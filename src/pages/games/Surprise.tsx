import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";

const Surprise = () => {
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleOpenGift = async () => {
    setIsOpened(true);

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    setTimeout(() => {
      setShowCertificate(true);
    }, 2000);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from("game_progress")
          .update({
            completed: true,
            score: 100,
            completed_at: new Date().toISOString()
          })
          .eq("user_id", user.id)
          .eq("game_number", 6);

        const { data: progressData } = await supabase
          .from("game_progress")
          .select("score, completed")
          .eq("user_id", user.id);

        if (progressData) {
          const totalScore = progressData.reduce((sum, g) => sum + g.score, 0);
          const gamesCompleted = progressData.filter(g => g.completed).length;

          await supabase
            .from("certificates")
            .insert({
              user_id: user.id,
              certificate_type: "Різдвяний ІТ Challenge 2024",
              total_score: totalScore,
              games_completed: gamesCompleted
            });
        }

        toast({
          title: "🎉 Вітаємо!",
          description: "Ви пройшли всі 6 ігор!",
        });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleDownloadCertificate = () => {
    toast({
      title: "📥 Завантаження...",
      description: "Сертифікат буде завантажено",
    });
  };

  const handleShare = () => {
    const shareText = "Я пройшов всі 6 різдвяних ІТ-ігор! 🎄🎮✨";
    
    if (navigator.share) {
      navigator.share({
        title: "Різдвяний ІТ Challenge",
        text: shareText,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast({
          title: "📋 Скопійовано!",
          description: "Текст скопійовано в буфер",
        });
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "📋 Скопійовано!",
        description: "Текст скопійовано в буфер",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              🎁 Фінальний сюрприз
            </h1>
            <p className="text-muted-foreground">
              Ви пройшли всі 6 ігор! Натисніть на подарунок!
            </p>
          </div>

          {!isOpened ? (
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleOpenGift}
                className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                <div className="text-[200px] animate-bounce">🎁</div>
              </button>
              <p className="text-xl font-semibold mt-6 text-christmas-gold animate-pulse">
                Натисніть на подарунок!
              </p>
            </div>
          ) : !showCertificate ? (
            <div className="glass-card p-8 rounded-3xl text-center py-12">
              <div className="text-8xl mb-6">🎊</div>
              <h2 className="text-3xl font-bold mb-4">Розпаковуємо...</h2>
            </div>
          ) : (
            <div className="glass-card p-8 rounded-3xl">
              <div className="border-8 border-double border-christmas-gold p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">
                    Сертифікат Досягнення
                  </h2>
                  
                  <div className="my-8">
                    <p className="text-xl mb-4">Цей сертифікат підтверджує, що</p>
                    <p className="text-3xl font-bold text-christmas-gold mb-4">
                      ІТ-професіонал
                    </p>
                    <p className="text-xl mb-6">успішно пройшов</p>
                    
                    <div className="bg-gradient-to-r from-christmas-red/20 to-christmas-gold/20 p-6 rounded-xl mb-6">
                      <p className="text-2xl font-bold mb-2">🎄 Різдвяний ІТ Challenge 🎄</p>
                      <p className="text-lg">Всі 6 різдвяних ігор</p>
                    </div>

                    <p className="text-lg mb-2">Дата:</p>
                    <p className="text-xl font-semibold text-christmas-gold mb-6">
                      {new Date().toLocaleDateString("uk-UA", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={handleDownloadCertificate}
                  className="bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Завантажити PDF
                </Button>
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Поділитися
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  До ігор
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Surprise;
