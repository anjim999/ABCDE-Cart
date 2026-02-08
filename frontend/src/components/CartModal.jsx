import { 
  X, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2,
  Package,
  ShoppingBag
} from 'lucide-react';

const CartModal = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCartItems = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return 'No items in cart';
    }
    
    const itemsList = cart.items.map(item => 
      `• ${item.item?.name || 'Item'} (x${item.quantity}) - ₹${item.subtotal?.toFixed(2)}`
    ).join('\n');
    
    return `Order Summary:\n\n${itemsList}\n\nTotal Amount: ₹${cart.total?.toFixed(2)}\n\nThank you for shopping with ShopEase!`;
  };

  // Also show as window.alert as per assignment requirement
  const handleShowAlert = () => {
    window.alert(formatCartItems());
  };

  return (
    <div 
      className="modal-overlay animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-dark-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Your Cart</h2>
              <p className="text-sm text-slate-500 dark:text-dark-400">
                {cart?.item_count || 0} items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-dark-300 mb-2">Your cart is empty</h3>
              <p className="text-slate-500 dark:text-dark-500">Start shopping to add items!</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-x-hidden">
              {cart.items.map((item) => (
                <div 
                  key={item.id}
                  className="w-full p-3 bg-white dark:bg-dark-800/50 rounded-xl border border-slate-200 dark:border-dark-700/50 flex items-center gap-3"
                >
                  {/* Item Image */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                    {item.item?.image_url ? (
                      <img 
                        src={item.item.image_url} 
                        alt={item.item?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-dark-500" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-dark-100 truncate text-sm sm:text-base">
                      {item.item?.name || `Item #${item.item_id}`}
                    </h4>
                    <p className="text-xs sm:text-sm text-dark-400">
                      ₹{item.item?.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>

                  {/* Actions Group */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {/* Quantity */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-dark-900/50 rounded-lg p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="w-6 h-6 rounded bg-white dark:bg-dark-700 border border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-dark-600 flex items-center justify-center transition-colors text-slate-600 dark:text-dark-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-medium text-slate-700 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-white dark:bg-dark-700 border border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-dark-600 flex items-center justify-center transition-colors text-slate-600 dark:text-dark-200"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right w-16 hidden sm:block">
                      <p className="font-semibold text-primary-400 text-sm">
                        ₹{item.subtotal?.toFixed(2) || '0.00'}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 dark:text-dark-500 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="p-6 border-t border-slate-200 dark:border-dark-700/50 space-y-4 bg-slate-50/50 dark:bg-transparent">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 dark:text-dark-300">Total</span>
              <span className="text-2xl font-bold text-primary-500 dark:text-primary-400">
                ₹{cart.total?.toFixed(2) || '0.00'}
              </span>
            </div>
            
            {/* Checkout Button */}
            <button 
              onClick={handleShowAlert}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 rounded-xl font-medium"
            >
              <ShoppingCart className="w-5 h-5" />
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
