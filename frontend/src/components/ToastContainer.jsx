import { useContext, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import "./ToastContainer.css";

function ToastContainer() {
  const { toasts } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);

  if (toasts.length === 0) {
    return null;
  }

  const visibleToasts = toasts.slice(-3).reverse();

  return (
    <div
      className="toast-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {visibleToasts.map((toast, index) => {
        const stackedOffset = index * 12;
        const expandedOffset = index * 68;

        return (
          <div
            key={toast.id}
            className="toast-item"
            style={{
              bottom: isHovered ? `${expandedOffset}px` : `${stackedOffset}px`,
              zIndex: 1000 - index,
              transform: isHovered
                ? "scale(1)"
                : `scale(${1 - index * 0.02})`,
              opacity: isHovered ? 1 : 1 - index * 0.08,
            }}
          >
            <FaCheckCircle className="toast-icon" />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;