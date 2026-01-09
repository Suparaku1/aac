import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  ChevronLeft,
  ChevronRight,
  Volume2,
  Heart,
  Star,
  Sparkles,
  Home
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SocialStoriesProps {
  onSpeak: (text: string) => void;
}

interface StoryPage {
  emoji: string;
  text: string;
}

interface Story {
  id: string;
  title: string;
  emoji: string;
  category: string;
  pages: StoryPage[];
}

const socialStories: Story[] = [
  {
    id: "waiting",
    title: "Të Presësh",
    emoji: "⏰",
    category: "Emocione",
    pages: [
      { emoji: "🧒", text: "Ndonjëherë duhet të pres." },
      { emoji: "😤", text: "Kur pres, mund të ndihem i mërzitur." },
      { emoji: "🧘", text: "Kjo është normale. Mund të marr frymë thellë." },
      { emoji: "🎮", text: "Mund të mendoj për diçka të bukur ndërsa pres." },
      { emoji: "😊", text: "Kur pres me durim, të rriturit janë krenarë për mua." },
      { emoji: "⭐", text: "Unë jam trim që di të pres!" },
    ]
  },
  {
    id: "sharing",
    title: "Të Ndash",
    emoji: "🤝",
    category: "Sociale",
    pages: [
      { emoji: "🧸", text: "Kam shumë lodra të bukura." },
      { emoji: "👫", text: "Kur luaj me shokët, ata duan të luajnë me lodrat e mia." },
      { emoji: "💝", text: "Kur ndaj, shokët e mi janë të lumtur." },
      { emoji: "😊", text: "Edhe unë ndihem mirë kur ndaj." },
      { emoji: "🎉", text: "Të ndash do të thotë të jesh mik i mirë!" },
      { emoji: "⭐", text: "Unë di të ndaj!" },
    ]
  },
  {
    id: "angry",
    title: "Kur Jam i Zemëruar",
    emoji: "😠",
    category: "Emocione",
    pages: [
      { emoji: "😡", text: "Ndonjëherë ndihem i zemëruar." },
      { emoji: "🌋", text: "Zemërimi ndihet si një vullkan brenda." },
      { emoji: "🛑", text: "Kur jam i zemëruar, ndalehem." },
      { emoji: "🌬️", text: "Marr frymë thellë: 1... 2... 3..." },
      { emoji: "🗣️", text: "Them si ndihem me fjalë, jo me goditje." },
      { emoji: "💚", text: "Zemërimi kalon. Unë jam i fortë!" },
    ]
  },
  {
    id: "dentist",
    title: "Vizita te Dentisti",
    emoji: "🦷",
    category: "Rutinë",
    pages: [
      { emoji: "🏥", text: "Sot shkoj te dentisti." },
      { emoji: "🪥", text: "Dentisti më ndihmon të kam dhëmbë të shëndetshëm." },
      { emoji: "🛋️", text: "Do të ulem në një karrige të veçantë." },
      { emoji: "👀", text: "Dentisti do të shikojë dhëmbët e mi." },
      { emoji: "😬", text: "Mund të ndihem pak i frikësuar, kjo është normale." },
      { emoji: "⭐", text: "Jam trim! Dentisti më ndihmon!" },
    ]
  },
  {
    id: "goodbye",
    title: "Kur Mama/Baba Largohet",
    emoji: "👋",
    category: "Emocione",
    pages: [
      { emoji: "👨‍👩‍👧", text: "Dua shumë mamanë dhe babanë." },
      { emoji: "🚗", text: "Ndonjëherë ata duhet të shkojnë në punë." },
      { emoji: "😢", text: "Ndihem i trishtuar kur largohen." },
      { emoji: "💝", text: "Por ata më duan shumë." },
      { emoji: "🕐", text: "Ata gjithmonë kthehen!" },
      { emoji: "🤗", text: "Kur kthehen, përqafohemi!" },
    ]
  },
  {
    id: "friends",
    title: "Si të Bëj Shokë",
    emoji: "👫",
    category: "Sociale",
    pages: [
      { emoji: "👋", text: "Për të bërë shokë, filloj me 'Përshëndetje!'" },
      { emoji: "😊", text: "Buzëqesh kur flas me të tjerët." },
      { emoji: "👂", text: "Dëgjoj kur shoku flet." },
      { emoji: "🎮", text: "Pyes: 'A do të luash me mua?'" },
      { emoji: "🤝", text: "Ndaj lodrat dhe luaj së bashku." },
      { emoji: "💛", text: "Shokët e bëjnë ditën më të bukur!" },
    ]
  },
];

