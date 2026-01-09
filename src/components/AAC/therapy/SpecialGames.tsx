import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Gamepad2,
  Zap,
  Target,
  Timer,
  RotateCcw,
  Trophy,
  Star,
  Sparkles,
  Heart
} from "lucide-react";

interface SpecialGamesProps {
  onSpeak: (text: string) => void;
}

type GameType = "causeEffect" | "turnTaking" | "simpleChoice" | "calmingGame" | null;

// Cause and Effect items
const causeEffectItems = [
  { trigger: "🔴", effect: "💥", sound: "Bum!" },
  { trigger: "🎈", effect: "💨", sound: "Pop!" },
  { trigger: "🔔", effect: "🎵", sound: "Ding dong!" },
  { trigger: "💡", effect: "✨", sound: "Klik!" },
  { trigger: "🎹", effect: "🎶", sound: "La la la!" },
  { trigger: "🚿", effect: "💧", sound: "Shhhhh!" },
];

// Turn taking characters
const turnTakingChars = [
  { emoji: "🐻", name: "Ariu", action: "thotë përshëndetje" },
  { emoji: "🐰", name: "Lepuri", action: "kërcon" },
  { emoji: "🐱", name: "Macja", action: "mjaullin" },
  { emoji: "🐕", name: "Qeni", action: "leh" },
];

// Simple choices
const simpleChoices = [
  { question: "Çfarë do të hash?", options: [{ emoji: "🍎", label: "Mollë" }, { emoji: "🍌", label: "Banane" }] },
  { question: "Ku do të shkosh?", options: [{ emoji: "🏠", label: "Shtëpi" }, { emoji: "🌳", label: "Park" }] },
  { question: "Me kë do të luash?", options: [{ emoji: "🐱", label: "Mace" }, { emoji: "🐕", label: "Qen" }] },
  { question: "Çfarë do të veshësh?", options: [{ emoji: "👕", label: "Bluzë" }, { emoji: "👗", label: "Fustan" }] },
  { question: "Si ndihesh?", options: [{ emoji: "😊", label: "I lumtur" }, { emoji: "😢", label: "I trishtuar" }] },
];

// Calming visuals
const calmingVisuals = [
  { emoji: "🌊", name: "Deti", animation: "wave" },
  { emoji: "🌸", name: "Lule", animation: "bloom" },
  { emoji: "⭐", name: "Yje", animation: "twinkle" },
  { emoji: "🦋", name: "Flutur", animation: "flutter" },
  { emoji: "☁️", name: "Re", animation: "float" },
  { emoji: "🌈", name: "Ylber", animation: "fade" },
];

