import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  Gift, 
  Trophy,
  Heart,
  Sparkles,
  Plus,
  Trash2,
  Rocket,
  Crown
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Reward {
  id: string;
  emoji: string;
  name: string;
  starsRequired: number;
  claimed: boolean;
}

interface RewardSystemProps {
  onSpeak: (text: string) => void;
}

const defaultRewards = [
  { emoji: "🍭", name: "Ëmbëlsirë", stars: 3 },
  { emoji: "📺", name: "15 min TV", stars: 5 },
  { emoji: "🎮", name: "30 min Lojë", stars: 7 },
  { emoji: "🧸", name: "Lodër e Re", stars: 15 },
  { emoji: "🎢", name: "Park Lojërash", stars: 20 },
  { emoji: "🍕", name: "Picë", stars: 10 },
  { emoji: "🎬", name: "Film", stars: 12 },
  { emoji: "🏖️", name: "Plazh", stars: 25 },
];

export const RewardSystem: React.FC<RewardSystemProps> = ({ onSpeak }) => {
  const [stars, setStars] = useLocalStorage("therapy-stars", 0);
  const [totalEarned, setTotalEarned] = useLocalStorage("therapy-total-stars", 0);
  const [rewards, setRewards] = useLocalStorage<Reward[]>("therapy-rewards", 
    defaultRewards.map((r, i) => ({
      id: `reward-${i}`,
      emoji: r.emoji,
      name: r.name,
      starsRequired: r.stars,
      claimed: false,
    }))
  );
  const [showAddReward, setShowAddReward] = useState(false);
  const [newRewardName, setNewRewardName] = useState("");
  const [newRewardEmoji, setNewRewardEmoji] = useState("🎁");
  const [newRewardStars, setNewRewardStars] = useState(5);
  const [celebration, setCelebration] = useState(false);

  const handleAddStar = () => {
    setStars(stars + 1);
    setTotalEarned(totalEarned + 1);
    onSpeak("Bravo! Një yll!");
    
    // Check for milestones
    const newTotal = totalEarned + 1;
    if (newTotal % 10 === 0) {
      setTimeout(() => {
        onSpeak(`Uau! ${newTotal} yje gjithsej! Shkelqyeshëm!`);
        setCelebration(true);
        setTimeout(() => setCelebration(false), 3000);
      }, 500);
    }
  };

  const handleAddMultipleStars = (count: number) => {
    setStars(stars + count);
    setTotalEarned(totalEarned + count);
    onSpeak(`Bravo! ${count} yje!`);
  };

  const handleClaimReward = (reward: Reward) => {
    if (stars < reward.starsRequired) {
      onSpeak(`Të duhen edhe ${reward.starsRequired - stars} yje`);
      return;
    }
    
    setStars(stars - reward.starsRequired);
    setRewards(rewards.map(r => 
      r.id === reward.id ? { ...r, claimed: true } : r
    ));
    onSpeak(`Bravo! Fitove ${reward.name}!`);
    setCelebration(true);
    setTimeout(() => setCelebration(false), 3000);
  };

  const handleResetReward = (rewardId: string) => {
    setRewards(rewards.map(r => 
      r.id === rewardId ? { ...r, claimed: false } : r
    ));
  };

  const handleAddReward = () => {
    if (!newRewardName.trim()) return;
    const newReward: Reward = {
      id: `reward-${Date.now()}`,
      emoji: newRewardEmoji,
      name: newRewardName,
      starsRequired: newRewardStars,
      claimed: false,
    };
    setRewards([...rewards, newReward]);
    setNewRewardName("");
    setNewRewardEmoji("🎁");
    setNewRewardStars(5);
    setShowAddReward(false);
    onSpeak(`${newRewardName} u shtua te shpërblimet`);
  };

  const handleDeleteReward = (rewardId: string) => {
    setRewards(rewards.filter(r => r.id !== rewardId));
  };

  const availableRewards = rewards.filter(r => !r.claimed);
  const claimedRewards = rewards.filter(r => r.claimed);

  return (
    <div className="space-y-6 relative">
      {/* Celebration Overlay */}
      {celebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-bounce-in">🎉</div>
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-animation"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                {["⭐", "🌟", "✨", "💫"][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stars Display */}
      <Card className="p-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-lg">
              <Star className="w-10 h-10 text-white fill-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Yjet e Mi</p>
              <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">
                {stars}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Gjithsej</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              <Trophy className="w-5 h-5 text-amber-500" />
              {totalEarned}
            </p>
          </div>
        </div>

        {/* Quick Add Stars */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleAddStar}
            className="flex-1 min-w-[100px] h-16 text-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg hover:scale-105 transition-transform"
          >
            <Star className="w-6 h-6 mr-2 fill-white" />
            +1 Yll
          </Button>
          <Button
            onClick={() => handleAddMultipleStars(3)}
            variant="outline"
            className="h-16 text-lg border-amber-400 hover:bg-amber-100"
          >
            +3 ⭐
          </Button>
          <Button
            onClick={() => handleAddMultipleStars(5)}
            variant="outline"
            className="h-16 text-lg border-amber-400 hover:bg-amber-100"
          >
            +5 🌟
          </Button>
        </div>
      </Card>

      {/* Level Progress */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <Rocket className="w-6 h-6 text-primary" />
          <span className="font-bold">Niveli</span>
          <Crown className="w-6 h-6 text-amber-500 ml-auto" />
          <span className="text-xl font-bold">{Math.floor(totalEarned / 10) + 1}</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${(totalEarned % 10) * 10}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1 text-center">
          {10 - (totalEarned % 10)} yje deri në nivelin e ardhshëm
        </p>
      </Card>

      {/* Available Rewards */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Shpërblimet
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableRewards.map((reward) => {
            const canClaim = stars >= reward.starsRequired;
            const progress = Math.min((stars / reward.starsRequired) * 100, 100);
            
            return (
              <Card
                key={reward.id}
                className={`p-4 relative overflow-hidden transition-all duration-300 ${
                  canClaim 
                    ? "border-primary shadow-lg cursor-pointer hover:scale-105 bg-gradient-to-br from-primary/10 to-secondary/10" 
                    : "opacity-80"
                }`}
                onClick={() => canClaim && handleClaimReward(reward)}
              >
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-4xl">{reward.emoji}</span>
                  <p className="font-bold mt-2 text-sm">{reward.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className={`font-bold ${canClaim ? "text-primary" : ""}`}>
                      {reward.starsRequired}
                    </span>
                  </div>
                  {canClaim && (
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 left-1 opacity-50 hover:opacity-100 p-1 h-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteReward(reward.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Add New Reward */}
        {showAddReward ? (
          <Card className="p-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="🎁"
                value={newRewardEmoji}
                onChange={(e) => setNewRewardEmoji(e.target.value)}
                className="w-16 text-center text-2xl"
              />
              <Input
                placeholder="Emri"
                value={newRewardName}
                onChange={(e) => setNewRewardName(e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" />
                <Input
                  type="number"
                  value={newRewardStars}
                  onChange={(e) => setNewRewardStars(Number(e.target.value))}
                  className="w-16"
                  min={1}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddReward} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Shto
              </Button>
              <Button variant="outline" onClick={() => setShowAddReward(false)}>
                Anulo
              </Button>
            </div>
          </Card>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAddReward(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Shto Shpërblim të Ri
          </Button>
        )}
      </div>

      {/* Claimed Rewards */}
      {claimedRewards.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Shpërblimet e Fituara
          </h3>
          <div className="flex flex-wrap gap-2">
            {claimedRewards.map((reward) => (
              <Button
                key={reward.id}
                variant="outline"
                className="border-green-300 bg-green-50 dark:bg-green-900/20"
                onClick={() => handleResetReward(reward.id)}
              >
                <span className="mr-1">{reward.emoji}</span>
                {reward.name}
                <Heart className="w-3 h-3 ml-1 text-green-500 fill-green-500" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
