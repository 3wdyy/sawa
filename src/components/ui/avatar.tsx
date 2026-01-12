"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarColor = "ahmad" | "reem" | "lavender" | "mint";

interface AvatarProps extends Omit<HTMLMotionProps<"div">, "children"> {
  emoji: string;
  name?: string;
  size?: AvatarSize;
  color?: AvatarColor;
  showRing?: boolean;
  isActive?: boolean;
}

const sizes: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-lg",
  md: "w-12 h-12 text-2xl",
  lg: "w-16 h-16 text-3xl",
  xl: "w-24 h-24 text-5xl",
};

const colors: Record<AvatarColor, { bg: string; ring: string; glow: string }> = {
  ahmad: {
    bg: "bg-sky/20",
    ring: "ring-sky",
    glow: "glow-sky",
  },
  reem: {
    bg: "bg-rose/20",
    ring: "ring-rose",
    glow: "glow-rose",
  },
  lavender: {
    bg: "bg-lavender/20",
    ring: "ring-lavender",
    glow: "glow-lavender",
  },
  mint: {
    bg: "bg-mint/20",
    ring: "ring-mint",
    glow: "glow-mint",
  },
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      emoji,
      name,
      size = "md",
      color = "lavender",
      showRing = false,
      isActive = false,
      ...props
    },
    ref
  ) => {
    const colorConfig = colors[color];

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center rounded-full",
          sizes[size],
          colorConfig.bg,
          showRing && `ring-2 ${colorConfig.ring}`,
          isActive && colorConfig.glow,
          className
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        <span role="img" aria-label={name || "avatar"}>
          {emoji}
        </span>

        {/* Active indicator dot */}
        {isActive && (
          <motion.div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
              color === "ahmad" ? "bg-sky" : "bg-rose"
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          />
        )}
      </motion.div>
    );
  }
);

Avatar.displayName = "Avatar";
