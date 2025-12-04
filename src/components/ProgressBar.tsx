import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}

const ProgressBar = ({ 
  progress, 
  className, 
  showLabel = true, 
  animated = true 
}: ProgressBarProps) => {
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Прогрес</span>
          <span className="text-sm font-bold text-christmas-gold">{progress}%</span>
        </div>
      )}
      <div className="h-3 bg-white/10 rounded-full overflow-hidden shadow-inner">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green",
            animated && "transition-all duration-1000 ease-out"
          )}
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
