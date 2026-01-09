import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Brain, 
  Puzzle, 
  Grid3X3, 
  Layers, 
  RotateCcw,
  Trophy,
  Star,
  Check,
  X,
  Sparkles
} from "lucide-react";

interface CognitiveGamesProps {
  onSpeak: (text: string) => void;
}

type GameType = "matching" | "sorting" | "sequencing" | "memory" | null;

interface MatchItem {
  id: string;
  emoji: string;
  label: string;
  matched: boolean;
}

interface SortItem {
  id: string;
  emoji: string;
  category: "food" | "animal" | "transport";
}

interface SequenceItem {
  id: string;
  emoji: string;
  order: number;
}

const matchingPairs = [
  { emoji: "🍎", label: "Mollë" },
  { emoji: "🐱", label: "Mace" },
  { emoji: "🚗", label: "Makinë" },
  { emoji: "🌸", label: "Lule" },
  { emoji: "⭐", label: "Yll" },
  { emoji: "🏠", label: "Shtëpi" },
];

const sortingItems: SortItem[] = [
  { id: "1", emoji: "🍎", category: "food" },
  { id: "2", emoji: "🍌", category: "food" },
  { id: "3", emoji: "🐱", category: "animal" },
  { id: "4", emoji: "🐕", category: "animal" },
  { id: "5", emoji: "🚗", category: "transport" },
  { id: "6", emoji: "🚌", category: "transport" },
  { id: "7", emoji: "🍇", category: "food" },
  { id: "8", emoji: "🐰", category: "animal" },
  { id: "9", emoji: "✈️", category: "transport" },
];

