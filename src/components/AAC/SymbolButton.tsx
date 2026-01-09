import React from "react";
import { AACSymbol } from "@/data/aacSymbols";
import { CustomSymbol, SymbolSize, SymbolStyle } from "@/types/aac";
import { cn } from "@/lib/utils";

interface SymbolButtonProps {
  symbol: AACSymbol | CustomSymbol;
  onClick: (symbol: AACSymbol | CustomSymbol) => void;
  size?: SymbolSize;
  style?: SymbolStyle;
  highContrast?: boolean;
  reducedMotion?: boolean;
  fontSize?: number;
}

// Type guard to check if symbol is a CustomSymbol
const isCustomSymbol = (symbol: AACSymbol | CustomSymbol): symbol is CustomSymbol => {
  return 'isCustom' in symbol && symbol.isCustom === true;
};

export const SymbolButton: React.FC<SymbolButtonProps> = ({
  symbol,
  onClick,
  size = "lg",
  style = "default",
  highContrast = false,
  reducedMotion = false,
  fontSize = 1,
}) => {
  const sizeClasses = {
    sm: "min-w-[90px] min-h-[90px] p-2",
    md: "min-w-[110px] min-h-[110px] p-3",
    lg: "min-w-[130px] min-h-[130px] p-4",
    xl: "min-w-[160px] min-h-[160px] p-5",
  };

  const labelSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const imageSizes = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-5xl",
    xl: "text-6xl",
  };

  const styleClasses = {
    default: "bg-gradient-to-br from-card via-card to-muted border-2 border-primary/30 rounded-3xl shadow-lg hover:shadow-xl",
    rounded: "bg-gradient-to-br from-accent/20 to-secondary/20 border-3 border-primary/40 rounded-full shadow-lg",
    minimal: "bg-muted/50 rounded-xl border border-border/50",
    bold: "bg-gradient-to-br from-primary/20 to-secondary/30 border-3 border-primary rounded-2xl shadow-xl",
  };

  const contrastClasses = highContrast
    ? "border-4 border-foreground bg-background text-foreground"
    : "";

  const motionClasses = reducedMotion
    ? ""
    : "hover:scale-105 active:scale-95 transition-all duration-200 hover:glow";

  const hasImageUrl = isCustomSymbol(symbol) && symbol.imageUrl;

  return (
    <button
      onClick={() => onClick(symbol)}
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        "focus:outline-none focus:ring-4 focus:ring-primary/50",
        sizeClasses[size],
        styleClasses[style],
        contrastClasses,
        motionClasses
      )}
      aria-label={symbol.label}
    >
      {hasImageUrl ? (
        <img
          src={symbol.imageUrl}
          alt={symbol.label}
          className={cn(
            "object-contain",
            size === "sm" ? "w-10 h-10" : size === "md" ? "w-14 h-14" : size === "lg" ? "w-16 h-16" : "w-20 h-20"
          )}
        />
      ) : (
        <span 
          className={imageSizes[size]}
          style={{ fontSize: `${fontSize * 2.5}rem` }}
        >
          {symbol.emoji}
        </span>
      )}
      <span
        className={cn(
          "font-bold text-foreground text-center leading-tight px-1.5",
          labelSizes[size]
        )}
        style={{ fontSize: `${fontSize * 0.9}rem` }}
      >
        {symbol.label}
      </span>
    </button>
  );
};
