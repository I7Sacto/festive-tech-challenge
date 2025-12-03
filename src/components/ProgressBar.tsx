import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}

const ProgressBar = ({ progress, className, showLabel = true, animated = true }: ProgressBarProps) => {
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Прогрес</span>
          <span className="text-sm font-bold text-christmas-gold">{progress}%</span>
        </div>
      )}
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full bg-gradient-gold rounded-full transition-all duration-1000",
            animated && "progress-animated"
          )}
          style={{ 
            "--progress-width": `${progress}%`,
            width: animated ? undefined : `${progress}%`
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
