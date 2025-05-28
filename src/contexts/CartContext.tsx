"use client";

import type { IceCreamFlavor, CartItem } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (flavor: IceCreamFlavor, quantity?: number) => void;
  removeFromCart: (flavorId: string) => void;
  updateQuantity: (flavorId: string, quantity: number) => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((flavor: IceCreamFlavor, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.flavorId === flavor.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.flavorId === flavor.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, flavor.stock) } // Respect stock
            : item
        );
      }
      return [...prevItems, { flavorId: flavor.id, name: flavor.name, price: flavor.price, image: flavor.image, quantity: Math.min(quantity, flavor.stock) }];
    });
    toast({
      title: "Added to cart!",
      description: `${flavor.name} has been added to your cart.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((flavorId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.flavorId !== flavorId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
      variant: "destructive"
    });
  }, [toast]);

  const updateQuantity = useCallback((flavorId: string, quantity: number) => {
    setCartItems(prevItems => {
      // Find flavor stock - assumes flavors are accessible or passed differently in a real app
      // For now, let's just cap quantity if we had stock info. Here, we allow going up to a reasonable limit.
      const maxQuantity = 10; // Or flavor.stock if available
      const newQuantity = Math.max(1, Math.min(quantity, maxQuantity));
      return prevItems.map(item =>
        item.flavorId === flavorId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);
  
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
