package handlers

import (
	"net/http"
	"strconv"

	"shopease/internal/database"
	"shopease/internal/middleware"
	"shopease/internal/models"
	"shopease/internal/utils"

	"github.com/gin-gonic/gin"
)

// OrderHandler handles order-related requests
type OrderHandler struct{}

// NewOrderHandler creates a new OrderHandler
func NewOrderHandler() *OrderHandler {
	return &OrderHandler{}
}

// CreateOrder handles POST /orders - Create order from cart
// @Summary Create order
// @Description Convert cart to order and clear the cart
// @Tags orders
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param order body models.CreateOrderRequest true "Order data"
// @Success 201 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 401 {object} utils.Response
// @Router /orders [post]
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	var req models.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, "Invalid request data", err.Error())
		return
	}

	// Find and validate cart
	var cart models.Cart
	if err := database.DB.Preload("CartItems.Item").First(&cart, req.CartID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Cart not found")
		return
	}

	// Verify cart belongs to user
	if cart.UserID != userID {
		utils.ErrorResponse(c, http.StatusForbidden, "Not authorized to checkout this cart")
		return
	}

	// Check if cart has items
	if len(cart.CartItems) == 0 {
		utils.ErrorResponse(c, http.StatusBadRequest, "Cart is empty")
		return
	}

	// Calculate total and create order items
	var totalAmount float64
	orderItems := make([]models.OrderItem, len(cart.CartItems))

	for i, cartItem := range cart.CartItems {
		if cartItem.Item == nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid item in cart")
			return
		}

		subtotal := float64(cartItem.Quantity) * cartItem.Item.Price
		totalAmount += subtotal

		orderItems[i] = models.OrderItem{
			ItemID:    cartItem.ItemID,
			ItemName:  cartItem.Item.Name,
			ItemPrice: cartItem.Item.Price,
			Quantity:  cartItem.Quantity,
			Subtotal:  subtotal,
		}
	}

	// Create order
	order := models.Order{
		UserID:      userID,
		TotalAmount: totalAmount,
		Status:      models.OrderStatusConfirmed,
		Note:        req.Note,
		OrderItems:  orderItems,
	}

	// Use transaction for data integrity
	tx := database.DB.Begin()

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create order")
		return
	}

	// Clear cart items
	if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		tx.Rollback()
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to clear cart")
		return
	}

	tx.Commit()

	// Reload order with items
	if err := database.DB.Preload("OrderItems").First(&order, order.ID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to reload order")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Order placed successfully", order.ToResponse())
}

// GetMyOrders handles GET /orders/my - Get current user's orders
// @Summary Get my orders
// @Description Get the authenticated user's order history
// @Tags orders
// @Security BearerAuth
// @Produce json
// @Success 200 {object} utils.Response
// @Router /orders/my [get]
func (h *OrderHandler) GetMyOrders(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	var orders []models.Order
	if err := database.DB.Preload("OrderItems").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&orders).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch orders")
		return
	}

	responses := make([]models.OrderListResponse, len(orders))
	for i, order := range orders {
		responses[i] = order.ToListResponse()
	}

	utils.SuccessResponse(c, http.StatusOK, "Orders retrieved successfully", responses)
}

// ListOrders handles GET /orders - List all orders (admin)
// @Summary List all orders
// @Description Get a list of all orders
// @Tags orders
// @Security BearerAuth
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} utils.PaginatedResponse
// @Router /orders [get]
func (h *OrderHandler) ListOrders(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize

	var totalCount int64
	database.DB.Model(&models.Order{}).Count(&totalCount)

	var orders []models.Order
	if err := database.DB.Preload("OrderItems").Preload("User").
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&orders).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch orders")
		return
	}

	responses := make([]models.OrderResponse, len(orders))
	for i, order := range orders {
		responses[i] = order.ToResponse()
	}

	utils.PaginatedSuccessResponse(c, responses, page, pageSize, totalCount)
}

// GetOrder handles GET /orders/:id - Get order details
// @Summary Get order by ID
// @Description Get detailed information about a specific order
// @Tags orders
// @Security BearerAuth
// @Produce json
// @Param id path int true "Order ID"
// @Success 200 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /orders/{id} [get]
func (h *OrderHandler) GetOrder(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	orderID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	var order models.Order
	if err := database.DB.Preload("OrderItems").First(&order, orderID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Order not found")
		return
	}

	// Verify order belongs to user
	if order.UserID != userID {
		utils.ErrorResponse(c, http.StatusForbidden, "Not authorized to view this order")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Order retrieved successfully", order.ToResponse())
}

// UpdateOrderStatus handles PATCH /orders/:id/status - Update order status
// @Summary Update order status
// @Description Update the status of an order (admin only)
// @Tags orders
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Order ID"
// @Param status body object{status string} true "New status"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /orders/{id}/status [patch]
func (h *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	orderID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	var req struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, "Invalid request data", err.Error())
		return
	}

	// Validate status
	validStatuses := map[string]models.OrderStatus{
		"pending":   models.OrderStatusPending,
		"confirmed": models.OrderStatusConfirmed,
		"shipped":   models.OrderStatusShipped,
		"delivered": models.OrderStatusDelivered,
		"cancelled": models.OrderStatusCancelled,
	}

	newStatus, ok := validStatuses[req.Status]
	if !ok {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid order status")
		return
	}

	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Order not found")
		return
	}

	order.Status = newStatus
	if err := database.DB.Save(&order).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update order status")
		return
	}

	// Reload with items
	if err := database.DB.Preload("OrderItems").First(&order, order.ID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to reload order")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Order status updated", order.ToResponse())
}

// CancelOrder handles POST /orders/:id/cancel - Cancel an order
// @Summary Cancel order
// @Description Cancel a pending order
// @Tags orders
// @Security BearerAuth
// @Produce json
// @Param id path int true "Order ID"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /orders/{id}/cancel [post]
func (h *OrderHandler) CancelOrder(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	orderID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid order ID")
		return
	}

	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Order not found")
		return
	}

	// Verify order belongs to user
	if order.UserID != userID {
		utils.ErrorResponse(c, http.StatusForbidden, "Not authorized to cancel this order")
		return
	}

	// Can only cancel pending or confirmed orders
	if order.Status != models.OrderStatusPending && order.Status != models.OrderStatusConfirmed {
		utils.ErrorResponse(c, http.StatusBadRequest, "Cannot cancel order with status: "+string(order.Status))
		return
	}

	order.Status = models.OrderStatusCancelled
	if err := database.DB.Save(&order).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to cancel order")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Order cancelled successfully", order.ToListResponse())
}
