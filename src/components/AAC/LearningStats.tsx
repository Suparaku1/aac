import React, { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Trophy,
  Target,
  Flame,
  Star,
  TrendingUp,
} from "lucide-react";
import { LearningScore } from "@/types/aac";
import { aacSymbols, categories } from "@/data/aacSymbols";
import { cn } from "@/lib/utils";

interface LearningStatsProps {
  isOpen: boolean;
  onClose: () => void;
  progress: LearningScore[];
}

export const LearningStats: React.FC<LearningStatsProps> = ({
  isOpen,
  onClose,
  progress,
}) => {
  const stats = useMemo(() => {
    const totalSymbols = aacSymbols.length;
    const learnedSymbols = progress.filter((p) => p.masteryLevel >= 3).length;
    const masteredSymbols = progress.filter((p) => p.masteryLevel >= 5).length;
    const totalAttempts = progress.reduce((sum, p) => sum + p.attemptCount, 0);
    const totalCorrect = progress.reduce((sum, p) => sum + p.correctCount, 0);
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    // Group by category
    const categoryStats = categories.map((cat) => {
      const categorySymbols = aacSymbols.filter((s) => s.category === cat.id);
      const categoryProgress = progress.filter((p) =>
        categorySymbols.some((s) => s.id === p.symbolId)
      );
      const mastered = categoryProgress.filter((p) => p.masteryLevel >= 3).length;
      return {
        ...cat,
        total: categorySymbols.length,
        mastered,
        percentage: categorySymbols.length > 0 ? Math.round((mastered / categorySymbols.length) * 100) : 0,
      };
    });

    // Symbols that need practice (lowest mastery)
    const needsPractice = progress
      .filter((p) => p.attemptCount > 0 && p.masteryLevel < 3)
      .sort((a, b) => {
        const aAccuracy = a.attemptCount > 0 ? a.correctCount / a.attemptCount : 0;
        const bAccuracy = b.attemptCount > 0 ? b.correctCount / b.attemptCount : 0;
        return aAccuracy - bAccuracy;
      })
      .slice(0, 5)
      .map((p) => {
        const symbol = aacSymbols.find((s) => s.id === p.symbolId);
        return { ...p, symbol };
      });

    // Recent activity (last 7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentActivity = progress.filter(
      (p) => p.lastPlayedAt && p.lastPlayedAt > weekAgo
    ).length;

    return {
      totalSymbols,
      learnedSymbols,
      masteredSymbols,
      accuracy,
      totalAttempts,
      categoryStats,
      needsPractice,
      recentActivity,
    };
  }, [progress]);

  const getMasteryLabel = (level: number) => {
    if (level === 0) return "Pa filluar";
    if (level < 2) return "Fillestar";
    if (level < 4) return "Në progres";
    if (level < 5) return "Mësuar";
    return "Mjeshtër";
  };

  const getMasteryColor = (level: number) => {
    if (level === 0) return "text-muted-foreground";
    if (level < 2) return "text-red-500";
    if (level < 4) return "text-yellow-500";
    if (level < 5) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="w-6 h-6 text-primary" />
            Statistikat e Mësimit
          </SheetTitle>
        </SheetHeader>

        <div className="max-w-2xl mx-auto py-6 space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200">
              <Target className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-blue-700">{stats.learnedSymbols}</p>
              <p className="text-xs text-blue-600">Simbole të mësuara</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200">
              <Trophy className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-green-700">{stats.masteredSymbols}</p>
              <p className="text-xs text-green-600">Mjeshtri e plotë</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-200">
              <Flame className="w-8 h-8 text-yellow-500 mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{stats.accuracy}%</p>
              <p className="text-xs text-yellow-600">Saktësia</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200">
              <Star className="w-8 h-8 text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-purple-700">{stats.totalAttempts}</p>
              <p className="text-xs text-purple-600">Përpjekje gjithsej</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="p-6 rounded-2xl bg-card border-2 border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Progresi i Përgjithshëm
              </h3>
              <span className="text-sm text-muted-foreground">
                {stats.learnedSymbols}/{stats.totalSymbols} simbole
              </span>
            </div>
            <Progress
              value={(stats.learnedSymbols / stats.totalSymbols) * 100}
              className="h-4"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round((stats.learnedSymbols / stats.totalSymbols) * 100)}% e simboleve janë mësuar
            </p>
          </div>

          {/* Category Progress */}
          <div className="space-y-4">
            <h3 className="font-semibold">Progresi sipas Kategorive</h3>
            <div className="grid gap-3">
              {stats.categoryStats.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="font-medium">{cat.name}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {cat.mastered}/{cat.total}
                    </span>
                  </div>
                  <Progress value={cat.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Needs Practice */}
          {stats.needsPractice.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-yellow-600 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Simbole që kërkojnë praktikë
              </h3>
              <div className="flex flex-wrap gap-3">
                {stats.needsPractice.map((item) => (
                  item.symbol && (
                    <div
                      key={item.symbolId}
                      className="flex items-center gap-2 p-3 rounded-xl bg-yellow-50 border-2 border-yellow-200"
                    >
                      <span className="text-2xl">{item.symbol.emoji}</span>
                      <div>
                        <p className="font-medium text-sm">{item.symbol.label}</p>
                        <p className={cn("text-xs", getMasteryColor(item.masteryLevel))}>
                          {getMasteryLabel(item.masteryLevel)}
                        </p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {stats.totalAttempts === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Nuk ka të dhëna ende</h3>
              <p className="text-muted-foreground">
                Luaj lojërat mësimore për të parë statistikat e progresit!
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
