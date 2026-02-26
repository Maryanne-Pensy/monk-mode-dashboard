import { Button } from "@/components/ui/button";

interface FocusModeProps {
    timeRemaining: number;
    onEndSession: () => void;
}

const FocusMode = ({ timeRemaining, onEndSession }: FocusModeProps) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground transition-colors duration-700">
            <div className="w-full max-w-xl text-center">
                <h1 className="text-xl font-medium tracking-widest text-muted-foreground uppercase mb-12">
                    Monk Mode Deep Work
                </h1>

                <p className="font-mono text-[10rem] font-bold leading-none tracking-tighter text-primary animate-pulse-slow">
                    {formatTime(timeRemaining)}
                </p>

                <p className="mt-12 text-lg text-muted-foreground italic">
                    "The soul of the session is silence."
                </p>

                <div className="mt-16">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onEndSession}
                        className="px-12 py-6 text-lg border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-300"
                    >
                        End Session
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FocusMode;
