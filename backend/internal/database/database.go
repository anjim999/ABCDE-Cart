package database

import (
	"log"

	"shopease/internal/config"
	"shopease/internal/models"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB is the global database instance
var DB *gorm.DB

// Connect establishes a connection to the database
func Connect() error {
	var err error

	// Configure GORM logger
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	// Connect to SQLite database
	DB, err = gorm.Open(sqlite.Open(config.AppConfig.DBPath), gormConfig)
	if err != nil {
		return err
	}

	log.Printf("Database connected successfully: %s", config.AppConfig.DBPath)
	return nil
}

// Migrate runs database migrations
func Migrate() error {
	log.Println("Running database migrations...")

	err := DB.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
	)

	if err != nil {
		return err
	}

	log.Println("Database migrations completed successfully")
	return nil
}

// SeedItems seeds some initial items for testing
func SeedItems() error {
	var count int64
	DB.Model(&models.Item{}).Count(&count)

	if count > 0 {
		log.Println("Items already exist, skipping seed")
		return nil
	}

	log.Println("Seeding initial items...")

	items := []models.Item{
		{
			Name:        "Wireless Bluetooth Headphones",
			Description: "Premium noise-cancelling headphones with 30hr battery life",
			Price:       149.99,
			ImageURL:    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
			Category:    "Electronics",
			IsActive:    true,
		},
		{
			Name:        "Smart Watch Pro",
			Description: "Fitness tracker with heart rate monitor and GPS",
			Price:       299.99,
			ImageURL:    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
			Category:    "Electronics",
			IsActive:    true,
		},
		{
			Name:        "Laptop Backpack",
			Description: "Water-resistant backpack with USB charging port",
			Price:       59.99,
			ImageURL:    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
			Category:    "Accessories",
			IsActive:    true,
		},
		{
			Name:        "Mechanical Keyboard",
			Description: "RGB gaming keyboard with Cherry MX switches",
			Price:       129.99,
			ImageURL:    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
			Category:    "Electronics",
			IsActive:    true,
		},
		{
			Name:        "Wireless Mouse",
			Description: "Ergonomic wireless mouse with precision tracking",
			Price:       49.99,
			ImageURL:    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
			Category:    "Electronics",
			IsActive:    true,
		},
		{
			Name:        "USB-C Hub",
			Description: "7-in-1 USB-C hub with HDMI and card reader",
			Price:       39.99,
			ImageURL:    "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400",
			Category:    "Accessories",
			IsActive:    true,
		},
		{
			Name:        "Portable Charger",
			Description: "20000mAh power bank with fast charging",
			Price:       34.99,
			ImageURL:    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
			Category:    "Electronics",
			IsActive:    true,
		},
		{
			Name:        "Webcam HD Pro",
			Description: "1080p webcam with built-in microphone",
			Price:       79.99,
			ImageURL:    "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400",
			Category:    "Electronics",
			IsActive:    true,
		},
		{
			Name:        "Desk Lamp LED",
			Description: "Adjustable LED desk lamp with touch control",
			Price:       29.99,
			ImageURL:    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
			Category:    "Home",
			IsActive:    true,
		},
		{
			Name:        "Coffee Mug Warmer",
			Description: "Electric mug warmer with auto shut-off",
			Price:       24.99,
			ImageURL:    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
			Category:    "Home",
			IsActive:    true,
		},
		{
			Name:        "Notebook Set",
			Description: "Premium leather-bound notebook with pen",
			Price:       19.99,
			ImageURL:    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400",
			Category:    "Office",
			IsActive:    true,
		},
		{
			Name:        "Phone Stand",
			Description: "Adjustable aluminum phone and tablet stand",
			Price:       15.99,
			ImageURL:    "https://images.unsplash.com/photo-1586816879360-004a0b7b1f8b?w=400",
			Category:    "Accessories",
			IsActive:    true,
		},
	}

	for _, item := range items {
		if err := DB.Create(&item).Error; err != nil {
			log.Printf("Error seeding item %s: %v", item.Name, err)
		}
	}

	log.Println("Items seeded successfully")
	return nil
}

// Close closes the database connection
func Close() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
