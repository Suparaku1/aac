import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Mic, 
  Volume2, 
  RotateCcw,
  Trophy,
  Star,
  ChevronRight,
  Check
} from "lucide-react";

interface ArticulationExercisesProps {
  onSpeak: (text: string) => void;
}

type ExerciseType = "sounds" | "syllables" | "words" | "sentences" | null;

const soundExercises = [
  { 
    sound: "A", 
    mouth: "👄", 
    tip: "Hap gojën gjerë si të thuash 'ah'",
    words: ["Ana", "Ari", "Arë", "Akull"],
  },
  { 
    sound: "E", 
    mouth: "😊", 
    tip: "Buzët pak të hapura, si buzëqeshje",
    words: ["Era", "Eni", "Elef", "Erë"],
  },
  { 
    sound: "I", 
    mouth: "😁", 
    tip: "Buzëqesh gjerë, dhëmbët afër",
    words: ["Ili", "Ira", "Iriq", "Imza"],
  },
  { 
    sound: "O", 
    mouth: "😮", 
    tip: "Bëj buzët rrumbullak",
    words: ["Ora", "Oda", "Ombrellë", "Okean"],
  },
  { 
    sound: "U", 
    mouth: "😗", 
    tip: "Buzët përpara si të frysh",
    words: ["Uja", "Ura", "Ujk", "Ulliri"],
  },
  { 
    sound: "M", 
    mouth: "😶", 
    tip: "Mbyll buzët dhe bëj 'mmm'",
    words: ["Mama", "Mace", "Mollë", "Mik"],
  },
  { 
    sound: "B", 
    mouth: "💋", 
    tip: "Mbyll buzët dhe hapi shpejt me zë",
    words: ["Baba", "Ball", "Bukë", "Buzë"],
  },
  { 
    sound: "P", 
    mouth: "💨", 
    tip: "Mbyll buzët dhe hapi me frymë",
    words: ["Papa", "Pulë", "Pemë", "Peshk"],
  },
];

const syllableExercises = [
  { syllables: ["ma", "me", "mi", "mo", "mu"], word: "Mama" },
  { syllables: ["ba", "be", "bi", "bo", "bu"], word: "Baba" },
  { syllables: ["pa", "pe", "pi", "po", "pu"], word: "Papa" },
  { syllables: ["ta", "te", "ti", "to", "tu"], word: "Tata" },
  { syllables: ["da", "de", "di", "do", "du"], word: "Dada" },
  { syllables: ["na", "ne", "ni", "no", "nu"], word: "Nana" },
  { syllables: ["la", "le", "li", "lo", "lu"], word: "Lala" },
  { syllables: ["ra", "re", "ri", "ro", "ru"], word: "Rara" },
];

const wordPractice = [
  { category: "Familja", words: [
    { word: "Mama", emoji: "👩" },
    { word: "Baba", emoji: "👨" },
    { word: "Vëlla", emoji: "👦" },
    { word: "Motër", emoji: "👧" },
    { word: "Gjysh", emoji: "👴" },
    { word: "Gjyshe", emoji: "👵" },
  ]},
  { category: "Kafshë", words: [
    { word: "Mace", emoji: "🐱" },
    { word: "Qen", emoji: "🐕" },
    { word: "Zog", emoji: "🐦" },
    { word: "Peshk", emoji: "🐟" },
    { word: "Lopë", emoji: "🐄" },
    { word: "Pulë", emoji: "🐔" },
  ]},
  { category: "Ushqim", words: [
    { word: "Mollë", emoji: "🍎" },
    { word: "Bukë", emoji: "🍞" },
    { word: "Qumësht", emoji: "🥛" },
    { word: "Ujë", emoji: "💧" },
    { word: "Vezë", emoji: "🥚" },
    { word: "Supë", emoji: "🍲" },
  ]},
];

const sentencePractice = [
  { sentence: "Unë dua mama", level: 1 },
  { sentence: "Macja është e bukur", level: 1 },
  { sentence: "Dua të luaj", level: 1 },
  { sentence: "Kam uri, dua bukë", level: 2 },
  { sentence: "Mami, ku është babi?", level: 2 },
  { sentence: "Dua të shkoj në park", level: 2 },
  { sentence: "A mund të më ndihmosh?", level: 3 },
  { sentence: "Sot është ditë e bukur", level: 3 },
];

