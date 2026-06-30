import { cn } from "../../lib/utils";

export function Label({ className, style, ...props }) {
  return (
    <label
      className={cn("form-field-label", className)}
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: 500,
        color: "var(--text-h)",
        lineHeight: "1.4",
        ...style,
      }}
      {...props}
    />
  );
}
