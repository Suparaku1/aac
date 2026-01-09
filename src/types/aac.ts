import { AACSymbol } from "@/data/aacSymbols";

export interface CustomSymbol extends AACSymbol {
  imageUrl?: string;
  isCustom: true;
}

export interface FavoriteSentence {
  id: string;
  symbols: AACSymbol[];
  label: string;
  createdAt: number;
}

export interface LearningScore {
  symbolId: string;
  correctCount: number;
  attemptCount: number;
  lastPlayedAt: number | null;
  masteryLevel: number; // 0-5
}

export type SymbolSize = "sm" | "md" | "lg" | "xl";
export type SymbolStyle = "default" | "rounded" | "minimal" | "bold";

export interface VisualSettings {
  symbolSize: SymbolSize;
  symbolStyle: SymbolStyle;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number; // 0.8 - 1.4
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: number;
  customSymbols: CustomSymbol[];
  favoriteSentences: FavoriteSentence[];
  learningProgress: LearningScore[];
  hiddenSymbols: string[]; // IDs of symbols hidden for this profile
  visualSettings: VisualSettings;
  settings: {
    rate: number;
    pitch: number;
    selectedVoice: string;
  };
  // Cloud-specific fields
  cloudId?: string;
  pinCode?: string;
  isTherapist?: boolean;
  lastSyncedAt?: number;
}

export interface ProfileShare {
  id: string;
  profileId: string;
  shareCode: string;
  expiresAt: number;
  createdAt: number;
}

export interface AppSettings {
  pinEnabled: boolean;
  pinCode: string;
  parentModeActive: boolean;
  lastPinEntry: number;
}
