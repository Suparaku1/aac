import { useCallback, useState, useEffect } from "react";

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  // Optimized for young Albanian girl voice - sweet and childlike
  const [rate, setRate] = useState(0.75); // Slower, more childlike pace
  const [pitch, setPitch] = useState(1.45); // Higher pitch for young girl voice

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Priority order for Albanian voice selection
      // 1. Native Albanian voice (sq-AL, sq) - female preferred
      // 2. Google Albanian voices (best quality)
      // 3. Microsoft Albanian voices
      // 4. Any Albanian variant
      // 5. Italian female (very similar vowel sounds to Albanian)
      // 6. Croatian/Serbian female (similar Balkan phonetics)
      
      // Albanian female voices - highest priority
      const albanianFemale = availableVoices.find(
        (v) => (v.lang === "sq-AL" || v.lang === "sq" || v.lang.startsWith("sq")) && 
               (v.name.toLowerCase().includes("female") || 
                v.name.toLowerCase().includes("femër") ||
                v.name.toLowerCase().includes("google"))
      );
      
      const googleAlbanian = availableVoices.find(
        (v) => (v.lang === "sq-AL" || v.lang === "sq") && 
               v.name.toLowerCase().includes("google")
      );
      
      const microsoftAlbanian = availableVoices.find(
        (v) => (v.lang === "sq-AL" || v.lang === "sq") && 
               v.name.toLowerCase().includes("microsoft")
      );
      
      const anyAlbanian = availableVoices.find(
        (v) => v.lang === "sq-AL" || v.lang === "sq" || v.lang.startsWith("sq")
      );
      
      // Italian female has very similar vowel sounds to Albanian
      const italianFemale = availableVoices.find(
        (v) => v.lang.includes("it") && 
               (v.name.toLowerCase().includes("female") || 
                v.name.toLowerCase().includes("google") ||
                v.name.toLowerCase().includes("elsa") ||
                v.name.toLowerCase().includes("cosimo") === false)
      );
      
      // Croatian female - similar consonant sounds
      const croatianFemale = availableVoices.find(
        (v) => v.lang.includes("hr") && 
               (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("google"))
      );
      
      // Serbian female
      const serbianFemale = availableVoices.find(
        (v) => v.lang.includes("sr") && 
               (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("google"))
      );
      
      // Spanish female as fallback (clear pronunciation)
      const spanishFemale = availableVoices.find(
        (v) => v.lang.includes("es") && 
               (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("google"))
      );
      
      const fallbackVoice = availableVoices.find(
        (v) => v.lang.includes("en") && v.name.includes("Google")
      ) || availableVoices[0];
      
      // Set voice with priority - Albanian first, then similar languages
      const bestVoice = albanianFemale ||
                        googleAlbanian || 
                        microsoftAlbanian || 
                        anyAlbanian || 
                        italianFemale ||
                        croatianFemale ||
                        serbianFemale ||
                        spanishFemale ||
                        fallbackVoice;
      
      setSelectedVoice(bestVoice);
      
      // Log for debugging
      console.log("Available voices:", availableVoices.length);
      console.log("Selected voice:", bestVoice?.name, bestVoice?.lang);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!text) return;

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Optimized settings for young Albanian girl voice
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 1;
      
      // Add natural pauses for better Albanian pronunciation
      utterance.text = text
        .replace(/,/g, ', ')
        .replace(/\./g, '. ')
        .replace(/!/g, '! ')
        .replace(/\?/g, '? ');

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    },
    [selectedVoice, rate, pitch]
  );

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Get Albanian-friendly voices sorted by preference
  const sortedVoices = voices.slice().sort((a, b) => {
    const aScore = getVoiceScore(a);
    const bScore = getVoiceScore(b);
    return bScore - aScore;
  });

  return {
    speak,
    stop,
    isSpeaking,
    voices: sortedVoices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
  };
};

// Helper function to score voices for Albanian compatibility
const getVoiceScore = (voice: SpeechSynthesisVoice): number => {
  let score = 0;
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  
  // Albanian voices get highest priority
  if (lang === "sq-al" || lang === "sq") score += 100;
  if (lang.startsWith("sq")) score += 90;
  
  // Female voices get bonus for young girl sound
  if (name.includes("female") || name.includes("femër")) score += 25;
  
  // Google voices are generally higher quality
  if (name.includes("google")) score += 20;
  if (name.includes("microsoft")) score += 15;
  
  // Similar languages bonus - ordered by phonetic similarity to Albanian
  if (lang.includes("it")) score += 35; // Italian - very similar vowels
  if (lang.includes("hr")) score += 30; // Croatian - similar consonants
  if (lang.includes("sr")) score += 28; // Serbian
  if (lang.includes("mk")) score += 26; // Macedonian
  if (lang.includes("el")) score += 24; // Greek
  if (lang.includes("ro")) score += 22; // Romanian
  if (lang.includes("es")) score += 18; // Spanish - clear pronunciation
  if (lang.includes("pt")) score += 15; // Portuguese
  
  return score;
};
