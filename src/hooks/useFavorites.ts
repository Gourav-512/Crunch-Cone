"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'scoopShopFavorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const saveFavorites = useCallback((newFavorites: string[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage", error);
    }
  }, []);

  const toggleFavorite = useCallback((flavorId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(flavorId)
        ? prevFavorites.filter(id => id !== flavorId)
        : [...prevFavorites, flavorId];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const isFavorite = useCallback((flavorId: string) => {
    return favorites.includes(flavorId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
