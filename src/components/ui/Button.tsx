import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500",
        ghost: "hover:bg-gray-100 focus:ring-gray-500",
        link: "text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500",
        gradient: "bg-gradient-to-b from-green-800 to-green-900 border border-green-700 text-white hover:bg-green-700 shadow-[0_4px_0_0_rgba(0,0,0,0.3)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.3)] active:translate-y-1 transition-all duration-200"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg"
      },
      width: {
        auto: "w-auto",
        full: "w-full"
      },
      state: {
        default: "",
        loading: "cursor-not-allowed opacity-50",
        disabled: "cursor-not-allowed opacity-50",
        active: "bg-blue-700 text-white",
        selected: "bg-blue-600 text-white border-blue-600"
      },
      roundness: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      width: "auto",
      state: "default",
      roundness: "default"
    }
  }
);

const selectionButtonVariants = cva(
  "px-4 py-2 border rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      selected: {
        true: "border-blue-600 bg-blue-600 text-white",
        false: "border-gray-300 hover:border-blue-600 bg-white text-gray-900"
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: ""
      }
    },
    defaultVariants: {
      selected: false,
      disabled: false
    }
  }
);

const quantityButtonVariants = cva(
  "flex items-center justify-center transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "text-gray-500 hover:text-gray-700",
        light: "text-white hover:text-green-300",
        dark: "text-gray-900 hover:text-gray-700"
      },
      size: {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export interface SelectionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof selectionButtonVariants> {
  children: React.ReactNode;
}

export interface QuantityButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof quantityButtonVariants> {
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, width, state, roundness, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, width, state, roundness, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

const SelectionButton = React.forwardRef<HTMLButtonElement, SelectionButtonProps>(
  ({ className, selected, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(selectionButtonVariants({ selected, disabled, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

const QuantityButton = React.forwardRef<HTMLButtonElement, QuantityButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(quantityButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
SelectionButton.displayName = "SelectionButton";
QuantityButton.displayName = "QuantityButton";

export { Button, SelectionButton, QuantityButton, buttonVariants, selectionButtonVariants, quantityButtonVariants }; 