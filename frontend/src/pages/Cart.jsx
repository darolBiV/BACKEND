import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import {FaTrash,FaCreditCard,FaTag,FaClock,FaMapMarkerAlt,FaShoppingBag,FaCheck,FaTimes,} from "react-icons/fa";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    totalItems,
    totalQuantity,
    applyPromo,
    isLoading,
  } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState(null);
  const [error, setError] = useState("");
  const [isPromoLoading, setIsPromoLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setError("Enter promo code");
      return;
    }

    setIsPromoLoading(true);
    try {
      const result = await applyPromo(promoCode);
      setPromoResult(result);
      setError("");
      setPromoCode("");
    } catch (promoError) {
      setPromoResult(null);
      setError(promoError.message);
    } finally {
      setIsPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoResult(null);
    setPromoCode("");
    setError("");
  };

  const subtotal = totalPrice;
  const finalTotal = promoResult?.total_price ?? subtotal;
  const freeShippingQualified = subtotal >= 50;

  useEffect(() => {
    setPromoResult(null);
  }, [subtotal]);

  if (!isAuthenticated) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <FaShoppingBag />
          </div>
          <h1>Sign in to view your cart</h1>
          <p>Your cart is connected to your account.</p>
          <Link to="/login" className="start-shopping-btn">
            Sign In →
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-content">
          <h1>Loading cart...</h1>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <FaShoppingBag />
          </div>
          <h1>Your cart is empty</h1>
          <p>Discover amazing products for your furry friends!</p>

          <Link to="/" className="start-shopping-btn">
            Start Shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header-block">
        <div>
          <h1 className="shopping-title">Shopping Bag</h1>
          <p className="shopping-subtitle">
            {totalItems} items ready for checkout
          </p>
        </div>

        <div className="cart-steps">
          <div className="step active">1</div>
          <span className="active-label">Cart</span>
          <span className="step-arrow">›</span>
          <div className="step">2</div>
          <span>Checkout</span>
          <span className="step-arrow">›</span>
          <div className="step">3</div>
          <span>Complete</span>
        </div>
      </div>

      <div className="shipping-banner">
        <span>
          <FaTag /> Free shipping on orders over
        </span>
        <strong>$50</strong>

        <span
          className={`shipping-status ${
            freeShippingQualified ? "qualified" : "not-qualified"
          }`}
        >
          {freeShippingQualified
            ? "✓ Qualified!"
            : `$${(50 - subtotal).toFixed(2)} away`}
        </span>
      </div>

      <div className="cart-layout">
        <div className="cart-items-column">
          {cartItems.map((item) => (
            <div className="cart-item-card" key={item.id}>
              <img
                src={item.image}
                alt={item.title}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-subtitle">{item.subtitle}</p>
              </div>

              <div className="cart-item-quantity">
                <button
                  type="button"
                  onClick={() => decreaseQuantity(item.id)}
                  className="qty-btn"
                >
                  −
                </button>

                <span className="qty-value">{item.quantity}</span>

                <button
                  type="button"
                  onClick={() => increaseQuantity(item.id)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <div className="cart-item-price-block">
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div className="cart-item-each">
                  ${item.price.toFixed(2)} each
                </div>
              </div>

              <button
                type="button"
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <aside className="order-summary">
          <div className="summary-header">
            <h2>Order Summary</h2>
            <p>{totalQuantity} items in your bag</p>
          </div>

          <div className="summary-body">
            <div className="promo-block">
              <label className="promo-label">
                <FaTag /> Promo Code
              </label>

              {!promoResult ? (
                <div className="promo-row">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="promo-input"
                  />

                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="apply-btn"
                    disabled={isPromoLoading}
                  >
                    {isPromoLoading ? "Applying..." : "Apply"}
                  </button>
                </div>
              ) : (
                <div className="promo-success-box">
                  <div className="promo-success-left">
                    <div className="promo-success-icon">
                      <FaCheck />
                    </div>

                    <div className="promo-success-text">
                      <div className="promo-success-code">{promoResult.code}</div>
                      <div className="promo-success-desc">
                        {promoResult.discount_percentage}% discount applied
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="promo-remove-btn"
                    onClick={handleRemovePromo}
                    aria-label="Remove promo code"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}

              {error && <p className="promo-error">{error}</p>}
            </div>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {promoResult && (
              <div className="summary-line discount-line">
                <span>Discount ({promoResult.discount_percentage}%)</span>
                <span>-${promoResult.discount_amount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-total">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            <div className="summary-info-card blue">
              <div className="summary-info-icon">
                <FaClock />
              </div>
              <div>
                <div className="summary-info-title">Delivery Time</div>
                <div className="summary-info-text">3-5 business days</div>
              </div>
            </div>

            <div className="summary-info-card purple">
              <div className="summary-info-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <div className="summary-info-title">Shipping To</div>
                <div className="summary-info-text">
                  123 Main Street, NY 10001
                </div>
              </div>
            </div>

            <button type="button" className="checkout-btn">
              <FaCreditCard /> Proceed to Checkout
            </button>

            <Link to="/" className="continue-shopping-link center">
              ← Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
