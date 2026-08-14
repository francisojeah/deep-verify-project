import React from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-surface-muted text-foreground hover:bg-border",
  ghost: "bg-transparent text-muted-foreground hover:bg-surface-muted",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm sm:px-7 sm:py-3.5 sm:text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => (
  <button
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
      "transition-colors duration-200 ease-brand",
      "disabled:cursor-not-allowed disabled:opacity-50",
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  >
    {loading && (
      <span
        aria-hidden
        className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
      />
    )}
    {children}
  </button>
);

export default Button;
