import { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import { 
  X, 
  History, 
  Package, 
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';

const OrderHistory = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.myOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Format orders for alert (Assignment Requirement)
  const handleShowAlert = () => {
    if (orders.length === 0) {
      window.alert('No orders found');
      return;
    }
    
    const orderIds = orders.map(order => `Order ID: ${order.id}`).join('\n');
    window.alert(`Your Orders:\n\n${orderIds}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-primary-400" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-400" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-dark-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-500/20 text-amber-400',
      confirmed: 'bg-primary-500/20 text-primary-400',
      shipped: 'bg-blue-500/20 text-blue-400',
      delivered: 'bg-emerald-500/20 text-emerald-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return styles[status] || 'bg-dark-500/20 text-dark-400';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <History className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Order History</h2>
              <p className="text-sm text-dark-400">
                {orders.length} order{orders.length !== 1 ? 's' : ''}
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

        {/* Orders List */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-dark-300 mb-2">No orders yet</h3>
              <p className="text-dark-500">Your order history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div 
                  key={order.id}
                  className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50 hover:border-dark-600/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="font-semibold">Order #{order.id}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400">
                      {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold text-primary-400">
                      ${order.total_amount?.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-dark-700/50">
                    <span className="text-xs text-dark-500">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default OrderHistory;