const storyCategories = ["Të gjitha", "Emocione", "Sociale", "Rutinë"];

export const SocialStories: React.FC<SocialStoriesProps> = ({ onSpeak }) => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Të gjitha");
  const [completedStories, setCompletedStories] = useLocalStorage<string[]>("therapy-completed-stories", []);

  const filteredStories = selectedCategory === "Të gjitha"
    ? socialStories
    : socialStories.filter(s => s.category === selectedCategory);

  const handleStartStory = (story: Story) => {
    setActiveStory(story);
    setCurrentPage(0);
    onSpeak(`${story.title}. ${story.pages[0].text}`);
  };

  const handleNextPage = () => {
    if (!activeStory) return;
    
    if (currentPage < activeStory.pages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      onSpeak(activeStory.pages[nextPage].text);
    } else {
      // Story complete
      if (!completedStories.includes(activeStory.id)) {
        setCompletedStories([...completedStories, activeStory.id]);
      }
      onSpeak("Bravo! E përfundove historinë!");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      if (activeStory) {
        onSpeak(activeStory.pages[prevPage].text);
      }
    }
  };

  const handleBackToList = () => {
    setActiveStory(null);
    setCurrentPage(0);
  };

  const handleRepeatPage = () => {
    if (activeStory) {
      onSpeak(activeStory.pages[currentPage].text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Story */}
      {activeStory ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBackToList}>
              <Home className="w-5 h-5 mr-2" />
              Kthehu
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeStory.emoji}</span>
              <span className="font-bold">{activeStory.title}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {currentPage + 1} / {activeStory.pages.length}
            </div>
          </div>

          {/* Story Page */}
          <Card className="p-8 bg-gradient-to-br from-card to-primary/5 min-h-[300px] flex flex-col items-center justify-center text-center">
            <div className="text-9xl mb-6 animate-bounce-in">
              {activeStory.pages[currentPage].emoji}
            </div>
            <p className="text-2xl font-medium leading-relaxed max-w-md">
              {activeStory.pages[currentPage].text}
            </p>
          </Card>

          {/* Page Progress */}
          <div className="flex justify-center gap-2">
            {activeStory.pages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage 
                    ? "bg-primary scale-125" 
                    : index < currentPage 
                      ? "bg-primary/50" 
                      : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              size="lg"
              variant="outline"
              className="w-24"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleRepeatPage}
              size="lg"
              variant="outline"
              className="w-24"
            >
              <Volume2 className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleNextPage}
              size="lg"
              className="w-24 bg-gradient-to-r from-violet-400 to-purple-400"
            >
              {currentPage === activeStory.pages.length - 1 ? (
                <Star className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <Card className="p-4 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-400 to-purple-400">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Histori të Lexuara</p>
                  <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                    {completedStories.length} / {socialStories.length}
                  </p>
                </div>
              </div>
              {completedStories.length === socialStories.length && (
                <div className="flex items-center gap-2 text-amber-500">
                  <Star className="w-6 h-6 fill-current" />
                  <span className="font-bold">Kampion!</span>
                </div>
              )}
            </div>
          </Card>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {storyCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-gradient-to-r from-violet-400 to-purple-400" 
                  : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Story Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStories.map((story) => {
              const isCompleted = completedStories.includes(story.id);
              return (
                <Card
                  key={story.id}
                  className={`p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${
                    isCompleted 
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200" 
                      : "hover:bg-primary/5"
                  }`}
                  onClick={() => handleStartStory(story)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{story.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{story.title}</h3>
                        {isCompleted && (
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {story.category} • {story.pages.length} faqe
                      </p>
                      <div className="flex gap-1 mt-2">
                        {story.pages.slice(0, 5).map((page, i) => (
                          <span key={i} className="text-lg">{page.emoji}</span>
                        ))}
                        {story.pages.length > 5 && (
                          <span className="text-muted-foreground">...</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Encouragement */}
          <Card className="p-4 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-pink-500" />
              <div>
                <p className="font-bold">Historitë Sociale ndihmojnë!</p>
                <p className="text-sm text-muted-foreground">
                  Lexoji shpesh për të kuptuar situata të ndryshme
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-pink-400 ml-auto animate-pulse" />
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
