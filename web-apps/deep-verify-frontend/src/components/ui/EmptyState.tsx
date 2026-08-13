import React from "react";
import { cn } from "../../lib/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center px-6 py-14 text-center",
      className
    )}
  >
    {icon && (
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-muted text-muted-foreground">
        {icon}
      </div>
    )}
    <p className="text-sm font-medium text-foreground">{title}</p>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
