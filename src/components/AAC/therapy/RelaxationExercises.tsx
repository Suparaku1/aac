import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Wind, 
  Heart,
  Cloud,
  Moon,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2
} from "lucide-react";

interface RelaxationExercisesProps {
  onSpeak: (text: string) => void;
}

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

interface BreathingPattern {
  id: string;
  name: string;
  emoji: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
  cycles: number;
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: "calm",
    name: "Frymëmarrje e Qetë",
    emoji: "🌸",
    description: "Për relaksim të thellë",
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 2,
    cycles: 4
  },
  {
    id: "balloon",
    name: "Balona",
    emoji: "🎈",
    description: "Imagjino që frysh një balonë!",
    inhale: 3,
    hold: 2,
    exhale: 5,
    rest: 2,
    cycles: 3
  },
  {
    id: "sleepy",
    name: "Përgatitu për Gjumë",
    emoji: "😴",
    description: "Për t'u qetësuar para gjumit",
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 2,
    cycles: 3
  },
  {
    id: "flower",
    name: "Nuhat Lulen",
    emoji: "🌷",
    description: "Thith erën e lules!",
    inhale: 4,
    hold: 1,
    exhale: 4,
    rest: 1,
    cycles: 4
  },
  {
    id: "bunny",
    name: "Lepurushi",
    emoji: "🐰",
    description: "Frymëmarrje e shpejtë si lepuri",
    inhale: 1,
    hold: 0,
    exhale: 1,
    rest: 1,
    cycles: 6
  }
];

const calmingActivities = [
  { emoji: "🌈", name: "Numëro ngjyrat", instruction: "Numëro 5 ngjyra që sheh rreth teje" },
  { emoji: "🎵", name: "Dëgjo tingujt", instruction: "Numëro 4 tinguj që dëgjon" },
  { emoji: "✋", name: "Prek diçka", instruction: "Prek 3 objekte të ndryshme" },
  { emoji: "👃", name: "Nuhat erërat", instruction: "Numëro 2 erëra që nuhat" },
  { emoji: "🍬", name: "Shijo", instruction: "Mendo 1 shije që të pëlqen" },
];

