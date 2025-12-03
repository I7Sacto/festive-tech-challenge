import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, Download, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const Surprise = () => {
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleOpenGift = () => {
    setIsOpened(true);

    // Запустити конфеті
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

    // Показати сертифікат через 2 секунди
    setTimeout(() => {
      setShowCertificate(true);
    }, 2000);

    // Зберегти досягнення
    const gameProgress = JSON.parse(localStorage.getItem("gameProgress") || "{}");
    gameProgress[6] = {
      completed: true,
      score: 100,
      unlocked: true,
    };
    localStorage.setItem("gameProgress", JSON.stringify(gameProgress));

    toast({
      title: "🎉 Вітаємо!",
      description: "Ви пройшли всі 6 ігор! Ось ваш різдвяний сертифікат!",
    });
  };

  const handleDownloadCertificate = () => {
    toast({
      title: "📥 Завантаження...",
      description: "Сертифікат буде завантажено як PDF",
    });
    // Тут можна додати реальну логіку завантаження PDF
  };

  const handleShare = () => {
    const shareText = "Я пройшов всі 6 різдвяних ІТ-ігор! 🎄🎮✨";
    
    if (navigator.share) {
      navigator.share({
        title: "Різдвяний ІТ Challenge",
        text: shareText,
      }).catch(() => {
        // Fallback - копіювати в буфер
        navigator.clipboard.writeText(shareText);
        toast({
          title: "📋 Скопійовано!",
          description: "Текст скопійовано в буфер обміну",
        });
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "📋 Скопійовано!",
        description: "Текст скопійовано в буфер обміну",
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
              Ви пройшли всі 6 ігор! Натисніть на подарунок щоб розкрити сюрприз!
            </p>
          </div>

          {!isOpened ? (
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleOpenGift}
                className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                <div className="text-[200px] animate-bounce">🎁</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-christmas-gold animate-pulse" />
                </div>
              </button>
              <p className="text-xl font-semibold mt-6 text-christmas-gold animate-pulse">
                Натисніть на подарунок!
              </p>
            </div>
          ) : (
            <div className="glass-card p-8 rounded-3xl">
              {!showCertificate ? (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6 animate-spin-slow">🎊</div>
                  <h2 className="text-3xl font-bold mb-4">Розпаковуємо...</h2>
                  <div className="w-64 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-christmas-red to-christmas-gold animate-progress" />
                  </div>
                </div>
              ) : (
                <div>
                  {/* Certificate */}
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
                          <p className="text-lg">Всі 6 різдвяних ігор на теми:</p>
                          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                            <div>✅ Системне адміністрування</div>
                            <div>✅ Комп'ютерні мережі</div>
                            <div>✅ Програмування</div>
                            <div>✅ DevOps</div>
                            <div className="col-span-2">✅ Технічні знання та навички</div>
                          </div>
                        </div>

                        <p className="text-lg mb-2">Дата завершення:</p>
                        <p className="text-xl font-semibold text-christmas-gold mb-6">
                          {new Date().toLocaleDateString("uk-UA", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>

                        <div className="flex items-center justify-center gap-8 mt-8">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎮</div>
                            <p className="text-sm text-muted-foreground">6/6 Ігор</p>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl mb-2">⭐</div>
                            <p className="text-sm text-muted-foreground">90% Прогрес</p>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl mb-2">🏅</div>
                            <p className="text-sm text-muted-foreground">Майстер</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t-2 border-christmas-gold/30 pt-6 mt-6">
                        <p className="text-sm text-muted-foreground italic">
                          "Знання - це найкращий різдвяний подарунок!"
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Різдвяний ІТ Challenge 2024 🎄
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
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

                  {/* Bonus Content */}
                  <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-christmas-green/20 to-christmas-red/20 border-2 border-christmas-gold/30">
                    <h3 className="text-xl font-bold mb-4 text-center">🎉 Бонусні подарунки:</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 rounded-lg bg-white/5">
                        <div className="text-4xl mb-2">📚</div>
                        <p className="font-semibold mb-1">Електронна книга</p>
                        <p className="text-sm text-muted-foreground">
                          "Різдвяні рецепти для DevOps"
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5">
                        <div className="text-4xl mb-2">🎨</div>
                        <p className="font-semibold mb-1">Святкові стікери</p>
                        <p className="text-sm text-muted-foreground">
                          Набір різдвяних ІТ-стікерів
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5">
                        <div className="text-4xl mb-2">🎬</div>
                        <p className="font-semibold mb-1">GIF-анімації</p>
                        <p className="text-sm text-muted-foreground">
                          Колекція святкових GIF
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Surprise;
