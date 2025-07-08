import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "rounded-lg overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white shadow-md hover:shadow-lg",
        elevated: "bg-white shadow-lg hover:shadow-xl",
        outline: "bg-white border border-gray-200 hover:border-gray-300",
        glass: "bg-white/10 backdrop-blur-sm border border-white/20",
        product: "bg-white shadow-md hover:shadow-lg group relative"
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10"
      },
      spacing: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const cardHeaderVariants = cva(
  "mb-4",
  {
    variants: {
      size: {
        sm: "mb-2",
        md: "mb-4",
        lg: "mb-6"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

const cardContentVariants = cva(
  "",
  {
    variants: {
      spacing: {
        none: "space-y-0",
        sm: "space-y-2",
        md: "space-y-4",
        lg: "space-y-6"
      }
    },
    defaultVariants: {
      spacing: "md"
    }
  }
);

const cardFooterVariants = cva(
  "mt-4 pt-4 border-t border-gray-200",
  {
    variants: {
      size: {
        sm: "mt-2 pt-2",
        md: "mt-4 pt-4",
        lg: "mt-6 pt-6"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, spacing, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, spacing, className }))}
      {...props}
    />
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ size, className }))}
      {...props}
    />
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, spacing, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ spacing, className }))}
      {...props}
    />
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ size, className }))}
      {...props}
    />
  )
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter, cardVariants }; 