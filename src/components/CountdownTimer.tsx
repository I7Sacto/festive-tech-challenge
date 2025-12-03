import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let christmas = new Date(currentYear, 11, 25); // December 25
      
      // If Christmas has passed this year, set to next year
      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25);
      }
      
      const difference = christmas.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="glass-card rounded-xl p-3 sm:p-4 min-w-[60px] sm:min-w-[80px]">
        <span className="text-2xl sm:text-4xl font-bold font-heading text-gradient-gold">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="text-center">
      <h3 className="text-lg sm:text-xl font-heading text-christmas-gold mb-4 flex items-center justify-center gap-2">
        <span>⏰</span>
        До Різдва залишилось
      </h3>
      <div className="flex justify-center gap-2 sm:gap-4">
        <TimeBlock value={timeLeft.days} label="Днів" />
        <span className="text-2xl sm:text-4xl font-bold text-christmas-gold self-start mt-3 sm:mt-4">:</span>
        <TimeBlock value={timeLeft.hours} label="Годин" />
        <span className="text-2xl sm:text-4xl font-bold text-christmas-gold self-start mt-3 sm:mt-4">:</span>
        <TimeBlock value={timeLeft.minutes} label="Хвилин" />
        <span className="text-2xl sm:text-4xl font-bold text-christmas-gold self-start mt-3 sm:mt-4 hidden sm:block">:</span>
        <div className="hidden sm:block">
          <TimeBlock value={timeLeft.seconds} label="Секунд" />
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
