import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  "block w-full rounded-md border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
        error: "border-red-300 focus:border-red-500 focus:ring-red-500",
        success: "border-green-300 focus:border-green-500 focus:ring-green-500"
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-4 py-3 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const labelVariants = cva(
  "block font-medium",
  {
    variants: {
      size: {
        sm: "text-xs mb-1",
        md: "text-sm mb-1",
        lg: "text-base mb-2"
      },
      variant: {
        default: "text-gray-700",
        error: "text-red-700",
        success: "text-green-700"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
);

const formGroupVariants = cva(
  "",
  {
    variants: {
      spacing: {
        tight: "space-y-2",
        normal: "space-y-4",
        loose: "space-y-6"
      }
    },
    defaultVariants: {
      spacing: "normal"
    }
  }
);

const helperTextVariants = cva(
  "text-sm mt-1",
  {
    variants: {
      variant: {
        default: "text-gray-500",
        error: "text-red-600",
        success: "text-green-600"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string;
  helpText?: string;
}

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string;
  helpText?: string;
}

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

export interface FormGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formGroupVariants> {}

export interface HelperTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof helperTextVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, helpText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helpId = helpText ? `${inputId}-help` : undefined;
    
    const finalVariant = error ? 'error' : variant;
    
    return (
      <div>
        <input
          id={inputId}
          className={cn(inputVariants({ variant: finalVariant, size, className }))}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        {helpText && (
          <HelperText id={helpId} variant="default">
            {helpText}
          </HelperText>
        )}
        {error && (
          <HelperText id={errorId} variant="error" role="alert">
            {error}
          </HelperText>
        )}
      </div>
    );
  }
);

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, error, helpText, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helpId = helpText ? `${textareaId}-help` : undefined;
    
    const finalVariant = error ? 'error' : variant;
    
    return (
      <div>
        <textarea
          id={textareaId}
          className={cn(inputVariants({ variant: finalVariant, size, className }))}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        {helpText && (
          <HelperText id={helpId} variant="default">
            {helpText}
          </HelperText>
        )}
        {error && (
          <HelperText id={errorId} variant="error" role="alert">
            {error}
          </HelperText>
        )}
      </div>
    );
  }
);

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <label
        className={cn(labelVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, spacing, ...props }, ref) => {
    return (
      <div
        className={cn(formGroupVariants({ spacing, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <p
        className={cn(helperTextVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
Textarea.displayName = "Textarea";
Label.displayName = "Label";
FormGroup.displayName = "FormGroup";
HelperText.displayName = "HelperText";

export { Input, Textarea, Label, FormGroup, HelperText, inputVariants, labelVariants, formGroupVariants, helperTextVariants }; 