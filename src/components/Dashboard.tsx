import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface DashboardProps {
  monthlyTarget: string;
  setMonthlyTarget: (v: string) => void;
  offerPrice: string;
  setOfferPrice: (v: string) => void;
  clientTarget: string;
  setClientTarget: (v: string) => void;
  dealsClosed: number;
}

const Dashboard = ({
  monthlyTarget,
  setMonthlyTarget,
  offerPrice,
  setOfferPrice,
  clientTarget,
  setClientTarget,
  dealsClosed,
}: DashboardProps) => {
  const target = Number(monthlyTarget) || 0;
  const price = Number(offerPrice) || 0;
  const clients = Number(clientTarget) || 0;

  // Automated calculations
  const revenueBooked = dealsClosed * price;
  const remaining = Math.max(target - revenueBooked, 0);
  const clientsBooked = dealsClosed;
  const clientsRemaining = Math.max(clients - clientsBooked, 0);
  const progress = target > 0 ? Math.min((revenueBooked / target) * 100, 100) : 0;

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground tracking-tight">Revenue Target</h2>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Monthly Revenue Target ($)</label>
          <Input
            type="number"
            value={monthlyTarget}
            onChange={(e) => setMonthlyTarget(e.target.value)}
            className="font-mono"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Offer Price ($)</label>
          <Input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            className="font-mono"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Client Target</label>
          <Input
            type="number"
            value={clientTarget}
            onChange={(e) => setClientTarget(e.target.value)}
            className="font-mono"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Revenue Booked" value={`$${revenueBooked.toLocaleString()}`} />
        <Stat label="Revenue Remaining" value={`$${remaining.toLocaleString()}`} />
        <Stat label="Clients Booked" value={String(clientsBooked)} />
        <Stat label="Clients Remaining" value={String(clientsRemaining)} />
      </div>

      <div className="mt-6">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Revenue Progress</span>
          <span className="font-mono text-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </section>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border border-border bg-secondary/50 p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-xl font-semibold font-mono text-foreground">{value}</p>
  </div>
);

export default Dashboard;
