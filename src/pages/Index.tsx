import { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";
import { Moon, Sun } from "lucide-react";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/Dashboard";
import ActivityTracker from "@/components/ActivityTracker";
import MonkTimer from "@/components/MonkTimer";
import StreakPanel from "@/components/StreakPanel";

interface ActivityEntry {
  date: string;
  conversationsStarted: number;
  outreachSent: number;
  callsBooked: number;
  callsHeld: number;
  dealsClosed: number;
}

interface IndexProps {
  isActive: boolean;
  timeRemaining: number;
  sessionDates: string[];
  setSessionDates: Dispatch<SetStateAction<string[]>>;
  onStartSession: () => void;
  onEndSession: () => void;
  alarmEnabled: boolean;
  setAlarmEnabled: Dispatch<SetStateAction<boolean>>;
}

const Index = ({
  isActive,
  timeRemaining,
  sessionDates,
  setSessionDates,
  onStartSession,
  onEndSession,
  alarmEnabled,
  setAlarmEnabled,
}: IndexProps) => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // Revenue Dashboard State
  const [monthlyTarget, setMonthlyTarget] = useState<string>(() =>
    localStorage.getItem("monthlyRevenueTarget") || "10000"
  );
  const [offerPrice, setOfferPrice] = useState<string>(() =>
    localStorage.getItem("offerPrice") || "2500"
  );
  const [clientTarget, setClientTarget] = useState<string>(() =>
    localStorage.getItem("clientTarget") || "4"
  );

  // Activity Log State
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(() => {
    const saved = localStorage.getItem("activityLog");
    return saved ? JSON.parse(saved) : [];
  });

  const [longestStreak, setLongestStreak] = useState<number>(() => {
    const saved = localStorage.getItem("longestStreak");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Derived State: totalDealsClosed
  const totalDealsClosed = useMemo(() => {
    return activityLog.reduce((sum, entry) => sum + (Number(entry.dealsClosed) || 0), 0);
  }, [activityLog]);

  // Streak Calculation Logic
  const getStreak = (dates: string[]) => {
    if (dates.length === 0) return 0;

    const sortedDates = [...new Set(dates)]
      .map(d => parseISO(d))
      .sort((a, b) => b.getTime() - a.getTime());

    const today = new Date();
    const yesterday = subDays(today, 1);

    let currentStreak = 0;
    let checkDate = today;

    // If today is completed, start from today. 
    // If not, check if yesterday was completed to keep streak alive.
    const hasToday = sortedDates.some(d => isSameDay(d, today));
    const hasYesterday = sortedDates.some(d => isSameDay(d, yesterday));

    if (!hasToday && !hasYesterday) return 0;

    checkDate = hasToday ? today : yesterday;

    for (const d of sortedDates) {
      if (isSameDay(d, checkDate)) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else if (d < checkDate) {
        break; // Gap found
      }
    }

    return currentStreak;
  };

  const revenueDates = useMemo(() => {
    return activityLog
      .filter(entry => Number(entry.conversationsStarted) > 0 || Number(entry.callsBooked) > 0)
      .map(entry => entry.date);
  }, [activityLog]);

  const currentRevenueStreak = useMemo(() => getStreak(revenueDates), [revenueDates]);
  const currentMonkStreak = useMemo(() => getStreak(sessionDates), [sessionDates]);

  const fullMonkDates = useMemo(() => {
    return sessionDates.filter(date => revenueDates.includes(date));
  }, [sessionDates, revenueDates]);

  const currentFullMonkStreak = useMemo(() => getStreak(fullMonkDates), [fullMonkDates]);

  // Update Longest Streak
  useEffect(() => {
    const maxCurrent = Math.max(currentRevenueStreak, currentMonkStreak, currentFullMonkStreak);
    if (maxCurrent > longestStreak) {
      setLongestStreak(maxCurrent);
      localStorage.setItem("longestStreak", maxCurrent.toString());
    }
  }, [currentRevenueStreak, currentMonkStreak, currentFullMonkStreak, longestStreak]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem("monthlyRevenueTarget", monthlyTarget);
  }, [monthlyTarget]);

  useEffect(() => {
    localStorage.setItem("offerPrice", offerPrice);
  }, [offerPrice]);

  useEffect(() => {
    localStorage.setItem("clientTarget", clientTarget);
  }, [clientTarget]);

  useEffect(() => {
    localStorage.setItem("activityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  const handleClearLog = () => {
    if (confirm("Are you sure you want to clear all activity? This cannot be undone.")) {
      setActivityLog([]);
      setSessionDates([]);
      setLongestStreak(0);
      localStorage.removeItem("longestStreak");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Monk Mode Revenue OS
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Focus. Execute. Close.
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>

        <div className="space-y-6">
          <Dashboard
            monthlyTarget={monthlyTarget}
            setMonthlyTarget={setMonthlyTarget}
            offerPrice={offerPrice}
            setOfferPrice={setOfferPrice}
            clientTarget={clientTarget}
            setClientTarget={setClientTarget}
            dealsClosed={totalDealsClosed}
          />
          <ActivityTracker
            log={activityLog}
            setLog={setActivityLog}
            onClearLog={handleClearLog}
          />
          <MonkTimer
            isActive={isActive}
            timeRemaining={timeRemaining}
            sessionDates={sessionDates}
            onStartSession={onStartSession}
            onEndSession={onEndSession}
            alarmEnabled={alarmEnabled}
            setAlarmEnabled={setAlarmEnabled}
          />
          <StreakPanel
            revenueStreak={currentRevenueStreak}
            monkStreak={currentMonkStreak}
            fullMonkStreak={currentFullMonkStreak}
            longestStreak={longestStreak}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