export const RelaxationExercises: React.FC<RelaxationExercisesProps> = ({ onSpeak }) => {
  const [activePattern, setActivePattern] = useState<BreathingPattern | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [phaseTime, setPhaseTime] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [showCalming, setShowCalming] = useState(false);

  const getPhaseInstruction = useCallback((p: BreathPhase): string => {
    switch (p) {
      case "inhale": return "Thith ajrin... 🌬️";
      case "hold": return "Mbaje... ⏸️";
      case "exhale": return "Nxirre ajrin... 💨";
      case "rest": return "Pusho... 😌";
    }
  }, []);

  const getPhaseColor = (p: BreathPhase): string => {
    switch (p) {
      case "inhale": return "from-sky-400 to-cyan-400";
      case "hold": return "from-violet-400 to-purple-400";
      case "exhale": return "from-amber-400 to-orange-400";
      case "rest": return "from-emerald-400 to-teal-400";
    }
  };

  const handleStart = (pattern: BreathingPattern) => {
    setActivePattern(pattern);
    setCurrentCycle(1);
    setPhase("inhale");
    setPhaseTime(pattern.inhale);
    setIsPlaying(true);
    onSpeak(`${pattern.name}. ${pattern.description}. Fillo!`);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleResume = () => {
    setIsPlaying(true);
  };

  const handleReset = () => {
    setActivePattern(null);
    setIsPlaying(false);
    setPhase("inhale");
    setPhaseTime(0);
    setCurrentCycle(1);
  };

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
    onSpeak("Bravo! U qetësove shumë bukur!");
    setTimeout(() => {
      handleReset();
    }, 2000);
  }, [onSpeak]);

  // Timer effect
  useEffect(() => {
    if (!isPlaying || !activePattern || phaseTime <= 0) return;

    const timer = setInterval(() => {
      setPhaseTime(prev => {
        if (prev <= 1) {
          // Move to next phase
          const nextPhase = (): BreathPhase => {
            switch (phase) {
              case "inhale": return activePattern.hold > 0 ? "hold" : "exhale";
              case "hold": return "exhale";
              case "exhale": return activePattern.rest > 0 ? "rest" : "inhale";
              case "rest": return "inhale";
            }
          };

          const next = nextPhase();
          
          // Check if completing a cycle
          if (next === "inhale" && phase !== "inhale") {
            if (currentCycle >= activePattern.cycles) {
              handleComplete();
              return 0;
            }
            setCurrentCycle(c => c + 1);
          }

          setPhase(next);
          onSpeak(getPhaseInstruction(next));

          switch (next) {
            case "inhale": return activePattern.inhale;
            case "hold": return activePattern.hold;
            case "exhale": return activePattern.exhale;
            case "rest": return activePattern.rest;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, activePattern, phase, phaseTime, currentCycle, handleComplete, onSpeak, getPhaseInstruction]);

  // Start with instruction
  useEffect(() => {
    if (isPlaying && activePattern && phase === "inhale" && phaseTime === activePattern.inhale) {
      onSpeak(getPhaseInstruction("inhale"));
    }
  }, [isPlaying, activePattern, phase, phaseTime, onSpeak, getPhaseInstruction]);

  const handleCalmingActivity = (activity: typeof calmingActivities[0]) => {
    onSpeak(`${activity.name}. ${activity.instruction}`);
  };

  return (
    <div className="space-y-6">
      {/* Active Breathing Exercise */}
      {activePattern && (
        <Card className={`p-8 bg-gradient-to-br ${getPhaseColor(phase)} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <Cloud
                key={i}
                className="absolute text-white animate-float-animation"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 10}%`,
                  animationDelay: `${i * 0.5}s`,
                  width: `${40 + i * 10}px`,
                  height: `${40 + i * 10}px`,
                }}
              />
            ))}
          </div>

          <div className="relative text-center text-white space-y-6">
            <div className="text-6xl">
              {activePattern.emoji}
            </div>
            
            <h2 className="text-2xl font-bold">
              {activePattern.name}
            </h2>

            {/* Breathing Circle */}
            <div className="relative w-48 h-48 mx-auto">
              <div 
                className={`absolute inset-0 rounded-full bg-white/30 transition-all duration-1000 ${
                  phase === "inhale" ? "scale-100" : 
                  phase === "hold" ? "scale-100" : 
                  "scale-75"
                }`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{phaseTime}</span>
                <span className="text-lg mt-2">{getPhaseInstruction(phase)}</span>
              </div>
            </div>

            {/* Cycle Progress */}
            <div className="flex justify-center gap-2">
              {[...Array(activePattern.cycles)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all ${
                    i < currentCycle ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {isPlaying ? (
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="secondary"
                  className="w-16"
                >
                  <Pause className="w-6 h-6" />
                </Button>
              ) : (
                <Button
                  onClick={handleResume}
                  size="lg"
                  variant="secondary"
                  className="w-16"
                >
                  <Play className="w-6 h-6" />
                </Button>
              )}
              <Button
                onClick={handleReset}
                size="lg"
                variant="secondary"
                className="w-16"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Breathing Patterns */}
      {!activePattern && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Wind className="w-5 h-5 text-sky-400" />
            Ushtrime Frymëmarrjeje
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {breathingPatterns.map((pattern) => (
              <Button
                key={pattern.id}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/10 hover:border-primary transition-all text-left"
                onClick={() => handleStart(pattern)}
              >
                <span className="text-4xl">{pattern.emoji}</span>
                <span className="font-bold">{pattern.name}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {pattern.description}
                </span>
                <div className="flex gap-2 text-xs">
                  <span>🌬️{pattern.inhale}s</span>
                  {pattern.hold > 0 && <span>⏸️{pattern.hold}s</span>}
                  <span>💨{pattern.exhale}s</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 5-4-3-2-1 Grounding */}
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setShowCalming(!showCalming)}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span className="font-bold">Teknika 5-4-3-2-1</span>
          </span>
          <span className="text-muted-foreground text-sm">
            Për të qetësuar mendjen
          </span>
        </Button>

        {showCalming && (
          <Card className="p-4 space-y-3 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            {calmingActivities.map((activity, index) => (
              <Button
                key={activity.emoji}
                variant="ghost"
                className="w-full justify-start h-auto py-3 hover:bg-primary/10"
                onClick={() => handleCalmingActivity(activity)}
              >
                <span className="text-3xl mr-4">{activity.emoji}</span>
                <div className="text-left">
                  <p className="font-bold">{5 - index} - {activity.name}</p>
                  <p className="text-sm text-muted-foreground">{activity.instruction}</p>
                </div>
                <Volume2 className="w-4 h-4 ml-auto opacity-50" />
              </Button>
            ))}
          </Card>
        )}
      </div>

      {/* Quick Calm */}
      <Card className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400">
            <Moon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold">Qetësim i Shpejtë</h4>
            <p className="text-sm text-muted-foreground">Kliko për një frazë qetësuese</p>
          </div>
          <Button
            onClick={() => {
              const phrases = [
                "Gjithçka do të shkojë mirë",
                "Je i sigurt dhe i dashur",
                "Frymëmarr thellë dhe qetësohem",
                "Unë jam trim dhe i fortë",
                "Ndjenjat e mia janë normale",
              ];
              const phrase = phrases[Math.floor(Math.random() * phrases.length)];
              onSpeak(phrase);
            }}
            className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white"
          >
            <Heart className="w-5 h-5 mr-2" />
            Qetëso
          </Button>
        </div>
      </Card>
    </div>
  );
};
