import { useParams, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { products } from "../data/products";
import { CartContext } from "../context/CartContext";
import Slider from "../components/Slider";
import ProductCard from "../components/ProductCard";
import "./Product.css";

function Product() {
  const { id } = useParams();
  const { addToCart, cartItems } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <h1 className="product-not-found">Product not found</h1>;
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const fullStars = Math.floor(product.rating);
  const emptyStars = 5 - fullStars;

  const category = product.category || "Pet Supplies";

  const highlights = product.highlights || [
    "Premium quality materials",
    "Comfortable and practical design",
    "Perfect for everyday use",
  ];

  const specifications = product.specifications || [
    { label: "Diameter", value: "3.5 inches" },
    { label: "Material", value: "Natural Rubber" },
    { label: "Treat Compartment", value: "Yes" },
    { label: "Safety", value: "BPA-Free, Non-Toxic" },
    { label: "Suitable For", value: "All Dog Sizes" },
  ];

  const cartItem = cartItems.find((item) => item.id === product.id);
  const isInCart = Boolean(cartItem);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="product-page">
      <div className="product-breadcrumbs">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>{category}</span>
        <span>›</span>
        <span>{product.title}</span>
      </div>

      <div className="product-main">
        <div className="product-gallery-card">
          <Slider images={product.images} title={product.title} />
        </div>

        <div className="product-info">
          <div className="product-tag">{category}</div>

          <h1 className="product-title">{product.title}</h1>

          <div className="product-rating-row">
            <span className="product-stars">
              {"★".repeat(fullStars)}
              {"☆".repeat(emptyStars)}
            </span>
            <span className="product-rating-text">
              {product.rating} out of 5 stars
            </span>
          </div>

          <div className="product-price">${product.price}</div>

          <div className="product-highlights">
            <h3>Key Highlights</h3>
            <ul>
              {highlights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="product-description-block">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-quantity-row">
            <span className="product-quantity-label">Quantity:</span>

            <div className="product-quantity-box">
              <button type="button" onClick={handleDecrease}>
                −
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={handleIncrease}>
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            className={`product-add-btn ${isInCart ? "product-add-btn-added" : ""}`}
            onClick={handleAddToCart}
          >
            {isInCart ? "✓ Added to Cart" : "🛒 Add to Cart"}
          </button>

          {isInCart && (
            <p className="product-cart-note">
              Already in cart: {cartItem.quantity}
            </p>
          )}

          <div className="product-specs-accordion">
            <button
              type="button"
              className="product-specs-toggle"
              onClick={() => setIsSpecsOpen((prev) => !prev)}
            >
              <span className="product-specs-toggle-title">
                Technical Specifications
              </span>
              <span
                className={`product-specs-arrow ${
                  isSpecsOpen ? "open" : ""
                }`}
              >
                ⌃
              </span>
            </button>

            {isSpecsOpen && (
              <div className="product-specs-list">
                {specifications.map((item, index) => (
                  <div className="product-spec-row" key={index}>
                    <span className="product-spec-label">{item.label}</span>
                    <span className="product-spec-value">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="related-products">
        <h2>Related Products</h2>

        <div className="related-products-grid">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;