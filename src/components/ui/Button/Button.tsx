// src/components/ui/Button/Button.tsx

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

// This is the only set of allowed variant names.
export type ButtonVariant = "primary" | "secondary" | "ghost";

// This defines what props Button accepts:
// - our custom props (variant, isLoading)
// - plus normal <button> props (onClick, type, aria-*, etc.)
export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled">;

// This is the shared base style for every button.
const baseStyle: CSSProperties = {
  padding: "10px 14px",
  fontSize: 16,
  borderRadius: 10,
};

// This is the style preset for each variant.
const variantStyle: Record<ButtonVariant, CSSProperties> = {
  primary: { background: "#111827", color: "white", border: "1px solid #111827" },
  secondary: { background: "#f3f4f6", color: "#111827", border: "1px solid #d1d5db" },
  ghost: { background: "transparent", color: "#111827", border: "1px solid transparent" },
};

// This is the actual reusable Button component.
export function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled = false,
  style,
  ...rest
}: ButtonProps) {
  // This combines "disabled" + "loading" into one non-clickable state.
  const isDisabled = disabled || isLoading;

  // This changes visuals based on whether the button is clickable.
  const stateStyle: CSSProperties = isDisabled
    ? { opacity: 0.3, cursor: "not-allowed" }
    : { opacity: 1, cursor: "pointer" };

  return (
    <button
      // This prevents clicks + keyboard actions automatically.
      disabled={isDisabled}
      // This helps screen readers understand the button is busy.
      aria-busy={isLoading}
      // This passes through normal button props like onClick, type, aria-label, etc.
      {...rest}
      style={{
        ...baseStyle,
        ...variantStyle[variant],
        ...stateStyle,
        // This lets the caller override/extend styles if needed.
        ...(style ?? {}),
      }}
    >
      {/* This swaps the label when loading. */}
      {isLoading ? "Loading..." : children}
    </button>
  );
}

// Optional: default export so you can import either way if you want.
export default Button;