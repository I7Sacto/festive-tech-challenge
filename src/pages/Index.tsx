import { useNavigate } from "react-router-dom";
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
  1: { completed: false, score: 0 },
  2: { completed: false, score: 0 },
  3: { completed: false, score: 0 },
  4: { completed: false, score: 0 },
  5: { completed: false, score: 0 },
  6: { completed: false, score: 0 },
};

const Index = () => {
  const navigate = useNavigate();

  const handleCertificate = () => {
    toast({
      title: "🏆 Сертифікат готується!",
      description: "Ваш сертифікат буде доступний для завантаження.",
    });
  };

  const handleResults = () => {
    navigate("/games");
  };

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      {/* Hero Section */}
      <section className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto text-center">
          {/* Main Title */}
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

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Тут ви знайдете різдвяні історії, музику та маленькі подарунки для справжніх IT-спеціалістів
          </p>

          {/* Main Buttons */}
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
            <ProgressBar progress={90} animated />
          </div>

          {/* Countdown */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <CountdownTimer />
          </div>

          {/* Scroll indicator */}
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
