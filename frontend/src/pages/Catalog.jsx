import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Catalog.css";

const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:5000";
const PRODUCTS_PER_PAGE = 6;

const sortParameters = {
  az: { sort_by: "title", order: "asc" },
  za: { sort_by: "title", order: "desc" },
  priceLow: { sort_by: "price", order: "asc" },
  priceHigh: { sort_by: "price", order: "desc" },
};

function Catalog() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total_items: 0, total_pages: 0, current_page: 1 });
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortType, setSortType] = useState("az");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setIsLoading(true);
      setError("");

      const query = new URLSearchParams({
        page: String(page),
        limit: String(PRODUCTS_PER_PAGE),
        sort_by: sortParameters[sortType].sort_by,
        order: sortParameters[sortType].order,
      });

      if (search.trim()) query.set("search", search.trim());
      if (minPrice !== "") query.set("min_price", minPrice);
      if (maxPrice !== "") query.set("max_price", maxPrice);
      if (minRating !== "") query.set("min_rating", minRating);

      try {
        const response = await fetch(`${API_URL}/api/products?${query}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to load products");

        const data = await response.json();
        setProducts(
          data.items.map((product) => ({
            ...product,
            image: product.images[0],
          })),
        );
        setMeta(data.meta);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setProducts([]);
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadProducts();
    return () => controller.abort();
  }, [page, search, minPrice, maxPrice, minRating, sortType]);

  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const handleRatingClick = (value) => {
    setMinRating((current) => (current === value ? "" : value));
    setPage(1);
  };

  return (
    <div className="catalog-page">
      <div className="catalog-hero">
        <h1 className="catalog-hero-title">Shop All Products</h1>
        <p className="catalog-hero-text">Discover the best products for your furry friends</p>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <h2 className="sidebar-title">Filters</h2>

          <div className="filter-block">
            <h3 className="filter-title">Search</h3>
            <input
              type="search"
              value={search}
              onChange={changeFilter(setSearch)}
              placeholder="Search products"
              className="catalog-search"
            />
          </div>

          <div className="filter-block">
            <h3 className="filter-title">Rating</h3>
            {[5, 4, 3].map((rating) => (
              <button
                key={rating}
                type="button"
                className={`rating-option ${minRating === String(rating) ? "active" : ""}`}
                onClick={() => handleRatingClick(String(rating))}
              >
                <span className="rating-box" />
                {rating}+ Stars
              </button>
            ))}
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
                  min="0"
                  value={minPrice}
                  onChange={changeFilter(setMinPrice)}
                  placeholder="0"
                  className="price-input"
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-wrap">
                <span className="price-dollar">$</span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={changeFilter(setMaxPrice)}
                  placeholder="100"
                  className="price-input"
                />
              </div>
            </div>
          </div>
        </aside>

        <section className="catalog-content">
          <div className="catalog-toolbar">
            <span className="product-count">{meta.total_items} products</span>
            <div className="sort-wrap">
              <span className="sort-label">Sort by:</span>
              <select
                value={sortType}
                onChange={changeFilter(setSortType)}
                className="catalog-select"
              >
                <option value="az">Name (A-Z)</option>
                <option value="za">Name (Z-A)</option>
                <option value="priceLow">Price ↑</option>
                <option value="priceHigh">Price ↓</option>
              </select>
            </div>
          </div>

          {isLoading && <p className="catalog-message">Loading products...</p>}
          {!isLoading && error && <p className="catalog-message error">{error}</p>}
          {!isLoading && !error && products.length === 0 && (
            <p className="catalog-message">No products found.</p>
          )}

          {!isLoading && !error && products.length > 0 && (
            <>
              <div className="catalog-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {meta.total_pages > 1 && (
                <div className="catalog-pagination">
                  <button
                    type="button"
                    className="pagination-button"
                    disabled={page === 1}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    Previous
                  </button>
                  <span className="pagination-page">
                    Page {meta.current_page} of {meta.total_pages}
                  </span>
                  <button
                    type="button"
                    className="pagination-button"
                    disabled={page === meta.total_pages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Catalog;
