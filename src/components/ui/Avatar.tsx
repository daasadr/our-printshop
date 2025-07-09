import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const avatarImageVariants = cva(
  "aspect-square h-full w-full object-cover"
);

const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {}

export interface AvatarImageProps
  extends Omit<React.ComponentProps<typeof Image>, 'className'>,
    VariantProps<typeof avatarImageVariants> {
  className?: string;
}

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarFallbackVariants> {}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
);

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof Image>,
  AvatarImageProps
>(({ className, alt, ...props }, ref) => (
  <Image
    ref={ref}
    className={cn(avatarImageVariants(), className)}
    alt={alt || "Avatar"}
    fill
    {...props}
  />
));

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, size, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(avatarFallbackVariants({ size }), className)}
      {...props}
    >
      {children}
    </div>
  )
);

Avatar.displayName = "Avatar";
AvatarImage.displayName = "AvatarImage";
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback, avatarVariants }; 