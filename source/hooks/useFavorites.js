import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('viclov_favorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('viclov_favorites', JSON.stringify(favorites));
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
