import React, { useState, useMemo } from "react";
import { X, Eye, EyeOff, Search, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { aacSymbols, categories, AACSymbol } from "@/data/aacSymbols";
import { toast } from "sonner";

interface SymbolVisibilityManagerProps {
  isOpen: boolean;
  onClose: () => void;
  hiddenSymbols: string[];
  onUpdateHiddenSymbols: (hiddenSymbols: string[]) => void;
}

export const SymbolVisibilityManager: React.FC<SymbolVisibilityManagerProps> = ({
  isOpen,
  onClose,
  hiddenSymbols,
  onUpdateHiddenSymbols,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredSymbols = useMemo(() => {
    let symbols = aacSymbols;
    
    if (activeCategory !== "all") {
      symbols = symbols.filter((s) => s.category === activeCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      symbols = symbols.filter((s) => 
        s.label.toLowerCase().includes(term) ||
        s.emoji.includes(term)
      );
    }
    
    return symbols;
  }, [activeCategory, searchTerm]);

  const toggleSymbol = (symbolId: string) => {
    if (hiddenSymbols.includes(symbolId)) {
      onUpdateHiddenSymbols(hiddenSymbols.filter((id) => id !== symbolId));
    } else {
      onUpdateHiddenSymbols([...hiddenSymbols, symbolId]);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const categorySymbols = aacSymbols.filter((s) => s.category === categoryId);
    const categorySymbolIds = categorySymbols.map((s) => s.id);
    const allHidden = categorySymbolIds.every((id) => hiddenSymbols.includes(id));
    
    if (allHidden) {
      onUpdateHiddenSymbols(hiddenSymbols.filter((id) => !categorySymbolIds.includes(id)));
    } else {
      const newHidden = [...new Set([...hiddenSymbols, ...categorySymbolIds])];
      onUpdateHiddenSymbols(newHidden);
    }
  };

  const resetAll = () => {
    onUpdateHiddenSymbols([]);
    toast.success("Të gjitha simbolet u bënë të dukshme");
  };

  const hideAll = () => {
    onUpdateHiddenSymbols(aacSymbols.map((s) => s.id));
    toast.info("Të gjitha simbolet u fshehn");
  };

  const visibleCount = aacSymbols.length - hiddenSymbols.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-card shadow-2xl animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-accent text-accent-foreground">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Menaxho Simbolet
              </h2>
              <p className="text-sm opacity-90 mt-1">
                {visibleCount} nga {aacSymbols.length} simbole të dukshme
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-accent-foreground/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Kërko simbole..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetAll}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Shfaq të gjitha
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={hideAll}
                className="flex-1"
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Fshih të gjitha
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto gap-2 p-3 border-b border-border bg-muted/30">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors",
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              🏷️ Të gjitha
            </button>
            {categories.map((cat) => {
              const catSymbols = aacSymbols.filter((s) => s.category === cat.id);
              const hiddenCount = catSymbols.filter((s) => hiddenSymbols.includes(s.id)).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-1",
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {cat.emoji} {cat.name}
                  {hiddenCount > 0 && (
                    <span className="text-xs opacity-70">({hiddenCount})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Category Toggle */}
          {activeCategory !== "all" && (
            <div className="p-3 border-b border-border bg-muted/20">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toggleCategory(activeCategory)}
                className="w-full"
              >
                {aacSymbols
                  .filter((s) => s.category === activeCategory)
                  .every((s) => hiddenSymbols.includes(s.id))
                  ? "Shfaq të gjithë kategorinë"
                  : "Fshih të gjithë kategorinë"}
              </Button>
            </div>
          )}

          {/* Symbol Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {filteredSymbols.map((symbol) => {
                const isHidden = hiddenSymbols.includes(symbol.id);
                return (
                  <button
                    key={symbol.id}
                    onClick={() => toggleSymbol(symbol.id)}
                    className={cn(
                      "aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all",
                      isHidden
                        ? "bg-muted/50 border-muted opacity-50"
                        : "bg-card border-border hover:border-primary"
                    )}
                  >
                    <span className={cn("text-2xl", isHidden && "grayscale")}>
                      {symbol.emoji}
                    </span>
                    <span className="text-[10px] text-center line-clamp-1 mt-1 text-foreground">
                      {symbol.label}
                    </span>
                    {!isHidden && (
                      <Check className="w-3 h-3 text-accent absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/50">
            <Button onClick={onClose} className="w-full">
              Ruaj & Mbyll
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
