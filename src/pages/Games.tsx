import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import ProgressBar from "@/components/ProgressBar";
import { toast } from "@/hooks/use-toast";

const games = [
  {
    gameNumber: 1,
    title: "Різдвяна вікторина",
    description: "30 питань про IT: DevOps, мережі, програмування",
    icon: "🎯",
    unlockCondition: "Розблоковано з початку",
    path: "/games/quiz",
  },
  {
    gameNumber: 2,
    title: "Технічний кросворд",
    description: "ІТ-терміни з різдвяною тематикою",
    icon: "📝",
    unlockCondition: "Набери 70+ балів у вікторині",
    path: "/games/crossword",
  },
  {
    gameNumber: 3,
    title: "DevOps пазл",
    description: "Збери різдвяну DevOps інфографіку",
    icon: "🧩",
    unlockCondition: "Заповни 80%+ кросворду",
    path: "/games/puzzle",
  },
  {
    gameNumber: 4,
    title: "Coding Challenge",
    description: "Напиши функцію для підрахунку подарунків",
    icon: "💻",
    unlockCondition: "Збери 100% пазлу",
    path: "/games/coding",
  },
  {
    gameNumber: 5,
    title: "Networking Quiz",
    description: "7 питань про TCP/IP, DNS, HTTP",
    icon: "🌐",
    unlockCondition: "Розв'яжи coding challenge",
    path: "/games/networking",
  },
  {
    gameNumber: 6,
    title: "Фінальний сюрприз",
    description: "Розпакуй святковий подарунок!",
    icon: "🎁",
    unlockCondition: "Набери 60+ балів у Networking Quiz",
    path: "/games/surprise",
  },
];

// Зберігання прогресу в localStorage
const getGameProgress = () => {
  const saved = localStorage.getItem('gameProgress');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    1: { completed: false, score: 0, unlocked: true },
    2: { completed: false, score: 0, unlocked: false },
    3: { completed: false, score: 0, unlocked: false },
    4: { completed: false, score: 0, unlocked: false },
    5: { completed: false, score: 0, unlocked: false },
    6: { completed: false, score: 0, unlocked: false },
  };
};

const Games = () => {
  const navigate = useNavigate();
  const [gameProgress, setGameProgress] = useState(getGameProgress());

  // Оновлення прогресу при зміні localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setGameProgress(getGameProgress());
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Також перевіряємо при mount
    const interval = setInterval(() => {
      setGameProgress(getGameProgress());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleGameClick = (path: string, isLocked: boolean) => {
    if (isLocked) {
      toast({
        title: "🔒 Гра заблокована",
        description: "Пройдіть попередню гру, щоб розблокувати цю.",
        variant: "destructive",
      });
      return;
    }
    navigate(path);
  };

  const isGameUnlocked = (gameNumber: number): boolean => {
    return gameProgress[gameNumber as keyof typeof gameProgress]?.unlocked || false;
  };

  const completedGames = Object.values(gameProgress).filter(g => g.completed).length;
  const totalProgress = Math.round((completedGames / games.length) * 100);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              🎮 Різдвяні Ігри
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Пройдіть всі 6 ігор та отримайте фінальний сюрприз!
            </p>
            
            {/* Progress */}
            <div className="max-w-md mx-auto">
              <ProgressBar progress={totalProgress} />
              <p className="text-sm text-muted-foreground mt-2">
                Пройдено: {completedGames} з {games.length}
              </p>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const isUnlocked = isGameUnlocked(game.gameNumber);
              const progress = gameProgress[game.gameNumber as keyof typeof gameProgress];
              
              return (
                <GameCard
                  key={game.gameNumber}
                  {...game}
                  isLocked={!isUnlocked}
                  isCompleted={progress?.completed || false}
                  score={progress?.score || 0}
                  onClick={() => handleGameClick(game.path, !isUnlocked)}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Games;
