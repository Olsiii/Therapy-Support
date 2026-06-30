import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "tw-btn-default",
      outline: "tw-btn-outline",
      ghost: "tw-btn-ghost",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const sizeStyles = {
  default: { height: "40px", padding: "0 16px", fontSize: "14px" },
  sm: { height: "32px", padding: "0 12px", fontSize: "13px" },
  lg: { height: "44px", padding: "0 24px", fontSize: "15px" },
  icon: { height: "40px", width: "40px", padding: 0 },
};

const baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  fontWeight: 500,
  cursor: "pointer",
  border: "none",
  fontFamily: "var(--sans)",
  transition: "opacity 0.2s, background 0.2s, border-color 0.2s",
  textDecoration: "none",
};

const variantStyles = {
  default: { background: "var(--accent)", color: "#fff" },
  outline: {
    background: "transparent",
    color: "var(--text-h)",
    border: "1px solid var(--border)",
  },
  ghost: { background: "transparent", color: "var(--text-h)" },
};

export function Button({ className, variant = "default", size = "default", style, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      style={{ ...baseStyle, ...variantStyles[variant], ...sizeStyles[size], ...style }}
      {...props}
    />
  );
}
