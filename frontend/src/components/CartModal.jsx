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
    
    return cart.items.map(item => 
      `Cart ID: ${item.cart_id}, Item ID: ${item.item_id}`
    ).join('\n');
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
        <div className="flex items-center justify-between p-6 border-b border-dark-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Your Cart</h2>
              <p className="text-sm text-dark-400">
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
              <ShoppingBag className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-dark-300 mb-2">Your cart is empty</h3>
              <p className="text-dark-500">Start shopping to add items!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl border border-dark-700/50"
                >
                  {/* Item Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
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
                    <h4 className="font-medium text-dark-100 truncate">
                      {item.item?.name || `Item #${item.item_id}`}
                    </h4>
                    <p className="text-sm text-dark-400">
                      ${item.item?.price?.toFixed(2) || '0.00'} each
                    </p>
                    <p className="text-xs text-dark-500 mt-1">
                      Cart ID: {item.cart_id}, Item ID: {item.item_id}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-semibold text-primary-400">
                      ${item.subtotal?.toFixed(2) || '0.00'}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="p-6 border-t border-dark-700/50 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Total</span>
              <span className="text-2xl font-bold text-primary-400">
                ${cart.total?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
