import React from "react";
import { X, Heart, Star, Users } from "lucide-react";

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💬</span>
                <div>
                  <h2 className="text-2xl font-bold">FolëmAAC</h2>
                  <p className="text-sm opacity-90">Versioni 1.0</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            {/* About */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Rreth aplikacionit
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>FolëmAAC</strong> është pajisja e parë AAC (Augmentative and 
                Alternative Communication) në gjuhën shqipe, e krijuar posaçërisht 
                për fëmijët me autizëm dhe vështirësi në komunikim.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-destructive" />
                Karakteristikat
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Simbole të qarta me emoji dhe tekst në shqip
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Ndërtues fjalish me shqiptim audio
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Kategori të organizuara: emocione, ushqim, veprime, etj.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Dizajn i thjeshtë dhe miqësor për fëmijë
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Cilësime të personalizueshme të zërit
                </li>
              </ul>
            </div>

            {/* How to use */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Si përdoret
              </h3>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>Zgjidhni kategorinë e dëshiruar</li>
                <li>Klikoni simbolet për të ndërtuar fjali</li>
                <li>Shtypni butonin e gjelbër për ta shqiptuar</li>
                <li>Përdorni butonat për të fshirë ose pastruar</li>
              </ol>
            </div>

            {/* Creator */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Krijuar me dashuri nga</p>
              <p className="text-xl font-bold text-foreground">Esmerald Suparaku</p>
              <p className="text-sm text-muted-foreground mt-2">🇦🇱 Shqipëri</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/30">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
            >
              Mbyll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
