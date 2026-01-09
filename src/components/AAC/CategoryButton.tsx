import React from "react";
import { Category } from "@/data/aacSymbols";
import { cn } from "@/lib/utils";

interface CategoryButtonProps {
  category: Category;
  onClick: (category: Category) => void;
  isActive?: boolean;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  onClick,
  isActive = false,
}) => {
  return (
    <button
      onClick={() => onClick(category)}
      className={cn(
        "symbol-btn flex flex-col items-center justify-center gap-1.5 p-3 sm:p-4 rounded-2xl",
        "min-w-[85px] sm:min-w-[100px]",
        category.color,
        "text-white shadow-lg",
        "hover:opacity-90 hover:shadow-xl hover:scale-110",
        "focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-white/50",
        "transition-all duration-200",
        isActive && "ring-4 ring-white scale-110 shadow-xl glow"
      )}
    >
      <span className="text-3xl sm:text-4xl select-none" role="img" aria-label={category.name}>
        {category.emoji}
      </span>
      <span className="text-xs sm:text-sm font-bold text-center leading-tight">
        {category.name}
      </span>
    </button>
  );
};
