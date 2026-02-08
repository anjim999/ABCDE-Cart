package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"shopease/internal/config"
	"shopease/internal/database"
	"shopease/internal/routes"
)

// @title ShopEase API
// @version 1.0
// @description E-Commerce Shopping Cart API built with Go, Gin, and GORM
// @host localhost:8080
// @BasePath /api/v1
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func main() {
	// ASCII Art Banner
	banner := `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ███████╗██╗  ██╗ ██████╗ ██████╗ ███████╗ █████╗ ███████╗║
║   ██╔════╝██║  ██║██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝║
║   ███████╗███████║██║   ██║██████╔╝█████╗  ███████║███████╗║
║   ╚════██║██╔══██║██║   ██║██╔═══╝ ██╔══╝  ██╔══██║╚════██║║
║   ███████║██║  ██║╚██████╔╝██║     ███████╗██║  ██║███████║║
║   ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝║
║                                                           ║
║   🛒 E-Commerce Shopping Cart API                         ║
║   Built with Go • Gin • GORM                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`
	log.Println(banner)

	// Load configuration
	config.LoadConfig()

	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	log.Println("✅ Database connected successfully")

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("✅ Database migrations completed")

	// Seed initial data
	if err := database.SeedItems(); err != nil {
		log.Printf("Warning: Failed to seed items: %v", err)
	} else {
		log.Println("✅ Initial items seeded")
	}

	// Setup router
	router := routes.SetupRouter()
	log.Println("✅ Routes configured")

	// Graceful shutdown handling
	go func() {
		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		<-quit

		log.Println("\n🛑 Shutting down server...")
		if err := database.Close(); err != nil {
			log.Printf("Error closing database: %v", err)
		}
		log.Println("👋 Server stopped gracefully")
		os.Exit(0)
	}()

	// Start server
	addr := ":" + config.AppConfig.Port
	log.Printf("🚀 Server starting on http://localhost%s", addr)
	log.Println("📚 API Documentation: http://localhost" + addr + "/health")
	log.Println("\n📋 Available Endpoints:")
	log.Println("   POST   /users          - Create user")
	log.Println("   GET    /users          - List users")
	log.Println("   POST   /users/login    - Login")
	log.Println("   POST   /users/logout   - Logout (auth required)")
	log.Println("   POST   /items          - Create item")
	log.Println("   GET    /items          - List items")
	log.Println("   POST   /carts          - Add to cart (auth required)")
	log.Println("   GET    /carts          - List carts (auth required)")
	log.Println("   POST   /orders         - Create order (auth required)")
	log.Println("   GET    /orders         - List orders (auth required)")
	log.Println("")

	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
