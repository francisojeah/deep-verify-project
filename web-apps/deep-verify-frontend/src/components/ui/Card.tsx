import React from "react";
import { cn } from "../../lib/cn";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("rounded-xl bg-surface shadow-card", className)}
    {...props}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  icon,
  actions,
}) => (
  <div className="flex items-start justify-between gap-4 px-5 pb-1 pt-5">
    <div className="flex items-start gap-3">
      {icon && <span className="mt-0.5 text-brand">{icon}</span>}
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
    {actions}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("px-5 py-5", className)} {...props}>
    {children}
  </div>
);
