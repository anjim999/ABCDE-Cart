import { useState, useCallback, useRef } from 'react';
import { cartApi, orderApi } from '../services/api';

export const useCart = (isAuthenticated, addToast) => {
  const [cart, setCart] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const processingCart = useRef(new Set());

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await cartApi.get();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [isAuthenticated]);

  const handleAddToCart = useCallback(async (itemId) => {
    if (processingCart.current.has(itemId)) return;

    try {
      processingCart.current.add(itemId);
      setAddingToCartId(itemId);
      const response = await cartApi.add(itemId, 1);
      if (response.success) {
        setCart(response.data);
        addToast('Item added to cart!', 'success');
      }
    } catch (error) {
      addToast('Failed to add item to cart', 'error');
    } finally {
      setAddingToCartId(null);
      processingCart.current.delete(itemId);
    }
  }, [addToast]);

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity === 0) {
        await cartApi.removeItem(cartItemId);
        addToast('Item removed from cart', 'info');
      } else {
        await cartApi.updateItem(cartItemId, quantity);
      }
      fetchCart();
    } catch (error) {
      addToast('Failed to update cart', 'error');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartApi.removeItem(cartItemId);
      fetchCart();
      addToast('Item removed from cart', 'info');
    } catch (error) {
      addToast('Failed to remove item', 'error');
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.item_count === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }

    try {
      setCheckingOut(true);
      const response = await orderApi.create(cart.id);
      if (response.success) {
        setCart({ ...cart, items: [], item_count: 0, total: 0 });
        addToast('🎉 Order placed successfully!', 'success');
      }
    } catch (error) {
      addToast('Failed to place order', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

  return {
    cart,
    setCart,
    addingToCartId,
    checkingOut,
    fetchCart,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleCheckout
  };
};
