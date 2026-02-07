import { useState, useEffect } from 'react';
import { itemApi, cartApi } from '../services/api';
import { 
  ShoppingCart, 
  Plus, 
  Loader2, 
  Filter, 
  Search,
  Package,
  Check,
  Star,
  Sparkles
} from 'lucide-react';

const ItemList = ({ onCartUpdate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addedItems, setAddedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [selectedCategory]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemApi.list(1, 50, selectedCategory);
      if (response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await itemApi.categories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      setAddingToCart(itemId);
      const response = await cartApi.add(itemId, 1);
      if (response.success) {
        setAddedItems(prev => new Set([...prev, itemId]));
        onCartUpdate(response.data);
        
        // Show success feedback
        setTimeout(() => {
          setAddedItems(prev => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      window.alert('Failed to add item to cart');
    } finally {
      setAddingToCart(null);
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
          <p className="text-dark-400">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-display font-bold mb-3">
          Discover Our <span className="gradient-text">Products</span>
        </h2>
        <p className="text-dark-400 max-w-2xl mx-auto">
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
          <Package className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-300 mb-2">No products found</h3>
          <p className="text-dark-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="item-card card-hover group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleAddToCart(item.id)}
            >
              {/* Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-dark-800">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-dark-600" />
                  </div>
                )}

                {/* Overlay with Add Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    addedItems.has(item.id)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-dark-900'
                  }`}>
                    {addingToCart === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : addedItems.has(item.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {addedItems.has(item.id) ? 'Added!' : 'Add to Cart'}
                    </span>
                  </div>
                </div>

                {/* Category Badge */}
                {item.category && (
                  <div className="absolute top-3 left-3">
                    <span className="badge-primary text-xs">
                      {item.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-dark-100 group-hover:text-primary-400 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-sm text-dark-400 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold text-primary-400">
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
              </div>

              {/* Quick Add Indicator */}
              {addingToCart === item.id && (
                <div className="absolute inset-0 bg-dark-950/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="flex items-center gap-3 text-white">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Adding...</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Product Count */}
      <div className="text-center pt-4">
        <p className="text-dark-500 text-sm">
          Showing {filteredItems.length} of {items.length} products
        </p>
      </div>
    </div>
  );
};

export default ItemList;
