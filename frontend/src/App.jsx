import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { cartApi, orderApi } from './services/api';
import Login from './components/Login';
import Navbar from './components/Navbar';
import ItemList from './components/ItemList';
import CartModal from './components/CartModal';
import OrderHistory from './components/OrderHistory';
import { 
  ShoppingBag, 
  CreditCard, 
  Loader2,
  CheckCircle,
  X,
  Sparkles,
  ShoppingCart,
  History
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

// Main Shop Page
const ShopPage = () => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Add toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

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

  const handleCartUpdate = (newCart) => {
    setCart(newCart);
    addToast('Item added to cart!', 'success');
  };

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
      console.error('Error updating cart:', error);
      addToast('Failed to update cart', 'error');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartApi.removeItem(cartItemId);
      fetchCart();
      addToast('Item removed from cart', 'info');
    } catch (error) {
      console.error('Error removing item:', error);
      addToast('Failed to remove item', 'error');
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.id || cart.item_count === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }

    try {
      setCheckingOut(true);
      const response = await orderApi.create(cart.id);
      if (response.success) {
        setCart({ ...cart, items: [], item_count: 0, total: 0 });
        addToast('🎉 Order placed successfully!', 'success');
        setShowCartModal(false);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      addToast('Failed to place order', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

  const cartCount = cart?.item_count || 0;

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar 
        cartCount={cartCount}
        onCartClick={() => setShowCartModal(true)}
        onOrdersClick={() => setShowOrderHistory(true)}
      />

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Assignment Specific Toolbar */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4 animate-fade-in shadow-glow-lg border-primary-500/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary-400" />
            <span className="font-display font-bold text-xl">Shopping Portal</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Cart Button (Alert version) */}
            <button
              onClick={() => {
                if (!cart || !cart.items || cart.items.length === 0) {
                  window.alert('No items in cart');
                } else {
                  const details = cart.items.map(item => `Cart ID: ${item.cart_id}, Item ID: ${item.item_id}`).join('\n');
                  window.alert(`Current Cart Items:\n\n${details}`);
                }
              }}
              className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart Details</span>
            </button>

            {/* Order History Button (Alert version) */}
            <button
              onClick={async () => {
                const response = await orderApi.myOrders();
                if (response.success && response.data.length > 0) {
                  const ids = response.data.map(o => `Order ID: ${o.id}`).join('\n');
                  window.alert(`Order History:\n\n${ids}`);
                } else {
                  window.alert('No order history found');
                }
              }}
              className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
            >
              <History className="w-4 h-4" />
              <span>Order History</span>
            </button>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={checkingOut || cartCount === 0}
              className="btn-primary flex items-center gap-2 py-2 px-6 shadow-glow"
            >
              {checkingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              <span>Checkout</span>
            </button>
          </div>
        </div>

        <ItemList onCartUpdate={handleCartUpdate} />
      </main>

      {/* Floating Checkout Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="btn-accent flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl shadow-accent-500/30"
          >
            {checkingOut ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Checkout</span>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                  ${cart?.total?.toFixed(2) || '0.00'}
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Cart Modal */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Order History Modal */}
      <OrderHistory
        isOpen={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
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
    </div>
  );
};

// App Component
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  if (!loggedIn) {
    return <Login onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return <ShopPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
