package handlers

import (
	"net/http"
	"strconv"

	"shopease/internal/database"
	"shopease/internal/models"
	"shopease/internal/utils"

	"github.com/gin-gonic/gin"
)

// ItemHandler handles item-related requests
type ItemHandler struct{}

// NewItemHandler creates a new ItemHandler
func NewItemHandler() *ItemHandler {
	return &ItemHandler{}
}

// CreateItem handles POST /items - Create a new item
// @Summary Create a new item
// @Description Add a new item to the catalog
// @Tags items
// @Accept json
// @Produce json
// @Param item body models.ItemCreateRequest true "Item data"
// @Success 201 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Router /items [post]
func (h *ItemHandler) CreateItem(c *gin.Context) {
	var req models.ItemCreateRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, "Invalid request data", err.Error())
		return
	}

	item := models.Item{
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		ImageURL:    req.ImageURL,
		Category:    req.Category,
		IsActive:    true,
	}

	if err := database.DB.Create(&item).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create item")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Item created successfully", item.ToResponse())
}

// ListItems handles GET /items - List all items
// @Summary List all items
// @Description Get a list of all active items in the catalog
// @Tags items
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Param category query string false "Filter by category"
// @Success 200 {object} utils.PaginatedResponse
// @Router /items [get]
func (h *ItemHandler) ListItems(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	category := c.Query("category")

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize

	// Build query
	query := database.DB.Model(&models.Item{}).Where("is_active = ?", true)

	if category != "" {
		query = query.Where("category = ?", category)
	}

	// Get total count
	var totalCount int64
	query.Count(&totalCount)

	// Get items with pagination
	var items []models.Item
	if err := query.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&items).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch items")
		return
	}

	// Convert to response format
	responses := make([]models.ItemResponse, len(items))
	for i, item := range items {
		responses[i] = item.ToResponse()
	}

	utils.PaginatedSuccessResponse(c, responses, page, pageSize, totalCount)
}

// GetItem handles GET /items/:id - Get a single item
// @Summary Get item by ID
// @Description Get detailed information about a specific item
// @Tags items
// @Produce json
// @Param id path int true "Item ID"
// @Success 200 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /items/{id} [get]
func (h *ItemHandler) GetItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid item ID")
		return
	}

	var item models.Item
	if err := database.DB.First(&item, id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Item not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Item retrieved successfully", item.ToResponse())
}

// UpdateItem handles PUT /items/:id - Update an item
// @Summary Update item
// @Description Update an existing item
// @Tags items
// @Accept json
// @Produce json
// @Param id path int true "Item ID"
// @Param item body models.ItemUpdateRequest true "Item data"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /items/{id} [put]
func (h *ItemHandler) UpdateItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid item ID")
		return
	}

	var item models.Item
	if err := database.DB.First(&item, id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Item not found")
		return
	}

	var req models.ItemUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, "Invalid request data", err.Error())
		return
	}

	// Update fields if provided
	if req.Name != nil {
		item.Name = *req.Name
	}
	if req.Description != nil {
		item.Description = *req.Description
	}
	if req.Price != nil {
		item.Price = *req.Price
	}
	if req.ImageURL != nil {
		item.ImageURL = *req.ImageURL
	}
	if req.Category != nil {
		item.Category = *req.Category
	}
	if req.IsActive != nil {
		item.IsActive = *req.IsActive
	}

	if err := database.DB.Save(&item).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update item")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Item updated successfully", item.ToResponse())
}

// DeleteItem handles DELETE /items/:id - Delete an item
// @Summary Delete item
// @Description Soft delete an item
// @Tags items
// @Produce json
// @Param id path int true "Item ID"
// @Success 200 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /items/{id} [delete]
func (h *ItemHandler) DeleteItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid item ID")
		return
	}

	var item models.Item
	if err := database.DB.First(&item, id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Item not found")
		return
	}

	if err := database.DB.Delete(&item).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete item")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Item deleted successfully", nil)
}

// GetCategories handles GET /items/categories - Get all categories
// @Summary Get item categories
// @Description Get a list of all item categories
// @Tags items
// @Produce json
// @Success 200 {object} utils.Response
// @Router /items/categories [get]
func (h *ItemHandler) GetCategories(c *gin.Context) {
	var categories []string

	if err := database.DB.Model(&models.Item{}).
		Where("is_active = ?", true).
		Distinct().
		Pluck("category", &categories).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch categories")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Categories retrieved successfully", categories)
}
