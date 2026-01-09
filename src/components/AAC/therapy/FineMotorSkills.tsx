import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Hand, 
  Pencil, 
  Scissors, 
  Puzzle,
  RotateCcw,
  Trophy,
  Star,
  Target,
  Sparkles
} from "lucide-react";

interface FineMotorSkillsProps {
  onSpeak: (text: string) => void;
}

type ActivityType = "tracing" | "tapping" | "dragging" | "pinching" | null;

interface TracingPath {
  id: string;
  name: string;
  points: { x: number; y: number }[];
  emoji: string;
}

const tracingPaths: TracingPath[] = [
  { id: "line", name: "Vijë", emoji: "➖", points: Array.from({ length: 10 }, (_, i) => ({ x: 10 + i * 8, y: 50 })) },
  { id: "wave", name: "Valë", emoji: "〰️", points: Array.from({ length: 10 }, (_, i) => ({ x: 10 + i * 8, y: 50 + Math.sin(i) * 20 })) },
  { id: "zigzag", name: "Zigzag", emoji: "⚡", points: Array.from({ length: 10 }, (_, i) => ({ x: 10 + i * 8, y: i % 2 === 0 ? 30 : 70 })) },
  { id: "circle", name: "Rreth", emoji: "⭕", points: Array.from({ length: 12 }, (_, i) => ({ x: 50 + Math.cos(i * Math.PI / 6) * 30, y: 50 + Math.sin(i * Math.PI / 6) * 30 })) },
];

const tappingTargets = [
  { emoji: "🔴", size: "large" },
  { emoji: "🟡", size: "medium" },
  { emoji: "🟢", size: "small" },
  { emoji: "🔵", size: "medium" },
  { emoji: "🟣", size: "large" },
];

const draggingItems = [
  { emoji: "🍎", target: "🧺" },
  { emoji: "🐟", target: "🐱" },
  { emoji: "⚽", target: "🥅" },
  { emoji: "✉️", target: "📬" },
];

const pinchingLevels = [
  { size: 100, name: "Shumë e madhe" },
  { size: 80, name: "E madhe" },
  { size: 60, name: "Mesatare" },
  { size: 40, name: "E vogël" },
  { size: 25, name: "Shumë e vogël" },
];

