import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Lock, 
  KeyRound,
  Baby,
  GraduationCap,
  Settings2
} from "lucide-react";
import { AppSettings } from "@/types/aac";

interface ParentModeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onSetPin: () => void;
  onChangePin: () => void;
}

export const ParentModeSettings: React.FC<ParentModeSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSetPin,
  onChangePin,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Modaliteti Prind/Terapist
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current Mode Indicator */}
          <div className={`p-4 rounded-xl ${settings.parentModeActive ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50 border-2 border-blue-200'}`}>
            <div className="flex items-center gap-3">
              {settings.parentModeActive ? (
                <>
                  <GraduationCap className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-800">Modaliteti Prind</h3>
                    <p className="text-sm text-green-600">
                      Aksesi i plotë në cilësime dhe ndryshime
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Baby className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-blue-800">Modaliteti Fëmijë</h3>
                    <p className="text-sm text-blue-600">
                      Cilësimet janë të mbrojtura
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* PIN Protection */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Mbrojtja me PIN
            </h3>

            {!settings.pinEnabled ? (
              <div className="p-4 rounded-xl border-2 border-dashed border-border bg-muted/50">
                <p className="text-sm text-muted-foreground mb-3">
                  Aktivizo mbrojtjen me PIN për të parandaluar ndryshime aksidentale nga fëmijët.
                </p>
                <Button onClick={onSetPin} className="w-full">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Vendos PIN
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border-2 border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">PIN aktiv</p>
                      <p className="text-xs text-muted-foreground">
                        Cilësimet janë të mbrojtura
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={onChangePin}>
                    Ndrysho
                  </Button>
                </div>

                {/* Lock on exit toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-lock" className="flex-1">
                    <span className="font-medium">Kyç automatikisht</span>
                    <p className="text-xs text-muted-foreground">
                      Kyç cilësimet pas 5 minutash
                    </p>
                  </Label>
                  <Switch
                    id="auto-lock"
                    checked={true}
                    disabled
                  />
                </div>
              </div>
            )}
          </div>

          {/* Protected Settings Info */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Cilësimet e Mbrojtura
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Menaxhimi i profileve
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Shtimi/Fshirja e simboleve
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Cilësimet e zërit
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Sinkronizimi në cloud
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
