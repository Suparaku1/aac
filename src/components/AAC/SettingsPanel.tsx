import React from "react";
import { X, Volume2, Globe } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  // Web Speech API settings
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  // Test
  onTestSpeak: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  rate,
  setRate,
  pitch,
  setPitch,
  voices,
  selectedVoice,
  setSelectedVoice,
  onTestSpeak,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card shadow-2xl animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-primary text-primary-foreground">
            <h2 className="text-xl sm:text-2xl font-bold">⚙️ Cilësimet e Zërit</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-pink-200/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👧</span>
                <span className="font-semibold text-foreground">Zë Vajze e Vogël Shqiptare</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Optimizuar për të dëgjuar si zë i ëmbël vajze të vogël me shqiptim të pastër shqip
              </p>
            </div>

            {/* Voice Speed */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                🐢 Shpejtësia e zërit
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Ngadalë</span>
                <Slider
                  value={[rate]}
                  onValueChange={([value]) => setRate(value)}
                  min={0.5}
                  max={1.2}
                  step={0.05}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">Shpejt</span>
              </div>
              <div className="text-center text-sm font-medium text-primary">
                {rate.toFixed(2)}x
              </div>
            </div>

            {/* Voice Pitch */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                🎵 Toni i zërit (lartësia)
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Ulët</span>
                <Slider
                  value={[pitch]}
                  onValueChange={([value]) => setPitch(value)}
                  min={0.8}
                  max={1.8}
                  step={0.05}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">Lart</span>
              </div>
              <div className="text-center text-sm font-medium text-primary">
                {pitch.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Toni më i lartë = zë më i ëmbël dhe më fëmijëror
              </p>
            </div>

            {/* Voice Selection */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Zëri (zgjidh gjuhën)
              </label>
              <p className="text-xs text-muted-foreground">
                Rekomandohet: Shqip, Italisht, Kroatisht - zëra femra
              </p>
              <div className="space-y-1 max-h-56 overflow-y-auto rounded-lg border border-border">
                {voices.map((voice) => (
                  <button
                    key={voice.name}
                    onClick={() => setSelectedVoice(voice)}
                    className={cn(
                      "w-full text-left p-3 hover:bg-muted transition-colors",
                      selectedVoice?.name === voice.name &&
                        "bg-primary/10 border-l-4 border-primary"
                    )}
                  >
                    <div className="font-medium text-foreground text-sm">{voice.name}</div>
                    <div className="text-xs text-muted-foreground">{voice.lang}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Button */}
            <button
              onClick={onTestSpeak}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-lg",
                "bg-accent text-accent-foreground",
                "flex items-center justify-center gap-3",
                "hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]",
                "shadow-lg transition-all"
              )}
            >
              <Volume2 className="w-6 h-6" />
              Provo zërin
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/50">
            <p className="text-center text-sm text-muted-foreground">
              Krijuar nga <strong>Esmerald Suparaku</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
