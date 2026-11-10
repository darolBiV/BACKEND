import "./Footer.css";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <div className="footer-logo-icon">🐾</div>
              <div className="footer-logo-text">PawsStore</div>
            </div>

            <p className="footer-description">
              Your trusted source for premium pet supplies and accessories.
            </p>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Quick Links</h3>
            <a href="/">Shop All</a>
            <a href="/">New Arrivals</a>
            <a href="/">Best Sellers</a>
            <a href="/">Sale Items</a>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Customer Service</h3>
            <a href="/">Contact Us</a>
            <a href="/">Shipping Info</a>
            <a href="/">Returns Policy</a>
            <a href="/">FAQ</a>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Newsletter</h3>
            <p className="footer-news-text">
              Subscribe to get special offers and updates.
            </p>

            <div className="footer-newsletter">
              <input
                type="email"
                placeholder="Your email"
                className="footer-input"
              />
              <button type="button" className="footer-send-btn">
                <FaEnvelope />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 PawsStore. All rights reserved.</p>

          <div className="footer-socials">
            <span><FaFacebook /></span>
            <span><FaTwitter /></span>
            <span><FaInstagram /></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;