const sequences = [
  { name: "Numrat", items: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"] },
  { name: "Madhësia", items: ["🔵", "🟢", "🟡", "🟠", "🔴"] },
  { name: "Aktivitetet", items: ["🌅", "🍳", "📚", "🍽️", "🌙"] },
  { name: "Rritja", items: ["🌱", "🌿", "🌳", "🍎", "🥧"] },
];

const memoryCards = [
  "🐱", "🐕", "🐰", "🦋", "🌸", "⭐", "🍎", "🚗"
];

export const CognitiveGames: React.FC<CognitiveGamesProps> = ({ onSpeak }) => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [stats, setStats] = useLocalStorage("cognitive-stats", {
    matching: 0,
    sorting: 0,
    sequencing: 0,
    memory: 0,
  });

  // Matching game state
  const [matchCards, setMatchCards] = useState<MatchItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Sorting game state
  const [sortItems, setSortItems] = useState<SortItem[]>([]);
  const [sortedItems, setSortedItems] = useState<Record<string, string[]>>({
    food: [],
    animal: [],
    transport: [],
  });

  // Sequencing game state
  const [currentSequence, setCurrentSequence] = useState(0);
  const [shuffledSequence, setShuffledSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);

  // Memory game state
  const [memoryGrid, setMemoryGrid] = useState<{ emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  const [showCelebration, setShowCelebration] = useState(false);

  const initMatchingGame = useCallback(() => {
    const pairs = matchingPairs.slice(0, 4);
    const cards: MatchItem[] = [];
    pairs.forEach((pair, index) => {
      cards.push({ id: `emoji-${index}`, emoji: pair.emoji, label: pair.emoji, matched: false });
      cards.push({ id: `label-${index}`, emoji: pair.label, label: pair.emoji, matched: false });
    });
    setMatchCards(cards.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchedPairs([]);
    onSpeak("Gjej çiftet! Kliko dy karta që përputhen.");
  }, [onSpeak]);

  const initSortingGame = useCallback(() => {
    setSortItems([...sortingItems].sort(() => Math.random() - 0.5));
    setSortedItems({ food: [], animal: [], transport: [] });
    onSpeak("Rendit objektet! Vendos çdo objekt në kategorinë e duhur.");
  }, [onSpeak]);

  const initSequencingGame = useCallback(() => {
    const seq = sequences[currentSequence];
    setShuffledSequence([...seq.items].sort(() => Math.random() - 0.5));
    setUserSequence([]);
    onSpeak(`Vendos në rend! ${seq.name}`);
  }, [currentSequence, onSpeak]);

  const initMemoryGame = useCallback(() => {
    const cards = [...memoryCards, ...memoryCards]
      .sort(() => Math.random() - 0.5)
      .map(emoji => ({ emoji, flipped: false, matched: false }));
    setMemoryGrid(cards);
    setFlippedIndices([]);
    onSpeak("Loja e kujtesës! Gjej të gjitha çiftet.");
  }, [onSpeak]);

  const handleStartGame = (game: GameType) => {
    setActiveGame(game);
    switch (game) {
      case "matching":
        initMatchingGame();
        break;
      case "sorting":
        initSortingGame();
        break;
      case "sequencing":
        initSequencingGame();
        break;
      case "memory":
        initMemoryGame();
        break;
    }
  };

  const handleMatchClick = (cardId: string) => {
    if (selectedCards.length >= 2) return;
    if (selectedCards.includes(cardId)) return;
    if (matchedPairs.includes(cardId)) return;

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const card1 = matchCards.find(c => c.id === newSelected[0]);
      const card2 = matchCards.find(c => c.id === newSelected[1]);

      if (card1 && card2 && card1.label === card2.label) {
        setMatchedPairs(prev => [...prev, card1.id, card2.id]);
        onSpeak("Saktë! Çift i gjetur!");
        
        if (matchedPairs.length + 2 === matchCards.length) {
          setStats(prev => ({ ...prev, matching: prev.matching + 1 }));
          setShowCelebration(true);
          onSpeak("Urime! Të gjitha çiftet u gjetën!");
          setTimeout(() => setShowCelebration(false), 3000);
        }
      } else {
        onSpeak("Provo përsëri!");
      }

      setTimeout(() => setSelectedCards([]), 1000);
    }
  };

  const handleSortDrop = (itemId: string, category: "food" | "animal" | "transport") => {
    const item = sortItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.category === category) {
      setSortItems(prev => prev.filter(i => i.id !== itemId));
      setSortedItems(prev => ({
        ...prev,
        [category]: [...prev[category], item.emoji],
      }));
      onSpeak("Saktë!");

      if (sortItems.length === 1) {
        setStats(prev => ({ ...prev, sorting: prev.sorting + 1 }));
        setShowCelebration(true);
        onSpeak("Urime! Të gjitha objektet u renditën!");
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } else {
      onSpeak("Provo kategorinë tjetër!");
    }
  };

  const handleSequenceClick = (emoji: string) => {
    const seq = sequences[currentSequence];
    const nextIndex = userSequence.length;

    if (emoji === seq.items[nextIndex]) {
      setUserSequence(prev => [...prev, emoji]);
      setShuffledSequence(prev => prev.filter(e => e !== emoji));
      onSpeak("Saktë!");

      if (nextIndex + 1 === seq.items.length) {
        setStats(prev => ({ ...prev, sequencing: prev.sequencing + 1 }));
        setShowCelebration(true);
        onSpeak("Urime! Sekuenca e plotë!");
        setTimeout(() => {
          setShowCelebration(false);
          setCurrentSequence(prev => (prev + 1) % sequences.length);
        }, 3000);
      }
    } else {
      onSpeak("Provo një tjetër!");
    }
  };

  const handleMemoryClick = (index: number) => {
    if (flippedIndices.length >= 2) return;
    if (memoryGrid[index].flipped || memoryGrid[index].matched) return;

    const newGrid = [...memoryGrid];
    newGrid[index].flipped = true;
    setMemoryGrid(newGrid);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (memoryGrid[first].emoji === memoryGrid[second].emoji) {
        setTimeout(() => {
          const matched = [...memoryGrid];
          matched[first].matched = true;
          matched[second].matched = true;
          setMemoryGrid(matched);
          setFlippedIndices([]);
          onSpeak("Çift i gjetur!");

          if (matched.every(c => c.matched)) {
            setStats(prev => ({ ...prev, memory: prev.memory + 1 }));
            setShowCelebration(true);
            onSpeak("Urime! Kujtesa e shkëlqyer!");
            setTimeout(() => setShowCelebration(false), 3000);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const unflipped = [...memoryGrid];
          unflipped[first].flipped = false;
          unflipped[second].flipped = false;
          setMemoryGrid(unflipped);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const games = [
    { id: "matching", name: "Gjej Çiftet", icon: Grid3X3, color: "from-pink-400 to-rose-400", score: stats.matching },
    { id: "sorting", name: "Rendit Objektet", icon: Layers, color: "from-blue-400 to-cyan-400", score: stats.sorting },
    { id: "sequencing", name: "Vendos në Rend", icon: Puzzle, color: "from-green-400 to-emerald-400", score: stats.sequencing },
    { id: "memory", name: "Loja e Kujtesës", icon: Brain, color: "from-purple-400 to-violet-400", score: stats.memory },
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

        {activeGame === "matching" && (
          <div className="grid grid-cols-4 gap-3">
            {matchCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleMatchClick(card.id)}
                disabled={matchedPairs.includes(card.id)}
                className={`
                  aspect-square rounded-xl text-3xl font-bold
                  transition-all duration-300 transform
                  ${matchedPairs.includes(card.id)
                    ? "bg-green-100 border-green-400 scale-95 opacity-50"
                    : selectedCards.includes(card.id)
                    ? "bg-primary/20 border-primary scale-105"
                    : "bg-card hover:bg-primary/10 hover:scale-105"
                  }
                  border-2 shadow-lg
                `}
              >
                {card.emoji}
              </button>
            ))}
          </div>
        )}

        {activeGame === "sorting" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: "food", label: "Ushqim", emoji: "🍽️" },
                { key: "animal", label: "Kafshë", emoji: "🐾" },
                { key: "transport", label: "Transport", emoji: "🚗" },
              ].map((cat) => (
                <Card
                  key={cat.key}
                  className="p-4 text-center min-h-[120px]"
                  onClick={() => {
                    const item = sortItems[0];
                    if (item) handleSortDrop(item.id, cat.key as any);
                  }}
                >
                  <div className="text-2xl mb-2">{cat.emoji}</div>
                  <div className="font-bold text-sm mb-2">{cat.label}</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {sortedItems[cat.key as keyof typeof sortedItems].map((emoji, i) => (
                      <span key={i} className="text-xl">{emoji}</span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center p-4 bg-muted rounded-xl">
              {sortItems.map((item) => (
                <button
                  key={item.id}
                  className="text-4xl p-3 bg-card rounded-xl shadow-lg hover:scale-110 transition-transform"
                >
                  {item.emoji}
                </button>
              ))}
            </div>

            <p className="text-center text-muted-foreground">
              Kliko kategorinë ku i përket objekti i parë
            </p>
          </div>
        )}

        {activeGame === "sequencing" && (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-4 text-center">
                {sequences[currentSequence].name}
              </h3>
              <div className="flex gap-2 justify-center min-h-[80px] p-4 bg-muted rounded-xl">
                {userSequence.map((emoji, i) => (
                  <span key={i} className="text-4xl">{emoji}</span>
                ))}
                {Array(sequences[currentSequence].items.length - userSequence.length)
                  .fill(null)
                  .map((_, i) => (
                    <span key={`empty-${i}`} className="w-12 h-12 border-2 border-dashed border-muted-foreground/30 rounded-xl" />
                  ))}
              </div>
            </Card>

            <div className="flex flex-wrap gap-3 justify-center">
              {shuffledSequence.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => handleSequenceClick(emoji)}
                  className="text-4xl p-4 bg-card rounded-xl shadow-lg hover:scale-110 transition-transform border-2 hover:border-primary"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeGame === "memory" && (
          <div className="grid grid-cols-4 gap-3">
            {memoryGrid.map((card, index) => (
              <button
                key={index}
                onClick={() => handleMemoryClick(index)}
                className={`
                  aspect-square rounded-xl text-3xl
                  transition-all duration-300 transform
                  ${card.matched
                    ? "bg-green-100 border-green-400 opacity-50"
                    : card.flipped
                    ? "bg-primary/20 border-primary rotate-0"
                    : "bg-gradient-to-br from-primary/20 to-secondary/20 hover:scale-105"
                  }
                  border-2 shadow-lg flex items-center justify-center
                `}
              >
                {(card.flipped || card.matched) ? card.emoji : "❓"}
              </button>
            ))}
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
          <div className="font-bold">Statistikat e Lojërave</div>
          <div className="text-sm text-muted-foreground">
            Total: {stats.matching + stats.sorting + stats.sequencing + stats.memory} lojëra
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
              className="group relative p-6 rounded-2xl bg-card border-2 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${game.color} group-hover:opacity-20 transition-opacity`} />
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${game.color} shadow-lg mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-1">{game.name}</h4>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">{game.score}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