export const FineMotorSkills: React.FC<FineMotorSkillsProps> = ({ onSpeak }) => {
  const [activeActivity, setActiveActivity] = useState<ActivityType>(null);
  const [stats, setStats] = useLocalStorage("finemotor-stats", {
    tracing: 0,
    tapping: 0,
    dragging: 0,
    pinching: 0,
  });

  // Tracing state
  const [currentPath, setCurrentPath] = useState(0);
  const [tracedPoints, setTracedPoints] = useState<number[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Tapping state
  const [tappedTargets, setTappedTargets] = useState<number[]>([]);
  const [targetPositions, setTargetPositions] = useState<{ x: number; y: number }[]>([]);

  // Dragging state
  const [currentDrag, setCurrentDrag] = useState(0);
  const [dragPosition, setDragPosition] = useState({ x: 50, y: 200 });
  const [isDragging, setIsDragging] = useState(false);

  // Pinching state
  const [currentLevel, setCurrentLevel] = useState(0);
  const [pinchScale, setPinchScale] = useState(1);

  const [showCelebration, setShowCelebration] = useState(false);

  const generateTargetPositions = useCallback(() => {
    const positions = tappingTargets.map(() => ({
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
    }));
    setTargetPositions(positions);
  }, []);

  const handleStartActivity = (activity: ActivityType) => {
    setActiveActivity(activity);
    switch (activity) {
      case "tracing":
        setCurrentPath(0);
        setTracedPoints([]);
        onSpeak("Ndiq vijën me gishtin tënd!");
        break;
      case "tapping":
        setTappedTargets([]);
        generateTargetPositions();
        onSpeak("Prek të gjitha objekte sa më shpejt!");
        break;
      case "dragging":
        setCurrentDrag(0);
        setDragPosition({ x: 50, y: 200 });
        onSpeak("Tërhiq objektin te destinacioni!");
        break;
      case "pinching":
        setCurrentLevel(0);
        setPinchScale(1);
        onSpeak("Shtrydhë objektin për ta bërë më të vogël!");
        break;
    }
  };

  const handlePointTouch = (index: number) => {
    if (!tracedPoints.includes(index)) {
      if (tracedPoints.length === 0 || index === tracedPoints[tracedPoints.length - 1] + 1) {
        setTracedPoints(prev => [...prev, index]);
        
        const path = tracingPaths[currentPath];
        if (tracedPoints.length + 1 === path.points.length) {
          onSpeak("Bravo! Vijë e bukur!");
          setTimeout(() => {
            if (currentPath + 1 < tracingPaths.length) {
              setCurrentPath(prev => prev + 1);
              setTracedPoints([]);
              onSpeak(`Tani ndiq: ${tracingPaths[currentPath + 1].name}`);
            } else {
              setStats(prev => ({ ...prev, tracing: prev.tracing + 1 }));
              setShowCelebration(true);
              onSpeak("Urime! Të gjitha vijat u ndoqën!");
              setTimeout(() => setShowCelebration(false), 3000);
            }
          }, 1000);
        }
      }
    }
  };

  const handleTargetTap = (index: number) => {
    if (!tappedTargets.includes(index)) {
      setTappedTargets(prev => [...prev, index]);
      onSpeak("Saktë!");
      
      if (tappedTargets.length + 1 === tappingTargets.length) {
        setStats(prev => ({ ...prev, tapping: prev.tapping + 1 }));
        setShowCelebration(true);
        onSpeak("Urime! Të gjitha u prekën!");
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  };

  const handleDragEnd = (targetX: number, targetY: number) => {
    const distance = Math.sqrt(
      Math.pow(dragPosition.x - targetX, 2) + Math.pow(dragPosition.y - targetY, 2)
    );
    
    if (distance < 30) {
      onSpeak("Bravo!");
      setTimeout(() => {
        if (currentDrag + 1 < draggingItems.length) {
          setCurrentDrag(prev => prev + 1);
          setDragPosition({ x: 50, y: 200 });
          onSpeak(`Tani tërhiq: ${draggingItems[currentDrag + 1].emoji}`);
        } else {
          setStats(prev => ({ ...prev, dragging: prev.dragging + 1 }));
          setShowCelebration(true);
          onSpeak("Urime! Të gjitha u tërhoqën!");
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }, 500);
    } else {
      setDragPosition({ x: 50, y: 200 });
      onSpeak("Provo përsëri!");
    }
    setIsDragging(false);
  };

  const handlePinch = () => {
    setPinchScale(prev => {
      const newScale = prev * 0.85;
      if (newScale < 0.3) {
        setTimeout(() => {
          if (currentLevel + 1 < pinchingLevels.length) {
            setCurrentLevel(prev => prev + 1);
            setPinchScale(1);
            onSpeak("Bravo! Tani më e vogël!");
          } else {
            setStats(prev => ({ ...prev, pinching: prev.pinching + 1 }));
            setShowCelebration(true);
            onSpeak("Urime! Të gjitha u shtrydhën!");
            setTimeout(() => setShowCelebration(false), 3000);
          }
        }, 500);
        return 0.3;
      }
      return newScale;
    });
    onSpeak("Shtrydh!");
  };

  const activities = [
    { id: "tracing", name: "Ndiq Vijën", description: "Praktiko lëvizjet e gishtave", icon: Pencil, color: "from-blue-400 to-cyan-400", score: stats.tracing },
    { id: "tapping", name: "Prek Objekte", description: "Përmirëso koordinimin", icon: Target, color: "from-green-400 to-emerald-400", score: stats.tapping },
    { id: "dragging", name: "Tërhiq dhe Lësho", description: "Mëso të kontrollosh", icon: Hand, color: "from-orange-400 to-amber-400", score: stats.dragging },
    { id: "pinching", name: "Shtrydh Objektin", description: "Forcë precize e gishtave", icon: Scissors, color: "from-purple-400 to-violet-400", score: stats.pinching },
  ];

  if (activeActivity) {
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
          <Button variant="outline" onClick={() => setActiveActivity(null)}>
            ← Kthehu
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleStartActivity(activeActivity)}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Rifillo
          </Button>
        </div>

        {activeActivity === "tracing" && (
          <Card className="p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">{tracingPaths[currentPath].emoji}</span>
              <h3 className="font-bold text-lg">{tracingPaths[currentPath].name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentPath + 1}/{tracingPaths.length}
              </p>
            </div>
            <div 
              ref={canvasRef}
              className="relative h-40 bg-muted rounded-xl overflow-hidden"
            >
              {tracingPaths[currentPath].points.map((point, i) => (
                <button
                  key={i}
                  onClick={() => handlePointTouch(i)}
                  className={`
                    absolute w-8 h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2
                    transition-all duration-200
                    ${tracedPoints.includes(i)
                      ? "bg-green-500 scale-75"
                      : i === tracedPoints.length
                      ? "bg-primary animate-pulse scale-125"
                      : "bg-primary/30"
                    }
                  `}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                />
              ))}
            </div>
          </Card>
        )}

        {activeActivity === "tapping" && (
          <Card className="p-6">
            <div className="text-center mb-4">
              <p className="text-muted-foreground">
                {tappedTargets.length}/{tappingTargets.length} objekte
              </p>
            </div>
            <div className="relative h-64 bg-muted rounded-xl overflow-hidden">
              {tappingTargets.map((target, i) => (
                <button
                  key={i}
                  onClick={() => handleTargetTap(i)}
                  disabled={tappedTargets.includes(i)}
                  className={`
                    absolute transform -translate-x-1/2 -translate-y-1/2
                    transition-all duration-200
                    ${tappedTargets.includes(i)
                      ? "opacity-30 scale-50"
                      : "hover:scale-125 animate-bounce"
                    }
                  `}
                  style={{
                    left: `${targetPositions[i]?.x || 50}%`,
                    top: `${targetPositions[i]?.y || 50}%`,
                    fontSize: target.size === "large" ? "3rem" : target.size === "medium" ? "2.5rem" : "2rem",
                  }}
                >
                  {target.emoji}
                </button>
              ))}
            </div>
          </Card>
        )}

        {activeActivity === "dragging" && (
          <Card className="p-6">
            <div className="text-center mb-4">
              <p className="text-muted-foreground">
                {currentDrag + 1}/{draggingItems.length}
              </p>
            </div>
            <div className="relative h-64 bg-muted rounded-xl overflow-hidden">
              {/* Target */}
              <div
                className="absolute text-5xl"
                style={{ right: "20%", top: "30%" }}
              >
                {draggingItems[currentDrag].target}
              </div>
              
              {/* Draggable item */}
              <button
                className={`
                  absolute text-5xl cursor-grab active:cursor-grabbing
                  transition-transform duration-100
                  ${isDragging ? "scale-125" : ""}
                `}
                style={{
                  left: `${dragPosition.x}px`,
                  top: `${dragPosition.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => handleDragEnd(70, 30)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => handleDragEnd(70, 30)}
              >
                {draggingItems[currentDrag].emoji}
              </button>

              <p className="absolute bottom-4 left-0 right-0 text-center text-muted-foreground">
                Kliko dhe tërhiq {draggingItems[currentDrag].emoji} te {draggingItems[currentDrag].target}
              </p>
            </div>
          </Card>
        )}

        {activeActivity === "pinching" && (
          <Card className="p-6 text-center">
            <div className="mb-4">
              <p className="text-muted-foreground">
                Niveli {currentLevel + 1}/{pinchingLevels.length}
              </p>
              <p className="font-bold">{pinchingLevels[currentLevel].name}</p>
            </div>
            <div className="flex justify-center items-center h-48">
              <button
                onClick={handlePinch}
                className="transition-transform duration-200 hover:opacity-80"
                style={{
                  transform: `scale(${pinchScale})`,
                  fontSize: `${pinchingLevels[currentLevel].size}px`,
                }}
              >
                🔴
              </button>
            </div>
            <p className="text-muted-foreground text-sm">
              Kliko për të shtrydhur!
            </p>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
        <Trophy className="w-8 h-8 text-amber-500" />
        <div>
          <div className="font-bold">Aftësi Motorike Fine</div>
          <div className="text-sm text-muted-foreground">
            Total: {stats.tracing + stats.tapping + stats.dragging + stats.pinching} ushtrime
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <button
              key={activity.id}
              onClick={() => handleStartActivity(activity.id as ActivityType)}
              className="group relative p-5 rounded-2xl bg-card border-2 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${activity.color} group-hover:opacity-20 transition-opacity`} />
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${activity.color} shadow-lg mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-sm mb-1">{activity.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs">{activity.score}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
