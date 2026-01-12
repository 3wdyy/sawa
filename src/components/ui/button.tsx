"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  glow?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-lavender text-background hover:bg-lavender-soft active:bg-lavender",
  secondary:
    "bg-background-tertiary text-foreground hover:bg-background-secondary border border-border",
  ghost:
    "bg-transparent text-foreground-muted hover:text-foreground hover:bg-background-tertiary",
  danger: "bg-peach text-background hover:bg-peach-soft active:bg-peach",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-4 text-base rounded-xl",
  lg: "h-12 px-6 text-lg rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      glow = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          glow && variant === "primary" && "glow-lavender",
          className
        )}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {isLoading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