export const ArticulationExercises: React.FC<ArticulationExercisesProps> = ({ onSpeak }) => {
  const [activeExercise, setActiveExercise] = useState<ExerciseType>(null);
  const [stats, setStats] = useLocalStorage("articulation-stats", {
    sounds: 0,
    syllables: 0,
    words: 0,
    sentences: 0,
  });

  // Sounds state
  const [currentSound, setCurrentSound] = useState(0);
  const [practicedWords, setPracticedWords] = useState<string[]>([]);

  // Syllables state
  const [currentSyllable, setCurrentSyllable] = useState(0);
  const [practicedSyllables, setPracticedSyllables] = useState<string[]>([]);

  // Words state
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [practicedWordsList, setPracticedWordsList] = useState<string[]>([]);

  // Sentences state
  const [currentSentence, setCurrentSentence] = useState(0);
  const [practicedSentences, setPracticedSentences] = useState<number[]>([]);

  const [showCelebration, setShowCelebration] = useState(false);

  const handleStartExercise = (exercise: ExerciseType) => {
    setActiveExercise(exercise);
    switch (exercise) {
      case "sounds":
        setCurrentSound(0);
        setPracticedWords([]);
        onSpeak("Le të praktikojmë tingujt! Dëgjo dhe përsërit.");
        break;
      case "syllables":
        setCurrentSyllable(0);
        setPracticedSyllables([]);
        onSpeak("Praktiko rrokjet! Ma, me, mi, mo, mu.");
        break;
      case "words":
        setSelectedCategory(0);
        setPracticedWordsList([]);
        onSpeak("Mëso fjalë të reja! Kliko për të dëgjuar.");
        break;
      case "sentences":
        setCurrentSentence(0);
        setPracticedSentences([]);
        onSpeak("Praktiko fjalitë! Dëgjo dhe përsërit.");
        break;
    }
  };

  const handleSoundPractice = (word: string) => {
    onSpeak(word);
    if (!practicedWords.includes(word)) {
      setPracticedWords(prev => [...prev, word]);
      
      const allWords = soundExercises.flatMap(s => s.words);
      if (practicedWords.length + 1 >= allWords.length / 2) {
        setStats(prev => ({ ...prev, sounds: prev.sounds + 1 }));
      }
    }
  };

  const handleSyllablePractice = (syllable: string) => {
    onSpeak(syllable);
    if (!practicedSyllables.includes(syllable)) {
      setPracticedSyllables(prev => [...prev, syllable]);
      
      const allSyllables = syllableExercises.flatMap(s => s.syllables);
      if (practicedSyllables.length + 1 >= allSyllables.length / 2) {
        setStats(prev => ({ ...prev, syllables: prev.syllables + 1 }));
      }
    }
  };

  const handleWordPractice = (word: string) => {
    onSpeak(word);
    if (!practicedWordsList.includes(word)) {
      setPracticedWordsList(prev => [...prev, word]);
      
      const allWords = wordPractice.flatMap(c => c.words.map(w => w.word));
      if (practicedWordsList.length + 1 >= allWords.length / 2) {
        setStats(prev => ({ ...prev, words: prev.words + 1 }));
      }
    }
  };

  const handleSentencePractice = () => {
    onSpeak(sentencePractice[currentSentence].sentence);
    if (!practicedSentences.includes(currentSentence)) {
      setPracticedSentences(prev => [...prev, currentSentence]);
      
      if (practicedSentences.length + 1 >= sentencePractice.length / 2) {
        setStats(prev => ({ ...prev, sentences: prev.sentences + 1 }));
      }
    }
  };

  const handleNextSentence = () => {
    if (currentSentence + 1 < sentencePractice.length) {
      setCurrentSentence(prev => prev + 1);
    } else {
      setShowCelebration(true);
      onSpeak("Urime! Të gjitha fjalitë u praktikuan!");
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const exercises = [
    { id: "sounds", name: "Tinguj Bazë", description: "A, E, I, O, U, M, B, P", icon: Volume2, color: "from-pink-400 to-rose-400", score: stats.sounds },
    { id: "syllables", name: "Rrokje", description: "Ma-me-mi-mo-mu", icon: Mic, color: "from-blue-400 to-cyan-400", score: stats.syllables },
    { id: "words", name: "Fjalë", description: "Praktiko fjalë të thjeshta", icon: Star, color: "from-green-400 to-emerald-400", score: stats.words },
    { id: "sentences", name: "Fjali", description: "Ndërto fjali të plota", icon: ChevronRight, color: "from-violet-400 to-purple-400", score: stats.sentences },
  ];

  if (activeExercise) {
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
          <Button variant="outline" onClick={() => setActiveExercise(null)}>
            ← Kthehu
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleStartExercise(activeExercise)}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Rifillo
          </Button>
        </div>

        {activeExercise === "sounds" && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {soundExercises.map((ex, i) => (
                <Button
                  key={ex.sound}
                  variant={currentSound === i ? "default" : "outline"}
                  onClick={() => setCurrentSound(i)}
                  className="shrink-0 text-xl"
                >
                  {ex.sound}
                </Button>
              ))}
            </div>

            <Card className="p-6 text-center">
              <div className="text-6xl mb-4">{soundExercises[currentSound].mouth}</div>
              <h3 className="text-4xl font-bold mb-2">{soundExercises[currentSound].sound}</h3>
              <p className="text-muted-foreground">{soundExercises[currentSound].tip}</p>
              
              <Button
                onClick={() => onSpeak(soundExercises[currentSound].sound)}
                className="mt-4 gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Dëgjo
              </Button>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {soundExercises[currentSound].words.map((word) => (
                <button
                  key={word}
                  onClick={() => handleSoundPractice(word)}
                  className={`
                    p-4 rounded-xl border-2 text-lg font-bold transition-all
                    ${practicedWords.includes(word)
                      ? "bg-green-100 border-green-400"
                      : "bg-card hover:border-primary hover:scale-105"
                    }
                  `}
                >
                  {word}
                  {practicedWords.includes(word) && <Check className="inline ml-2 w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeExercise === "syllables" && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {syllableExercises.map((ex, i) => (
                <Button
                  key={i}
                  variant={currentSyllable === i ? "default" : "outline"}
                  onClick={() => setCurrentSyllable(i)}
                  className="shrink-0"
                >
                  {ex.syllables[0].toUpperCase()}...
                </Button>
              ))}
            </div>

            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-2">Fjala e plotë:</p>
              <h3 className="text-3xl font-bold">{syllableExercises[currentSyllable].word}</h3>
            </Card>

            <div className="grid grid-cols-5 gap-2">
              {syllableExercises[currentSyllable].syllables.map((syllable) => (
                <button
                  key={syllable}
                  onClick={() => handleSyllablePractice(syllable)}
                  className={`
                    p-4 rounded-xl border-2 text-xl font-bold transition-all
                    ${practicedSyllables.includes(syllable)
                      ? "bg-green-100 border-green-400"
                      : "bg-card hover:border-primary hover:scale-105"
                    }
                  `}
                >
                  {syllable}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeExercise === "words" && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {wordPractice.map((cat, i) => (
                <Button
                  key={cat.category}
                  variant={selectedCategory === i ? "default" : "outline"}
                  onClick={() => setSelectedCategory(i)}
                  className="shrink-0"
                >
                  {cat.category}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {wordPractice[selectedCategory].words.map((item) => (
                <button
                  key={item.word}
                  onClick={() => handleWordPractice(item.word)}
                  className={`
                    p-4 rounded-xl border-2 text-center transition-all
                    ${practicedWordsList.includes(item.word)
                      ? "bg-green-100 border-green-400"
                      : "bg-card hover:border-primary hover:scale-105"
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="font-bold">{item.word}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeExercise === "sentences" && (
          <div className="space-y-6">
            <Card className="p-6 text-center">
              <div className="flex gap-1 justify-center mb-4">
                {sentencePractice.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      practicedSentences.includes(i)
                        ? "bg-green-500"
                        : i === currentSentence
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                Niveli {sentencePractice[currentSentence].level}
              </p>
              <h3 className="text-2xl font-bold mb-6">
                "{sentencePractice[currentSentence].sentence}"
              </h3>

              <div className="flex gap-3 justify-center">
                <Button onClick={handleSentencePractice} className="gap-2">
                  <Volume2 className="w-4 h-4" />
                  Dëgjo
                </Button>
                <Button variant="outline" onClick={handleNextSentence} className="gap-2">
                  Tjetra
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            <div className="text-center text-muted-foreground">
              <p>Dëgjo fjalinë dhe përsërite me zë të lartë!</p>
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
          <div className="font-bold">Ushtrime Artikulimi</div>
          <div className="text-sm text-muted-foreground">
            Tinguj: {stats.sounds} | Rrokje: {stats.syllables} | Fjalë: {stats.words} | Fjali: {stats.sentences}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          return (
            <button
              key={exercise.id}
              onClick={() => handleStartExercise(exercise.id as ExerciseType)}
              className="group relative p-5 rounded-2xl bg-card border-2 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${exercise.color} group-hover:opacity-20 transition-opacity`} />
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${exercise.color} shadow-lg mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-sm mb-1">{exercise.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{exercise.description}</p>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs">{exercise.score}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
