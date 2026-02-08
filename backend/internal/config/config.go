package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds all configuration variables
type Config struct {
	Port           string
	GinMode        string
	DBPath         string
	JWTSecret      string
	JWTExpiryHours int
	AllowedOrigins string
}

// AppConfig is the global configuration instance
var AppConfig *Config

// LoadConfig loads configuration from environment variables
func LoadConfig() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	expiryHours, err := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))
	if err != nil {
		expiryHours = 24
	}

	AppConfig = &Config{
		Port:           getEnv("PORT", "8080"),
		GinMode:        getEnv("GIN_MODE", "debug"),
		DBPath:         getEnv("DB_PATH", "./shopease.db"),
		JWTSecret:      getEnv("JWT_SECRET", "default-secret-key"),
		JWTExpiryHours: expiryHours,
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:5173"),
	}

	log.Printf("Configuration loaded successfully")
	log.Printf("Server will run on port: %s", AppConfig.Port)
}

// getEnv gets an environment variable with a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
