import { useState, useEffect, useRef } from "react";
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    alert("Monk Session Complete! Focus maintained.");
    navigate("/");
  };

  const startSession = () => {
    setIsActive(true);
    navigate("/focus");
  };

  const endSession = () => {
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
