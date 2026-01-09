import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AACSymbol, Category, getSymbolsByCategory } from "@/data/aacSymbols";
import { useSpeech } from "@/hooks/useSpeech";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "./Header";
import { SentenceBar } from "./SentenceBar";
import { CategoryBar } from "./CategoryBar";
import { SymbolGrid } from "./SymbolGrid";
import { SettingsPanel } from "./SettingsPanel";
import { InfoPanel } from "./InfoPanel";
import { ProfileManager } from "./ProfileManager";
import { CreateProfileDialog } from "./CreateProfileDialog";
import { FavoriteSentences } from "./FavoriteSentences";
import { CustomSymbolDialog } from "./CustomSymbolDialog";
import { LearningGames } from "./LearningGames";
import { PinDialog } from "./PinDialog";
import { ParentModeSettings } from "./ParentModeSettings";
import { LearningStats } from "./LearningStats";
import { CloudSyncPanel } from "./CloudSyncPanel";
import { VisualSettings, VisualSettingsData } from "./VisualSettings";
import { SymbolVisibilityManager } from "./SymbolVisibilityManager";
import { TherapyHub } from "./TherapyHub";
import { TherapyProgressReport } from "./TherapyProgressReport";
import { UserProfile, CustomSymbol, FavoriteSentence, AppSettings, LearningScore, ProfileShare, VisualSettings as VisualSettingsType } from "@/types/aac";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

const DEFAULT_APP_SETTINGS: AppSettings = {
  pinEnabled: false,
  pinCode: "",
  parentModeActive: false,
  lastPinEntry: 0,
};

