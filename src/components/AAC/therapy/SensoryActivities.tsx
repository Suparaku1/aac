import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Ear,
  Eye,
  Hand,
  Music,
  Palette,
  Sparkles,
  Volume2,
  RotateCcw,
  Trophy,
  Star
} from "lucide-react";

interface SensoryActivitiesProps {
  onSpeak: (text: string) => void;
}

type ActivityType = "sounds" | "colors" | "textures" | "patterns" | null;

const soundCategories = [
  { name: "Kafshë", sounds: [
    { emoji: "🐱", name: "Mace", sound: "Miau miau" },
    { emoji: "🐕", name: "Qen", sound: "Ham ham" },
    { emoji: "🐄", name: "Lopë", sound: "Mu mu" },
    { emoji: "🐓", name: "Gjel", sound: "Kikiriki" },
    { emoji: "🐸", name: "Bretkosë", sound: "Kua kua" },
    { emoji: "🦁", name: "Luan", sound: "Rrrr" },
  ]},
  { name: "Mjedis", sounds: [
    { emoji: "🌧️", name: "Shi", sound: "Shhh shhh" },
    { emoji: "⚡", name: "Bubullimë", sound: "Bum bum" },
    { emoji: "🌊", name: "Det", sound: "Shhhh" },
    { emoji: "🍃", name: "Erë", sound: "Fuuuu" },
  ]},
  { name: "Muzikë", sounds: [
    { emoji: "🥁", name: "Daulle", sound: "Tum tum tum" },
    { emoji: "🔔", name: "Zile", sound: "Ding dong" },
    { emoji: "🎺", name: "Bori", sound: "Ta ta ta" },
    { emoji: "🎸", name: "Kitarë", sound: "Ting ting" },
  ]},
];

const colorGames = [
  { colors: ["🔴", "🟢", "🔵"], target: "🔴", name: "e kuqe" },
  { colors: ["🟡", "🟣", "🟠"], target: "🟡", name: "e verdhë" },
  { colors: ["🟢", "🔵", "🟤"], target: "🟢", name: "e gjelbër" },
  { colors: ["🔵", "🟣", "🟠"], target: "🔵", name: "blu" },
  { colors: ["🟣", "🟤", "🔴"], target: "🟣", name: "vjollcë" },
];

const textureCards = [
  { emoji: "🧸", name: "E butë", description: "Si arusha" },
  { emoji: "🪨", name: "E fortë", description: "Si guri" },
  { emoji: "🧊", name: "E ftohtë", description: "Si akulli" },
  { emoji: "☀️", name: "E ngrohtë", description: "Si dielli" },
  { emoji: "🌊", name: "E lagur", description: "Si uji" },
  { emoji: "🏜️", name: "E thatë", description: "Si rëra" },
  { emoji: "🦔", name: "E ashpër", description: "Si iriq" },
  { emoji: "🥚", name: "E lëmuar", description: "Si veza" },
];

const patternSequences = [
  { pattern: ["🔴", "🔵", "🔴", "🔵"], next: "🔴" },
  { pattern: ["⭐", "⭐", "🌙", "⭐", "⭐"], next: "🌙" },
  { pattern: ["🍎", "🍊", "🍋", "🍎", "🍊"], next: "🍋" },
  { pattern: ["▲", "▲", "●", "▲", "▲"], next: "●" },
  { pattern: ["🐱", "🐕", "🐱", "🐕", "🐱"], next: "🐕" },
];

