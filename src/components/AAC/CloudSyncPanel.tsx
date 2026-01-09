import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Cloud,
  Share2,
  Download,
  Copy,
  Check,
  RefreshCw,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { UserProfile, ProfileShare } from "@/types/aac";
import { toast } from "sonner";

interface CloudSyncPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
  activeProfile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onSync: () => Promise<void>;
  onCreateShare: () => Promise<ProfileShare | null>;
  onImportFromCode: (code: string) => Promise<boolean>;
  lastSyncedAt?: number;
  isSyncing: boolean;
}

export const CloudSyncPanel: React.FC<CloudSyncPanelProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  userEmail,
  activeProfile,
  onLogin,
  onLogout,
  onSync,
  onCreateShare,
  onImportFromCode,
  lastSyncedAt,
  isSyncing,
}) => {
  const [shareCode, setShareCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [importCode, setImportCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleCreateShare = async () => {
    const share = await onCreateShare();
    if (share) {
      setGeneratedCode(share.shareCode);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success("Kodi u kopjua!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImport = async () => {
    if (importCode.length !== 6) {
      toast.error("Kodi duhet të jetë 6 karaktere");
      return;
    }
    setIsImporting(true);
    const success = await onImportFromCode(importCode.toUpperCase());
    setIsImporting(false);
    if (success) {
      setImportCode("");
    }
  };

  const formatLastSync = (timestamp?: number) => {
    if (!timestamp) return "Asnjëherë";
    const date = new Date(timestamp);
    return date.toLocaleString("sq-AL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Cloud className="w-6 h-6 text-primary" />
            Sinkronizimi në Cloud
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Login Status */}
          <div className={`p-4 rounded-xl border-2 ${isLoggedIn ? 'border-green-200 bg-green-50' : 'border-border bg-muted/50'}`}>
            {isLoggedIn ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">I kyçur</p>
                    <p className="text-xs text-green-600 truncate max-w-[150px]">
                      {userEmail}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Dil
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Kyçu për të sinkronizuar profilet në cloud dhe për t'i ndarë me terapistët/prindërit
                </p>
                <Button onClick={onLogin} className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Kyçu ose Regjistrohu
                </Button>
              </div>
            )}
          </div>

          {isLoggedIn && (
            <>
              {/* Sync Status */}
              <div className="p-4 rounded-xl border-2 border-border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Statusi i Sinkronizimit</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSync}
                    disabled={isSyncing || !activeProfile}
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                    Sinkronizo
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sinkronizimi i fundit: {formatLastSync(lastSyncedAt)}
                </p>
                {!activeProfile && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Krijo një profil për të filluar sinkronizimin
                  </p>
                )}
              </div>

              {/* Share Profile */}
              {activeProfile && (
                <div className="p-4 rounded-xl border-2 border-border bg-card space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    Ndaj Profilin
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Krijo një kod të përkohshëm për të ndarë profilin "{activeProfile.name}" me dikë tjetër.
                  </p>

                  {generatedCode ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-4 bg-muted rounded-xl text-center">
                          <p className="text-3xl font-mono font-bold tracking-widest">
                            {generatedCode}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyCode}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Kodi skadon pas 24 orësh
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setGeneratedCode(null)}
                      >
                        Gjenero kod të ri
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleCreateShare} className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Gjenero Kod Ndarjeje
                    </Button>
                  )}
                </div>
              )}

              {/* Import Profile */}
              <div className="p-4 rounded-xl border-2 border-border bg-card space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Importo Profil
                </h3>
                <p className="text-sm text-muted-foreground">
                  Vendos kodin e ndarjes për të importuar një profil nga dikush tjetër.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value.toUpperCase())}
                    placeholder="ABCD12"
                    maxLength={6}
                    className="font-mono text-center text-lg tracking-widest"
                  />
                  <Button
                    onClick={handleImport}
                    disabled={importCode.length !== 6 || isImporting}
                  >
                    {isImporting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
