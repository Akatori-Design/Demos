// src/components/ui/Select/Select.tsx

import { useId, useState } from "react";
import type { CSSProperties, SelectHTMLAttributes } from "react";

export type SelectOption = { value: string; label: string };
export type SelectVariant = "default" | "ghost";

export type SelectProps = {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  variant?: SelectVariant;
  value?: string;
  onChange?: (value: string) => void;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "onChange" | "value">;

const wrapperStyle: CSSProperties = { display: "grid", gap: 6 };

const labelStyle: CSSProperties = { fontSize: 14, fontWeight: 600 };

const hintStyle: CSSProperties = { fontSize: 12, opacity: 0.7 };

const errorTextStyle: CSSProperties = { fontSize: 12, fontWeight: 600, color: "#b91c1c" };

const baseSelectStyle: CSSProperties = {
  padding: "10px 12px",
  fontSize: 16,
  borderRadius: 10,
  outline: "none",
  border: "1px solid #d1d5db",
  appearance: "none",
};

const variantSelectStyle: Record<SelectVariant, CSSProperties> = {
  default: { background: "white", color: "#111827" },
  ghost: { background: "transparent", color: "#111827" },
};

export function Select({
  label,
  hint,
  error,
  options,
  variant = "default",
  disabled,
  value,
  onChange,
  name,
  style,
  onFocus,
  onBlur,
  ...rest
}: SelectProps) {
  const reactId = useId();
  const id = name ? `select-${name}` : `select-${reactId}`;
  const [isFocused, setIsFocused] = useState(false);
  const isInvalid = Boolean(error);

  const disabledStyle: CSSProperties = disabled
    ? { opacity: 0.45, cursor: "not-allowed" }
    : { opacity: 1, cursor: "pointer" };

  const invalidStyle: CSSProperties = isInvalid
    ? {
        borderColor: "#ef4444",
        background: variant === "ghost" ? "transparent" : "#fef2f2",
      }
    : { borderColor: "#d1d5db" };

  const focusStyle: CSSProperties =
    isFocused && !disabled
      ? {
          borderColor: isInvalid ? "#ef4444" : "#111827",
          boxShadow: isInvalid
            ? "0 0 0 3px rgba(239, 68, 68, 0.25)"
            : "0 0 0 3px rgba(17, 24, 39, 0.18)",
        }
      : {};

  const metaId = hint || error ? `${id}-meta` : undefined;

  return (
    <div style={wrapperStyle}>
      {label ? (
        <label htmlFor={id} style={{ ...labelStyle, color: isInvalid ? "#b91c1c" : "#111827" }}>
          {label}
        </label>
      ) : null}

      <select
        id={id}
        name={name}
        disabled={disabled}
        aria-invalid={isInvalid}
        aria-describedby={metaId}
        value={value}
        {...rest}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        style={{
          ...baseSelectStyle,
          ...variantSelectStyle[variant],
          ...disabledStyle,
          ...invalidStyle,
          ...focusStyle,
          ...(style ?? {}),
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {metaId ? <div id={metaId} style={error ? errorTextStyle : hintStyle}>{error ?? hint}</div> : null}
    </div>
  );
}

export default Select;
