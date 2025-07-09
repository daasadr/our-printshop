import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liveRegionVariants = cva(
  "sr-only",
  {
    variants: {
      politeness: {
        polite: "",
        assertive: "",
        off: "",
      },
    },
    defaultVariants: {
      politeness: "polite",
    },
  }
);

export interface LiveRegionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liveRegionVariants> {
  message?: string;
}

const LiveRegion = React.forwardRef<HTMLDivElement, LiveRegionProps>(
  ({ className, politeness, message, children, ...props }, ref) => (
    <div
      ref={ref}
      aria-live={politeness}
      aria-atomic="true"
      className={cn(liveRegionVariants({ politeness }), className)}
      {...props}
    >
      {message || children}
    </div>
  )
);

LiveRegion.displayName = "LiveRegion";

export { LiveRegion, liveRegionVariants }; 