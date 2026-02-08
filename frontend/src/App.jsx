import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ItemList from './components/ItemList';
import CartModal from './components/CartModal';
import OrderHistory from './components/OrderHistory';
import FavoritesModal from './components/FavoritesModal';
import ProductPreviewModal from './components/ProductPreviewModal';
import Login from './components/Login';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import { favoriteApi, cartApi, orderApi } from './services/api';
import { 
  CheckCircle,
  X,
  Sparkles,
  Smartphone,
  Layout,
  Heart,
  Package
} from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <X className="w-5 h-5 text-red-400" />,
    info: <Sparkles className="w-5 h-5 text-primary-400" />,
  };

  const styles = {
    success: 'border-emerald-500/50',
    error: 'border-red-500/50',
    info: 'border-primary-500/50',
  };

  return (
    <div className={`toast ${styles[type]}`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-dark-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main Layout Wrapper
const MainLayout = ({ children, cart, setDarkMode, darkMode, cartCount, onCartClick, onOrdersClick, onFavoritesClick }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/login'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen">
      {!shouldHideNavbar && (
        <Navbar 
          cartCount={cartCount}
          onCartClick={onCartClick}
          onOrdersClick={onOrdersClick}
          onFavoritesClick={onFavoritesClick}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      {children}
    </div>
  );
};

// Main App Controller
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [fullFavorites, setFullFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [toasts, setToasts] = useState([]);
  const processingFavorites = useRef(new Set());
  const processingCart = useRef(new Set());
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply theme class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Add toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch cart and favorites
  const fetchCart = async () => {
    try {
      const response = await cartApi.get();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const response = await favoriteApi.list();
      if (response.success) {
        const uniqueData = [];
        const seenIds = new Set();
        (response.data || []).forEach(item => {
          const id = item._id || item.id;
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            uniqueData.push(item);
          }
        });
        setFullFavorites(uniqueData);
        setFavorites(new Set(uniqueData.map(item => item._id || item.id)));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const handleToggleFavorite = useCallback(async (itemId) => {
    if (processingFavorites.current.has(itemId)) return;
    
    try {
      processingFavorites.current.add(itemId);
      const response = await favoriteApi.toggle(itemId);
      if (response.success) {
        setFavorites(prev => {
          const next = new Set(prev);
          if (response.action === 'added') {
            next.add(itemId);
            addToast('Added to favorites', 'success');
          } else {
            next.delete(itemId);
            addToast('Removed from favorites', 'info');
          }
          return next;
        });
        fetchFavorites();
      }
    } catch (error) {
       addToast('Failed to update favorites', 'error');
    } finally {
      processingFavorites.current.delete(itemId);
    }
  }, [addToast, fetchFavorites]);

  const handleAddToCart = useCallback(async (itemId) => {
    if (processingCart.current.has(itemId)) return;

    try {
      processingCart.current.add(itemId);
      setAddingToCartId(itemId);
      const response = await cartApi.add(itemId, 1);
      if (response.success) {
        setCart(response.data);
        addToast('Item added to cart!', 'success');
      }
    } catch (error) {
      addToast('Failed to add item to cart', 'error');
    } finally {
      setAddingToCartId(null);
      processingCart.current.delete(itemId);
    }
  }, [addToast]);

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity === 0) {
        await cartApi.removeItem(cartItemId);
        addToast('Item removed from cart', 'info');
      } else {
        await cartApi.updateItem(cartItemId, quantity);
      }
      fetchCart();
    } catch (error) {
      addToast('Failed to update cart', 'error');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartApi.removeItem(cartItemId);
      fetchCart();
      addToast('Item removed from cart', 'info');
    } catch (error) {
      addToast('Failed to remove item', 'error');
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.item_count === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }

    try {
      setCheckingOut(true);
      const response = await orderApi.create(cart.id);
      if (response.success) {
        setCart({ ...cart, items: [], item_count: 0, total: 0 });
        addToast('🎉 Order placed successfully!', 'success');
      }
    } catch (error) {
      addToast('Failed to place order', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

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
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/shop" /> : <Login onLoginSuccess={fetchCart} />} />
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
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>

      {/* Modals & Overlays (Persistent across routes if needed) */}
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
