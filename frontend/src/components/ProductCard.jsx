import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart} from "react-icons/fa";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const fullStars = Math.floor(product.rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <Link to={`/product/${product.id}`} className="product-card-image-link">
          <img
            src={product.image}
            alt={product.title}
            className="product-card-image"
          />
        </Link>

        <div className="product-card-price-badge">${product.price}</div>

        <div className="product-card-hover-panel">
          <div className="hover-title">{product.title}</div>

          <div className="hover-rating">
            <span className="stars">
              {"★".repeat(fullStars)}
              {"☆".repeat(emptyStars)}
            </span>
            <span className="rating-count">({product.rating})</span>
          </div>

          <div className="hover-bottom">
            <div className="hover-price">${product.price}</div>

            <button
              type="button"
              className="hover-cart-btn"
              onClick={() => addToCart(product)}
              aria-label="Add to cart"
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>

      <div className="product-card-body">
        <Link to={`/product/${product.id}`} className="product-card-title">
          {product.title}
        </Link>

        <div className="product-card-rating">
          <span className="stars">
            {"★".repeat(fullStars)}
            {"☆".repeat(emptyStars)}
          </span>
          <span className="rating-count">({product.rating})</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;