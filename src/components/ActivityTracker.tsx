import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActivityEntry {
  date: string;
  conversationsStarted: number;
  outreachSent: number;
  callsBooked: number;
  callsHeld: number;
  dealsClosed: number;
}

interface ActivityTrackerProps {
  log: ActivityEntry[];
  setLog: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
  onClearLog: () => void;
}

const ActivityTracker = ({ log, setLog, onClearLog }: ActivityTrackerProps) => {
  const [conversationsStarted, setConversationsStarted] = useState<string>("0");
  const [outreachSent, setOutreachSent] = useState<string>("0");
  const [callsBooked, setCallsBooked] = useState<string>("0");
  const [callsHeld, setCallsHeld] = useState<string>("0");
  const [dealsClosed, setDealsClosed] = useState<string>("0");

  const handleSave = () => {
    const today = new Date().toISOString().split("T")[0];

    setLog((prev) => {
      const newEntry: ActivityEntry = {
        date: today,
        conversationsStarted: Number(conversationsStarted),
        outreachSent: Number(outreachSent),
        callsBooked: Number(callsBooked),
        callsHeld: Number(callsHeld),
        dealsClosed: Number(dealsClosed),
      };

      // Check for duplicate date
      const existingIndex = prev.findIndex((entry) => entry.date === today);

      if (existingIndex !== -1) {
        // Replace existing entry
        const updatedLog = [...prev];
        updatedLog[existingIndex] = newEntry;
        return updatedLog;
      } else {
        // Append to front
        return [newEntry, ...prev];
      }
    });

    // Clear fields
    setConversationsStarted("0");
    setOutreachSent("0");
    setCallsBooked("0");
    setCallsHeld("0");
    setDealsClosed("0");
  };

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground tracking-tight">Daily Revenue Actions</h2>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Field label="Conversations Started" value={conversationsStarted} onChange={setConversationsStarted} />
        <Field label="Outreach Sent" value={outreachSent} onChange={setOutreachSent} />
        <Field label="Calls Booked" value={callsBooked} onChange={setCallsBooked} />
        <Field label="Calls Held" value={callsHeld} onChange={setCallsHeld} />
        <Field label="Deals Closed" value={dealsClosed} onChange={setDealsClosed} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Save Today's Activity
        </Button>
        <Button
          variant="outline"
          onClick={onClearLog}
          className="w-full sm:w-auto text-destructive hover:bg-destructive/10"
        >
          Clear All Activity
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Activity Log</h3>
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Convs</TableHead>
                <TableHead className="text-xs">Outreach</TableHead>
                <TableHead className="text-xs">Calls Bk</TableHead>
                <TableHead className="text-xs">Calls Hd</TableHead>
                <TableHead className="text-xs">Closed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {log.map((entry, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-sm">{entry.date}</TableCell>
                  <TableCell className="font-mono text-sm">{entry.conversationsStarted}</TableCell>
                  <TableCell className="font-mono text-sm">{entry.outreachSent}</TableCell>
                  <TableCell className="font-mono text-sm">{entry.callsBooked}</TableCell>
                  <TableCell className="font-mono text-sm">{entry.callsHeld}</TableCell>
                  <TableCell className="font-mono text-sm font-bold">{entry.dealsClosed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="mb-1.5 block text-xs text-muted-foreground">{label}</label>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-mono"
    />
  </div>
);

export default ActivityTracker;
