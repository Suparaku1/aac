import React, { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Gamepad2,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Sparkles,
} from "lucide-react";
import { AACSymbol, aacSymbols, categories } from "@/data/aacSymbols";
import { cn } from "@/lib/utils";

interface LearningGamesProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
  onUpdateProgress?: (symbolId: string, correct: boolean) => void;
}

type GameType = "match" | "listen" | null;

interface GameState {
  currentSymbol: AACSymbol | null;
  options: AACSymbol[];
  score: number;
  round: number;
  totalRounds: number;
  isCorrect: boolean | null;
  gameComplete: boolean;
}

const TOTAL_ROUNDS = 10;

export const LearningGames: React.FC<LearningGamesProps> = ({
  isOpen,
  onClose,
  onSpeak,
  onUpdateProgress,
}) => {
  const [gameType, setGameType] = useState<GameType>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [gameState, setGameState] = useState<GameState>({
    currentSymbol: null,
    options: [],
    score: 0,
    round: 0,
    totalRounds: TOTAL_ROUNDS,
    isCorrect: null,
    gameComplete: false,
  });

  const getSymbolsForGame = useCallback(() => {
    if (selectedCategory === "all") {
      return [...aacSymbols];
    }
    return aacSymbols.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const startNewRound = useCallback(() => {
    const symbols = getSymbolsForGame();
    if (symbols.length < 4) return;

    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    const wrongOptions = shuffled.slice(1, 4);
    const options = [...wrongOptions, correct].sort(() => Math.random() - 0.5);

    setGameState((prev) => ({
      ...prev,
      currentSymbol: correct,
      options,
      isCorrect: null,
    }));

    // For listen game, speak the word
    if (gameType === "listen") {
      setTimeout(() => onSpeak(correct.label), 500);
    }
  }, [getSymbolsForGame, gameType, onSpeak]);

  const startGame = (type: GameType) => {
    setGameType(type);
    setGameState({
      currentSymbol: null,
      options: [],
      score: 0,
      round: 1,
      totalRounds: TOTAL_ROUNDS,
      isCorrect: null,
      gameComplete: false,
    });
  };

  useEffect(() => {
    if (gameType && gameState.round > 0 && !gameState.gameComplete) {
      startNewRound();
    }
  }, [gameType, gameState.round, gameState.gameComplete, startNewRound]);

  const handleAnswer = (symbol: AACSymbol) => {
    if (gameState.isCorrect !== null) return;

    const isCorrect = symbol.id === gameState.currentSymbol?.id;
    onSpeak(symbol.label);
    
    // Update learning progress
    if (gameState.currentSymbol && onUpdateProgress) {
      onUpdateProgress(gameState.currentSymbol.id, isCorrect);
    }

    setGameState((prev) => ({
      ...prev,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    setTimeout(() => {
      if (gameState.round >= TOTAL_ROUNDS) {
        setGameState((prev) => ({ ...prev, gameComplete: true }));
      } else {
        setGameState((prev) => ({
          ...prev,
          round: prev.round + 1,
          isCorrect: null,
        }));
      }
    }, 1500);
  };

  const resetGame = () => {
    setGameType(null);
    setGameState({
      currentSymbol: null,
      options: [],
      score: 0,
      round: 0,
      totalRounds: TOTAL_ROUNDS,
      isCorrect: null,
      gameComplete: false,
    });
  };

  const renderGameSelection = () => (
    <div className="space-y-6 py-4">
      {/* Category selection */}
      <div>
        <h3 className="font-semibold mb-3">Zgjidh kategorinë:</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            🎯 Të gjitha
          </Button>
          {categories.slice(0, 6).map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.emoji} {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Game modes */}
      <div>
        <h3 className="font-semibold mb-3">Zgjidh lojën:</h3>
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => startGame("match")}
            className="p-6 rounded-2xl border-2 border-border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:border-blue-400 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center text-3xl">
                🎯
              </div>
              <div>
                <h4 className="font-bold text-lg">Gjej Simbolin</h4>
                <p className="text-sm text-muted-foreground">
                  Shiko simbolin dhe gjej atë që përputhet
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => startGame("listen")}
            className="p-6 rounded-2xl border-2 border-border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:border-green-400 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-green-500 flex items-center justify-center text-3xl">
                👂
              </div>
              <div>
                <h4 className="font-bold text-lg">Dëgjo dhe Gjej</h4>
                <p className="text-sm text-muted-foreground">
                  Dëgjo fjalën dhe gjej simbolin e saktë
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="space-y-6 py-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Raundi {gameState.round}/{gameState.totalRounds}
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            {gameState.score}
          </span>
        </div>
        <Progress
          value={(gameState.round / gameState.totalRounds) * 100}
          className="h-3"
        />
      </div>

      {/* Question */}
      <div className="text-center space-y-4">
        {gameType === "match" && gameState.currentSymbol && (
          <>
            <p className="text-lg font-medium">Gjej këtë simbol:</p>
            <div className="flex flex-col items-center gap-2">
              <span className="text-7xl">{gameState.currentSymbol.emoji}</span>
              <span className="text-xl font-bold">
                {gameState.currentSymbol.label}
              </span>
            </div>
          </>
        )}

        {gameType === "listen" && (
          <>
            <p className="text-lg font-medium">Dëgjo dhe gjej simbolin:</p>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                gameState.currentSymbol && onSpeak(gameState.currentSymbol.label)
              }
              className="text-2xl py-8 px-12"
            >
              <Volume2 className="w-8 h-8 mr-3" />
              Dëgjo përsëri
            </Button>
          </>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        {gameState.options.map((option) => {
          const isSelected = gameState.isCorrect !== null;
          const isCorrectOption = option.id === gameState.currentSymbol?.id;
          const showCorrect = isSelected && isCorrectOption;
          const showWrong = isSelected && !isCorrectOption && gameState.isCorrect === false;

          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              disabled={isSelected}
              className={cn(
                "p-4 rounded-2xl border-3 flex flex-col items-center gap-2 transition-all",
                "hover:scale-105 active:scale-95",
                !isSelected && "border-border bg-card hover:border-primary",
                showCorrect && "border-green-500 bg-green-50 dark:bg-green-900/30",
                showWrong && "border-red-500 bg-red-50 dark:bg-red-900/30 opacity-50"
              )}
            >
              <span className="text-5xl">{option.emoji}</span>
              <span className="font-semibold">{option.label}</span>
              {showCorrect && (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              )}
              {showWrong && <XCircle className="w-6 h-6 text-red-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderGameComplete = () => {
    const percentage = Math.round((gameState.score / gameState.totalRounds) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <div className="text-center space-y-6 py-8">
        <div className="relative inline-block">
          <Trophy
            className={cn(
              "w-24 h-24",
              isExcellent
                ? "text-yellow-500"
                : isGood
                ? "text-gray-400"
                : "text-amber-600"
            )}
          />
          {isExcellent && (
            <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-2">
            {isExcellent
              ? "Shkëlqyeshëm! 🎉"
              : isGood
              ? "Shumë mirë! 👏"
              : "Vazhdoni përpara! 💪"}
          </h3>
          <p className="text-4xl font-bold text-primary">
            {gameState.score}/{gameState.totalRounds}
          </p>
          <p className="text-muted-foreground">përgjigje të sakta</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={resetGame}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Lojë e re
          </Button>
          <Button onClick={() => startGame(gameType)}>
            <Gamepad2 className="w-4 h-4 mr-2" />
            Luaj përsëri
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Gamepad2 className="w-6 h-6 text-primary" />
            Lojëra Mësimore
            {gameType && !gameState.gameComplete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetGame}
                className="ml-auto"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Kthehu
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="max-w-lg mx-auto">
          {!gameType && renderGameSelection()}
          {gameType && !gameState.gameComplete && renderGame()}
          {gameState.gameComplete && renderGameComplete()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
