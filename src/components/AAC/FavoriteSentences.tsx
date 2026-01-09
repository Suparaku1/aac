import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Star, Play, Trash2, Plus } from "lucide-react";
import { FavoriteSentence } from "@/types/aac";
import { AACSymbol } from "@/data/aacSymbols";

interface FavoriteSentencesProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteSentence[];
  onSpeak: (text: string) => void;
  onDelete: (id: string) => void;
  onAddCurrent: () => void;
  currentSentence: AACSymbol[];
}

export const FavoriteSentences: React.FC<FavoriteSentencesProps> = ({
  isOpen,
  onClose,
  favorites,
  onSpeak,
  onDelete,
  onAddCurrent,
  currentSentence,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Star className="w-6 h-6 text-yellow-500" />
            Fjalitë e Preferuara
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Add current sentence */}
          {currentSentence.length > 0 && (
            <Button
              onClick={onAddCurrent}
              className="w-full"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Shto fjalinë aktuale
            </Button>
          )}

          {/* Favorites list */}
          <div className="space-y-3">
            {favorites.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Nuk ka fjali të ruajtura ende.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ndërto një fjali dhe shtoje këtu për akses të shpejtë!
                </p>
              </div>
            ) : (
              favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {fav.symbols.map((s, i) => (
                          <span key={i} className="text-2xl" title={s.label}>
                            {s.emoji}
                          </span>
                        ))}
                      </div>
                      <p className="font-medium text-sm truncate">{fav.label}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="default"
                        onClick={() => onSpeak(fav.label)}
                        title="Shqipto"
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(fav.id)}
                        title="Fshi"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
