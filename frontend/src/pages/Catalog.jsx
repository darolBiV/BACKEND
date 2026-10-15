import { useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import "./Catalog.css";

function Catalog() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortType, setSortType] = useState("az");

  let filteredProducts = products.filter((product) => {
    const matchesPrice =
      (!minPrice || product.price >= Number(minPrice)) &&
      (!maxPrice || product.price <= Number(maxPrice));

    const matchesRating = !minRating || product.rating >= Number(minRating);

    return matchesPrice && matchesRating;
  });

  if (sortType === "az") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortType === "za") {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (sortType === "priceLow") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortType === "priceHigh") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const handleRatingClick = (value) => {
    setMinRating((prev) => (prev === value ? "" : value));
  };

  return (
    <div className="catalog-page">
      <div className="catalog-hero">
        <h1 className="catalog-hero-title">Shop All Products</h1>
        <p className="catalog-hero-text">
          Discover the best products for your furry friends
        </p>
      </div>

      <div className="catalog-layout">
        {/* ЛЕВАЯ ПАНЕЛЬ */}
        <aside className="catalog-sidebar">
          <h2 className="sidebar-title">Filters</h2>

          <div className="filter-block">
            <h3 className="filter-title">Rating</h3>

            <button
              type="button"
              className={`rating-option ${minRating === "5" ? "active" : ""}`}
              onClick={() => handleRatingClick("5")}
            >
              <span className="rating-box" />
              5+ Stars
            </button>

            <button
              type="button"
              className={`rating-option ${minRating === "4" ? "active" : ""}`}
              onClick={() => handleRatingClick("4")}
            >
              <span className="rating-box" />
              4+ Stars
            </button>

            <button
              type="button"
              className={`rating-option ${minRating === "3" ? "active" : ""}`}
              onClick={() => handleRatingClick("3")}
            >
              <span className="rating-box" />
              3+ Stars
            </button>
          </div>

          <div className="filter-block">
            <h3 className="filter-title">Price Range</h3>

            <div className="price-labels">
              <span>Min</span>
              <span>Max</span>
            </div>

            <div className="price-row">
              <div className="price-input-wrap">
                <span className="price-dollar">$</span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="price-input"
                />
              </div>

              <span className="price-separator">-</span>

              <div className="price-input-wrap">
                <span className="price-dollar">$</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="100"
                  className="price-input"
                />
              </div>
            </div>
          </div>
        </aside>
        <section className="catalog-content">
          <div className="catalog-toolbar">
            <span className="product-count">
              {filteredProducts.length} products
            </span>

            <div className="sort-wrap">
              <span className="sort-label">Sort by:</span>

              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="catalog-select"
              >
                <option value="az">Name (A-Z)</option>
                <option value="za">Name (Z-A)</option>
                <option value="priceLow">Price ↑</option>
                <option value="priceHigh">Price ↓</option>
              </select>
            </div>
          </div>

          <div className="catalog-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Catalog;