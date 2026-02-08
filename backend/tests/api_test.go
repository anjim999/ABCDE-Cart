package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"shopease/internal/config"
	"shopease/internal/database"
	"shopease/internal/routes"

	"github.com/gin-gonic/gin"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestShopEase(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "ShopEase API Suite")
}

var router *gin.Engine
var authToken string

var _ = BeforeSuite(func() {
	// Initialize configuration
	config.AppConfig = &config.Config{
		Port:           "8080",
		GinMode:        "test",
		DBPath:         ":memory:", // Use in-memory SQLite for tests
		JWTSecret:      "test-secret-key",
		JWTExpiryHours: 24,
		AllowedOrigins: "*",
	}

	// Connect to test database
	err := database.Connect()
	Expect(err).NotTo(HaveOccurred())

	// Run migrations
	err = database.Migrate()
	Expect(err).NotTo(HaveOccurred())

	// Seed test items
	err = database.SeedItems()
	Expect(err).NotTo(HaveOccurred())

	// Setup router
	gin.SetMode(gin.TestMode)
	router = routes.SetupRouter()
})

var _ = AfterSuite(func() {
	database.Close()
})

var _ = Describe("User API", func() {
	Describe("POST /users", func() {
		Context("with valid data", func() {
			It("should create a new user", func() {
				payload := map[string]string{
					"username": "testuser",
					"password": "password123",
					"email":    "test@example.com",
				}
				body, _ := json.Marshal(payload)

				req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(body))
				req.Header.Set("Content-Type", "application/json")

				w := httptest.NewRecorder()
				router.ServeHTTP(w, req)

				Expect(w.Code).To(Equal(http.StatusCreated))

				var response map[string]interface{}
				json.Unmarshal(w.Body.Bytes(), &response)
				Expect(response["success"]).To(BeTrue())
			})
		})

		Context("with duplicate username", func() {
			It("should return conflict error", func() {
				payload := map[string]string{
					"username": "testuser",
					"password": "password123",
				}
				body, _ := json.Marshal(payload)

				req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(body))
				req.Header.Set("Content-Type", "application/json")

				w := httptest.NewRecorder()
				router.ServeHTTP(w, req)

				Expect(w.Code).To(Equal(http.StatusConflict))
			})
		})
	})

	Describe("POST /users/login", func() {
		Context("with valid credentials", func() {
			It("should return a token", func() {
				payload := map[string]string{
					"username": "testuser",
					"password": "password123",
				}
				body, _ := json.Marshal(payload)

				req, _ := http.NewRequest("POST", "/users/login", bytes.NewBuffer(body))
				req.Header.Set("Content-Type", "application/json")

				w := httptest.NewRecorder()
				router.ServeHTTP(w, req)

				Expect(w.Code).To(Equal(http.StatusOK))

				var response map[string]interface{}
				json.Unmarshal(w.Body.Bytes(), &response)
				Expect(response["success"]).To(BeTrue())

				data := response["data"].(map[string]interface{})
				authToken = data["token"].(string)
				Expect(authToken).NotTo(BeEmpty())
			})
		})

		Context("with already logged in user", func() {
			It("should return forbidden error (single device enforcement)", func() {
				payload := map[string]string{
					"username": "testuser",
					"password": "password123",
				}
				body, _ := json.Marshal(payload)

				req, _ := http.NewRequest("POST", "/users/login", bytes.NewBuffer(body))
				req.Header.Set("Content-Type", "application/json")

				w := httptest.NewRecorder()
				router.ServeHTTP(w, req)

				Expect(w.Code).To(Equal(http.StatusForbidden))
			})
		})

		Context("with invalid credentials", func() {
			It("should return bad request error", func() {
				payload := map[string]string{
					"username": "testuser",
					"password": "wrongpassword",
				}
				body, _ := json.Marshal(payload)

				req, _ := http.NewRequest("POST", "/users/login", bytes.NewBuffer(body))
				req.Header.Set("Content-Type", "application/json")

				w := httptest.NewRecorder()
				router.ServeHTTP(w, req)

				Expect(w.Code).To(Equal(http.StatusBadRequest))
			})
		})
	})

	Describe("GET /users", func() {
		It("should return list of users", func() {
			req, _ := http.NewRequest("GET", "/users", nil)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusOK))

			var response map[string]interface{}
			json.Unmarshal(w.Body.Bytes(), &response)
			Expect(response["success"]).To(BeTrue())
		})
	})
})

