package routes

import (
	"shopease/internal/config"
	"shopease/internal/handlers"
	"shopease/internal/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRouter configures all API routes
func SetupRouter() *gin.Engine {
	// Set Gin mode
	gin.SetMode(config.AppConfig.GinMode)

	router := gin.Default()

	// Global middleware
	router.Use(middleware.CORSMiddleware(config.AppConfig.AllowedOrigins))
	router.Use(middleware.SecurityHeaders())
	router.Use(middleware.RateLimitMiddleware())

	// Initialize handlers
	userHandler := handlers.NewUserHandler()
	itemHandler := handlers.NewItemHandler()
	cartHandler := handlers.NewCartHandler()
	orderHandler := handlers.NewOrderHandler()

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"message": "ShopEase API is running",
		})
	})

	// API v1 group
	api := router.Group("/api/v1")
	{
		// ==================
		// User Routes
		// ==================
		users := api.Group("/users")
		{
			// Public routes
			users.POST("", userHandler.CreateUser)          // POST /users - Create user
			users.GET("", userHandler.ListUsers)            // GET /users - List users
			users.POST("/login", userHandler.Login)         // POST /users/login - Login

			// Protected routes
			users.POST("/logout", middleware.AuthMiddleware(), userHandler.Logout)         // POST /users/logout
			users.GET("/me", middleware.AuthMiddleware(), userHandler.GetCurrentUser)      // GET /users/me
		}

		// ==================
		// Item Routes
		// ==================
		items := api.Group("/items")
		{
			// Public routes (anyone can view items)
			items.GET("", itemHandler.ListItems)                // GET /items - List items
			items.GET("/categories", itemHandler.GetCategories) // GET /items/categories
			items.GET("/:id", itemHandler.GetItem)              // GET /items/:id

			// Admin routes (no auth for simplicity, in production add admin check)
			items.POST("", itemHandler.CreateItem)         // POST /items - Create item
			items.PUT("/:id", itemHandler.UpdateItem)      // PUT /items/:id - Update item
			items.DELETE("/:id", itemHandler.DeleteItem)   // DELETE /items/:id - Delete item
		}

		// ==================
		// Cart Routes (Protected)
		// ==================
		carts := api.Group("/carts")
		carts.Use(middleware.AuthMiddleware())
		{
			carts.POST("", cartHandler.AddToCart)                // POST /carts - Add to cart
			carts.GET("", cartHandler.ListCarts)                 // GET /carts - List all carts
			carts.GET("/my", cartHandler.GetMyCart)              // GET /carts/my - Get my cart
			carts.DELETE("/my", cartHandler.ClearCart)           // DELETE /carts/my - Clear cart
			carts.PUT("/items/:id", cartHandler.UpdateCartItem)  // PUT /carts/items/:id - Update item
			carts.DELETE("/items/:id", cartHandler.RemoveFromCart) // DELETE /carts/items/:id
		}

		// ==================
		// Order Routes (Protected)
		// ==================
		orders := api.Group("/orders")
		orders.Use(middleware.AuthMiddleware())
		{
			orders.POST("", orderHandler.CreateOrder)              // POST /orders - Create order
			orders.GET("", orderHandler.ListOrders)                // GET /orders - List all orders
			orders.GET("/my", orderHandler.GetMyOrders)            // GET /orders/my - My orders
			orders.GET("/:id", orderHandler.GetOrder)              // GET /orders/:id - Order details
			orders.PATCH("/:id/status", orderHandler.UpdateOrderStatus) // PATCH /orders/:id/status
			orders.POST("/:id/cancel", orderHandler.CancelOrder)   // POST /orders/:id/cancel
		}
	}

	// Legacy routes (without /api/v1 prefix for assignment compatibility)
	legacy := router.Group("")
	{
		// User routes
		legacy.POST("/users", userHandler.CreateUser)
		legacy.GET("/users", userHandler.ListUsers)
		legacy.POST("/users/login", userHandler.Login)
		legacy.POST("/users/logout", middleware.AuthMiddleware(), userHandler.Logout)

		// Item routes
		legacy.POST("/items", itemHandler.CreateItem)
		legacy.GET("/items", itemHandler.ListItems)

		// Cart routes (protected)
		legacy.POST("/carts", middleware.AuthMiddleware(), cartHandler.AddToCart)
		legacy.GET("/carts", middleware.AuthMiddleware(), cartHandler.ListCarts)

		// Order routes (protected)
		legacy.POST("/orders", middleware.AuthMiddleware(), orderHandler.CreateOrder)
		legacy.GET("/orders", middleware.AuthMiddleware(), orderHandler.ListOrders)
	}

	return router
}
