import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Image, X } from "lucide-react";
import { CustomSymbol } from "@/types/aac";
import { categories } from "@/data/aacSymbols";
import { toast } from "sonner";

interface CustomSymbolDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSymbol: (symbol: CustomSymbol) => void;
}

export const CustomSymbolDialog: React.FC<CustomSymbolDialogProps> = ({
  isOpen,
  onClose,
  onAddSymbol,
}) => {
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("home");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [emoji, setEmoji] = useState("📷");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Foto është shumë e madhe. Max 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      toast.error("Shkruaj emrin e simbolit");
      return;
    }

    const newSymbol: CustomSymbol = {
      id: `custom-${Date.now()}`,
      label: label.trim(),
      emoji: emoji,
      category: category,
      imageUrl: imageUrl || undefined,
      isCustom: true,
    };

    onAddSymbol(newSymbol);
    resetForm();
    onClose();
    toast.success(`Simboli "${label}" u shtua me sukses!`);
  };

  const resetForm = () => {
    setLabel("");
    setCategory("home");
    setImageUrl("");
    setEmoji("📷");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shto Simbol të Ri</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Foto (opsionale)</Label>
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Zgjidh foto
                  </Button>
                  {imageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setImageUrl("")}
                      className="text-destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hiq foton
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Emoji fallback */}
            {!imageUrl && (
              <div className="space-y-2">
                <Label htmlFor="emoji">Emoji (nëse nuk ka foto)</Label>
                <Input
                  id="emoji"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="📷"
                  className="text-2xl"
                  maxLength={4}
                />
              </div>
            )}

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="symbolLabel">Emri i Simbolit</Label>
              <Input
                id="symbolLabel"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="p.sh. Mami, Lodra ime..."
                autoFocus
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Kategoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Anulo
            </Button>
            <Button type="submit" disabled={!label.trim()}>
              Shto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
