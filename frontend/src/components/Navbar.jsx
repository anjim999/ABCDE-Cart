import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  ShoppingCart, 
  History, 
  LogOut, 
  User,
  Menu,
  X,
  Package
} from 'lucide-react';

const Navbar = ({ cartCount, onCartClick, onOrdersClick }) => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'navbar-blur shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text hidden sm:block">
              ShopEase
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-2 px-4 py-2 bg-dark-800/50 rounded-xl border border-dark-700/50">
              <User className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-dark-200">{user?.username}</span>
            </div>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="btn-icon relative"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>

            {/* Order History Button */}
            <button
              onClick={onOrdersClick}
              className="btn-icon"
              title="Order History"
            >
              <History className="w-5 h-5" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2 py-2.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Cart (Mobile) */}
            <button
              onClick={onCartClick}
              className="btn-icon relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass rounded-2xl p-4 mb-4 animate-slide-up">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                <User className="w-5 h-5 text-primary-400" />
                <span className="text-dark-200">{user?.username}</span>
              </div>
              
              <button
                onClick={() => {
                  onOrdersClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 hover:bg-dark-800/50 rounded-xl transition-colors"
              >
                <History className="w-5 h-5 text-dark-400" />
                <span>Order History</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 hover:bg-dark-800/50 rounded-xl transition-colors text-red-400"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
