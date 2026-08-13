import React from "react";
import { cn } from "../../lib/cn";

const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    aria-hidden
    className={cn("animate-pulse rounded-lg bg-surface-muted", className)}
    {...props}
  />
);

export default Skeleton;
