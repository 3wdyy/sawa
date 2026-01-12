"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "glass" | "glow";
  glowColor?: "lavender" | "mint" | "rose" | "sky" | "gold";
  interactive?: boolean;
}

const glowColors = {
  lavender: "glow-lavender",
  mint: "glow-mint",
  rose: "glow-rose",
  sky: "glow-sky",
  gold: "glow-gold",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      glowColor = "lavender",
      interactive = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl p-4",
          variant === "default" && "bg-background-secondary border border-border",
          variant === "glass" && "glass",
          variant === "glow" && [
            "bg-background-secondary border border-border",
            glowColors[glowColor],
          ],
          interactive && "cursor-pointer",
          className
        )}
        whileHover={interactive ? { scale: 1.02, y: -2 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

// Card subcomponents
export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";
