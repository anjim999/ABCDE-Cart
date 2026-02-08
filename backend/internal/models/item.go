package models

import (
	"time"

	"gorm.io/gorm"
)

// Item represents a product in the store
type Item struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"not null;size:255" json:"name"`
	Description string         `gorm:"size:1000" json:"description"`
	Price       float64        `gorm:"not null;default:0" json:"price"`
	ImageURL    string         `gorm:"size:500" json:"image_url,omitempty"`
	Category    string         `gorm:"size:100;index" json:"category,omitempty"`
	IsActive    bool           `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// ItemCreateRequest represents the request body for creating an item
type ItemCreateRequest struct {
	Name        string  `json:"name" binding:"required,min=1,max=255"`
	Description string  `json:"description" binding:"max=1000"`
	Price       float64 `json:"price" binding:"required,gte=0"`
	ImageURL    string  `json:"image_url" binding:"omitempty,url"`
	Category    string  `json:"category" binding:"max=100"`
}

// ItemUpdateRequest represents the request body for updating an item
type ItemUpdateRequest struct {
	Name        *string  `json:"name" binding:"omitempty,min=1,max=255"`
	Description *string  `json:"description" binding:"omitempty,max=1000"`
	Price       *float64 `json:"price" binding:"omitempty,gte=0"`
	ImageURL    *string  `json:"image_url" binding:"omitempty"`
	Category    *string  `json:"category" binding:"omitempty,max=100"`
	IsActive    *bool    `json:"is_active"`
}

// ItemResponse represents the item response
type ItemResponse struct {
	ID          uint      `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	ImageURL    string    `json:"image_url,omitempty"`
	Category    string    `json:"category,omitempty"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
}

// ToResponse converts Item to ItemResponse
func (i *Item) ToResponse() ItemResponse {
	return ItemResponse{
		ID:          i.ID,
		Name:        i.Name,
		Description: i.Description,
		Price:       i.Price,
		ImageURL:    i.ImageURL,
		Category:    i.Category,
		IsActive:    i.IsActive,
		CreatedAt:   i.CreatedAt,
	}
}

// TableName specifies the table name for GORM
func (Item) TableName() string {
	return "items"
}
