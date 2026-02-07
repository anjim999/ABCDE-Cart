import { createContext, useContext, useState, useEffect } from 'react';
import { userApi, isAuthenticated, getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      const storedUser = getCurrentUser();
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await userApi.login(username, password);
    if (response.success) {
      setUser(response.data.user);
    }
    return response;
  };

  const register = async (username, password, email) => {
    return await userApi.register(username, password, email);
  };

  const logout = async () => {
    try {
      await userApi.logout();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
