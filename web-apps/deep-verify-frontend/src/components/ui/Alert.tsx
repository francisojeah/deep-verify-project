import React from "react";
import { cn } from "../../lib/cn";

type Tone = "danger" | "brand" | "neutral";

const tones: Record<Tone, string> = {
  danger: "bg-danger-subtle text-danger",
  brand: "bg-brand-subtle text-brand",
  neutral: "bg-surface-muted text-muted-foreground",
};

interface AlertProps {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  tone = "neutral",
  title,
  children,
  className,
}) => (
  <div
    role="alert"
    className={cn("rounded-lg px-4 py-3 text-sm", tones[tone], className)}
  >
    {title && <p className="font-semibold">{title}</p>}
    <div className={cn(title && "mt-1")}>{children}</div>
  </div>
);

export default Alert;
