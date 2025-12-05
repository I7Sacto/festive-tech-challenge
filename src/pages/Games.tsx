import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, GameProgress as GameProgressType } from "@/lib/supabase";
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

const Games = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameProgress, setGameProgress] = useState<GameProgressType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGameProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Оновлення прогресу кожні 2 секунди
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchGameProgress();
    }, 2000);

    return () => clearInterval(interval);
  }, [user]);

  const fetchGameProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("game_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("game_number", { ascending: true });

      if (error) throw error;
      
      if (data) {
        setGameProgress(data);
      }
    } catch (error) {
      console.error("Error fetching game progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (path: string, isLocked: boolean) => {
    if (!user) {
      toast({
        title: "⚠️ Потрібна авторизація",
        description: "Увійдіть в акаунт щоб грати та зберігати прогрес",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

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

  const getGameProgress = (gameNumber: number) => {
    return gameProgress.find((g) => g.game_number === gameNumber);
  };

  const isGameUnlocked = (gameNumber: number): boolean => {
    const progress = getGameProgress(gameNumber);
    return progress?.unlocked || false;
  };

  const completedGames = gameProgress.filter((g) => g.completed).length;
  const totalProgress = Math.round((completedGames / games.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl">Завантаження...</div>
      </div>
    );
  }

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

            {!user && (
              <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/50 max-w-md mx-auto">
                <p className="text-yellow-500">
                  ⚠️ Увійдіть в акаунт щоб зберігати прогрес
                </p>
              </div>
            )}

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
              const progress = getGameProgress(game.gameNumber);
              const isUnlocked = isGameUnlocked(game.gameNumber);

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

          {/* Debugging info (видаліть після тестування) */}
          {user && (
            <div className="mt-8 p-4 rounded-xl bg-white/5 text-xs font-mono">
              <div>User ID: {user.id}</div>
              <div>Games loaded: {gameProgress.length}</div>
              <div className="mt-2">
                {gameProgress.map((g) => (
                  <div key={g.id}>
                    Game {g.game_number}: {g.score} pts, 
                    {g.completed ? " completed" : " not completed"},
                    {g.unlocked ? " unlocked" : " locked"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Games;
