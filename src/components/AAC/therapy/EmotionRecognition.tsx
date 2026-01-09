import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Heart, 
  RefreshCw,
  Trophy,
  Star,
  Sparkles
} from "lucide-react";

interface EmotionRecognitionProps {
  onSpeak: (text: string) => void;
}

type GameMode = "identify" | "match" | "story" | null;

const emotions = [
  { emoji: "😊", name: "I lumtur", description: "Kur diçka e mirë ndodh" },
  { emoji: "😢", name: "I trishtuar", description: "Kur na mungon dikush" },
  { emoji: "😠", name: "I zemëruar", description: "Kur diçka nuk shkon mirë" },
  { emoji: "😨", name: "I frikësuar", description: "Kur diçka na tremb" },
  { emoji: "😮", name: "I habitur", description: "Kur diçka e papritur ndodh" },
  { emoji: "🥰", name: "I dashur", description: "Kur ndihemi të dashur" },
  { emoji: "😴", name: "I lodhur", description: "Kur kemi nevojë për gjumë" },
  { emoji: "🤔", name: "I hutuar", description: "Kur nuk kuptojmë diçka" },
];

const emotionScenarios = [
  { scenario: "Miku yt të dha një dhuratë", correctEmotion: "😊", options: ["😊", "😢", "😠"] },
  { scenario: "Lodra jote u prish", correctEmotion: "😢", options: ["😊", "😢", "😮"] },
  { scenario: "Dikush të mori lodren pa leje", correctEmotion: "😠", options: ["😊", "😠", "😴"] },
  { scenario: "Dëgjove një zhurmë të fortë në errësirë", correctEmotion: "😨", options: ["😨", "😊", "🤔"] },
  { scenario: "Mami erdhi në shtëpi papritur", correctEmotion: "😮", options: ["😴", "😮", "😢"] },
  { scenario: "Babai të përqafoi fort", correctEmotion: "🥰", options: ["🥰", "😠", "😨"] },
  { scenario: "Luajte gjithë ditën në park", correctEmotion: "😴", options: ["😊", "😴", "😢"] },
  { scenario: "Nuk e kupton si punon loja e re", correctEmotion: "🤔", options: ["🤔", "😊", "😠"] },
];

const emotionStories = [
  {
    title: "Ana dhe Miku i Ri",
    pages: [
      { text: "Ana shkoi në shkollë", emotion: null },
      { text: "Ajo pa një fëmijë të ri në klasë", emotion: "🤔" },
      { text: "Fëmija i ri ishte vetëm", emotion: "😢" },
      { text: "Ana shkoi dhe i tha 'Përshëndetje!'", emotion: "😊" },
      { text: "Tani ata janë miq të mirë", emotion: "🥰" },
    ],
  },
  {
    title: "Dita e Shiut",
    pages: [
      { text: "Beni donte të luante jashtë", emotion: "😊" },
      { text: "Por filloi të binte shi", emotion: "😢" },
      { text: "Mami i tha 'Mund të luash brenda'", emotion: "🤔" },
      { text: "Beni bëri një kështjellë me jastëkë", emotion: "😊" },
      { text: "Ishte dita më e bukur!", emotion: "🥰" },
    ],
  },
];

