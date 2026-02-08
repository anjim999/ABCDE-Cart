import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  CreditCard, 
  ArrowLeft,
  Package,
  ShoppingCart
} from 'lucide-react';

const CartPage = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout, checkingOut }) => {
  const navigate = useNavigate();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-4">Your cart is empty</h2>
          <p className="text-slate-500 dark:text-dark-400 mb-8 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our products and find something you love!
          </p>
          <button 
            onClick={() => navigate('/shop')}
            className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-10 animate-fade-in">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-600 dark:text-dark-300 hover:text-primary-500 transition-all shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white">Your Shopping <span className="gradient-text">Cart</span></h1>
          <p className="text-slate-500 dark:text-dark-400 font-medium">{cart.item_count} items in your bag</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6 animate-slide-up">
          {cart.items.map((item, index) => (
            <div 
              key={item.id}
              className="group bg-white dark:bg-dark-800/40 rounded-3xl border border-slate-200 dark:border-dark-700/50 p-6 flex flex-col sm:flex-row items-center gap-6 hover:border-primary-500/30 transition-all shadow-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Product Image */}
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-dark-900/50 flex-shrink-0">
                {item.item?.image_url ? (
                  <img 
                    src={item.item.image_url} 
                    alt={item.item?.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-10 h-10 text-slate-300 dark:text-dark-600" />
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="text-xl font-bold text-slate-800 dark:text-dark-100 mb-1 truncate">{item.item?.name || 'Product'}</h3>
                <p className="text-sm text-slate-500 dark:text-dark-400 mb-4">{item.item?.category || 'General'}</p>
                <div className="text-2xl font-black text-primary-500">₹{item.item?.price?.toLocaleString('en-IN')}</div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center sm:items-end gap-4">
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-dark-900/50 p-2 rounded-2xl border border-slate-200 dark:border-dark-700">
                  <button 
                   onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                   className="w-8 h-8 rounded-xl bg-white dark:bg-dark-800 flex items-center justify-center text-slate-600 dark:text-dark-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-black dark:text-white w-6 text-center">{item.quantity}</span>
                  <button 
                   onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                   className="w-8 h-8 rounded-xl bg-white dark:bg-dark-800 flex items-center justify-center text-slate-600 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-500 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Side */}
        <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-700/80 p-8 sticky top-24 shadow-xl">
             <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-dark-700 pb-4">Order Summary</h2>
             
             <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500 dark:text-dark-400">
                   <span>Subtotal</span>
                   <span className="font-bold dark:text-dark-200">₹{cart.total?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-dark-400">
                   <span>Shipping</span>
                   <span className="text-emerald-500 font-bold uppercase text-xs p-1 bg-emerald-500/10 rounded">Free</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-dark-400">
                   <span>Tax (GST)</span>
                   <span className="font-bold dark:text-dark-200">Included</span>
                </div>
             </div>

             <div className="pt-6 border-t border-slate-100 dark:border-dark-700 mb-8">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-slate-900 dark:text-white font-bold text-xl">Total Amount</span>
                   <span className="text-3xl font-black text-primary-500">₹{cart.total?.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-right text-xs text-slate-400 font-medium">Inclusive of all taxes</p>
             </div>

             <button 
               onClick={onCheckout}
               disabled={checkingOut}
               className="btn-primary w-full py-5 rounded-[2rem] text-xl font-black flex items-center justify-center gap-3 shadow-glow hover:scale-[1.02] active:scale-95 transition-all"
             >
               {checkingOut ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
               ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    Checkout
                  </>
               )}
             </button>

             <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 dark:text-dark-500 grayscale opacity-50">
                <CreditCard className="w-8 h-8" />
                <ShoppingCart className="w-8 h-8" />
                <ShieldCheck className="w-8 h-8" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

const Loader2 = ({ className }) => (
  <svg className={`${className} lucide lucide-loader-2 animate-spin`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

export default CartPage;
