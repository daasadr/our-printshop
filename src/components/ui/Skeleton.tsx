import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-gray-200",
  {
    variants: {
      variant: {
        default: "bg-gray-200",
        light: "bg-gray-100",
        dark: "bg-gray-300",
      },
      shape: {
        default: "rounded-md",
        circle: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "default",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, shape, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, shape }), className)}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  );
}

// Predefined skeleton components for common use cases
function SkeletonText({ 
  className, 
  lines = 1, 
  ...props 
}: SkeletonProps & { lines?: number }) {
  if (lines === 1) {
    return <Skeleton className={cn("h-4 w-full", className)} {...props} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full",
            className
          )}
          {...props}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function SkeletonAvatar({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      shape="circle"
      className={cn("h-10 w-10", className)}
      {...props}
    />
  );
}

function SkeletonButton({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      className={cn("h-10 w-24", className)}
      {...props}
    />
  );
}

Skeleton.displayName = "Skeleton";
SkeletonText.displayName = "SkeletonText";
SkeletonCard.displayName = "SkeletonCard";
SkeletonAvatar.displayName = "SkeletonAvatar";
SkeletonButton.displayName = "SkeletonButton";

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonAvatar, 
  SkeletonButton, 
  skeletonVariants 
}; 