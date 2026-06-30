import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(({ className, type, style, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn("form-field-input", className)}
      style={{
        display: "block",
        width: "100%",
        height: "42px",
        padding: "0 14px",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        fontSize: "15px",
        color: "var(--text-h)",
        background: "var(--bg)",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "var(--sans)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        ...style,
      }}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
