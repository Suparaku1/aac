import React from "react";
import { motion, Transition } from "framer-motion";

interface AnimatedEmojiProps {
  emoji: string;
  size?: "sm" | "md" | "lg" | "xl";
  animation?: "bounce" | "pulse" | "wiggle" | "float" | "spin" | "sparkle";
  delay?: number;
  className?: string;
}

const sizeClasses = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl",
};

interface AnimationConfig {
  animate: {
    y?: number[];
    scale?: number[];
    rotate?: number | number[];
    opacity?: number[];
  };
  transition: Transition;
}

const animations: Record<string, AnimationConfig> = {
  bounce: {
    animate: { y: [0, -15, 0] },
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
  pulse: {
    animate: { scale: [1, 1.2, 1] },
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatDelay: 1.5,
    },
  },
  wiggle: {
    animate: { rotate: [-10, 10, -10, 10, 0] },
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
  float: {
    animate: { y: [0, -8, 0] },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  spin: {
    animate: { rotate: 360 },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
  sparkle: {
    animate: { scale: [1, 1.1, 1], opacity: [1, 0.8, 1] },
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

export const AnimatedEmoji: React.FC<AnimatedEmojiProps> = ({
  emoji,
  size = "md",
  animation = "bounce",
  delay = 0,
  className = "",
}) => {
  const config = animations[animation];
  
  return (
    <motion.span
      className={`inline-block ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        ...config.animate,
      }}
      transition={{
        opacity: { duration: 0.3, delay },
        scale: { duration: 0.3, delay },
        ...config.transition,
      }}
    >
      {emoji}
    </motion.span>
  );
};
