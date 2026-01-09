import React from "react";
import { AACSymbol } from "@/data/aacSymbols";
import { SymbolButton } from "./SymbolButton";
import { CustomSymbol, SymbolSize, SymbolStyle } from "@/types/aac";
import { cn } from "@/lib/utils";

interface SymbolGridProps {
  symbols: (AACSymbol | CustomSymbol)[];
  onSymbolClick: (symbol: AACSymbol | CustomSymbol) => void;
  symbolSize?: SymbolSize;
  symbolStyle?: SymbolStyle;
  fontSize?: number;
  highContrast?: boolean;
  reducedMotion?: boolean;
}

export const SymbolGrid: React.FC<SymbolGridProps> = ({
  symbols,
  onSymbolClick,
  symbolSize = "md",
  symbolStyle = "default",
  fontSize = 1,
  highContrast = false,
  reducedMotion = false,
}) => {
  // Adjust grid based on symbol size
  const gridClasses = {
    sm: "grid-cols-[repeat(auto-fill,minmax(70px,1fr))]",
    md: "grid-cols-[repeat(auto-fill,minmax(90px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))]",
    lg: "grid-cols-[repeat(auto-fill,minmax(120px,1fr))]",
    xl: "grid-cols-[repeat(auto-fill,minmax(150px,1fr))]",
  };

  return (
    <div className={cn(
      "grid gap-2 sm:gap-3 p-2 sm:p-4",
      gridClasses[symbolSize]
    )}>
      {symbols.map((symbol) => (
        <SymbolButton
          key={symbol.id}
          symbol={symbol}
          onClick={onSymbolClick}
          size={symbolSize}
          style={symbolStyle}
          fontSize={fontSize}
          highContrast={highContrast}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
};