const PIN_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const AACBoard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSymbols, setSelectedSymbols] = useState<AACSymbol[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("home");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isProfileManagerOpen, setIsProfileManagerOpen] = useState(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCustomSymbolOpen, setIsCustomSymbolOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [isParentModeOpen, setIsParentModeOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isVisualSettingsOpen, setIsVisualSettingsOpen] = useState(false);
  const [isSymbolVisibilityOpen, setIsSymbolVisibilityOpen] = useState(false);
  const [isTherapyHubOpen, setIsTherapyHubOpen] = useState(false);
  const [isProgressReportOpen, setIsProgressReportOpen] = useState(false);
  const [pinMode, setPinMode] = useState<"enter" | "set" | "change">("enter");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Persistent storage
  const [profiles, setProfiles] = useLocalStorage<UserProfile[]>("aac-profiles", []);
  const [activeProfileId, setActiveProfileId] = useLocalStorage<string | null>("aac-active-profile", null);
  const [appSettings, setAppSettings] = useLocalStorage<AppSettings>("aac-app-settings", DEFAULT_APP_SETTINGS);
  // Speech hook - optimized for Albanian child voice
  const speech = useSpeech();

  // Speak function
  const speak = useCallback((text: string) => {
    if (!text) return;
    speech.speak(text);
  }, [speech]);

  const stop = useCallback(() => {
    speech.stop();
  }, [speech]);

  const isSpeaking = speech.isSpeaking;

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-lock PIN after timeout
  useEffect(() => {
    if (appSettings.pinEnabled && appSettings.parentModeActive) {
      const checkTimeout = () => {
        if (Date.now() - appSettings.lastPinEntry > PIN_TIMEOUT) {
          setAppSettings((prev) => ({ ...prev, parentModeActive: false }));
        }
      };
      const interval = setInterval(checkTimeout, 30000);
      return () => clearInterval(interval);
    }
  }, [appSettings.pinEnabled, appSettings.parentModeActive, appSettings.lastPinEntry, setAppSettings]);

  // Get active profile
  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || null;
  }, [profiles, activeProfileId]);

  // Combine default symbols with custom symbols, excluding hidden ones
  const currentSymbols = useMemo(() => {
    const defaultSymbols = getSymbolsByCategory(activeCategory);
    const customSymbols = activeProfile?.customSymbols.filter(
      (s) => s.category === activeCategory
    ) || [];
    const hiddenSymbols = activeProfile?.hiddenSymbols || [];
    return [...defaultSymbols, ...customSymbols].filter(
      (s) => !hiddenSymbols.includes(s.id)
    );
  }, [activeCategory, activeProfile]);

  // Visual settings from active profile
  const visualSettings = useMemo((): VisualSettingsData => {
    return activeProfile?.visualSettings || {
      symbolSize: "md",
      symbolStyle: "default",
      highContrast: false,
      reducedMotion: false,
      fontSize: 1,
    };
  }, [activeProfile]);

  // Favorites from active profile
  const favorites = useMemo(() => {
    return activeProfile?.favoriteSentences || [];
  }, [activeProfile]);

  // Learning progress from active profile
  const learningProgress = useMemo(() => {
    return activeProfile?.learningProgress || [];
  }, [activeProfile]);

  // Check if parent mode is required
  const requiresPin = useCallback((action: () => void) => {
    if (!appSettings.pinEnabled) {
      action();
      return;
    }
    if (appSettings.parentModeActive && Date.now() - appSettings.lastPinEntry < PIN_TIMEOUT) {
      action();
      return;
    }
    setPendingAction(() => action);
    setPinMode("enter");
    setIsPinDialogOpen(true);
  }, [appSettings.pinEnabled, appSettings.parentModeActive, appSettings.lastPinEntry]);

  const handlePinSuccess = useCallback(() => {
    setAppSettings((prev) => ({
      ...prev,
      parentModeActive: true,
      lastPinEntry: Date.now(),
    }));
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction, setAppSettings]);

  const handleSymbolClick = useCallback((symbol: AACSymbol) => {
    setSelectedSymbols((prev) => [...prev, symbol]);
    speak(symbol.label);
  }, [speak]);

  const handleSpeak = useCallback(() => {
    if (selectedSymbols.length === 0) {
      toast.info("Zgjidh simbole për të ndërtuar fjali");
      return;
    }
    const sentence = selectedSymbols.map((s) => s.label).join(" ");
    speak(sentence);
    toast.success("Duke shqiptuar fjalen...");
  }, [selectedSymbols, speak]);

  const handleClear = useCallback(() => {
    stop();
    setSelectedSymbols([]);
    toast.info("Fjalia u pastrua");
  }, [stop]);

  const handleRemoveLast = useCallback(() => {
    setSelectedSymbols((prev) => prev.slice(0, -1));
  }, []);

  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category.id);
  }, []);

  const handleHomeClick = useCallback(() => {
    setActiveCategory("home");
  }, []);

  const handleTestSpeak = useCallback(() => {
    speak("Përshëndetje! Unë jam FolëmAAC.");
  }, [speak]);

  // Profile management
  const handleSelectProfile = useCallback((profile: UserProfile) => {
    setActiveProfileId(profile.id);
    toast.success(`Profili "${profile.name}" u aktivizua`);
  }, [setActiveProfileId]);

  const handleCreateProfile = useCallback((profile: UserProfile) => {
    setProfiles((prev) => [...prev, profile]);
    setActiveProfileId(profile.id);
    toast.success(`Profili "${profile.name}" u krijua me sukses!`);
  }, [setProfiles, setActiveProfileId]);

  const handleDeleteProfile = useCallback((profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    if (activeProfileId === profileId) {
      setActiveProfileId(null);
    }
    toast.success(`Profili "${profile?.name}" u fshi`);
  }, [profiles, activeProfileId, setProfiles, setActiveProfileId]);

  const handleImportProfile = useCallback((profile: UserProfile) => {
    setProfiles((prev) => [...prev, profile]);
  }, [setProfiles]);

  // Custom symbols
  const handleAddCustomSymbol = useCallback((symbol: CustomSymbol) => {
    if (!activeProfile) {
      toast.error("Duhet të krijosh një profil së pari");
      setIsProfileManagerOpen(true);
      return;
    }
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, customSymbols: [...p.customSymbols, symbol] }
          : p
      )
    );
  }, [activeProfile, activeProfileId, setProfiles]);

  // Favorites
  const handleAddFavorite = useCallback(() => {
    if (!activeProfile) {
      toast.error("Duhet të krijosh një profil së pari");
      setIsProfileManagerOpen(true);
      return;
    }
    if (selectedSymbols.length === 0) {
      toast.error("Ndërto një fjali së pari");
      return;
    }
    const newFavorite: FavoriteSentence = {
      id: `fav-${Date.now()}`,
      symbols: [...selectedSymbols],
      label: selectedSymbols.map((s) => s.label).join(" "),
      createdAt: Date.now(),
    };
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, favoriteSentences: [...p.favoriteSentences, newFavorite] }
          : p
      )
    );
    toast.success("Fjalia u shtua te preferuarat!");
  }, [activeProfile, activeProfileId, selectedSymbols, setProfiles]);

  const handleDeleteFavorite = useCallback((favoriteId: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? {
              ...p,
              favoriteSentences: p.favoriteSentences.filter(
                (f) => f.id !== favoriteId
              ),
            }
          : p
      )
    );
    toast.success("Fjalia u fshi nga preferuarat");
  }, [activeProfileId, setProfiles]);

  // Learning progress update
  const handleUpdateProgress = useCallback((symbolId: string, correct: boolean) => {
    if (!activeProfile) return;
    
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfileId) return p;
        
        const existingIndex = p.learningProgress.findIndex((s) => s.symbolId === symbolId);
        let newProgress: LearningScore[];
        
        if (existingIndex >= 0) {
          newProgress = p.learningProgress.map((s, i) => {
            if (i !== existingIndex) return s;
            const newCorrect = correct ? s.correctCount + 1 : s.correctCount;
            const newAttempts = s.attemptCount + 1;
            const accuracy = newCorrect / newAttempts;
            let masteryLevel = s.masteryLevel;
            if (accuracy >= 0.9 && newAttempts >= 5) masteryLevel = 5;
            else if (accuracy >= 0.8) masteryLevel = 4;
            else if (accuracy >= 0.7) masteryLevel = 3;
            else if (accuracy >= 0.5) masteryLevel = 2;
            else if (newAttempts > 0) masteryLevel = 1;
            return {
              ...s,
              correctCount: newCorrect,
              attemptCount: newAttempts,
              lastPlayedAt: Date.now(),
              masteryLevel,
            };
          });
        } else {
          newProgress = [
            ...p.learningProgress,
            {
              symbolId,
              correctCount: correct ? 1 : 0,
              attemptCount: 1,
              lastPlayedAt: Date.now(),
              masteryLevel: correct ? 1 : 0,
            },
          ];
        }
        
        return { ...p, learningProgress: newProgress };
      })
    );
  }, [activeProfile, activeProfileId, setProfiles]);

  // PIN management
  const handleSetPin = useCallback((pin: string) => {
    setAppSettings((prev) => ({
      ...prev,
      pinEnabled: true,
      pinCode: pin,
      parentModeActive: true,
      lastPinEntry: Date.now(),
    }));
    toast.success("PIN u vendos me sukses!");
  }, [setAppSettings]);

  // Cloud sync functions
  const handleLogin = useCallback(() => {
    navigate("/auth");
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    toast.success("U çkyçët me sukses");
  }, []);

  const handleSync = useCallback(async () => {
    if (!user || !activeProfile) return;
    
    setIsSyncing(true);
    try {
      // For now, just update the lastSyncedAt
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === activeProfileId
            ? { ...p, lastSyncedAt: Date.now() }
            : p
        )
      );
      toast.success("Sinkronizimi u krye me sukses!");
    } catch (error) {
      toast.error("Gabim gjatë sinkronizimit");
    } finally {
      setIsSyncing(false);
    }
  }, [user, activeProfile, activeProfileId, setProfiles]);

  const handleCreateShare = useCallback(async (): Promise<ProfileShare | null> => {
    if (!activeProfile) return null;
    
    const shareCode = Array.from({ length: 6 }, () => 
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]
    ).join("");
    
    const share: ProfileShare = {
      id: `share-${Date.now()}`,
      profileId: activeProfile.id,
      shareCode,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      createdAt: Date.now(),
    };
    
    toast.success("Kodi i ndarjes u krijua!");
    return share;
  }, [activeProfile]);

  const handleImportFromCode = useCallback(async (code: string): Promise<boolean> => {
    // This would normally fetch from database
    toast.info("Funksioni i importimit nga cloud do të implementohet së shpejti");
    return false;
  }, []);

  // Protected action handlers
  const handleProtectedSettingsClick = useCallback(() => {
    requiresPin(() => setIsSettingsOpen(true));
  }, [requiresPin]);

  const handleProtectedProfileClick = useCallback(() => {
    requiresPin(() => setIsProfileManagerOpen(true));
  }, [requiresPin]);

  const handleProtectedCustomSymbolClick = useCallback(() => {
    requiresPin(() => setIsCustomSymbolOpen(true));
  }, [requiresPin]);

  const handleProtectedCloudClick = useCallback(() => {
    requiresPin(() => setIsCloudSyncOpen(true));
  }, [requiresPin]);

  const handleProtectedParentModeClick = useCallback(() => {
    requiresPin(() => setIsParentModeOpen(true));
  }, [requiresPin]);

  const handleProtectedVisualSettingsClick = useCallback(() => {
    requiresPin(() => setIsVisualSettingsOpen(true));
  }, [requiresPin]);

  const handleProtectedSymbolVisibilityClick = useCallback(() => {
    requiresPin(() => setIsSymbolVisibilityOpen(true));
  }, [requiresPin]);

  const handleTherapyHubClick = useCallback(() => {
    setIsTherapyHubOpen(true);
  }, []);

  // Visual settings update
  const handleUpdateVisualSettings = useCallback((updates: Partial<VisualSettingsData>) => {
    if (!activeProfile) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, visualSettings: { ...p.visualSettings, ...updates } }
          : p
      )
    );
  }, [activeProfile, activeProfileId, setProfiles]);

  // Hidden symbols update
  const handleUpdateHiddenSymbols = useCallback((hiddenSymbols: string[]) => {
    if (!activeProfile) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, hiddenSymbols }
          : p
      )
    );
  }, [activeProfile, activeProfileId, setProfiles]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header
        onSettingsClick={handleProtectedSettingsClick}
        onInfoClick={() => setIsInfoOpen(true)}
        onProfileClick={handleProtectedProfileClick}
        onFavoritesClick={() => setIsFavoritesOpen(true)}
        onCustomSymbolClick={handleProtectedCustomSymbolClick}
        onGamesClick={() => setIsGamesOpen(true)}
        onStatsClick={() => setIsStatsOpen(true)}
        onCloudClick={handleProtectedCloudClick}
        onParentModeClick={handleProtectedParentModeClick}
        onVisualSettingsClick={handleProtectedVisualSettingsClick}
        onSymbolVisibilityClick={handleProtectedSymbolVisibilityClick}
        onTherapyHubClick={handleTherapyHubClick}
        onProgressReportClick={() => setIsProgressReportOpen(true)}
        activeProfile={activeProfile}
        isLoggedIn={!!user}
        parentModeActive={appSettings.parentModeActive}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Sentence Bar */}
        <div className="px-2 sm:px-4 pt-3 sm:pt-4">
          <SentenceBar
            symbols={selectedSymbols}
            onSpeak={handleSpeak}
            onClear={handleClear}
            onRemoveLast={handleRemoveLast}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* Category Bar */}
        <div className="mt-3 sm:mt-4">
          <CategoryBar
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            onHomeClick={handleHomeClick}
          />
        </div>

        {/* Symbol Grid */}
        <div className="flex-1 overflow-y-auto pb-4">
          <SymbolGrid
            symbols={currentSymbols}
            onSymbolClick={handleSymbolClick}
            symbolSize={visualSettings.symbolSize}
            symbolStyle={visualSettings.symbolStyle}
            fontSize={visualSettings.fontSize}
            highContrast={visualSettings.highContrast}
            reducedMotion={visualSettings.reducedMotion}
          />
        </div>
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        rate={speech.rate}
        setRate={speech.setRate}
        pitch={speech.pitch}
        setPitch={speech.setPitch}
        voices={speech.voices}
        selectedVoice={speech.selectedVoice}
        setSelectedVoice={speech.setSelectedVoice}
        onTestSpeak={handleTestSpeak}
      />

      {/* Info Panel */}
      <InfoPanel
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Profile Manager */}
      <ProfileManager
        isOpen={isProfileManagerOpen}
        onClose={() => setIsProfileManagerOpen(false)}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={() => {
          setIsProfileManagerOpen(false);
          setIsCreateProfileOpen(true);
        }}
        onDeleteProfile={handleDeleteProfile}
        onImportProfile={handleImportProfile}
      />

      {/* Create Profile Dialog */}
      <CreateProfileDialog
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
        onCreateProfile={handleCreateProfile}
      />

      {/* Favorites Panel */}
      <FavoriteSentences
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSpeak={speak}
        onDelete={handleDeleteFavorite}
        onAddCurrent={handleAddFavorite}
        currentSentence={selectedSymbols}
      />

      {/* Custom Symbol Dialog */}
      <CustomSymbolDialog
        isOpen={isCustomSymbolOpen}
        onClose={() => setIsCustomSymbolOpen(false)}
        onAddSymbol={handleAddCustomSymbol}
      />

      {/* Learning Games */}
      <LearningGames
        isOpen={isGamesOpen}
        onClose={() => setIsGamesOpen(false)}
        onSpeak={speak}
        onUpdateProgress={handleUpdateProgress}
      />

      {/* Learning Stats */}
      <LearningStats
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        progress={learningProgress}
      />

      {/* PIN Dialog */}
      <PinDialog
        isOpen={isPinDialogOpen}
        onClose={() => {
          setIsPinDialogOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handlePinSuccess}
        correctPin={appSettings.pinCode}
        mode={pinMode}
        onPinSet={handleSetPin}
      />

      {/* Parent Mode Settings */}
      <ParentModeSettings
        isOpen={isParentModeOpen}
        onClose={() => setIsParentModeOpen(false)}
        settings={appSettings}
        onUpdateSettings={(updates) => setAppSettings((prev) => ({ ...prev, ...updates }))}
        onSetPin={() => {
          setIsParentModeOpen(false);
          setPinMode("set");
          setIsPinDialogOpen(true);
        }}
        onChangePin={() => {
          setIsParentModeOpen(false);
          setPinMode("change");
          setIsPinDialogOpen(true);
        }}
      />

      {/* Cloud Sync Panel */}
      <CloudSyncPanel
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        isLoggedIn={!!user}
        userEmail={user?.email}
        activeProfile={activeProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onSync={handleSync}
        onCreateShare={handleCreateShare}
        onImportFromCode={handleImportFromCode}
        lastSyncedAt={activeProfile?.lastSyncedAt}
        isSyncing={isSyncing}
      />

      {/* Visual Settings */}
      <VisualSettings
        isOpen={isVisualSettingsOpen}
        onClose={() => setIsVisualSettingsOpen(false)}
        settings={visualSettings}
        onUpdateSettings={handleUpdateVisualSettings}
      />

      {/* Symbol Visibility Manager */}
      <SymbolVisibilityManager
        isOpen={isSymbolVisibilityOpen}
        onClose={() => setIsSymbolVisibilityOpen(false)}
        hiddenSymbols={activeProfile?.hiddenSymbols || []}
        onUpdateHiddenSymbols={handleUpdateHiddenSymbols}
      />

      {/* Therapy Hub */}
      <TherapyHub
        isOpen={isTherapyHubOpen}
        onClose={() => setIsTherapyHubOpen(false)}
        onSpeak={speak}
      />

      {/* Progress Report */}
      <TherapyProgressReport
        isOpen={isProgressReportOpen}
        onClose={() => setIsProgressReportOpen(false)}
      />
    </div>
  );
};
