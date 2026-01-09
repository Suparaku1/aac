import React from "react";
import { Settings, Info, User, Star, PlusCircle, Gamepad2, BarChart3, Cloud, ShieldCheck, Eye, EyeOff, Heart, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/aac";

interface HeaderProps {
  onSettingsClick: () => void;
  onInfoClick: () => void;
  onProfileClick: () => void;
  onFavoritesClick: () => void;
  onCustomSymbolClick: () => void;
  onGamesClick: () => void;
  onStatsClick: () => void;
  onCloudClick: () => void;
  onParentModeClick: () => void;
  onVisualSettingsClick: () => void;
  onSymbolVisibilityClick: () => void;
  onTherapyHubClick: () => void;
  onProgressReportClick: () => void;
  activeProfile: UserProfile | null;
  isLoggedIn: boolean;
  parentModeActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onInfoClick,
  onProfileClick,
  onFavoritesClick,
  onCustomSymbolClick,
  onGamesClick,
  onStatsClick,
  onCloudClick,
  onParentModeClick,
  onVisualSettingsClick,
  onSymbolVisibilityClick,
  onTherapyHubClick,
  onProgressReportClick,
  activeProfile,
  isLoggedIn,
  parentModeActive,
}) => {
  return (
    <header className="bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground shadow-lg aac-shadow-lg">
      <div className="flex items-center justify-between px-3 py-3 sm:px-6 sm:py-5">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/25 rounded-2xl flex items-center justify-center float-animation glow">
            <span className="text-2xl sm:text-4xl">💬</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              FolëmAAC
            </h1>
            {activeProfile && (
              <p className="text-xs sm:text-sm opacity-90 truncate max-w-[100px] sm:max-w-none font-medium">
                ✨ {activeProfile.name}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Therapy Hub */}
          <button
            onClick={onTherapyHubClick}
            className={cn(
              "p-2 sm:p-4 rounded-2xl",
              "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "hover:glow shadow-lg shadow-pink-500/30"
            )}
            aria-label="Qendra Terapeutike"
            title="Qendra Terapeutike"
          >
            <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </button>

          {/* Games */}
          <button
            onClick={onGamesClick}
            className={cn(
              "p-2 sm:p-4 rounded-2xl",
              "bg-white/25 hover:bg-white/40",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "hover:glow"
            )}
            aria-label="Lojëra"
            title="Lojëra Mësimore"
          >
            <Gamepad2 className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          {/* Stats */}
          <button
            onClick={onStatsClick}
            className={cn(
              "p-2 sm:p-4 rounded-2xl",
              "bg-white/25 hover:bg-white/40",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "hover:glow"
            )}
            aria-label="Statistika"
            title="Statistikat e Mësimit"
          >
            <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          {/* Progress Report - only in parent mode */}
          {parentModeActive && (
            <button
              onClick={onProgressReportClick}
              className={cn(
                "p-2 sm:p-4 rounded-2xl",
                "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400",
                "transition-all duration-200 hover:scale-110 active:scale-95",
                "hover:glow shadow-lg shadow-emerald-500/30"
              )}
              aria-label="Raport Progresi"
              title="Raporti i Progresit për Terapistët"
            >
              <FileBarChart className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </button>
          )}

          {/* Favorites */}
          <button
            onClick={onFavoritesClick}
            className={cn(
              "p-2 sm:p-4 rounded-2xl",
              "bg-white/25 hover:bg-white/40",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "hover:glow"
            )}
            aria-label="Preferuarat"
            title="Fjalitë e Preferuara"
          >
            <Star className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          {/* Add Custom Symbol */}
          <button
            onClick={onCustomSymbolClick}
            className={cn(
              "p-2 sm:p-4 rounded-2xl",
              "bg-white/25 hover:bg-white/40",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "hover:glow"
            )}
            aria-label="Shto Simbol"
            title="Shto Simbol të Ri"
          >
            <PlusCircle className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          {/* Visual Settings - only in parent mode */}
          {parentModeActive && (
            <button
              onClick={onVisualSettingsClick}
              className={cn(
                "p-2 sm:p-4 rounded-2xl",
                "bg-secondary/70 hover:bg-secondary",
                "transition-all duration-200 hover:scale-110 active:scale-95",
                "hover:glow animate-pulse-soft"
              )}
              aria-label="Cilësimet Vizuale"
              title="Madhësia dhe Stili i Simboleve"
            >
              <Eye className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          )}

          {/* Symbol Visibility - only in parent mode */}
          {parentModeActive && (
            <button
              onClick={onSymbolVisibilityClick}
              className={cn(
                "p-2 sm:p-4 rounded-2xl",
                "bg-accent/70 hover:bg-accent",
                "transition-all duration-200 hover:scale-110 active:scale-95",
                "hover:glow animate-pulse-soft"
              )}
              aria-label="Menaxho Simbolet"
              title="Zgjidh cilat simbole të shfaqen"
            >
              <EyeOff className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          )}

          {/* Cloud Sync */}
          <button
            onClick={onCloudClick}
            className={cn(
              "p-2 sm:p-4 rounded-2xl relative",
              "bg-white/25 hover:bg-white/40",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "hover:glow"
            )}
            aria-label="Cloud"
            title="Sinkronizo në Cloud"
          >
            <Cloud className="w-5 h-5 sm:w-7 sm:h-7" />
            {isLoggedIn && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-sparkle" />
            )}
          </button>

          {/* Profile */}
          <button
            onClick={onProfileClick}
            className={cn(
              "p-2 sm:p-4 rounded-2xl",
              "bg-white/25 hover:bg-white/40",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "hover:glow"
            )}
            aria-label="Profili"
            title="Menaxho Profilet"
          >
            <User className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          {/* Parent Mode */}
          <button
            onClick={onParentModeClick}
            className={cn(
              "p-2 sm:p-4 rounded-2xl relative",
              parentModeActive ? "bg-green-400/60 animate-sparkle" : "bg-white/25",
              "hover:bg-white/40",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "hover:glow"
            )}
            aria-label="Modaliteti Prind"
            title="Modaliteti Prind/Terapist"
          >
            <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className={cn(
              "p-2 sm:p-4 rounded-2xl",
              "bg-white/25 hover:bg-white/40",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "hover:glow"
            )}
            aria-label="Cilësimet"
            title="Cilësimet"
          >
            <Settings className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        </div>
      </div>
    </header>
  );
};
