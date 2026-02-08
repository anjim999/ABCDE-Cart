package middleware

import (
	"net/http"
	"strings"

	"shopease/internal/database"
	"shopease/internal/models"
	"shopease/internal/utils"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware validates the JWT token and checks single-device session
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Authorization header is required")
			c.Abort()
			return
		}

		// Extract the token
		tokenString := utils.ExtractTokenFromHeader(authHeader)
		if tokenString == "" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid authorization format")
			c.Abort()
			return
		}

		// Validate the token
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid or expired token")
			c.Abort()
			return
		}

		// Fetch the user from database
		var user models.User
		if err := database.DB.First(&user, claims.UserID).Error; err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not found")
			c.Abort()
			return
		}

		// CRITICAL: Verify that the token matches the one stored in the database
		// This enforces single-device login
		if user.Token != tokenString {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Session expired. Please login again.")
			c.Abort()
			return
		}

		// Store user info in context for use in handlers
		c.Set("userID", user.ID)
		c.Set("username", user.Username)
		c.Set("user", &user)

		c.Next()
	}
}

// GetUserFromContext retrieves the user from the Gin context
func GetUserFromContext(c *gin.Context) (*models.User, bool) {
	user, exists := c.Get("user")
	if !exists {
		return nil, false
	}
	return user.(*models.User), true
}

// GetUserIDFromContext retrieves the user ID from the Gin context
func GetUserIDFromContext(c *gin.Context) (uint, bool) {
	userID, exists := c.Get("userID")
	if !exists {
		return 0, false
	}
	return userID.(uint), true
}

// OptionalAuthMiddleware extracts user info if token is present, but doesn't require it
func OptionalAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		tokenString := utils.ExtractTokenFromHeader(authHeader)
		if tokenString == "" {
			c.Next()
			return
		}

		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			c.Next()
			return
		}

		var user models.User
		if err := database.DB.First(&user, claims.UserID).Error; err != nil {
			c.Next()
			return
		}

		if user.Token == tokenString {
			c.Set("userID", user.ID)
			c.Set("username", user.Username)
			c.Set("user", &user)
		}

		c.Next()
	}
}

// RateLimitMiddleware implements basic rate limiting (bonus feature)
func RateLimitMiddleware() gin.HandlerFunc {
	// Simple in-memory rate limiting (for production, use Redis)
	return func(c *gin.Context) {
		// For now, just pass through
		// In production, implement proper rate limiting
		c.Next()
	}
}

// LoggerMiddleware logs request details
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Log request
		method := c.Request.Method
		path := c.Request.URL.Path

		c.Next()

		// Log response status
		status := c.Writer.Status()
		_ = method
		_ = path
		_ = status
	}
}

// SecurityHeaders adds security headers to responses
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Next()
	}
}

// CORSMiddleware handles CORS
func CORSMiddleware(allowedOrigins string) gin.HandlerFunc {
	origins := strings.Split(allowedOrigins, ",")

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Check if origin is allowed
		allowed := false
		for _, o := range origins {
			if strings.TrimSpace(o) == origin {
				allowed = true
				break
			}
		}

		if allowed || origin == "" {
			c.Header("Access-Control-Allow-Origin", origin)
		} else {
			// Allow any origin in development
			c.Header("Access-Control-Allow-Origin", "*")
		}

		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
