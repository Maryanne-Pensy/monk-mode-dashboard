import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import FocusMode from "./pages/FocusMode";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const TIMER_DURATION = 5400; // 90 minutes in seconds

const AppContent = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [sessionDates, setSessionDates] = useState<string[]>(() => {
    const saved = localStorage.getItem("monkSessionDates");
    return saved ? JSON.parse(saved) : [];
  });
  const [alarmEnabled, setAlarmEnabled] = useState(() => {
    const saved = localStorage.getItem("alarmEnabled");
    return saved ? JSON.parse(saved) : true;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem("alarmEnabled", JSON.stringify(alarmEnabled));
  }, [alarmEnabled]);

  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  const playAlarm = () => {
    if (!alarmEnabled) return;

    // Stop any existing alarm before starting a new one
    stopAlarm();

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const triggerChime = () => {
      const playTone = (freq: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(freq, startTime);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;
      playTone(880, now, 1); // A5
      playTone(1108.73, now + 0.1, 1); // C#6
      playTone(1318.51, now + 0.2, 1); // E6
    };

    // Play immediately then repeat every 3 seconds
    triggerChime();
    alarmIntervalRef.current = setInterval(triggerChime, 3000);
  };

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeRemaining]);

  const handleComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const today = new Date().toISOString().split("T")[0];
    setSessionDates((prev) => {
      const updated = prev.includes(today) ? prev : [...prev, today];
      localStorage.setItem("monkSessionDates", JSON.stringify(updated));
      return updated;
    });

    setIsActive(false);
    setTimeRemaining(TIMER_DURATION);

    playAlarm();

    toast("Monk Session Complete!", {
      description: "Focus maintained. Great work.",
      duration: Infinity,
      action: {
        label: "Stop Alarm",
        onClick: stopAlarm,
      },
    });

    navigate("/");
  };

  const startSession = () => {
    stopAlarm();
    setIsActive(true);
    navigate("/focus");
  };

  const endSession = () => {
    stopAlarm();
    setIsActive(false);
    setTimeRemaining(TIMER_DURATION);
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Index
            isActive={isActive}
            timeRemaining={timeRemaining}
            sessionDates={sessionDates}
            setSessionDates={setSessionDates}
            onStartSession={startSession}
            onEndSession={endSession}
            alarmEnabled={alarmEnabled}
            setAlarmEnabled={setAlarmEnabled}
          />
        }
      />
      <Route
        path="/focus"
        element={
          <FocusMode
            timeRemaining={timeRemaining}
            onEndSession={endSession}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
