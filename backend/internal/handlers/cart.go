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

// CartHandler handles cart-related requests
type CartHandler struct{}

// NewCartHandler creates a new CartHandler
func NewCartHandler() *CartHandler {
	return &CartHandler{}
}

// AddToCart handles POST /carts - Add item to cart
// @Summary Add item to cart
// @Description Add an item to the user's cart (creates cart if doesn't exist)
// @Tags carts
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param item body models.AddToCartRequest true "Item to add"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 401 {object} utils.Response
// @Router /carts [post]
func (h *CartHandler) AddToCart(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	var req models.AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, "Invalid request data", err.Error())
		return
	}

	// Default quantity to 1
	if req.Quantity == 0 {
		req.Quantity = 1
	}

	// Verify item exists
	var item models.Item
	if err := database.DB.First(&item, req.ItemID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Item not found")
		return
	}

	if !item.IsActive {
		utils.ErrorResponse(c, http.StatusBadRequest, "Item is not available")
		return
	}

	// Get or create cart for user (single cart per user)
	var cart models.Cart
	result := database.DB.Where("user_id = ?", userID).First(&cart)

	if result.Error != nil {
		// Create new cart for user
		cart = models.Cart{UserID: userID}
		if err := database.DB.Create(&cart).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create cart")
			return
		}
	}

	// Check if item already in cart
	var cartItem models.CartItem
	result = database.DB.Where("cart_id = ? AND item_id = ?", cart.ID, req.ItemID).First(&cartItem)

	if result.Error == nil {
		// Item exists, update quantity
		cartItem.Quantity += req.Quantity
		if err := database.DB.Save(&cartItem).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update cart item")
			return
		}
	} else {
		// Add new item to cart
		cartItem = models.CartItem{
			CartID:   cart.ID,
			ItemID:   req.ItemID,
			Quantity: req.Quantity,
		}
		if err := database.DB.Create(&cartItem).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to add item to cart")
			return
		}
	}

	// Reload cart with items
	if err := database.DB.Preload("CartItems.Item").First(&cart, cart.ID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to reload cart")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Item added to cart", cart.ToResponse())
}

// GetMyCart handles GET /carts/my - Get current user's cart
// @Summary Get my cart
// @Description Get the authenticated user's cart
// @Tags carts
// @Security BearerAuth
// @Produce json
// @Success 200 {object} utils.Response
// @Failure 401 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /carts/my [get]
func (h *CartHandler) GetMyCart(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	var cart models.Cart
	if err := database.DB.Preload("CartItems.Item").Where("user_id = ?", userID).First(&cart).Error; err != nil {
		// Return empty cart response
		emptyCart := models.CartResponse{
			UserID:    userID,
			Items:     []models.CartItemResponse{},
			Total:     0,
			ItemCount: 0,
		}
		utils.SuccessResponse(c, http.StatusOK, "Cart is empty", emptyCart)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cart retrieved successfully", cart.ToResponse())
}

// ListCarts handles GET /carts - List all carts (admin)
// @Summary List all carts
// @Description Get a list of all carts
// @Tags carts
// @Security BearerAuth
// @Produce json
// @Success 200 {object} utils.Response
// @Router /carts [get]
func (h *CartHandler) ListCarts(c *gin.Context) {
	var carts []models.Cart

	if err := database.DB.Preload("CartItems.Item").Preload("User").Find(&carts).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch carts")
		return
	}

	responses := make([]models.CartResponse, len(carts))
	for i, cart := range carts {
		responses[i] = cart.ToResponse()
	}

	utils.SuccessResponse(c, http.StatusOK, "Carts retrieved successfully", responses)
}

// UpdateCartItem handles PUT /carts/items/:id - Update cart item quantity
// @Summary Update cart item
// @Description Update the quantity of an item in the cart
// @Tags carts
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Cart Item ID"
// @Param quantity body object{quantity int} true "New quantity"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /carts/items/{id} [put]
func (h *CartHandler) UpdateCartItem(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	cartItemID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid cart item ID")
		return
	}

	var req struct {
		Quantity int `json:"quantity" binding:"required,gte=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, "Invalid request data", err.Error())
		return
	}

	// Find cart item and verify ownership
	var cartItem models.CartItem
	if err := database.DB.Preload("Cart").First(&cartItem, cartItemID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Cart item not found")
		return
	}

	if cartItem.Cart.UserID != userID {
		utils.ErrorResponse(c, http.StatusForbidden, "Not authorized to modify this cart")
		return
	}

	if req.Quantity == 0 {
		// Remove item from cart
		if err := database.DB.Delete(&cartItem).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to remove item")
			return
		}
		utils.SuccessResponse(c, http.StatusOK, "Item removed from cart", nil)
		return
	}

	cartItem.Quantity = req.Quantity
	if err := database.DB.Save(&cartItem).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update cart item")
		return
	}

	// Reload cart
	var cart models.Cart
	if err := database.DB.Preload("CartItems.Item").First(&cart, cartItem.CartID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to reload cart")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cart item updated", cart.ToResponse())
}

// RemoveFromCart handles DELETE /carts/items/:id - Remove item from cart
// @Summary Remove item from cart
// @Description Remove an item from the user's cart
// @Tags carts
// @Security BearerAuth
// @Produce json
// @Param id path int true "Cart Item ID"
// @Success 200 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /carts/items/{id} [delete]
func (h *CartHandler) RemoveFromCart(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	cartItemID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid cart item ID")
		return
	}

	// Find cart item and verify ownership
	var cartItem models.CartItem
	if err := database.DB.Preload("Cart").First(&cartItem, cartItemID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Cart item not found")
		return
	}

	if cartItem.Cart.UserID != userID {
		utils.ErrorResponse(c, http.StatusForbidden, "Not authorized to modify this cart")
		return
	}

	if err := database.DB.Delete(&cartItem).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to remove item")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Item removed from cart", nil)
}

// ClearCart handles DELETE /carts/my - Clear the user's cart
// @Summary Clear cart
// @Description Remove all items from the user's cart
// @Tags carts
// @Security BearerAuth
// @Produce json
// @Success 200 {object} utils.Response
// @Router /carts/my [delete]
func (h *CartHandler) ClearCart(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	var cart models.Cart
	if err := database.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		utils.SuccessResponse(c, http.StatusOK, "Cart was already empty", nil)
		return
	}

	// Delete all cart items
	if err := database.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to clear cart")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cart cleared successfully", nil)
}
