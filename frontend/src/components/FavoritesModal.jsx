import { 
  X, 
  Heart, 
  ShoppingCart, 
  Plus, 
  Loader2, 
  Trash2,
  Package,
  Star
} from 'lucide-react';

const FavoritesModal = ({ 
  isOpen, 
  onClose, 
  favorites, 
  loading, 
  onAddToCart, 
  onToggleFavorite,
  onProductClick,
  addingToCart,
  addedItems 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Your Favorites</h2>
              <p className="text-sm text-slate-500 dark:text-dark-400">
                {favorites.length} saved items
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

        {/* Favorites List */}
        <div className="p-6 max-h-[450px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 dark:text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-dark-300 mb-2">No favorites yet</h3>
              <p className="text-slate-500 dark:text-dark-500">Items you heart will appear here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((product) => {
                const rating = (4.0 + (product._id?.charCodeAt(product._id.length - 1) % 10) / 10).toFixed(1);
                
                return (
                  <div 
                    key={product._id}
                    className="group p-3 bg-white dark:bg-dark-800/50 rounded-2xl border border-slate-200 dark:border-dark-700/50 hover:border-red-500/30 transition-all flex items-center gap-4"
                  >
                    {/* Product Image */}
                    <div 
                      className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-dark-900/50 cursor-pointer flex-shrink-0"
                      onClick={() => onProductClick(product)}
                    >
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-slate-400 dark:text-dark-600" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-bold text-slate-800 dark:text-dark-100 truncate hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer transition-colors"
                        onClick={() => onProductClick(product)}
                      >
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">{rating}</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-dark-400 font-bold">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAddToCart(product._id)}
                          disabled={addingToCart === product._id}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            addedItems.has(product._id)
                              ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-lg'
                              : 'bg-primary-500 text-white hover:bg-primary-600'
                          }`}
                        >
                          {addingToCart === product._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : addedItems.has(product._id) ? (
                            <>
                              <ShoppingCart className="w-3 h-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => onToggleFavorite(product._id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-dark-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
