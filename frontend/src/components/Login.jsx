import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const response = await login(formData.username, formData.password);
        if (response.success) {
          onLoginSuccess();
        } else {
          setError(response.error || 'Login failed');
        }
      } else {
        const response = await register(formData.username, formData.password, formData.email);
        if (response.success) {
          setSuccess('Account created successfully! Please login.');
          setIsLogin(true);
          setFormData({ ...formData, password: '' });
        } else {
          setError(response.error || 'Registration failed');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      
      // Handle single-device login error
      if (err.response?.status === 403) {
        window.alert('You are already logged in on another device.');
        setError('You are already logged in on another device.');
      } else if (errorMessage.includes('Invalid username/password')) {
        window.alert('Invalid username/password');
        setError('Invalid username/password');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse animate-delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-6 shadow-lg shadow-primary-500/25">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-2">
            <span className="gradient-text">ShopEase</span>
          </h1>
          <p className="text-dark-400">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Login/Register Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
          {/* Tab Switcher */}
          <div className="flex gap-2 p-1 bg-dark-800/50 rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                isLogin 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg' 
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg' 
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-6 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-400 text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="input-field pl-12"
                required
                minLength={3}
                autoComplete="username"
              />
            </div>

            {/* Email Field (Register only) */}
            {!isLogin && (
              <div className="relative animate-fade-in">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email (optional)"
                  className="input-field pl-12"
                  autoComplete="email"
                />
              </div>
            )}

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="input-field pl-12 pr-12"
                required
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="divider" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-900 px-4 text-dark-500 text-sm">
              or continue with
            </span>
          </div>

          {/* Demo Login */}
          <button
            onClick={async () => {
              setFormData({ username: 'demo', password: 'demo123', email: '' });
              setLoading(true);
              try {
                // First try to register demo user
                await register('demo', 'demo123', 'demo@example.com');
              } catch (e) {
                // User might already exist, ignore
              }
              try {
                const response = await login('demo', 'demo123');
                if (response.success) {
                  onLoginSuccess();
                }
              } catch (e) {
                if (e.response?.status === 403) {
                  window.alert('Demo user is already logged in on another device.');
                }
              }
              setLoading(false);
            }}
            disabled={loading}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-accent-400" />
            <span>Try Demo Account</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-dark-500 text-sm mt-6 animate-fade-in animate-delay-300">
          Built with ❤️ for ABCDE Ventures
        </p>
      </div>
    </div>
  );
};

export default Login;
