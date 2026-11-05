'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the type for a cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  variant?: string;
  weight?: string;
  isSample?: boolean; // Flag to identify free samples
}

// Define the cart context type
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  addFreeSample: (sample: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemsCount: () => number;
  hasFreeSample: () => boolean;
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Initialize cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem('cart')) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Add a product to the cart
  const addToCart = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart(prevCart => {
      // Check if item already exists in cart with the same variant and weight
      const existingItemIndex = prevCart.findIndex(item => 
        item.id === product.id && 
        item.variant === product.variant && 
        item.weight === product.weight
      );
      const quantityToAdd = product.quantity || 1;
      
      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantityToAdd
        };
        return updatedCart;
      } else {
        // Item doesn't exist, add it with specified quantity or 1
        return [...prevCart, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  // Helper function to check if there are any paid products in cart
  const hasPaidProducts = (cartItems: CartItem[]) => {
    return cartItems.some(item => !item.isSample && item.price > 0);
  };

  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      
      // If no paid products remain, remove free sample
      if (!hasPaidProducts(newCart)) {
        return newCart.filter(item => !item.isSample);
      }
      
      return newCart;
    });
  };

  // Update quantity of a product in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
      
      // If no paid products remain, remove free sample
      if (!hasPaidProducts(newCart)) {
        return newCart.filter(item => !item.isSample);
      }
      
      return newCart;
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Calculate the total price of all items in the cart
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get the total number of items in the cart
  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Add free sample to cart
  const addFreeSample = (sample: Omit<CartItem, 'quantity'>) => {
    // First remove any existing sample
    setCart(prevCart => prevCart.filter(item => !item.isSample));
    
    // Then add the new sample
    setCart(prevCart => [...prevCart, { ...sample, quantity: 1, isSample: true, price: 0 }]);
  };

  // Check if cart has a free sample
  const hasFreeSample = () => {
    return cart.some(item => item.isSample);
  };

  const value = {
    cart,
    addToCart,
    addFreeSample,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemsCount,
    hasFreeSample
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 