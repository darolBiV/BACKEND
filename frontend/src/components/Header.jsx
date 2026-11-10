import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import "./Header.css";

function Header() {
  const { totalQuantity } = useContext(CartContext);

  return (
    <header className="header">
      <nav className="nav">
        <div className="brand">
          <div className="brand-icon">🐾</div>
          <Link to="/" className="logo">
            PawsStore
          </Link>
        </div>

        <div className="menu">
          <Link to="/">Shop</Link>
          <Link to="/">Categories</Link>
          <Link to="/">Deals</Link>
          <Link to="/">About</Link>
        </div>

        <div className="header-actions">
          <button type="button" className="icon-button" aria-label="Search">
            <FaSearch />
          </button>

          <Link to="/cart" className="icon-button cart-icon" aria-label="Cart">
            <FaShoppingCart />
            {totalQuantity > 0 && (
              <span className="cart-badge">{totalQuantity}</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;