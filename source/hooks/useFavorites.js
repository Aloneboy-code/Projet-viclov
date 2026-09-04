import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('viclov_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Erreur lors du chargement des favoris:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('viclov_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des favoris:', error);
    }
  }, [favorites]);

  const toggle = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id) 
        : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  return { favorites, toggle, isFavorite };
}