export const SpecialGames: React.FC<SpecialGamesProps> = ({ onSpeak }) => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [stats, setStats] = useLocalStorage("specialgames-stats", {
    causeEffect: 0,
    turnTaking: 0,
    simpleChoice: 0,
    calmingGame: 0,
  });

  // Cause Effect state
  const [activeEffect, setActiveEffect] = useState<number | null>(null);
  const [triggeredEffects, setTriggeredEffects] = useState<number[]>([]);

  // Turn Taking state
  const [currentTurn, setCurrentTurn] = useState<"child" | "character">("child");
  const [currentChar, setCurrentChar] = useState(0);
  const [turnCount, setTurnCount] = useState(0);

  // Simple Choice state
  const [currentChoice, setCurrentChoice] = useState(0);
  const [madeChoices, setMadeChoices] = useState<string[]>([]);

  // Calming state
  const [activeVisual, setActiveVisual] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [showCelebration, setShowCelebration] = useState(false);

  const handleStartGame = (game: GameType) => {
    setActiveGame(game);
    switch (game) {
      case "causeEffect":
        setActiveEffect(null);
        setTriggeredEffects([]);
        onSpeak("Kliko objektet dhe shiko çfarë ndodh!");
        break;
      case "turnTaking":
        setCurrentTurn("child");
        setCurrentChar(0);
        setTurnCount(0);
        onSpeak("Radha jote! Kliko butonin.");
        break;
      case "simpleChoice":
        setCurrentChoice(0);
        setMadeChoices([]);
        onSpeak(simpleChoices[0].question);
        break;
      case "calmingGame":
        setActiveVisual(0);
        setIsAnimating(true);
        onSpeak("Relaksohu dhe shiko pamjet qetësuese.");
        break;
    }
  };

  const handleCauseEffect = (index: number) => {
    const item = causeEffectItems[index];
    setActiveEffect(index);
    onSpeak(item.sound);
    
    if (!triggeredEffects.includes(index)) {
      setTriggeredEffects(prev => [...prev, index]);
      
      if (triggeredEffects.length + 1 === causeEffectItems.length) {
        setStats(prev => ({ ...prev, causeEffect: prev.causeEffect + 1 }));
        setShowCelebration(true);
        onSpeak("Urime! Të gjitha efektet u zbuluan!");
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
    
    setTimeout(() => setActiveEffect(null), 1500);
  };

  const handleTurn = () => {
    if (currentTurn === "child") {
      onSpeak("Bravo! Tani radha e " + turnTakingChars[currentChar].name);
      setCurrentTurn("character");
      
      setTimeout(() => {
        onSpeak(turnTakingChars[currentChar].name + " " + turnTakingChars[currentChar].action);
        setTimeout(() => {
          setCurrentTurn("child");
          setCurrentChar(prev => (prev + 1) % turnTakingChars.length);
          setTurnCount(prev => prev + 1);
          
          if (turnCount + 1 >= 8) {
            setStats(prev => ({ ...prev, turnTaking: prev.turnTaking + 1 }));
            setShowCelebration(true);
            onSpeak("Urime! Mësove të presësh radhën!");
            setTimeout(() => setShowCelebration(false), 3000);
          } else {
            onSpeak("Radha jote!");
          }
        }, 1500);
      }, 500);
    }
  };

  const handleChoice = (choice: string) => {
    onSpeak(`Ti zgjodhe ${choice}! Zgjedhje e mirë!`);
    setMadeChoices(prev => [...prev, choice]);
    
    if (currentChoice + 1 < simpleChoices.length) {
      setTimeout(() => {
        setCurrentChoice(prev => prev + 1);
        onSpeak(simpleChoices[currentChoice + 1].question);
      }, 1500);
    } else {
      setStats(prev => ({ ...prev, simpleChoice: prev.simpleChoice + 1 }));
      setShowCelebration(true);
      onSpeak("Urime! Bëre zgjedhje të shkëlqyera!");
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handleVisualChange = (index: number) => {
    setActiveVisual(index);
    onSpeak(calmingVisuals[index].name);
  };

  useEffect(() => {
    if (activeGame === "calmingGame" && isAnimating) {
      const interval = setInterval(() => {
        setActiveVisual(prev => (prev + 1) % calmingVisuals.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeGame, isAnimating]);

  const games = [
    { id: "causeEffect", name: "Shkak dhe Efekt", description: "Kliko dhe shiko çfarë ndodh", icon: Zap, color: "from-amber-400 to-orange-400", score: stats.causeEffect },
    { id: "turnTaking", name: "Prit Radhën", description: "Mëso të presësh", icon: Timer, color: "from-blue-400 to-cyan-400", score: stats.turnTaking },
    { id: "simpleChoice", name: "Bëj Zgjedhje", description: "Zgjedh çfarë dëshiron", icon: Target, color: "from-green-400 to-emerald-400", score: stats.simpleChoice },
    { id: "calmingGame", name: "Qetësim", description: "Pamje relaksuese", icon: Heart, color: "from-pink-400 to-rose-400", score: stats.calmingGame },
  ];

  if (activeGame) {
    return (
      <div className="space-y-6">
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="text-center animate-bounce">
              <div className="text-8xl mb-4">🎉</div>
              <div className="text-4xl font-bold text-white">Urime!</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setActiveGame(null)}>
            ← Kthehu
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleStartGame(activeGame)}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Rifillo
          </Button>
        </div>

        {activeGame === "causeEffect" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {causeEffectItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleCauseEffect(index)}
                className={`
                  relative p-8 rounded-2xl border-2 shadow-lg transition-all
                  ${triggeredEffects.includes(index)
                    ? "bg-green-50 border-green-300"
                    : "bg-card hover:border-primary hover:scale-105"
                  }
                `}
              >
                <div className={`text-6xl transition-all duration-300 ${activeEffect === index ? "scale-0" : ""}`}>
                  {item.trigger}
                </div>
                {activeEffect === index && (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
                    {item.effect}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {activeGame === "turnTaking" && (
          <div className="space-y-6">
            <Card className="p-6 text-center">
              <div className="text-6xl mb-4">
                {currentTurn === "child" ? "👶" : turnTakingChars[currentChar].emoji}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {currentTurn === "child" ? "Radha jote!" : `Radha e ${turnTakingChars[currentChar].name}`}
              </h3>
              <p className="text-muted-foreground">
                Radha: {turnCount + 1}/8
              </p>
            </Card>

            <div className="flex justify-center">
              <button
                onClick={handleTurn}
                disabled={currentTurn !== "child"}
                className={`
                  w-32 h-32 rounded-full text-4xl shadow-lg transition-all
                  ${currentTurn === "child"
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 hover:scale-110 animate-pulse"
                    : "bg-muted opacity-50"
                  }
                `}
              >
                {currentTurn === "child" ? "👋" : "⏳"}
              </button>
            </div>

            <div className="flex justify-center gap-2">
              {turnTakingChars.map((char, i) => (
                <div
                  key={i}
                  className={`
                    text-3xl p-2 rounded-xl transition-all
                    ${i === currentChar && currentTurn === "character"
                      ? "bg-primary/20 scale-125"
                      : ""
                    }
                  `}
                >
                  {char.emoji}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeGame === "simpleChoice" && (
          <div className="space-y-6">
            <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <p className="text-sm text-muted-foreground mb-2">
                {currentChoice + 1}/{simpleChoices.length}
              </p>
              <h3 className="text-2xl font-bold">
                {simpleChoices[currentChoice].question}
              </h3>
            </Card>

            <div className="flex justify-center gap-6">
              {simpleChoices[currentChoice].options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleChoice(option.label)}
                  className="p-8 rounded-2xl bg-card border-2 hover:border-primary shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center"
                >
                  <div className="text-6xl mb-3">{option.emoji}</div>
                  <div className="font-bold">{option.label}</div>
                </button>
              ))}
            </div>

            {madeChoices.length > 0 && (
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Zgjedhjet e tua:</p>
                <div className="flex justify-center gap-2 mt-2">
                  {madeChoices.map((choice, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                      {choice}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeGame === "calmingGame" && (
          <div className="space-y-6">
            <Card className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-violet-50 dark:from-sky-950 dark:to-violet-950">
              <div 
                className={`
                  text-9xl mb-4 transition-all duration-1000
                  ${calmingVisuals[activeVisual].animation === "wave" ? "animate-pulse" : ""}
                  ${calmingVisuals[activeVisual].animation === "bloom" ? "animate-bounce" : ""}
                  ${calmingVisuals[activeVisual].animation === "twinkle" ? "animate-ping" : ""}
                  ${calmingVisuals[activeVisual].animation === "flutter" ? "animate-bounce" : ""}
                  ${calmingVisuals[activeVisual].animation === "float" ? "animate-pulse" : ""}
                `}
              >
                {calmingVisuals[activeVisual].emoji}
              </div>
              <h3 className="text-2xl font-bold text-foreground/80">
                {calmingVisuals[activeVisual].name}
              </h3>
              <p className="text-muted-foreground mt-2">
                Frymëmarr thellë dhe relaksohu...
              </p>
            </Card>

            <div className="flex justify-center gap-3">
              {calmingVisuals.map((visual, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleVisualChange(i);
                    setIsAnimating(false);
                  }}
                  className={`
                    text-3xl p-3 rounded-xl transition-all
                    ${i === activeVisual
                      ? "bg-primary/20 scale-110"
                      : "bg-card hover:scale-105"
                    }
                  `}
                >
                  {visual.emoji}
                </button>
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setIsAnimating(!isAnimating)}
              >
                {isAnimating ? "Ndalo Autoplay" : "Fillo Autoplay"}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
        <Trophy className="w-8 h-8 text-amber-500" />
        <div>
          <div className="font-bold">Lojëra të Veçanta</div>
          <div className="text-sm text-muted-foreground">
            Total: {stats.causeEffect + stats.turnTaking + stats.simpleChoice + stats.calmingGame} lojëra
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <button
              key={game.id}
              onClick={() => handleStartGame(game.id as GameType)}
              className="group relative p-5 rounded-2xl bg-card border-2 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${game.color} group-hover:opacity-20 transition-opacity`} />
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${game.color} shadow-lg mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-sm mb-1">{game.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{game.description}</p>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs">{game.score}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
