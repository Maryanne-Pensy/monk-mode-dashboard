interface StreakPanelProps {
  revenueStreak: number;
  monkStreak: number;
  fullMonkStreak: number;
  longestStreak: number;
}

const StreakPanel = ({
  revenueStreak,
  monkStreak,
  fullMonkStreak,
  longestStreak,
}: StreakPanelProps) => {
  const streaks = [
    { label: "Current Revenue Action Streak", value: revenueStreak },
    { label: "Current Monk Mode Streak", value: monkStreak },
    { label: "Full Monk Day Streak", value: fullMonkStreak },
    { label: "Longest Streak", value: longestStreak },
  ];

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground tracking-tight">Momentum</h2>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {streaks.map((s) => (
          <div key={s.label} className="rounded-md border border-border bg-secondary/50 p-4 text-center">
            <p className="text-3xl font-bold font-mono text-foreground">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground leading-tight">{s.label}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StreakPanel;
