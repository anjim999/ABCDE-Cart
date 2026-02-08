package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User represents the user entity in the database
type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Username  string         `gorm:"uniqueIndex;not null;size:100" json:"username"`
	Password  string         `gorm:"not null;size:255" json:"-"` // Never expose password in JSON
	Email     string         `gorm:"size:255" json:"email,omitempty"`
	Token     string         `gorm:"size:500" json:"-"` // Current active session token (for single-device login)
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Cart      *Cart   `gorm:"foreignKey:UserID" json:"cart,omitempty"`
	Orders    []Order `gorm:"foreignKey:UserID" json:"orders,omitempty"`
	Favorites []Item  `gorm:"many2many:user_favorites;" json:"favorites,omitempty"`
}

// UserCreateRequest represents the request body for creating a user
type UserCreateRequest struct {
	Username string `json:"username" binding:"required,min=3,max=100"`
	Password string `json:"password" binding:"required,min=6,max=100"`
	Email    string `json:"email" binding:"omitempty,email"`
}

// UserLoginRequest represents the request body for user login
type UserLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// UserResponse represents the user response (without sensitive data)
type UserResponse struct {
	ID        uint      `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// LoginResponse represents the login response with token
type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// BeforeCreate hook to hash password before saving
func (u *User) BeforeCreate(tx *gorm.DB) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// CheckPassword verifies the password against the hash
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:        u.ID,
		Username:  u.Username,
		Email:     u.Email,
		CreatedAt: u.CreatedAt,
	}
}

// HasActiveSession checks if user has an active session (single-device enforcement)
func (u *User) HasActiveSession() bool {
	return u.Token != ""
}

// SetToken sets the user's session token
func (u *User) SetToken(token string) {
	u.Token = token
}

// ClearToken clears the user's session token (logout)
func (u *User) ClearToken() {
	u.Token = ""
}

// TableName specifies the table name for GORM
func (User) TableName() string {
	return "users"
}
