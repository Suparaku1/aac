import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Play, 
  Pause,
  RotateCcw,
  Volume2,
  Star,
  Sparkles,
  Heart
} from "lucide-react";

interface MovementGamesProps {
  onSpeak: (text: string) => void;
}

interface Exercise {
  id: string;
  emoji: string;
  name: string;
  instruction: string;
  duration: number;
  animation: string;
}

const exercises: Exercise[] = [
  {
    id: "jump",
    emoji: "🦘",
    name: "Kërce si Kangur",
    instruction: "Kërce lart me dy këmbë!",
    duration: 10,
    animation: "animate-bounce"
  },
  {
    id: "spin",
    emoji: "🌀",
    name: "Sillu Rreth",
    instruction: "Rrotullohu ngadalë si balerinë!",
    duration: 8,
    animation: "animate-spin"
  },
  {
    id: "stretch",
    emoji: "🌟",
    name: "Shtrihu si Yll",
    instruction: "Hap krahët dhe këmbët si yll!",
    duration: 10,
    animation: "animate-pulse"
  },
  {
    id: "march",
    emoji: "🚶",
    name: "Marshim",
    instruction: "Ngri gjunjtë lart duke ecur në vend!",
    duration: 15,
    animation: "animate-bounce"
  },
  {
    id: "clap",
    emoji: "👏",
    name: "Duartrokit",
    instruction: "Duartrokit me ritëm!",
    duration: 8,
    animation: "animate-pulse"
  },
  {
    id: "touch-toes",
    emoji: "🦶",
    name: "Prek Gishtat",
    instruction: "Përku dhe prek gishtat e këmbëve!",
    duration: 10,
    animation: "animate-bounce"
  },
  {
    id: "balance",
    emoji: "🦩",
    name: "Qëndro si Flamingo",
    instruction: "Qëndro në një këmbë!",
    duration: 10,
    animation: "animate-pulse"
  },
  {
    id: "wave",
    emoji: "🌊",
    name: "Valë Oqeani",
    instruction: "Lëviz krahët si valët e detit!",
    duration: 12,
    animation: "animate-pulse"
  },
  {
    id: "shake",
    emoji: "🤪",
    name: "Shkund Trupin",
    instruction: "Shkund gjithë trupin!",
    duration: 8,
    animation: "animate-wiggle"
  },
  {
    id: "airplane",
    emoji: "✈️",
    name: "Aeroplan",
    instruction: "Hap krahët dhe flutura rreth dhomës!",
    duration: 15,
    animation: "animate-float-animation"
  },
];

export const MovementGames: React.FC<MovementGamesProps> = ({ onSpeak }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleStart = useCallback((exercise: Exercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration);
    setIsPlaying(true);
    onSpeak(exercise.instruction);
  }, [onSpeak]);

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleResume = () => {
    setIsPlaying(true);
    if (selectedExercise) {
      onSpeak("Vazhdo!");
    }
  };

  const handleReset = () => {
    setSelectedExercise(null);
    setIsPlaying(false);
    setTimeLeft(0);
  };

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
    setCompletedCount(prev => prev + 1);
    setShowCelebration(true);
    onSpeak("Bravo! Shumë mirë!");
    
    setTimeout(() => {
      setShowCelebration(false);
      setSelectedExercise(null);
    }, 2000);
  }, [onSpeak]);

  // Timer effect
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        // Countdown speech at certain intervals
        if (prev === 4) onSpeak("3");
        if (prev === 3) onSpeak("2");
        if (prev === 2) onSpeak("1");
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, handleComplete, onSpeak]);

  const handleRandomExercise = () => {
    const randomIndex = Math.floor(Math.random() * exercises.length);
    handleStart(exercises[randomIndex]);
  };

  return (
    <div className="space-y-6 relative">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-bounce-in">
            {selectedExercise?.emoji}
          </div>
          <div className="absolute text-4xl animate-scale-up">⭐</div>
        </div>
      )}

      {/* Stats Bar */}
      <Card className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ushtrime të Kryera</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {completedCount}
              </p>
            </div>
          </div>
          <Button
            onClick={handleRandomExercise}
            className="h-14 px-6 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg"
            disabled={isPlaying}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Rastësisht
          </Button>
        </div>
      </Card>

      {/* Active Exercise */}
      {selectedExercise && (
        <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-2 border-primary/20">
          <div className="text-center space-y-4">
            <div className={`text-9xl ${selectedExercise.animation}`}>
              {selectedExercise.emoji}
            </div>
            
            <h2 className="text-3xl font-bold text-primary">
              {selectedExercise.name}
            </h2>
            
            <p className="text-xl text-muted-foreground">
              {selectedExercise.instruction}
            </p>

            {/* Timer */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  className="text-muted"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-primary transition-all duration-1000"
                  strokeWidth="8"
                  strokeDasharray={352}
                  strokeDashoffset={352 - (352 * timeLeft) / selectedExercise.duration}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
                {timeLeft}
              </span>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {isPlaying ? (
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="outline"
                  className="w-24"
                >
                  <Pause className="w-6 h-6" />
                </Button>
              ) : (
                <Button
                  onClick={handleResume}
                  size="lg"
                  className="w-24 bg-gradient-to-r from-emerald-400 to-teal-400"
                >
                  <Play className="w-6 h-6" />
                </Button>
              )}
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="w-24"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
              <Button
                onClick={() => onSpeak(selectedExercise.instruction)}
                size="lg"
                variant="outline"
                className="w-24"
              >
                <Volume2 className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Exercise Grid */}
      {!selectedExercise && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            Zgjidh një Ushtrim
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {exercises.map((exercise) => (
              <Button
                key={exercise.id}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all group"
                onClick={() => handleStart(exercise)}
              >
                <span className={`text-4xl group-hover:${exercise.animation}`}>
                  {exercise.emoji}
                </span>
                <span className="text-sm font-bold text-center">
                  {exercise.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {exercise.duration}s
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
