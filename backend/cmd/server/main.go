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
	log.Println("✅ ShopEase API starting...")

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
	log.Printf("🚀 Server running on http://localhost%s", addr)

	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
