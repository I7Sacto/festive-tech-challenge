import { Lock, Play, Check, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameCardProps {
  gameNumber: number;
  title: string;
  description: string;
  icon: string;
  isLocked: boolean;
  isCompleted: boolean;
  score?: number;
  unlockCondition: string;
  onClick: () => void;
}

const GameCard = ({
  gameNumber,
  title,
  description,
  icon,
  isLocked,
  isCompleted,
  score,
  unlockCondition,
  onClick,
}: GameCardProps) => {
  return (
    <div
      className={cn(
        "relative glass-card rounded-2xl p-6 transition-all duration-500 group",
        isLocked && "opacity-60 backdrop-blur-lg",
        isCompleted && "border-christmas-green border-2",
        !isLocked && !isCompleted && "hover:shadow-[0_0_30px_hsla(51,100%,50%,0.2)] hover:scale-[1.02]"
      )}
    >
      {/* Game number badge */}
      <div className={cn(
        "absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold font-heading text-lg",
        isCompleted ? "bg-christmas-green text-foreground" : "bg-gradient-gold text-primary-foreground"
      )}>
        {isCompleted ? <Check className="w-5 h-5" /> : gameNumber}
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
          <Lock className="w-12 h-12 text-muted-foreground mb-3 lock-shake" />
          <p className="text-sm text-muted-foreground text-center px-4">{unlockCondition}</p>
        </div>
      )}

      {/* Content */}
      <div className="text-center">
        <span className="text-5xl mb-4 block">{icon}</span>
        <h3 className="font-heading font-bold text-xl mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>

        {/* Score display for completed games */}
        {isCompleted && score !== undefined && (
          <div className="flex items-center justify-center gap-2 mb-4 text-christmas-gold">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{score} балів</span>
          </div>
        )}

        {/* Action button */}
        <Button
          variant={isLocked ? "locked" : isCompleted ? "christmas" : "game"}
          className="w-full"
          onClick={onClick}
          disabled={isLocked}
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Заблоковано
            </>
          ) : isCompleted ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Пройдено
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Грати
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GameCard;