var _ = Describe("Item API", func() {
	Describe("GET /items", func() {
		It("should return list of items", func() {
			req, _ := http.NewRequest("GET", "/items", nil)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusOK))

			var response map[string]interface{}
			json.Unmarshal(w.Body.Bytes(), &response)
			Expect(response["success"]).To(BeTrue())
		})
	})

	Describe("POST /items", func() {
		It("should create a new item", func() {
			payload := map[string]interface{}{
				"name":        "Test Item",
				"description": "A test item",
				"price":       29.99,
				"category":    "Test",
			}
			body, _ := json.Marshal(payload)

			req, _ := http.NewRequest("POST", "/items", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusCreated))
		})
	})
})

var _ = Describe("Cart API", func() {
	Describe("POST /carts", func() {
		Context("without authentication", func() {
			It("should return unauthorized error", func() {
				payload := map[string]interface{}{
					"item_id":  1,
					"quantity": 2,
				}
				body, _ := json.Marshal(payload)

				req, _ := http.NewRequest("POST", "/carts", bytes.NewBuffer(body))
				req.Header.Set("Content-Type", "application/json")

				w := httptest.NewRecorder()
				router.ServeHTTP(w, req)

				Expect(w.Code).To(Equal(http.StatusUnauthorized))
			})
		})

		Context("with authentication", func() {
			It("should add item to cart", func() {
				payload := map[string]interface{}{
					"item_id":  1,
					"quantity": 2,
				}
				body, _ := json.Marshal(payload)

				req, _ := http.NewRequest("POST", "/carts", bytes.NewBuffer(body))
				req.Header.Set("Content-Type", "application/json")
				req.Header.Set("Authorization", "Bearer "+authToken)

				w := httptest.NewRecorder()
				router.ServeHTTP(w, req)

				Expect(w.Code).To(Equal(http.StatusOK))

				var response map[string]interface{}
				json.Unmarshal(w.Body.Bytes(), &response)
				Expect(response["success"]).To(BeTrue())
			})
		})
	})

	Describe("GET /carts", func() {
		It("should return list of carts", func() {
			req, _ := http.NewRequest("GET", "/carts", nil)
			req.Header.Set("Authorization", "Bearer "+authToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusOK))
		})
	})
})

var _ = Describe("Order API", func() {
	var cartID float64

	BeforeEach(func() {
		// Get cart ID
		req, _ := http.NewRequest("GET", "/api/v1/carts/my", nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code == http.StatusOK {
			var response map[string]interface{}
			json.Unmarshal(w.Body.Bytes(), &response)
			if data, ok := response["data"].(map[string]interface{}); ok {
				if id, ok := data["id"].(float64); ok {
					cartID = id
				}
			}
		}
	})

	Describe("POST /orders", func() {
		Context("with valid cart", func() {
			It("should create an order", func() {
				if cartID == 0 {
					Skip("Cart not found, skipping order test")
				}

				payload := map[string]interface{}{
					"cart_id": cartID,
					"note":    "Please deliver ASAP",
				}
				body, _ := json.Marshal(payload)

				req, _ := http.NewRequest("POST", "/orders", bytes.NewBuffer(body))
				req.Header.Set("Content-Type", "application/json")
				req.Header.Set("Authorization", "Bearer "+authToken)

				w := httptest.NewRecorder()
				router.ServeHTTP(w, req)

				Expect(w.Code).To(Equal(http.StatusCreated))

				var response map[string]interface{}
				json.Unmarshal(w.Body.Bytes(), &response)
				Expect(response["success"]).To(BeTrue())
			})
		})
	})

	Describe("GET /orders", func() {
		It("should return list of orders", func() {
			req, _ := http.NewRequest("GET", "/orders", nil)
			req.Header.Set("Authorization", "Bearer "+authToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusOK))
		})
	})
})

var _ = Describe("User Logout", func() {
	Describe("POST /users/logout", func() {
		It("should logout user and clear token", func() {
			req, _ := http.NewRequest("POST", "/users/logout", nil)
			req.Header.Set("Authorization", "Bearer "+authToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusOK))
		})

		It("should allow re-login after logout", func() {
			payload := map[string]string{
				"username": "testuser",
				"password": "password123",
			}
			body, _ := json.Marshal(payload)

			req, _ := http.NewRequest("POST", "/users/login", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusOK))
		})
	})
})
