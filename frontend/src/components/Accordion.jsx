import { useState } from "react";

function Accordion({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        marginTop: "20px",
        border: "1px solid #e2e2e2",
        borderRadius: "14px",
        overflow: "hidden",
        background: "#fafafa",
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          padding: "16px",
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "15px",
        }}
      >
        {title}
      </button>

      {isOpen && (
        <div
          style={{
            padding: "0 16px 16px 16px",
            color: "#555",
            lineHeight: "1.6",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Accordion;