import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = ({ children, darkMode, setDarkMode, cartCount, onCartClick, onOrdersClick, onFavoritesClick, onLogoutToast }) => {
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
          onLogoutToast={onLogoutToast}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      {children}
    </div>
  );
};

export default MainLayout;
