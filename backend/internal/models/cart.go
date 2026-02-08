package models

import (
	"time"

	"gorm.io/gorm"
)

// Cart represents a user's shopping cart
// Each user can have only ONE cart at a time
type Cart struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `gorm:"uniqueIndex;not null" json:"user_id"` // One cart per user
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	User      *User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	CartItems []CartItem `gorm:"foreignKey:CartID" json:"cart_items,omitempty"`
}

// CartItem represents an item in a cart with quantity
type CartItem struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CartID    uint           `gorm:"not null;index" json:"cart_id"`
	ItemID    uint           `gorm:"not null;index" json:"item_id"`
	Quantity  int            `gorm:"not null;default:1" json:"quantity"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Cart *Cart `gorm:"foreignKey:CartID" json:"-"`
	Item *Item `gorm:"foreignKey:ItemID" json:"item,omitempty"`
}

// AddToCartRequest represents the request to add an item to cart
type AddToCartRequest struct {
	ItemID   uint `json:"item_id" binding:"required"`
	Quantity int  `json:"quantity" binding:"omitempty,gte=1"`
}

// CartResponse represents the cart response
type CartResponse struct {
	ID        uint               `json:"id"`
	UserID    uint               `json:"user_id"`
	Items     []CartItemResponse `json:"items"`
	Total     float64            `json:"total"`
	ItemCount int                `json:"item_count"`
	CreatedAt time.Time          `json:"created_at"`
}

// CartItemResponse represents a cart item in the response
type CartItemResponse struct {
	ID       uint         `json:"id"`
	CartID   uint         `json:"cart_id"`
	ItemID   uint         `json:"item_id"`
	Quantity int          `json:"quantity"`
	Item     ItemResponse `json:"item"`
	Subtotal float64      `json:"subtotal"`
}

// ToResponse converts Cart to CartResponse
func (c *Cart) ToResponse() CartResponse {
	items := make([]CartItemResponse, len(c.CartItems))
	var total float64 = 0
	var itemCount int = 0

	for i, cartItem := range c.CartItems {
		itemResp := CartItemResponse{
			ID:       cartItem.ID,
			CartID:   cartItem.CartID,
			ItemID:   cartItem.ItemID,
			Quantity: cartItem.Quantity,
		}

		if cartItem.Item != nil {
			itemResp.Item = cartItem.Item.ToResponse()
			itemResp.Subtotal = float64(cartItem.Quantity) * cartItem.Item.Price
			total += itemResp.Subtotal
		}

		itemCount += cartItem.Quantity
		items[i] = itemResp
	}

	return CartResponse{
		ID:        c.ID,
		UserID:    c.UserID,
		Items:     items,
		Total:     total,
		ItemCount: itemCount,
		CreatedAt: c.CreatedAt,
	}
}

// ToItemResponse converts CartItem to CartItemResponse
func (ci *CartItem) ToItemResponse() CartItemResponse {
	resp := CartItemResponse{
		ID:       ci.ID,
		CartID:   ci.CartID,
		ItemID:   ci.ItemID,
		Quantity: ci.Quantity,
	}

	if ci.Item != nil {
		resp.Item = ci.Item.ToResponse()
		resp.Subtotal = float64(ci.Quantity) * ci.Item.Price
	}

	return resp
}

// TableName specifies the table name for GORM
func (Cart) TableName() string {
	return "carts"
}

// TableName specifies the table name for GORM
func (CartItem) TableName() string {
	return "cart_items"
}