export const EmotionRecognition: React.FC<EmotionRecognitionProps> = ({ onSpeak }) => {
  const [activeMode, setActiveMode] = useState<GameMode>(null);
  const [stats, setStats] = useLocalStorage("emotion-stats", { identify: 0, match: 0, story: 0 });
  
  // Identify mode state
  const [currentEmotion, setCurrentEmotion] = useState(0);
  
  // Match mode state
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Story mode state
  const [currentStory, setCurrentStory] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [storyAnswers, setStoryAnswers] = useState<boolean[]>([]);

  const [showCelebration, setShowCelebration] = useState(false);

  const handleStartMode = (mode: GameMode) => {
    setActiveMode(mode);
    switch (mode) {
      case "identify":
        setCurrentEmotion(0);
        onSpeak("Mëso emocionet! Kliko çdo emocion për të dëgjuar.");
        break;
      case "match":
        setCurrentScenario(0);
        setSelectedAnswer(null);
        setShowResult(false);
        onSpeak(emotionScenarios[0].scenario);
        break;
      case "story":
        setCurrentStory(0);
        setCurrentPage(0);
        setStoryAnswers([]);
        onSpeak(emotionStories[0].pages[0].text);
        break;
    }
  };

  const handleEmotionClick = (emotion: typeof emotions[0]) => {
    onSpeak(`${emotion.name}. ${emotion.description}`);
  };

  const handleScenarioAnswer = (emoji: string) => {
    setSelectedAnswer(emoji);
    setShowResult(true);
    
    const scenario = emotionScenarios[currentScenario];
    const isCorrect = emoji === scenario.correctEmotion;
    
    if (isCorrect) {
      onSpeak("Saktë! Bravo!");
      setTimeout(() => {
        if (currentScenario + 1 < emotionScenarios.length) {
          setCurrentScenario(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          onSpeak(emotionScenarios[currentScenario + 1].scenario);
        } else {
          setStats(prev => ({ ...prev, match: prev.match + 1 }));
          setShowCelebration(true);
          onSpeak("Urime! Të gjitha skenarët u kompletuan!");
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }, 1500);
    } else {
      onSpeak("Provo përsëri!");
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowResult(false);
      }, 1000);
    }
  };

  const handleStoryNext = (selectedEmotion?: string) => {
    const story = emotionStories[currentStory];
    const page = story.pages[currentPage];
    
    if (page.emotion && selectedEmotion) {
      const isCorrect = selectedEmotion === page.emotion;
      setStoryAnswers(prev => [...prev, isCorrect]);
      
      if (isCorrect) {
        onSpeak("Saktë!");
      } else {
        onSpeak("Emocioni i duhur ishte " + emotions.find(e => e.emoji === page.emotion)?.name);
      }
    }
    
    if (currentPage + 1 < story.pages.length) {
      setCurrentPage(prev => prev + 1);
      setTimeout(() => onSpeak(story.pages[currentPage + 1].text), 500);
    } else {
      setStats(prev => ({ ...prev, story: prev.story + 1 }));
      setShowCelebration(true);
      onSpeak("Historia përfundoi! Bravo!");
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const modes = [
    { id: "identify", name: "Mëso Emocionet", description: "Njihu me emocionet", icon: Heart, color: "from-pink-400 to-rose-400" },
    { id: "match", name: "Gjej Emocionin", description: "Lidh situatën me emocionin", icon: Sparkles, color: "from-amber-400 to-orange-400" },
    { id: "story", name: "Histori me Emocione", description: "Lexo dhe gjej emocionet", icon: Star, color: "from-violet-400 to-purple-400" },
  ];

  if (activeMode) {
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

        <Button variant="outline" onClick={() => setActiveMode(null)}>
          ← Kthehu
        </Button>

        {activeMode === "identify" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {emotions.map((emotion) => (
              <button
                key={emotion.emoji}
                onClick={() => handleEmotionClick(emotion)}
                className="p-6 rounded-2xl bg-card border-2 hover:border-primary shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center"
              >
                <div className="text-5xl mb-3">{emotion.emoji}</div>
                <div className="font-bold text-sm">{emotion.name}</div>
              </button>
            ))}
          </div>
        )}

        {activeMode === "match" && (
          <div className="space-y-6">
            <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-xl font-bold mb-2">
                Skenari {currentScenario + 1}/{emotionScenarios.length}
              </div>
              <p className="text-lg">{emotionScenarios[currentScenario].scenario}</p>
              <p className="text-muted-foreground mt-2">Si do të ndiheshe?</p>
            </Card>

            <div className="flex justify-center gap-4">
              {emotionScenarios[currentScenario].options.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => !showResult && handleScenarioAnswer(emoji)}
                  className={`
                    text-6xl p-6 rounded-2xl border-4 transition-all
                    ${showResult && emoji === emotionScenarios[currentScenario].correctEmotion
                      ? "border-green-500 bg-green-100 scale-110"
                      : showResult && emoji === selectedAnswer
                      ? "border-red-500 bg-red-100"
                      : "border-transparent hover:border-primary hover:scale-110"
                    }
                    bg-card shadow-lg
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => onSpeak(emotionScenarios[currentScenario].scenario)}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Dëgjo Përsëri
              </Button>
            </div>
          </div>
        )}

        {activeMode === "story" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">
                {emotionStories[currentStory].title}
              </h3>
              <div className="flex gap-2 justify-center mb-4">
                {emotionStories[currentStory].pages.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i === currentPage
                        ? "bg-primary"
                        : i < currentPage
                        ? "bg-green-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-lg text-center mb-6">
                {emotionStories[currentStory].pages[currentPage].text}
              </p>

              {emotionStories[currentStory].pages[currentPage].emotion ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Si ndihet personazhi?
                  </p>
                  <div className="flex justify-center gap-3">
                    {emotions.slice(0, 4).map((e) => (
                      <button
                        key={e.emoji}
                        onClick={() => handleStoryNext(e.emoji)}
                        className="text-4xl p-3 rounded-xl bg-card border-2 hover:border-primary hover:scale-110 transition-all"
                      >
                        {e.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Button onClick={() => handleStoryNext()} size="lg">
                    Vazhdo →
                  </Button>
                </div>
              )}
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
          <div className="font-bold">Emocionet e Mësuara</div>
          <div className="text-sm text-muted-foreground">
            Identifiko: {stats.identify} | Gjej: {stats.match} | Histori: {stats.story}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => handleStartMode(mode.id as GameMode)}
              className="w-full group relative p-6 rounded-2xl bg-card border-2 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] text-left overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${mode.color} group-hover:opacity-20 transition-opacity`} />
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${mode.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{mode.name}</h4>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
