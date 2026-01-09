import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessAnimationProps {
  isVisible: boolean;
  message?: string;
  emoji?: string;
  onComplete?: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  isVisible,
  message = "Të lumtë!",
  emoji = "🎉",
  onComplete,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-background/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            if (!isVisible && onComplete) onComplete();
          }}
        >
          <motion.div
            className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 shadow-2xl"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
              }
            }}
            exit={{ scale: 0, rotate: 20 }}
          >
            <motion.span
              className="text-8xl"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: 2,
              }}
            >
              {emoji}
            </motion.span>
            <motion.p
              className="text-3xl font-bold text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
            
            {/* Sparkle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                }}
                transition={{
                  duration: 1,
                  delay: 0.1 * i,
                  repeat: 2,
                }}
              >
                ✨
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
