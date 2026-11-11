import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:5000";

export const CartContext = createContext();

function CartProvider({ children }) {
  const { token, isAuthenticated, logout } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const normalizeCart = useCallback((cart) => {
    const items = cart.items.map((item) => ({
      cartItemId: item.id,
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      image: item.product.image,
      stock_quantity: item.product.stock_quantity,
      quantity: item.quantity,
      line_total: item.line_total,
    }));

    setCartItems(items);
    return items;
  }, []);

  const request = useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          setCartItems([]);
        }
        throw new Error(data.message ?? "Request failed");
      }

      return data;
    },
    [logout, token],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    let isCurrent = true;
    setIsLoading(true);

    request("/api/cart")
      .then((cart) => {
        if (isCurrent) normalizeCart(cart);
      })
      .catch((error) => {
        if (isCurrent) showToast(error.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [isAuthenticated, normalizeCart, request, showToast]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      showToast("Sign in to add products to your cart");
      return false;
    }

    try {
      const cart = await request("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });
      normalizeCart(cart);
      showToast(
        quantity > 1
          ? `${product.title} x${quantity} added to cart!`
          : `${product.title} added to cart!`,
      );
      return true;
    } catch (error) {
      showToast(error.message);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    try {
      const cart = await request(`/api/cart/items/${item.cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      normalizeCart(cart);
    } catch (error) {
      showToast(error.message);
    }
  };

  const removeFromCart = async (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    try {
      const cart = await request(`/api/cart/items/${item.cartItemId}`, {
        method: "DELETE",
      });
      normalizeCart(cart);
    } catch (error) {
      showToast(error.message);
    }
  };

  const increaseQuantity = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    if (item) updateQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    if (item.quantity === 1) {
      removeFromCart(productId);
      return;
    }

    updateQuantity(productId, item.quantity - 1);
  };

  const applyPromo = async (code) =>
    request("/api/cart/apply-promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

  const totalItems = cartItems.length;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    applyPromo,
    totalItems,
    totalQuantity,
    totalPrice,
    isLoading,
    toasts,
    removeToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
