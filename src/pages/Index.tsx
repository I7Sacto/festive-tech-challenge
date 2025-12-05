import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, GameProgress } from "@/lib/supabase";
import { Award, Medal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import CountdownTimer from "@/components/CountdownTimer";
import ProgressBar from "@/components/ProgressBar";
import GameCard from "@/components/GameCard";
import Header from "@/components/Header";
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
    description: "10 технічних термінів з різдвяною тематикою",
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

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameProgress, setGameProgress] = useState<GameProgress[]>([]);
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

  const handleCertificate = () => {
    if (!user) {
      toast({
        title: "⚠️ Потрібна авторизація",
        description: "Увійдіть в акаунт",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/games/surprise");
  };

  const handleResults = () => {
    navigate("/games");
  };

  const handleGameClick = (path: string, isLocked: boolean) => {
    if (!user) {
      toast({
        title: "⚠️ Потрібна авторизація",
        description: "Увійдіть в акаунт щоб грати",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (isLocked) {
      toast({
        title: "🔒 Гра заблокована",
        description: "Пройдіть попередню гру",
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
  const totalProgress = user ? Math.round((completedGames / games.length) * 100) : 90;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      {/* Hero Section */}
      <section className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              <span className="text-christmas-gold">🎄</span>{" "}
              <span className="text-foreground">Вітаємо!</span>
              <br />
              <span className="text-gradient-gold">
                Ви пройшли різдвяний мешап на 90%!
              </span>{" "}
              <span className="text-christmas-gold">🎄</span>
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Тут ви знайдете різдвяні історії, музику та маленькі подарунки для справжніх IT-спеціалістів
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button
              variant="gold"
              size="xl"
              onClick={handleCertificate}
              className="min-w-[280px] text-lg"
            >
              <Award className="w-6 h-6 mr-2" />
              🏆 Отримати сертифікат
            </Button>

            <Button
              variant="silver"
              size="xl"
              onClick={handleResults}
              className="min-w-[280px] text-lg group"
            >
              <Medal className="w-6 h-6 mr-2" />
              🥈 Подивитися результати
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="max-w-md mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <ProgressBar progress={totalProgress} animated />
            {user && (
              <p className="text-sm text-muted-foreground mt-2">
                Ваш прогрес: {completedGames} з {games.length} ігор пройдено
              </p>
            )}
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <CountdownTimer />
          </div>

          <div className="mt-12 animate-float">
            <ChevronDown className="w-8 h-8 mx-auto text-christmas-gold opacity-60" />
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-4">
            <span className="text-gradient-gold">🎮 Різдвяні ігри</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Проходьте ігри послідовно, щоб розблокувати нові рівні та отримати фінальний подарунок!
          </p>

          {!user && (
            <div className="mb-8 p-4 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/50 max-w-md mx-auto text-center">
              <p className="text-yellow-500">
                ⚠️ Увійдіть в акаунт щоб грати та зберігати прогрес
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50 relative z-10">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            🎄 З Різдвом Христовим! Нехай цей рік принесе багато успішних деплоїв! 🎄
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
