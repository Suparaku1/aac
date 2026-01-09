import { useCallback, useState } from "react";

// ElevenLabs voice options - multilingual voices that work well with Albanian
export const ELEVENLABS_VOICES = [
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura - Vajzë e ëmbël", description: "Zë femëror i butë, perfekt për fëmijë" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah - E qetë", description: "Zë i qetë dhe i ngrohtë" },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda - E gjallë", description: "Zë energjik dhe miqësor" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily - E ëmbël", description: "Zë shumë i butë" },
  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica - E ngrohtë", description: "Zë i ngrohtë dhe i qartë" },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice - Britanike", description: "Zë elegant dhe i pastër" },
];

export const useElevenLabsSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState(ELEVENLABS_VOICES[0].id);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const speak = useCallback(
    async (text: string): Promise<{ ok: boolean; status?: number }> => {
      if (!text || isLoading) return { ok: false };

      setIsLoading(true);
      setError(null);

      try {
        // Stop any currently playing audio
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              text,
              voiceId: selectedVoiceId,
            }),
          }
        );

        if (!response.ok) {
          // Avoid throwing here: keep the app stable and let callers decide fallbacks.
          const msg = response.status === 401
            ? "Zëri premium nuk është aktiv (mungon leja për Text-to-Speech)."
            : `Zëri premium dështoi (${response.status}).`;
          setError(msg);
          setIsSpeaking(false);
          return { ok: false, status: response.status };
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        setAudioElement(audio);

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          setError("Gabim në riprodhimin e audios");
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
        return { ok: true, status: 200 };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gabim i panjohur");
        setIsSpeaking(false);
        return { ok: false };
      } finally {
        setIsLoading(false);
      }
    },
    [selectedVoiceId, audioElement, isLoading]
  );

  const stop = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setIsSpeaking(false);
  }, [audioElement]);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
    voices: ELEVENLABS_VOICES,
    selectedVoiceId,
    setSelectedVoiceId,
  };
};
