import React, { createContext, useState, ReactNode } from 'react';
import { Product } from '../types';

type CartContextType = {
  cart: Product[];
  addToCart: (product: Product) => void;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};