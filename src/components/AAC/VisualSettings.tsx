import React from "react";
import { X, Eye, Palette, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export type SymbolSize = "sm" | "md" | "lg" | "xl";
export type SymbolStyle = "default" | "rounded" | "minimal" | "bold";

export interface VisualSettingsData {
  symbolSize: SymbolSize;
  symbolStyle: SymbolStyle;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number; // 0.8 - 1.4
}

interface VisualSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VisualSettingsData;
  onUpdateSettings: (updates: Partial<VisualSettingsData>) => void;
}

const sizeOptions: { value: SymbolSize; label: string; emoji: string }[] = [
  { value: "sm", label: "Vogël", emoji: "🔹" },
  { value: "md", label: "Mesatar", emoji: "🔸" },
  { value: "lg", label: "I madh", emoji: "🟠" },
  { value: "xl", label: "Shumë i madh", emoji: "🟡" },
];

const styleOptions: { value: SymbolStyle; label: string; description: string }[] = [
  { value: "default", label: "Standarde", description: "Stili normal me hije" },
  { value: "rounded", label: "E rrumbullakët", description: "Kënde më të buta" },
  { value: "minimal", label: "Minimale", description: "Pa hije, e thjeshtë" },
  { value: "bold", label: "E trashë", description: "Kufij të theksuar" },
];

export const VisualSettings: React.FC<VisualSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card shadow-2xl animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-secondary text-secondary-foreground">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Cilësimet Vizuale
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-secondary-foreground/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Symbol Size */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-primary" />
                Madhësia e simboleve
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onUpdateSettings({ symbolSize: option.value })}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all",
                      "hover:border-primary hover:bg-primary/5",
                      settings.symbolSize === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    )}
                  >
                    <span className="text-2xl block mb-1">{option.emoji}</span>
                    <span className="font-medium text-foreground">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Symbol Style */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Stili i simboleve
              </label>
              <div className="space-y-2">
                {styleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onUpdateSettings({ symbolStyle: option.value })}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 text-left transition-all",
                      "hover:border-primary hover:bg-primary/5",
                      settings.symbolStyle === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    )}
                  >
                    <div className="font-medium text-foreground">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground">
                📝 Madhësia e tekstit
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">A</span>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => onUpdateSettings({ fontSize: value })}
                  min={0.8}
                  max={1.4}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-lg text-muted-foreground font-bold">A</span>
              </div>
              <div className="text-center text-sm font-medium text-primary">
                {Math.round(settings.fontSize * 100)}%
              </div>
            </div>

            {/* Accessibility Options */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground">
                ♿ Qasje e lehtë
              </h3>

              {/* High Contrast */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <Label className="font-medium text-foreground">Kontrast i lartë</Label>
                  <p className="text-sm text-muted-foreground">
                    Ngjyra më të forta për shikim më të qartë
                  </p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => onUpdateSettings({ highContrast: checked })}
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <Label className="font-medium text-foreground">Pa animacione</Label>
                  <p className="text-sm text-muted-foreground">
                    Ul lëvizjet për fokus më të mirë
                  </p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => onUpdateSettings({ reducedMotion: checked })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/50">
            <p className="text-center text-sm text-muted-foreground">
              Ndryshimet ruhen automatikisht
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
