import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
  mode: "enter" | "set" | "change";
  onPinSet?: (pin: string) => void;
}

export const PinDialog: React.FC<PinDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
  mode,
  onPinSet,
}) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");

  const handlePinChange = (value: string, isConfirm = false) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    if (isConfirm) {
      setConfirmPin(numericValue);
    } else {
      setPin(numericValue);
    }
    setError("");
  };

  const handleSubmit = () => {
    if (mode === "enter") {
      if (pin === correctPin) {
        onSuccess();
        resetAndClose();
      } else {
        setError("PIN i gabuar. Provoni përsëri.");
        setPin("");
      }
    } else if (mode === "set" || mode === "change") {
      if (step === "enter") {
        if (pin.length !== 4) {
          setError("PIN duhet të jetë 4 shifra");
          return;
        }
        setStep("confirm");
      } else {
        if (pin === confirmPin) {
          onPinSet?.(pin);
          resetAndClose();
        } else {
          setError("PIN-at nuk përputhen. Provoni përsëri.");
          setConfirmPin("");
        }
      }
    }
  };

  const resetAndClose = () => {
    setPin("");
    setConfirmPin("");
    setError("");
    setStep("enter");
    onClose();
  };

  const getTitle = () => {
    if (mode === "enter") return "Vendos PIN-in";
    if (mode === "set") return "Krijo PIN të Ri";
    return "Ndrysho PIN-in";
  };

  const getSubtitle = () => {
    if (mode === "enter") return "Vendos PIN-in 4-shifror për të aksesuar cilësimet e prindërve";
    if (step === "enter") return "Vendos një PIN 4-shifror për të mbrojtur cilësimet";
    return "Konfirmo PIN-in tuaj të ri";
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground text-center">
            {getSubtitle()}
          </p>

          {/* PIN Input */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((index) => {
              const currentPin = step === "confirm" ? confirmPin : pin;
              const hasDigit = currentPin.length > index;
              return (
                <div
                  key={index}
                  className={cn(
                    "w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all",
                    hasDigit
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted"
                  )}
                >
                  {hasDigit && (showPin ? currentPin[index] : "•")}
                </div>
              );
            })}
          </div>

          {/* Hidden input for actual entry */}
          <div className="flex justify-center">
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                value={step === "confirm" ? confirmPin : pin}
                onChange={(e) => handlePinChange(e.target.value, step === "confirm")}
                className="text-center text-2xl tracking-widest w-48"
                maxLength={4}
                autoFocus
                placeholder="••••"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={resetAndClose}>
              Anulo
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={(step === "confirm" ? confirmPin : pin).length !== 4}
            >
              {mode === "enter" ? "Hyr" : step === "enter" ? "Vazhdo" : "Ruaj"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
