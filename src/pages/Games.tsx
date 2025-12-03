import { useNavigate } from "react-router-dom";
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
    description: "8 питань про IT: DevOps, мережі, програмування",
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

// Mock game progress (will be replaced with Supabase data)
const mockProgress = {
  1: { completed: true, score: 85 },
  2: { completed: false, score: 0 },
  3: { completed: false, score: 0 },
  4: { completed: false, score: 0 },
  5: { completed: false, score: 0 },
  6: { completed: false, score: 0 },
};

const Games = () => {
  const navigate = useNavigate();

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
    if (gameNumber === 1) return true;
    const prevGame = mockProgress[gameNumber - 1 as keyof typeof mockProgress];
    return prevGame?.completed || false;
  };

  const completedGames = Object.values(mockProgress).filter(g => g.completed).length;
  const totalProgress = Math.round((completedGames / games.length) * 100);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              <span className="text-gradient-gold">🎮 Різдвяні ігри</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Проходьте ігри послідовно, щоб розблокувати нові рівні та отримати фінальний подарунок!
            </p>

            {/* Overall Progress */}
            <div className="max-w-md mx-auto glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-medium">Загальний прогрес</span>
                <span className="text-christmas-gold font-bold">{completedGames}/{games.length} ігор</span>
              </div>
              <ProgressBar progress={totalProgress} showLabel={false} />
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {games.map((game) => (
              <GameCard
                key={game.gameNumber}
                {...game}
                isLocked={!isGameUnlocked(game.gameNumber)}
                isCompleted={mockProgress[game.gameNumber as keyof typeof mockProgress]?.completed || false}
                score={mockProgress[game.gameNumber as keyof typeof mockProgress]?.score}
                onClick={() => handleGameClick(game.path, !isGameUnlocked(game.gameNumber))}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Games;
