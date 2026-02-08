import { useState, useCallback, useRef } from 'react';
import { favoriteApi } from '../services/api';

export const useFavorites = (isAuthenticated, addToast) => {
  const [favorites, setFavorites] = useState(new Set());
  const [fullFavorites, setFullFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const processingFavorites = useRef(new Set());

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setFavoritesLoading(true);
      const response = await favoriteApi.list();
      if (response.success) {
        const uniqueData = [];
        const seenIds = new Set();
        (response.data || []).forEach(item => {
          const id = item._id || item.id;
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            uniqueData.push(item);
          }
        });
        setFullFavorites(uniqueData);
        setFavorites(new Set(uniqueData.map(item => item._id || item.id)));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  }, [isAuthenticated]);

  const handleToggleFavorite = useCallback(async (itemId) => {
    if (processingFavorites.current.has(itemId)) return;
    
    try {
      processingFavorites.current.add(itemId);
      const response = await favoriteApi.toggle(itemId);
      if (response.success) {
        setFavorites(prev => {
          const next = new Set(prev);
          if (response.action === 'added') {
            next.add(itemId);
            addToast('Added to favorites', 'success');
          } else {
            next.delete(itemId);
            addToast('Removed from favorites', 'info');
          }
          return next;
        });
        fetchFavorites();
      }
    } catch (error) {
       addToast('Failed to update favorites', 'error');
    } finally {
      processingFavorites.current.delete(itemId);
    }
  }, [addToast, fetchFavorites]);

  return {
    favorites,
    fullFavorites,
    favoritesLoading,
    fetchFavorites,
    handleToggleFavorite
  };
};
