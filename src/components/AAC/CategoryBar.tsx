import React from "react";
import { categories, Category } from "@/data/aacSymbols";
import { CategoryButton } from "./CategoryButton";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (category: Category) => void;
  onHomeClick: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onCategoryChange,
  onHomeClick,
}) => {
  return (
    <div className="bg-card/90 backdrop-blur-sm border-b-2 border-primary/20 shadow-md">
      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 overflow-x-auto">
        {/* Home Button */}
        <button
          onClick={onHomeClick}
          className={cn(
            "flex-shrink-0 flex flex-col items-center justify-center gap-1.5 p-3 sm:p-4 rounded-2xl",
            "min-w-[85px] sm:min-w-[100px]",
            "bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg",
            "hover:opacity-90 hover:shadow-xl hover:scale-110",
            "focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-primary/50",
            "transition-all duration-200",
            activeCategory === "home" && "ring-4 ring-white scale-110 shadow-xl glow"
          )}
        >
          <Home className="w-7 h-7 sm:w-9 sm:h-9" />
          <span className="text-xs sm:text-sm font-bold">Kryefaqja</span>
        </button>

        {/* Category Buttons */}
        {categories
          .filter((cat) => cat.id !== "home")
          .map((category, index) => (
            <div 
              key={category.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CategoryButton
                category={category}
                onClick={onCategoryChange}
                isActive={activeCategory === category.id}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
