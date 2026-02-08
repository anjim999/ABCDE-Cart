package handlers

import (
	"net/http"

	"shopease/internal/database"
	"shopease/internal/middleware"
	"shopease/internal/models"
	"shopease/internal/utils"

	"github.com/gin-gonic/gin"
)

// UserHandler handles user-related requests
type UserHandler struct{}

// NewUserHandler creates a new UserHandler
func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

// CreateUser handles POST /users - Create a new user
// @Summary Create a new user
// @Description Register a new user account
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.UserCreateRequest true "User registration data"
// @Success 201 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Router /users [post]
func (h *UserHandler) CreateUser(c *gin.Context) {
	var req models.UserCreateRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, "Invalid request data", err.Error())
		return
	}

	// Check if username already exists
	var existingUser models.User
	if err := database.DB.Where("username = ?", req.Username).First(&existingUser).Error; err == nil {
		utils.ErrorResponse(c, http.StatusConflict, "Username already exists")
		return
	}

	// Create new user
	user := models.User{
		Username: req.Username,
		Password: req.Password, // Will be hashed by BeforeCreate hook
		Email:    req.Email,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "User created successfully", user.ToResponse())
}

// ListUsers handles GET /users - List all users
// @Summary List all users
// @Description Get a list of all registered users
// @Tags users
// @Produce json
// @Success 200 {object} utils.Response
// @Router /users [get]
func (h *UserHandler) ListUsers(c *gin.Context) {
	var users []models.User

	if err := database.DB.Find(&users).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch users")
		return
	}

	// Convert to response format
	responses := make([]models.UserResponse, len(users))
	for i, user := range users {
		responses[i] = user.ToResponse()
	}

	utils.SuccessResponse(c, http.StatusOK, "Users retrieved successfully", responses)
}

// Login handles POST /users/login - User login
// @Summary User login
// @Description Authenticate user and return JWT token
// @Tags users
// @Accept json
// @Produce json
// @Param credentials body models.UserLoginRequest true "Login credentials"
// @Success 200 {object} models.LoginResponse
// @Failure 400 {object} utils.Response
// @Failure 403 {object} utils.Response
// @Router /users/login [post]
func (h *UserHandler) Login(c *gin.Context) {
	var req models.UserLoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, "Invalid request data", err.Error())
		return
	}

	// Find user by username
	var user models.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid username/password")
		return
	}

	// Check if user is already logged in on another device (SINGLE-DEVICE ENFORCEMENT)
	if user.HasActiveSession() {
		utils.ErrorResponse(c, http.StatusForbidden, "User is already logged in on another device")
		return
	}

	// Verify password
	if !user.CheckPassword(req.Password) {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid username/password")
		return
	}

	// Generate JWT token
	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	// Store token in database (for single-device enforcement)
	user.SetToken(token)
	if err := database.DB.Save(&user).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to save session")
		return
	}

	// Return token
	response := models.LoginResponse{
		Token: token,
		User:  user.ToResponse(),
	}

	c.Header("Authorization", token)
	utils.SuccessResponse(c, http.StatusOK, "Login successful", response)
}

// Logout handles POST /users/logout - User logout
// @Summary User logout
// @Description Invalidate user session token
// @Tags users
// @Security BearerAuth
// @Produce json
// @Success 200 {object} utils.Response
// @Failure 401 {object} utils.Response
// @Router /users/logout [post]
func (h *UserHandler) Logout(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not found in context")
		return
	}

	// Clear the token in the database
	user.ClearToken()
	if err := database.DB.Save(user).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to logout")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Logged out successfully", nil)
}

// GetCurrentUser handles GET /users/me - Get current user info
// @Summary Get current user
// @Description Get the currently authenticated user's information
// @Tags users
// @Security BearerAuth
// @Produce json
// @Success 200 {object} utils.Response
// @Failure 401 {object} utils.Response
// @Router /users/me [get]
func (h *UserHandler) GetCurrentUser(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", user.ToResponse())
}
// ToggleFavorite handles POST /users/favorites - Add/Remove from favorites
func (h *UserHandler) ToggleFavorite(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not found")
		return
	}

	var req struct {
		ItemID uint `json:"itemId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, "Invalid request body", err.Error())
		return
	}

	// Check if item exists
	var item models.Item
	if err := database.DB.First(&item, req.ItemID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Item not found")
		return
	}

	// Check if already in favorites
	var count int64
	database.DB.Table("user_favorites").Where("user_id = ? AND item_id = ?", user.ID, req.ItemID).Count(&count)

	action := "added"
	if count > 0 {
		// Remove from favorites
		if err := database.DB.Model(user).Association("Favorites").Delete(&item); err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to remove from favorites")
			return
		}
		action = "removed"
	} else {
		// Add to favorites
		if err := database.DB.Model(user).Association("Favorites").Append(&item); err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to add to favorites")
			return
		}
	}

	utils.SuccessResponse(c, http.StatusOK, "Favorites updated", gin.H{
		"action": action,
	})
}

// GetFavorites handles GET /users/favorites - Get user's favorite items
func (h *UserHandler) GetFavorites(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not found")
		return
	}

	var favorites []models.Item
	if err := database.DB.Model(user).Association("Favorites").Find(&favorites); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch favorites")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Favorites retrieved successfully", favorites)
}
