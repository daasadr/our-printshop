import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const separatorVariants = cva(
  "shrink-0 bg-gray-200",
  {
    variants: {
      orientation: {
        horizontal: "h-[1px] w-full",
        vertical: "h-full w-[1px]",
      },
      variant: {
        default: "bg-gray-200",
        light: "bg-gray-100",
        dark: "bg-gray-300",
        accent: "bg-blue-200",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "default",
    },
  }
);

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation, variant, decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(separatorVariants({ orientation, variant }), className)}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export { Separator, separatorVariants }; 