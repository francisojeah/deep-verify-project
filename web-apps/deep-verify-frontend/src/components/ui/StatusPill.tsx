import React from "react";
import { cn } from "../../lib/cn";

type Tone = "neutral" | "success" | "danger" | "brand";

const tones: Record<Tone, { pill: string; dot: string }> = {
  neutral: { pill: "bg-surface-muted text-muted-foreground", dot: "bg-muted-foreground" },
  success: { pill: "bg-success-subtle text-success", dot: "bg-success" },
  danger: { pill: "bg-danger-subtle text-danger", dot: "bg-danger" },
  brand: { pill: "bg-brand-subtle text-brand", dot: "bg-brand" },
};

interface StatusPillProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}

const StatusPill: React.FC<StatusPillProps> = ({
  tone = "neutral",
  children,
  className,
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-medium",
      tones[tone].pill,
      className
    )}
  >
    <span aria-hidden className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tones[tone].dot)} />
    {children}
  </span>
);

export default StatusPill;
