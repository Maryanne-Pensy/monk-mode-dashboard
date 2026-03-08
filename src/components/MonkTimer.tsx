import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Volume2, VolumeX } from "lucide-react";

const TIMER_DURATION = 5400; // 90 minutes in seconds

interface MonkTimerProps {
  isActive: boolean;
  timeRemaining: number;
  sessionDates: string[];
  onStartSession: () => void;
  onEndSession: () => void;
  alarmEnabled: boolean;
  setAlarmEnabled: Dispatch<SetStateAction<boolean>>;
}

const MonkTimer = ({
  isActive,
  timeRemaining,
  sessionDates,
  onStartSession,
  onEndSession,
  alarmEnabled,
  setAlarmEnabled
}: MonkTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Monk Mode</h2>
        <div className="text-right flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor="alarm-toggle" className="cursor-pointer">
              {alarmEnabled ? (
                <Volume2 className="h-4 w-4 text-primary" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </Label>
            <Switch
              id="alarm-toggle"
              checked={alarmEnabled}
              onCheckedChange={setAlarmEnabled}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Sessions Completed</p>
            <p className="font-mono text-xl font-bold text-foreground">{sessionDates.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <p
          className={`font-mono text-7xl font-bold tracking-tighter transition-colors duration-500 ${isActive ? "text-primary" : "text-muted-foreground"
            }`}
        >
          {formatTime(timeRemaining)}
        </p>

        <p className="mt-3 text-sm text-muted-foreground italic">
          "Silence builds revenue."
        </p>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={onStartSession}
            disabled={isActive}
            className="w-32"
          >
            Start Session
          </Button>
          <Button
            variant="outline"
            onClick={onEndSession}
            disabled={!isActive}
            className="w-32"
          >
            End Session
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MonkTimer;
