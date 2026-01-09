import React, { useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2, User } from "lucide-react";
import { UserProfile } from "@/types/aac";
import { toast } from "sonner";

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  onSelectProfile: (profile: UserProfile) => void;
  onCreateProfile: () => void;
  onDeleteProfile: (profileId: string) => void;
  onImportProfile: (profile: UserProfile) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onImportProfile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportProfile = (profile: UserProfile) => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `folem-aac-profile-${profile.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Profili "${profile.name}" u eksportua me sukses!`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as UserProfile;
        if (!imported.id || !imported.name || !imported.customSymbols) {
          throw new Error("Formati i skedarit nuk është i vlefshëm");
        }
        // Generate new ID to avoid conflicts
        imported.id = `profile-${Date.now()}`;
        imported.createdAt = Date.now();
        onImportProfile(imported);
        toast.success(`Profili "${imported.name}" u importua me sukses!`);
      } catch (error) {
        toast.error("Gabim gjatë importimit. Sigurohu që skedari është i saktë.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <User className="w-6 h-6 text-primary" />
            Menaxho Profilet
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Import/Create buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onCreateProfile}
              className="flex-1"
              variant="default"
            >
              <User className="w-4 h-4 mr-2" />
              Profil i Ri
            </Button>
            <Button
              onClick={handleImportClick}
              variant="outline"
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importo
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Profile list */}
          <div className="space-y-3">
            <h3 className="font-semibold text-muted-foreground">Profilet e Ruajtura</h3>
            {profiles.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nuk ka profile të ruajtura. Krijo një profil të ri!
              </p>
            ) : (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    activeProfile?.id === profile.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSelectProfile(profile)}
                      className="flex-1 text-left"
                    >
                      <h4 className="font-semibold">{profile.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {profile.customSymbols.length} simbole • {profile.favoriteSentences.length} fjali
                      </p>
                    </button>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleExportProfile(profile)}
                        title="Eksporto"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteProfile(profile.id)}
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
