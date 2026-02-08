import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts & Components
import MainLayout from './layouts/MainLayout';
import Toast from './components/common/Toast';
import CartModal from './components/CartModal';
import OrderHistory from './components/OrderHistory';
import FavoritesModal from './components/FavoritesModal';
import ProductPreviewModal from './components/ProductPreviewModal';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ItemList from './pages/ItemList';
import CartPage from './pages/CartPage';

// Hooks
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  // Toast State
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const [darkMode, setDarkMode] = useTheme();

  // Modals State
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);

  // Custom Hooks for Business Logic
  const { 
    cart, 
    setCart,
    addingToCartId, 
    checkingOut, 
    fetchCart, 
    handleAddToCart, 
    handleUpdateQuantity, 
    handleRemoveItem, 
    handleCheckout 
  } = useCart(isAuthenticated, addToast);

  const { 
    favorites, 
    fullFavorites, 
    favoritesLoading, 
    fetchFavorites, 
    handleToggleFavorite 
  } = useFavorites(isAuthenticated, addToast);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchFavorites();
    }
  }, [isAuthenticated, fetchCart, fetchFavorites]);

  const cartCount = cart?.item_count || 0;

  return (
    <BrowserRouter>
      <MainLayout 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        cartCount={cartCount}
        onCartClick={() => setShowCartModal(true)}
        onOrdersClick={() => setShowOrderHistory(true)}
        onFavoritesClick={() => setShowFavoritesModal(true)}
        onLogoutToast={addToast}
      >
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/shop" /> : <Login onLoginSuccess={fetchCart} darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/shop" element={
            isAuthenticated ? (
              <main className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ItemList 
                  onCartUpdate={(c) => setCart(c)} 
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onProductClick={(p) => setPreviewProduct(p)}
                  addingToCartId={addingToCartId}
                  onAddToCart={handleAddToCart}
                />
              </main>
            ) : <Navigate to="/login" />
          } />
          <Route path="/cart" element={
            isAuthenticated ? (
              <CartPage 
                cart={cart} 
                onUpdateQuantity={handleUpdateQuantity} 
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                checkingOut={checkingOut}
              />
            ) : <Navigate to="/login" />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>

      {/* Modals & Overlays */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <OrderHistory
        isOpen={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
      />
      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={fullFavorites}
        loading={favoritesLoading}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        onProductClick={(p) => setPreviewProduct(p)}
        addingToCart={addingToCartId}
        addedItems={new Set()}
      />
      <ProductPreviewModal 
        isOpen={!!previewProduct}
        onClose={() => setPreviewProduct(null)}
        product={previewProduct}
        onAddToCart={handleAddToCart}
        addingToCart={addingToCartId}
        isAdded={previewProduct && cart?.items?.some(i => i.item_id === (previewProduct.id || previewProduct._id))}
        isFavorite={previewProduct && favorites.has(previewProduct?._id || previewProduct?.id)}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
