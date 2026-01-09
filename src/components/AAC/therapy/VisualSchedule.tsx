import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Sun, 
  Moon, 
  Utensils, 
  Bath, 
  Shirt, 
  Bed,
  BookOpen,
  Play,
  Bus,
  Home,
  Check,
  Plus,
  Trash2,
  GripVertical,
  Sparkles
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface ScheduleItem {
  id: string;
  emoji: string;
  label: string;
  completed: boolean;
  time?: string;
}

interface VisualScheduleProps {
  onSpeak: (text: string) => void;
}

const defaultActivities = [
  { emoji: "🌅", label: "Zgjohem", icon: Sun },
  { emoji: "🪥", label: "Laj dhëmbët", icon: Bath },
  { emoji: "👕", label: "Vishem", icon: Shirt },
  { emoji: "🥣", label: "Mëngjes", icon: Utensils },
  { emoji: "🚌", label: "Shkoj në shkollë", icon: Bus },
  { emoji: "📚", label: "Mësim", icon: BookOpen },
  { emoji: "🍽️", label: "Drekë", icon: Utensils },
  { emoji: "🎮", label: "Luaj", icon: Play },
  { emoji: "🏠", label: "Kthehem në shtëpi", icon: Home },
  { emoji: "🍝", label: "Darkë", icon: Utensils },
  { emoji: "🛁", label: "Lahem", icon: Bath },
  { emoji: "😴", label: "Fle", icon: Bed },
];

const scheduleTemplates = [
  {
    name: "Dita e Shkollës",
    items: ["🌅", "🪥", "👕", "🥣", "🚌", "📚", "🍽️", "🏠", "🎮", "🍝", "🛁", "😴"]
  },
  {
    name: "Fundjavë",
    items: ["🌅", "🪥", "👕", "🥣", "🎮", "🍽️", "🏞️", "🍝", "🛁", "😴"]
  },
  {
    name: "Ditë Terapie",
    items: ["🌅", "🪥", "👕", "🥣", "🏥", "🎮", "🍽️", "📚", "🍝", "🛁", "😴"]
  }
];

export const VisualSchedule: React.FC<VisualScheduleProps> = ({ onSpeak }) => {
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>("therapy-schedule", []);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemEmoji, setNewItemEmoji] = useState("⭐");

  const handleAddFromDefault = (activity: typeof defaultActivities[0]) => {
    const newItem: ScheduleItem = {
      id: `item-${Date.now()}`,
      emoji: activity.emoji,
      label: activity.label,
      completed: false,
    };
    setSchedule([...schedule, newItem]);
    onSpeak(`${activity.label} u shtua në orar`);
  };

  const handleAddCustom = () => {
    if (!newItemLabel.trim()) return;
    const newItem: ScheduleItem = {
      id: `item-${Date.now()}`,
      emoji: newItemEmoji,
      label: newItemLabel,
      completed: false,
    };
    setSchedule([...schedule, newItem]);
    setNewItemLabel("");
    setNewItemEmoji("⭐");
    setShowAddNew(false);
    onSpeak(`${newItemLabel} u shtua në orar`);
  };

  const handleToggleComplete = (id: string) => {
    setSchedule(schedule.map(item => {
      if (item.id === id) {
        const newCompleted = !item.completed;
        onSpeak(newCompleted ? `${item.label} u krye! Bravo!` : item.label);
        return { ...item, completed: newCompleted };
      }
      return item;
    }));
  };

  const handleRemove = (id: string) => {
    setSchedule(schedule.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setSchedule([]);
    onSpeak("Orari u pastrua");
  };

  const handleResetProgress = () => {
    setSchedule(schedule.map(item => ({ ...item, completed: false })));
    onSpeak("Progresi u rivendos");
  };

  const handleLoadTemplate = (template: typeof scheduleTemplates[0]) => {
    const newSchedule = template.items.map((emoji, index) => {
      const activity = defaultActivities.find(a => a.emoji === emoji) || {
        emoji,
        label: emoji,
      };
      return {
        id: `item-${Date.now()}-${index}`,
        emoji: activity.emoji,
        label: activity.label,
        completed: false,
      };
    });
    setSchedule(newSchedule);
    onSpeak(`Orari "${template.name}" u ngarkua`);
  };

  const completedCount = schedule.filter(item => item.completed).length;
  const progress = schedule.length > 0 ? (completedCount / schedule.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {schedule.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">Progresi i Ditës</span>
            <span className="text-2xl font-bold text-primary">
              {completedCount}/{schedule.length}
            </span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <div className="mt-3 text-center">
              <span className="text-2xl">🎉</span>
              <span className="font-bold text-primary ml-2">Bravo! I kreve të gjitha!</span>
            </div>
          )}
        </Card>
      )}

      {/* Templates */}
      {schedule.length === 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Zgjidh një Orar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {scheduleTemplates.map((template) => (
              <Button
                key={template.name}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/10 hover:border-primary"
                onClick={() => handleLoadTemplate(template)}
              >
                <span className="text-2xl">{template.items.slice(0, 3).join("")}</span>
                <span className="font-bold">{template.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Current Schedule */}
      {schedule.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Orari i Sotëm</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleResetProgress}>
                Rifillo
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {schedule.map((item, index) => (
              <Card
                key={item.id}
                className={`p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer hover:shadow-md ${
                  item.completed 
                    ? "bg-green-100 dark:bg-green-900/30 border-green-300" 
                    : "hover:bg-primary/5"
                }`}
                onClick={() => handleToggleComplete(item.id)}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="w-4 h-4" />
                  <span className="font-bold">{index + 1}</span>
                </div>
                <span className="text-4xl">{item.emoji}</span>
                <span className={`flex-1 text-xl font-bold ${
                  item.completed ? "line-through text-muted-foreground" : ""
                }`}>
                  {item.label}
                </span>
                {item.completed && (
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center animate-scale-up">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  className="opacity-50 hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Activities */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Shto Aktivitete</h3>
        
        {/* Quick Add */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {defaultActivities.map((activity) => (
            <Button
              key={activity.emoji}
              variant="outline"
              className="h-auto py-3 flex flex-col gap-1 hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all"
              onClick={() => handleAddFromDefault(activity)}
            >
              <span className="text-2xl">{activity.emoji}</span>
              <span className="text-xs font-medium truncate w-full">{activity.label}</span>
            </Button>
          ))}
        </div>

        {/* Custom Add */}
        {showAddNew ? (
          <Card className="p-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Emoji (p.sh. ⭐)"
                value={newItemEmoji}
                onChange={(e) => setNewItemEmoji(e.target.value)}
                className="w-20 text-center text-2xl"
              />
              <Input
                placeholder="Emri i aktivitetit"
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                className="flex-1 text-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCustom} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Shto
              </Button>
              <Button variant="outline" onClick={() => setShowAddNew(false)}>
                Anulo
              </Button>
            </div>
          </Card>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAddNew(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Shto Aktivitet të Ri
          </Button>
        )}
      </div>
    </div>
  );
};
