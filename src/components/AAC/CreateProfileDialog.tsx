import React, { useState } from "react";
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
import { UserProfile } from "@/types/aac";

interface CreateProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (profile: UserProfile) => void;
}

export const CreateProfileDialog: React.FC<CreateProfileDialogProps> = ({
  isOpen,
  onClose,
  onCreateProfile,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: UserProfile = {
      id: `profile-${Date.now()}`,
      name: name.trim(),
      createdAt: Date.now(),
      customSymbols: [],
      favoriteSentences: [],
      learningProgress: [],
      hiddenSymbols: [],
      visualSettings: {
        symbolSize: "md",
        symbolStyle: "default",
        highContrast: false,
        reducedMotion: false,
        fontSize: 1,
      },
      settings: {
        rate: 0.9,
        pitch: 1.0,
        selectedVoice: "",
      },
    };

    onCreateProfile(newProfile);
    setName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Krijo Profil të Ri</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profileName">Emri i Profilit</Label>
              <Input
                id="profileName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="p.sh. Emri i fëmijës"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Anulo
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Krijo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
