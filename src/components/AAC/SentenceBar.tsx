import React from "react";
import { AACSymbol } from "@/data/aacSymbols";
import { Volume2, Trash2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentenceBarProps {
  symbols: AACSymbol[];
  onSpeak: () => void;
  onClear: () => void;
  onRemoveLast: () => void;
  isSpeaking: boolean;
}

export const SentenceBar: React.FC<SentenceBarProps> = ({
  symbols,
  onSpeak,
  onClear,
  onRemoveLast,
  isSpeaking,
}) => {
  return (
    <div className="sentence-bar rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-primary/30 shimmer">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Speak Button */}
        <button
          onClick={onSpeak}
          disabled={symbols.length === 0}
          className={cn(
            "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl",
            "bg-gradient-to-br from-accent to-secondary text-accent-foreground",
            "flex items-center justify-center",
            "shadow-lg hover:shadow-xl transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:scale-110 active:scale-95",
            isSpeaking && "animate-heart-beat glow"
          )}
          aria-label="Shqipto fjalen"
        >
          <Volume2 className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>

        {/* Symbols Display */}
        <div className="flex-1 min-h-[70px] sm:min-h-[85px] bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-border p-3 overflow-x-auto shadow-inner">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {symbols.length === 0 ? (
              <span className="text-muted-foreground text-base sm:text-lg italic px-3">
                ✨ Kliko simbolet për të ndërtuar fjali...
              </span>
            ) : (
              symbols.map((symbol, index) => (
                <div
                  key={`${symbol.id}-${index}`}
                  className="flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 rounded-xl p-2 sm:p-3 min-w-[60px] sm:min-w-[75px] animate-bounce-in shadow-md"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-2xl sm:text-3xl">{symbol.emoji}</span>
                  <span className="text-[11px] sm:text-sm font-bold text-foreground leading-tight">
                    {symbol.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Backspace Button */}
        <button
          onClick={onRemoveLast}
          disabled={symbols.length === 0}
          className={cn(
            "flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl",
            "bg-gradient-to-br from-secondary to-primary text-secondary-foreground",
            "flex items-center justify-center",
            "shadow-lg hover:shadow-xl transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:scale-110 active:scale-95"
          )}
          aria-label="Fshi të fundit"
        >
          <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Clear Button */}
        <button
          onClick={onClear}
          disabled={symbols.length === 0}
          className={cn(
            "flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl",
            "bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground",
            "flex items-center justify-center",
            "shadow-lg hover:shadow-xl transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:scale-110 active:scale-95"
          )}
          aria-label="Pastro"
        >
          <Trash2 className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  );
};
