import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, TrendingUp, Clock, Star, Brain, Activity, Volume2, 
  Gamepad2, Calendar, Award, Target, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface TherapyProgressReportProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModuleStats {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  sessionsCompleted: number;
  totalTime: number;
  lastActivity: string | null;
  achievements: number;
}

export const TherapyProgressReport: React.FC<TherapyProgressReportProps> = ({
  isOpen,
  onClose,
}) => {
  // Get stored data for each module
  const [cognitiveScores] = useLocalStorage<any[]>("cognitive-game-scores", []);
  const [emotionScores] = useLocalStorage<any[]>("emotion-recognition-scores", []);
  const [motorProgress] = useLocalStorage<any[]>("fine-motor-progress", []);
  const [relaxationSessions] = useLocalStorage<number>("relaxation-sessions", 0);
  const [voiceRecordings] = useLocalStorage<any[]>("voice-recordings", []);
  const [socialStories] = useLocalStorage<string[]>("completed-social-stories", []);
  const [scheduleItems] = useLocalStorage<any[]>("visual-schedule", []);
  const [totalStars] = useLocalStorage<number>("reward-total-stars", 0);

  const moduleStats = useMemo<ModuleStats[]>(() => [
    {
      id: "cognitive",
      name: "Lojëra Kognitive",
      icon: Brain,
      color: "from-indigo-400 to-blue-400",
      sessionsCompleted: cognitiveScores.length,
      totalTime: cognitiveScores.length * 5,
      lastActivity: cognitiveScores.length > 0 ? "Sot" : null,
      achievements: Math.floor(cognitiveScores.length / 3),
    },
    {
      id: "emotions",
      name: "Njohja e Emocioneve",
      icon: Star,
      color: "from-rose-400 to-pink-400",
      sessionsCompleted: emotionScores.length,
      totalTime: emotionScores.length * 4,
      lastActivity: emotionScores.length > 0 ? "Sot" : null,
      achievements: Math.floor(emotionScores.length / 5),
    },
    {
      id: "motor",
      name: "Motorika Fine",
      icon: Activity,
      color: "from-orange-400 to-amber-400",
      sessionsCompleted: motorProgress.length,
      totalTime: motorProgress.length * 3,
      lastActivity: motorProgress.length > 0 ? "Sot" : null,
      achievements: Math.floor(motorProgress.length / 4),
    },
    {
      id: "relaxation",
      name: "Ushtrime Relaksimi",
      icon: Clock,
      color: "from-sky-400 to-cyan-400",
      sessionsCompleted: relaxationSessions,
      totalTime: relaxationSessions * 8,
      lastActivity: relaxationSessions > 0 ? "Sot" : null,
      achievements: Math.floor(relaxationSessions / 5),
    },
    {
      id: "voice",
      name: "Praktiko Zërin",
      icon: Volume2,
      color: "from-fuchsia-400 to-pink-400",
      sessionsCompleted: voiceRecordings.length,
      totalTime: voiceRecordings.length * 2,
      lastActivity: voiceRecordings.length > 0 ? "Sot" : null,
      achievements: Math.floor(voiceRecordings.length / 10),
    },
    {
      id: "stories",
      name: "Histori Sociale",
      icon: Calendar,
      color: "from-violet-400 to-purple-400",
      sessionsCompleted: socialStories.length,
      totalTime: socialStories.length * 6,
      lastActivity: socialStories.length > 0 ? "Sot" : null,
      achievements: Math.floor(socialStories.length / 2),
    },
  ], [cognitiveScores, emotionScores, motorProgress, relaxationSessions, voiceRecordings, socialStories]);

  const totalStats = useMemo(() => ({
    totalSessions: moduleStats.reduce((sum, m) => sum + m.sessionsCompleted, 0),
    totalMinutes: moduleStats.reduce((sum, m) => sum + m.totalTime, 0),
    totalAchievements: moduleStats.reduce((sum, m) => sum + m.achievements, 0) + Math.floor(totalStars / 10),
    activeModules: moduleStats.filter(m => m.sessionsCompleted > 0).length,
  }), [moduleStats, totalStars]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
              <BarChart3 className="w-7 h-7 text-primary" />
            </div>
            Raporti i Progresit
            <Sparkles className="w-5 h-5 text-amber-400 ml-auto animate-pulse" />
          </SheetTitle>
        </SheetHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Overview Stats */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Përmbledhje e Përgjithshme
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-3xl font-bold text-primary">{totalStats.totalSessions}</div>
                <div className="text-sm text-muted-foreground">Seanca totale</div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="text-3xl font-bold text-secondary">{totalStats.totalMinutes}</div>
                <div className="text-sm text-muted-foreground">Minuta totale</div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-amber-400/10 to-amber-400/5">
                <div className="text-3xl font-bold text-amber-500">{totalStats.totalAchievements}</div>
                <div className="text-sm text-muted-foreground">Arritje</div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-emerald-400/10 to-emerald-400/5">
                <div className="text-3xl font-bold text-emerald-500">{totalStats.activeModules}/6</div>
                <div className="text-sm text-muted-foreground">Module aktive</div>
              </Card>
            </div>
          </motion.div>

          {/* Stars Collected */}
          <motion.div variants={itemVariants}>
            <Card className="p-4 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30">
              <div className="flex items-center gap-3">
                <div className="text-4xl">⭐</div>
                <div>
                  <div className="text-2xl font-bold text-amber-600">{totalStars} Yje</div>
                  <div className="text-sm text-amber-700/70">Të mbledhura gjithsej</div>
                </div>
                <Award className="w-10 h-10 text-amber-400 ml-auto" />
              </div>
            </Card>
          </motion.div>

          {/* Module Progress */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Progresi i Moduleve
            </h3>
            <div className="space-y-3">
              {moduleStats.map((module, index) => {
                const Icon = module.icon;
                const progressPercent = Math.min((module.sessionsCompleted / 20) * 100, 100);
                
                return (
                  <motion.div
                    key={module.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${module.color}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{module.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {module.sessionsCompleted} seanca
                            </span>
                          </div>
                          <Progress value={progressPercent} className="h-2 mb-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{module.totalTime} min totale</span>
                            {module.achievements > 0 && (
                              <span className="flex items-center gap-1">
                                <Award className="w-3 h-3 text-amber-400" />
                                {module.achievements} arritje
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Encouragement */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 text-center">
              <div className="text-4xl mb-3">🌟</div>
              <p className="text-lg font-medium text-primary">
                {totalStats.totalSessions === 0 
                  ? "Fillo aventurën tënde mësimore!"
                  : totalStats.totalSessions < 10
                  ? "Po bën progres të shkëlqyer!"
                  : "Je një yll i vërtetë! Vazhdo kështu!"}
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};
