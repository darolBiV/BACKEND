import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";
import "./Header.css";

function Header() {
  const { totalQuantity } = useContext(CartContext);
  const { isAuthenticated, logout } = useContext(AuthContext);

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

          {isAuthenticated ? (
            <button type="button" className="auth-header-button" onClick={logout}>
              Sign out
            </button>
          ) : (
            <Link to="/login" className="icon-button" aria-label="Sign in">
              <FaUser />
            </Link>
          )}

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
