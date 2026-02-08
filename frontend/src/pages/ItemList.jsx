import { useState, useEffect } from 'react';
import { itemApi } from '../services/api';
import { 
  ShoppingCart, 
  Plus, 
  Loader2, 
  Filter, 
  Search,
  Package,
  Check,
  Star,
  Sparkles,
  Heart
} from 'lucide-react';

const ItemList = ({ 
  onCartUpdate, 
  favorites, 
  onToggleFavorite, 
  onProductClick, 
  addingToCartId, 
  onAddToCart 
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [selectedCategory, page]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemApi.list({ 
        page, 
        page_size: itemsPerPage, 
        category: selectedCategory 
      });
      
      if (response.success) {
        setItems(response.data || []);
        if (response.meta) {
            setTotalPages(Math.ceil(response.meta.total / itemsPerPage));
        } else {
             if (response.data.length === itemsPerPage) {
                 setTotalPages(page + 1); 
             }
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await itemApi.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-dark-400 font-medium">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-display font-bold mb-3 text-slate-900 dark:text-white">
          Discover Our <span className="gradient-text">Products</span>
        </h2>
        <p className="text-slate-500 dark:text-dark-400 max-w-2xl mx-auto font-medium">
          Click on any item to add it to your cart. Premium selection of electronics, accessories, and more.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field pl-12 pr-10 appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-slate-300 dark:text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-dark-300 mb-2">No products found</h3>
          <p className="text-slate-500 dark:text-dark-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="item-card card-hover group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onProductClick(item)}
              >
                {/* Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-dark-800">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-dark-600" />
                    </div>
                  )}

                  {/* Overlay with Add Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item.id);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                        addingToCartId === item.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-white border border-transparent dark:border-dark-700 shadow-xl'
                      }`}
                    >
                      {addingToCartId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span className="text-sm font-bold">
                        Add to Cart
                      </span>
                    </button>
                  </div>

                  {/* Favorite Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-slate-200/50 dark:border-dark-700/50 text-slate-400 hover:text-red-500 transition-all z-10 group/fav"
                  >
                    <Heart className={`w-4 h-4 transition-all ${favorites.has(item.id) ? 'fill-red-500 text-red-500 scale-110' : 'group-hover/fav:scale-110'}`} />
                  </button>

                  {/* Category Badge */}
                  {item.category && (
                    <div className="absolute top-3 left-3">
                      <span className="badge-primary text-[10px] px-2 py-0.5">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800 dark:text-dark-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-dark-400 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-primary-400">
                      ₹{item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">
                        {(4.0 + (item.id?.charCodeAt(item.id.length - 1) % 10) / 10).toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-dark-400 font-medium">
                        ({(10 + (item.id?.charCodeAt(item.id.length - 1) * 7 + item.id?.charCodeAt(0)) % 250)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-dark-700/50">
            <div className="flex items-center gap-2 font-display text-sm font-medium">
              <span className="text-slate-500 dark:text-dark-400">Showing</span>
              <span className="text-primary-500 dark:text-primary-400">{filteredItems.length}</span>
              <span className="text-slate-500 dark:text-dark-400">items on page {page}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      page === i + 1
                        ? 'bg-primary-500 text-white shadow-glow-sm'
                        : 'bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemList;
