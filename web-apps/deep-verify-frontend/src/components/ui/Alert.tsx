import React from "react";
import { cn } from "../../lib/cn";

type Tone = "danger" | "brand" | "neutral";

const tones: Record<Tone, string> = {
  danger: "border-danger/30 bg-danger-subtle text-danger",
  brand: "border-brand/30 bg-brand-subtle text-brand",
  neutral: "border-border bg-surface-muted text-muted-foreground",
};

interface AlertProps {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ tone = "neutral", title, children, className }) => (
  <div role="alert" className={cn("rounded-lg border px-4 py-3 text-sm", tones[tone], className)}>
    {title && <p className="font-semibold">{title}</p>}
    <div className={cn(title && "mt-1")}>{children}</div>
  </div>
);

export default Alert;
