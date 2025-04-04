// src/contexts/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from local storage or as an empty array
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  // Sync cart with local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart, updating quantity if already present
  const addToCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove an item completely from the cart
  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Decrease item quantity, remove if quantity is 1
  const decreaseQuantity = (itemId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for accessing the cart context
export const useCart = () => useContext(CartContext);
