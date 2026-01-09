import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  colors?: string[];
}

interface Particle {
  id: number;
  x: number;
  color: string;
  emoji: string;
  delay: number;
  size: number;
}

const celebrationEmojis = ["🎉", "⭐", "🌟", "✨", "💫", "🎊", "🎈", "🌈", "💖", "🦋"];

export const Confetti: React.FC<ConfettiProps> = ({
  isActive,
  duration = 3000,
  colors = ["#FF6B9D", "#9B59B6", "#3498DB", "#2ECC71", "#F1C40F", "#E74C3C"],
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)],
        delay: Math.random() * 0.5,
        size: 0.8 + Math.random() * 0.8,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, colors]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              style={{ 
                left: `${particle.x}%`,
                fontSize: `${particle.size * 2}rem`,
              }}
              initial={{ y: -50, opacity: 1, rotate: 0 }}
              animate={{ 
                y: window.innerHeight + 100,
                opacity: [1, 1, 0],
                rotate: Math.random() > 0.5 ? 360 : -360,
                x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.5 + Math.random(),
                delay: particle.delay,
                ease: "easeOut",
              }}
            >
              {particle.emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};
