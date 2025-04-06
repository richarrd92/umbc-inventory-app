// src/contexts/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// Create cart context
const CartContext = createContext();

// CartProvider manages cart state
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

      // If item is already in cart, update quantity
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity:
                  typeof item.quantity === "number"
                    ? item.quantity
                    : i.quantity + 1,
              }
            : i
        );
      }

      // If item is not in cart, add it
      return [
        ...prev,
        {
          ...item,
          quantity: typeof item.quantity === "number" ? item.quantity : 1,
        },
      ];
    });
  };

  // Add multiple items to the cart
  const addItems = (newItems) => {

    // Merge new items with existing items
    setCart((prev) => {
      const merged = [...prev];
      newItems.forEach((newItem) => {
        if (!merged.find((item) => item.id === newItem.id)) {
          merged.push(newItem);
        }
      });
      return merged;
    });
  };

  // Remove an item completely from the cart
  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Decrease item quantity, remove if quantity is 1
  const decreaseQuantity = (itemId) => {
    setCart(
      (prev) =>
        prev
          .map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0) // Remove item if quantity is 0
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Render the cart context provider
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
        addItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for accessing the cart context
export const useCart = () => useContext(CartContext);
