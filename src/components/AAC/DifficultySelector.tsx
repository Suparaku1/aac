import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Zap, Trophy } from "lucide-react";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

interface DifficultySelectorProps {
  currentLevel: DifficultyLevel;
  onLevelChange: (level: DifficultyLevel) => void;
  className?: string;
}

const levels = [
  {
    id: "beginner" as const,
    name: "Fillestar",
    emoji: "🌱",
    icon: Star,
    color: "from-emerald-400 to-green-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    description: "Lehtë dhe e qetë",
  },
  {
    id: "intermediate" as const,
    name: "Mesatar",
    emoji: "🌟",
    icon: Zap,
    color: "from-amber-400 to-orange-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    description: "Sfidë e moderuar",
  },
  {
    id: "advanced" as const,
    name: "I Avancuar",
    emoji: "🏆",
    icon: Trophy,
    color: "from-purple-400 to-pink-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    description: "Për ekspertët",
  },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentLevel,
  onLevelChange,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm font-medium text-muted-foreground mb-3">Niveli i vështirësisë:</p>
      <div className="flex flex-wrap gap-2">
        {levels.map((level) => {
          const isActive = currentLevel === level.id;
          const Icon = level.icon;
          
          return (
            <motion.div
              key={level.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isActive ? "default" : "outline"}
                onClick={() => onLevelChange(level.id)}
                className={`
                  relative overflow-hidden h-auto py-2 px-4
                  ${isActive 
                    ? `bg-gradient-to-r ${level.color} border-0 text-white` 
                    : level.bgColor
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{level.emoji}</span>
                  <div className="text-left">
                    <div className="font-semibold">{level.name}</div>
                    <div className={`text-xs ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                      {level.description}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Helper hook to manage difficulty with localStorage
export const useDifficulty = (moduleId: string) => {
  const [level, setLevel] = React.useState<DifficultyLevel>(() => {
    const stored = localStorage.getItem(`difficulty-${moduleId}`);
    return (stored as DifficultyLevel) || "beginner";
  });

  const setDifficulty = (newLevel: DifficultyLevel) => {
    setLevel(newLevel);
    localStorage.setItem(`difficulty-${moduleId}`, newLevel);
  };

  return { level, setDifficulty };
};

// Difficulty multipliers for game settings
export const getDifficultySettings = (level: DifficultyLevel) => {
  switch (level) {
    case "beginner":
      return {
        itemCount: 3,
        timeMultiplier: 2,
        hintsEnabled: true,
        complexity: 1,
        speedMultiplier: 0.5,
      };
    case "intermediate":
      return {
        itemCount: 5,
        timeMultiplier: 1,
        hintsEnabled: true,
        complexity: 2,
        speedMultiplier: 1,
      };
    case "advanced":
      return {
        itemCount: 8,
        timeMultiplier: 0.7,
        hintsEnabled: false,
        complexity: 3,
        speedMultiplier: 1.5,
      };
  }
};
