package models

import (
	"time"

	"gorm.io/gorm"
)

// OrderStatus represents the status of an order
type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusConfirmed OrderStatus = "confirmed"
	OrderStatusShipped   OrderStatus = "shipped"
	OrderStatusDelivered OrderStatus = "delivered"
	OrderStatusCancelled OrderStatus = "cancelled"
)

// Order represents a placed order (converted from cart)
type Order struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	UserID      uint           `gorm:"not null;index" json:"user_id"`
	TotalAmount float64        `gorm:"not null;default:0" json:"total_amount"`
	Status      OrderStatus    `gorm:"size:50;default:'pending'" json:"status"`
	Note        string         `gorm:"size:500" json:"note,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	User       *User       `gorm:"foreignKey:UserID" json:"user,omitempty"`
	OrderItems []OrderItem `gorm:"foreignKey:OrderID" json:"order_items,omitempty"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	OrderID   uint           `gorm:"not null;index" json:"order_id"`
	ItemID    uint           `gorm:"not null;index" json:"item_id"`
	ItemName  string         `gorm:"not null;size:255" json:"item_name"` // Store item name at time of order
	ItemPrice float64        `gorm:"not null" json:"item_price"`         // Store price at time of order
	Quantity  int            `gorm:"not null;default:1" json:"quantity"`
	Subtotal  float64        `gorm:"not null" json:"subtotal"`
	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Order *Order `gorm:"foreignKey:OrderID" json:"-"`
	Item  *Item  `gorm:"foreignKey:ItemID" json:"item,omitempty"`
}

// CreateOrderRequest represents the request to create an order from cart
type CreateOrderRequest struct {
	CartID uint   `json:"cart_id" binding:"required"`
	Note   string `json:"note" binding:"max=500"`
}

// OrderResponse represents the order response
type OrderResponse struct {
	ID          uint                `json:"id"`
	UserID      uint                `json:"user_id"`
	TotalAmount float64             `json:"total_amount"`
	Status      OrderStatus         `json:"status"`
	Note        string              `json:"note,omitempty"`
	Items       []OrderItemResponse `json:"items"`
	CreatedAt   time.Time           `json:"created_at"`
}

// OrderItemResponse represents an order item in the response
type OrderItemResponse struct {
	ID        uint    `json:"id"`
	ItemID    uint    `json:"item_id"`
	ItemName  string  `json:"item_name"`
	ItemPrice float64 `json:"item_price"`
	Quantity  int     `json:"quantity"`
	Subtotal  float64 `json:"subtotal"`
}

// OrderListResponse represents a simplified order for lists
type OrderListResponse struct {
	ID          uint        `json:"id"`
	TotalAmount float64     `json:"total_amount"`
	Status      OrderStatus `json:"status"`
	ItemCount   int         `json:"item_count"`
	CreatedAt   time.Time   `json:"created_at"`
}

// ToResponse converts Order to OrderResponse
func (o *Order) ToResponse() OrderResponse {
	items := make([]OrderItemResponse, len(o.OrderItems))

	for i, orderItem := range o.OrderItems {
		items[i] = OrderItemResponse{
			ID:        orderItem.ID,
			ItemID:    orderItem.ItemID,
			ItemName:  orderItem.ItemName,
			ItemPrice: orderItem.ItemPrice,
			Quantity:  orderItem.Quantity,
			Subtotal:  orderItem.Subtotal,
		}
	}

	return OrderResponse{
		ID:          o.ID,
		UserID:      o.UserID,
		TotalAmount: o.TotalAmount,
		Status:      o.Status,
		Note:        o.Note,
		Items:       items,
		CreatedAt:   o.CreatedAt,
	}
}

// ToListResponse converts Order to OrderListResponse
func (o *Order) ToListResponse() OrderListResponse {
	itemCount := 0
	for _, item := range o.OrderItems {
		itemCount += item.Quantity
	}

	return OrderListResponse{
		ID:          o.ID,
		TotalAmount: o.TotalAmount,
		Status:      o.Status,
		ItemCount:   itemCount,
		CreatedAt:   o.CreatedAt,
	}
}

// TableName specifies the table name for GORM
func (Order) TableName() string {
	return "orders"
}

// TableName specifies the table name for GORM
func (OrderItem) TableName() string {
	return "order_items"
}
