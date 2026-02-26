import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

const TIMER_DURATION = 5400; // 90 minutes in seconds

interface MonkTimerProps {
  isActive: boolean;
  timeRemaining: number;
  sessionDates: string[];
  onStartSession: () => void;
  onEndSession: () => void;
}

const MonkTimer = ({
  isActive,
  timeRemaining,
  sessionDates,
  onStartSession,
  onEndSession
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
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Sessions Completed</p>
          <p className="font-mono text-xl font-bold text-foreground">{sessionDates.length}</p>
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