export const SensoryActivities: React.FC<SensoryActivitiesProps> = ({ onSpeak }) => {
  const [activeActivity, setActiveActivity] = useState<ActivityType>(null);
  const [stats, setStats] = useLocalStorage("sensory-stats", {
    sounds: 0,
    colors: 0,
    textures: 0,
    patterns: 0,
  });

  // Sound activity state
  const [selectedCategory, setSelectedCategory] = useState(0);

  // Color activity state
  const [currentColor, setCurrentColor] = useState(0);
  const [colorScore, setColorScore] = useState(0);

  // Texture activity state
  const [matchedTextures, setMatchedTextures] = useState<string[]>([]);

  // Pattern activity state
  const [currentPattern, setCurrentPattern] = useState(0);
  const [patternScore, setPatternScore] = useState(0);

  const [showCelebration, setShowCelebration] = useState(false);

  const handleStartActivity = (activity: ActivityType) => {
    setActiveActivity(activity);
    switch (activity) {
      case "sounds":
        setSelectedCategory(0);
        onSpeak("Dëgjo tingujt! Kliko çdo objekt për të dëgjuar zërin e tij.");
        break;
      case "colors":
        setCurrentColor(0);
        setColorScore(0);
        onSpeak(`Gjej ngjyrën ${colorGames[0].name}!`);
        break;
      case "textures":
        setMatchedTextures([]);
        onSpeak("Eksploro teksturat! Kliko për të mësuar.");
        break;
      case "patterns":
        setCurrentPattern(0);
        setPatternScore(0);
        onSpeak("Plotëso sekuencën! Cili vjen pas?");
        break;
    }
  };

  const handleSoundClick = (sound: typeof soundCategories[0]["sounds"][0]) => {
    onSpeak(`${sound.name}. ${sound.sound}`);
  };

  const handleColorClick = (color: string) => {
    const game = colorGames[currentColor];
    if (color === game.target) {
      onSpeak("Saktë! Bravo!");
      setColorScore(prev => prev + 1);
      
      if (currentColor + 1 < colorGames.length) {
        setTimeout(() => {
          setCurrentColor(prev => prev + 1);
          onSpeak(`Gjej ngjyrën ${colorGames[currentColor + 1].name}!`);
        }, 1000);
      } else {
        setStats(prev => ({ ...prev, colors: prev.colors + 1 }));
        setShowCelebration(true);
        onSpeak("Urime! Të gjitha ngjyrat u gjetën!");
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } else {
      onSpeak("Provo përsëri!");
    }
  };

  const handleTextureClick = (texture: typeof textureCards[0]) => {
    onSpeak(`${texture.name}. ${texture.description}`);
    if (!matchedTextures.includes(texture.emoji)) {
      setMatchedTextures(prev => [...prev, texture.emoji]);
      
      if (matchedTextures.length + 1 === textureCards.length) {
        setStats(prev => ({ ...prev, textures: prev.textures + 1 }));
        setShowCelebration(true);
        onSpeak("Urime! Të gjitha teksturat u eksploruan!");
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  };

  const handlePatternAnswer = (answer: string) => {
    const pattern = patternSequences[currentPattern];
    if (answer === pattern.next) {
      onSpeak("Saktë!");
      setPatternScore(prev => prev + 1);
      
      if (currentPattern + 1 < patternSequences.length) {
        setTimeout(() => {
          setCurrentPattern(prev => prev + 1);
          onSpeak("Cili vjen pas?");
        }, 1000);
      } else {
        setStats(prev => ({ ...prev, patterns: prev.patterns + 1 }));
        setShowCelebration(true);
        onSpeak("Urime! Të gjitha sekuencat u plotësuan!");
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } else {
      onSpeak("Provo përsëri!");
    }
  };

  const activities = [
    { id: "sounds", name: "Tinguj & Zëra", description: "Dëgjo dhe njihu me tingujt", icon: Ear, color: "from-blue-400 to-cyan-400", score: stats.sounds },
    { id: "colors", name: "Ngjyra", description: "Mëso dhe gjej ngjyrat", icon: Palette, color: "from-pink-400 to-rose-400", score: stats.colors },
    { id: "textures", name: "Tekstura", description: "Eksploro ndjesitë", icon: Hand, color: "from-amber-400 to-orange-400", score: stats.textures },
    { id: "patterns", name: "Sekuenca", description: "Gjej çfarë vjen pas", icon: Sparkles, color: "from-violet-400 to-purple-400", score: stats.patterns },
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

        {activeActivity === "sounds" && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {soundCategories.map((cat, i) => (
                <Button
                  key={cat.name}
                  variant={selectedCategory === i ? "default" : "outline"}
                  onClick={() => setSelectedCategory(i)}
                  className="shrink-0"
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {soundCategories[selectedCategory].sounds.map((sound) => (
                <button
                  key={sound.emoji}
                  onClick={() => handleSoundClick(sound)}
                  className="p-4 rounded-2xl bg-card border-2 hover:border-primary shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-2">{sound.emoji}</div>
                  <div className="text-sm font-medium">{sound.name}</div>
                  <Volume2 className="w-4 h-4 mx-auto mt-2 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeActivity === "colors" && (
          <div className="space-y-6">
            <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <p className="text-lg mb-2">
                Gjej ngjyrën <strong>{colorGames[currentColor].name}</strong>!
              </p>
              <p className="text-sm text-muted-foreground">
                {currentColor + 1}/{colorGames.length}
              </p>
            </Card>

            <div className="flex justify-center gap-6">
              {colorGames[currentColor].colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => handleColorClick(color)}
                  className="text-7xl hover:scale-125 transition-transform active:scale-90"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeActivity === "textures" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {textureCards.map((texture) => (
              <button
                key={texture.emoji}
                onClick={() => handleTextureClick(texture)}
                className={`
                  p-4 rounded-2xl border-2 shadow-lg transition-all hover:scale-105
                  ${matchedTextures.includes(texture.emoji)
                    ? "bg-green-100 border-green-400"
                    : "bg-card hover:border-primary"
                  }
                `}
              >
                <div className="text-4xl mb-2">{texture.emoji}</div>
                <div className="font-bold text-sm">{texture.name}</div>
                <div className="text-xs text-muted-foreground">{texture.description}</div>
              </button>
            ))}
          </div>
        )}

        {activeActivity === "patterns" && (
          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                {currentPattern + 1}/{patternSequences.length}
              </p>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {patternSequences[currentPattern].pattern.map((item, i) => (
                  <span key={i} className="text-4xl">{item}</span>
                ))}
                <span className="text-4xl">❓</span>
              </div>

              <p className="text-center font-bold mb-4">Cili vjen pas?</p>

              <div className="flex justify-center gap-4">
                {[...new Set([patternSequences[currentPattern].next, ...patternSequences[currentPattern].pattern])].slice(0, 3).sort(() => Math.random() - 0.5).map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handlePatternAnswer(option)}
                    className="text-5xl p-4 rounded-xl bg-card border-2 hover:border-primary hover:scale-110 transition-all shadow-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Card>
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
          <div className="font-bold">Aktivitete Sensorike</div>
          <div className="text-sm text-muted-foreground">
            Total: {stats.sounds + stats.colors + stats.textures + stats.patterns} aktivitete
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
