import { useEffect, useState } from "react";

export function Toast({ message, show, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // wait for fade-out before clearing
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--text-h)",
        color: "var(--bg)",
        padding: "14px 22px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 500,
        boxShadow: "var(--shadow)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "16px" }}>✅</span>
      {message}
    </div>
  );
}
