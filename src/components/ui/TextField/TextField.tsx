// src/components/ui/TextField/TextField.tsx

import { useId, useState } from "react";
import type { CSSProperties, InputHTMLAttributes } from "react";

export type TextFieldVariant = "default" | "ghost";

export type TextFieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  variant?: TextFieldVariant;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

const wrapperStyle: CSSProperties = { display: "grid", gap: 6 };

const labelStyle: CSSProperties = { fontSize: 14, fontWeight: 600 };

const hintStyle: CSSProperties = { fontSize: 12, opacity: 0.7 };

const errorTextStyle: CSSProperties = { fontSize: 12, fontWeight: 600, color: "#b91c1c" };

const baseInputStyle: CSSProperties = {
  padding: "10px 12px",
  fontSize: 16,
  borderRadius: 10,
  outline: "none",
  border: "1px solid #d1d5db",
};

const variantInputStyle: Record<TextFieldVariant, CSSProperties> = {
  default: { background: "white", color: "#111827" },
  ghost: { background: "transparent", color: "#111827" },
};

export function TextField({
  label,
  hint,
  error,
  variant = "default",
  disabled,
  style,
  name,
  ...rest
}: TextFieldProps) {
  // This creates a stable id React is happy with.
  const reactId = useId();

  // This links <label htmlFor> to the <input id>.
  const id = name ? `textfield-${name}` : `textfield-${reactId}`;

  // This tracks focus so we can style the input when active.
  const [isFocused, setIsFocused] = useState(false);

  // This is the “error state” flag.
  const isInvalid = Boolean(error);

  // This allows user-provided onFocus/onBlur to still work.
  const { onFocus, onBlur, ...inputProps } = rest;

  // This handles disabled visuals.
  const disabledStyle: CSSProperties = disabled
    ? { opacity: 0.45, cursor: "not-allowed" }
    : { opacity: 1, cursor: "text" };

  // This handles error visuals.
  const invalidStyle: CSSProperties = isInvalid
    ? {
        borderColor: "#ef4444",
        background: variant === "ghost" ? "transparent" : "#fef2f2",
      }
    : { borderColor: "#d1d5db" };

  // This handles focus visuals (and changes based on error state).
  const focusStyle: CSSProperties =
    isFocused && !disabled
      ? {
          borderColor: isInvalid ? "#ef4444" : "#111827",
          boxShadow: isInvalid
            ? "0 0 0 3px rgba(239, 68, 68, 0.25)"
            : "0 0 0 3px rgba(17, 24, 39, 0.18)",
        }
      : {};

  // This connects hint/error text to the input for accessibility.
  const metaId = hint || error ? `${id}-meta` : undefined;

  return (
    <div style={wrapperStyle}>
      {label ? (
        <label
          htmlFor={id}
          style={{
            ...labelStyle,
            // This changes label color when there’s an error.
            color: isInvalid ? "#b91c1c" : "#111827",
          }}
        >
          {label}
        </label>
      ) : null}

      <input
        id={id}
        name={name}
        disabled={disabled}
        aria-invalid={isInvalid}
        aria-describedby={metaId}
        {...inputProps}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        style={{
          ...baseInputStyle,
          ...variantInputStyle[variant],
          ...disabledStyle,
          ...invalidStyle,
          ...focusStyle,
          // This lets the caller override styles if needed.
          ...(style ?? {}),
        }}
      />

      {metaId ? (
        <div id={metaId} style={error ? errorTextStyle : hintStyle}>
          {error ?? hint}
        </div>
      ) : null}
    </div>
  );
}

export default TextField;