import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Star, Activity, Wind, Mic, BookOpen, Heart, Sparkles, ArrowLeft,
  Brain, Hand, Ear, Gamepad2, Volume2
} from "lucide-react";
import { VisualSchedule } from "./therapy/VisualSchedule";
import { RewardSystem } from "./therapy/RewardSystem";
import { MovementGames } from "./therapy/MovementGames";
import { RelaxationExercises } from "./therapy/RelaxationExercises";
import { VoiceRecording } from "./therapy/VoiceRecording";
import { SocialStories } from "./therapy/SocialStories";
import { CognitiveGames } from "./therapy/CognitiveGames";
import { EmotionRecognition } from "./therapy/EmotionRecognition";
import { FineMotorSkills } from "./therapy/FineMotorSkills";
import { SensoryActivities } from "./therapy/SensoryActivities";
import { ArticulationExercises } from "./therapy/ArticulationExercises";
import { SpecialGames } from "./therapy/SpecialGames";

interface TherapyHubProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

type TherapyModule = 
  | "schedule" | "rewards" | "movement" | "relaxation" | "voice" | "stories"
  | "cognitive" | "emotions" | "finemotor" | "sensory" | "articulation" | "specialgames"
  | null;

const modules = [
  { id: "cognitive" as const, name: "Lojëra Kognitive", description: "Kujtesa, renditja, sekuencat", icon: Brain, color: "from-indigo-400 to-blue-400", category: "Terapi Zhvillimi" },
  { id: "emotions" as const, name: "Njohja e Emocioneve", description: "Mëso të kuptosh ndjenjat", icon: Heart, color: "from-rose-400 to-pink-400", category: "Terapi Zhvillimi" },
  { id: "schedule" as const, name: "Orari Vizual", description: "Rutina dhe orare me imazhe", icon: Calendar, color: "from-pink-400 to-rose-400", category: "Terapi Zhvillimi" },
  { id: "rewards" as const, name: "Sistemi i Shpërblimeve", description: "Yje dhe çmime motivuese", icon: Star, color: "from-amber-400 to-orange-400", category: "Terapi Zhvillimi" },
  { id: "stories" as const, name: "Histori Sociale", description: "Mëso situata sociale", icon: BookOpen, color: "from-violet-400 to-purple-400", category: "Terapi Zhvillimi" },
  { id: "movement" as const, name: "Lojëra Lëvizjeje", description: "Ushtrime psikomotrike", icon: Activity, color: "from-emerald-400 to-teal-400", category: "Psikomotricitet" },
  { id: "relaxation" as const, name: "Ushtrime Relaksimi", description: "Frymëmarrje dhe qetësim", icon: Wind, color: "from-sky-400 to-cyan-400", category: "Psikomotricitet" },
  { id: "finemotor" as const, name: "Motorika Fine", description: "Aftësi të gishtave", icon: Hand, color: "from-orange-400 to-amber-400", category: "Psikomotricitet" },
  { id: "sensory" as const, name: "Aktivitete Sensorike", description: "Tinguj, ngjyra, tekstura", icon: Ear, color: "from-cyan-400 to-blue-400", category: "Psikomotricitet" },
  { id: "voice" as const, name: "Praktiko Zërin", description: "Regjistro dhe dëgjo", icon: Mic, color: "from-fuchsia-400 to-pink-400", category: "Logopedi" },
  { id: "articulation" as const, name: "Ushtrime Artikulimi", description: "Tinguj, rrokje, fjalë", icon: Volume2, color: "from-purple-400 to-violet-400", category: "Logopedi" },
  { id: "specialgames" as const, name: "Lojëra të Veçanta", description: "Për fëmijë me autizëm", icon: Gamepad2, color: "from-teal-400 to-green-400", category: "Lojëra Speciale" },
];

export const TherapyHub: React.FC<TherapyHubProps> = ({
  isOpen,
  onClose,
  onSpeak,
}) => {
  const [activeModule, setActiveModule] = useState<TherapyModule>(null);

  const handleBack = () => {
    setActiveModule(null);
  };

  const handleClose = () => {
    setActiveModule(null);
    onClose();
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case "schedule": return <VisualSchedule onSpeak={onSpeak} />;
      case "rewards": return <RewardSystem onSpeak={onSpeak} />;
      case "movement": return <MovementGames onSpeak={onSpeak} />;
      case "relaxation": return <RelaxationExercises onSpeak={onSpeak} />;
      case "voice": return <VoiceRecording onSpeak={onSpeak} />;
      case "stories": return <SocialStories onSpeak={onSpeak} />;
      case "cognitive": return <CognitiveGames onSpeak={onSpeak} />;
      case "emotions": return <EmotionRecognition onSpeak={onSpeak} />;
      case "finemotor": return <FineMotorSkills onSpeak={onSpeak} />;
      case "sensory": return <SensoryActivities onSpeak={onSpeak} />;
      case "articulation": return <ArticulationExercises onSpeak={onSpeak} />;
      case "specialgames": return <SpecialGames onSpeak={onSpeak} />;
      default: return null;
    }
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof modules>);

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[92vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-3 text-2xl">
            {activeModule ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mr-2 hover:bg-primary/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            ) : (
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <Sparkles className="w-7 h-7 text-primary animate-pulse" />
              </div>
            )}
            {activeModule 
              ? modules.find(m => m.id === activeModule)?.name 
              : "Qendra Terapeutike"
            }
            <Heart className="w-5 h-5 text-pink-400 animate-pulse ml-auto" />
          </SheetTitle>
        </SheetHeader>

        {activeModule ? (
          <div className="mt-4">
            {renderModuleContent()}
          </div>
        ) : (
          <div className="space-y-8 pb-8">
            {Object.entries(groupedModules).map(([category, categoryModules]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryModules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <button
                        key={module.id}
                        onClick={() => setActiveModule(module.id)}
                        className="group relative p-6 rounded-2xl bg-gradient-to-br from-card to-card/80 border-2 border-transparent hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden"
                      >
                        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${module.color} group-hover:opacity-20 transition-opacity`} />
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${module.color} shadow-lg mb-4`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-foreground mb-2">
                          {module.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {module.description}
                        </p>
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
