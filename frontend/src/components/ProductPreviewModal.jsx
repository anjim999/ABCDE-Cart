import { 
  X, 
  ShoppingCart, 
  Plus, 
  Star,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  Loader2,
  Heart
} from 'lucide-react';

const ProductPreviewModal = ({ isOpen, onClose, product, onAddToCart, addingToCart, isAdded, isFavorite, onToggleFavorite }) => {
  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const rating = (4.0 + (product.id?.charCodeAt(product.id.length - 1) % 10) / 10).toFixed(1);
  const reviews = (10 + (product.id?.charCodeAt(product.id.length - 1) * 7 + product.id?.charCodeAt(0)) % 250);

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white dark:bg-dark-900 w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up relative flex flex-col md:flex-row max-h-[95vh] border border-slate-200 dark:border-dark-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right Floating */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-slate-100/80 dark:bg-dark-800/80 text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white transition-all hover:rotate-90"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Gallery Section */}
        <div className="w-full md:w-[55%] bg-slate-50 dark:bg-dark-950/40 relative flex items-center justify-center p-8 sm:p-12 overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-primary-500 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-accent-500 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-center">
             {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="max-w-full max-h-[300px] md:max-h-[500px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-48 h-48 rounded-3xl bg-slate-200 dark:bg-dark-800 flex items-center justify-center">
                  <Package className="w-20 h-20 text-slate-400 dark:text-dark-600" />
                </div>
              )}
          </div>

          {/* Category Tag */}
          <div className="absolute top-8 left-8">
            <span className="px-4 py-2 rounded-full bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-slate-200/50 dark:border-dark-700/50 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-wider uppercase">
              {product.category || 'General'}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-[45%] flex flex-col p-8 sm:p-10 bg-white dark:bg-dark-900">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-6">
              {/* Product Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{rating}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-dark-700" />
                    <span className="text-sm font-medium text-slate-500 dark:text-dark-400">{reviews} Verified Reviews</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white leading-[1.1]">
                  {product.name}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-display font-extrabold text-primary-500 dark:text-primary-400">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-lg text-slate-400 dark:text-dark-500 line-through">
                   ₹{(product.price * 1.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-dark-500">Details</h4>
                <p className="text-slate-600 dark:text-dark-400 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 dark:border-dark-800/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Original</p>
                    <p className="text-[10px] text-slate-500 dark:text-dark-500">100% Authentic</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Shipping</p>
                    <p className="text-[10px] text-slate-500 dark:text-dark-500">Free Next Day</p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-dark-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  Premium materials and build quality
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-dark-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  Eco-friendly production process
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 flex gap-3">
            <button
               onClick={() => onAddToCart(product.id)}
               disabled={addingToCart === product.id}
               className={`flex-[4] h-16 rounded-2xl flex items-center justify-center gap-3 font-display font-bold text-lg transition-all ${
                 isAdded 
                   ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                   : 'btn-primary'
               }`}
            >
              {addingToCart === product.id ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isAdded ? (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  <span>In Your Cart</span>
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
            <button 
              onClick={() => onToggleFavorite(product.id)}
              className="flex-1 h-16 rounded-2xl border border-slate-200 dark:border-dark-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors group"
            >
              <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover:text-red-500'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal;
