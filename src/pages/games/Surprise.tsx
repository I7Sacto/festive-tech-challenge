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

    // Конфеті анімація
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
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

    // Збереження прогресу
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from("game_progress").update({
          completed: true,
          score: 100,
          completed_at: new Date().toISOString()
        }).eq("user_id", user.id).eq("game_number", 6);

        const { data: progressData } = await supabase
          .from("game_progress")
          .select("score, completed")
          .eq("user_id", user.id);

        if (progressData) {
          const totalScore = progressData.reduce((sum, g) => sum + g.score, 0);
          const gamesCompleted = progressData.filter(g => g.completed).length;

          await supabase.from("certificates").insert({
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
      console.error("Error:", error);
    }
  };

 const handleDownloadCertificate = async () => {
  try {
    // Створюємо HTML для PDF
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial; text-align: center; padding: 40px; background: linear-gradient(135deg, #C41E3A, #FFD700); }
          .cert { background: white; padding: 60px; border: 10px double #FFD700; border-radius: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #C41E3A; font-size: 48px; margin-bottom: 20px; }
          .name { color: #FFD700; font-size: 36px; font-weight: bold; margin: 30px 0; }
          .date { color: #666; font-size: 20px; }
        </style>
      </head>
      <body>
        <div class="cert">
          <div style="font-size: 72px;">🏆</div>
          <h1>Сертифікат Досягнення</h1>
          <p style="font-size: 24px;">Цей сертифікат підтверджує, що</p>
          <div class="name">ІТ-професіонал</div>
          <p style="font-size: 24px;">успішно пройшов</p>
          <div style="background: linear-gradient(to right, rgba(196,30,58,0.2), rgba(255,215,0,0.2)); padding: 30px; border-radius: 15px; margin: 30px 0;">
            <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">🎄 Різдвяний ІТ Challenge 🎄</p>
            <p style="font-size: 20px;">Всі 6 різдвяних ігор</p>
          </div>
          <div class="date">Дата: ${new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</div>
          <p style="margin-top: 40px; color: #999; font-size: 14px; font-style: italic;">"Знання - це найкращий різдвяний подарунок!"</p>
        </div>
      </body>
      </html>
    `;

    // Створюємо Blob з HTML
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Завантажуємо як HTML (можна відкрити і зберегти як PDF через браузер)
    const link = document.createElement('a');
    link.href = url;
    link.download = `Різдвяний_Сертифікат_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "📥 Завантажено!",
      description: "Відкрийте файл і збережіть як PDF через браузер (Ctrl+P → Save as PDF)",
    });
  } catch (error) {
    console.error(error);
    toast({
      title: "❌ Помилка",
      description: "Не вдалося завантажити сертифікат",
      variant: "destructive",
    });
  }
};

  const handleShare = () => {
  const shareText = "Я пройшов всі 6 різдвяних ІТ-ігор! 🎄🎮✨";
  const shareUrl = window.location.origin;
  
  // Створюємо меню з соцмережами
  const shareMenu = document.createElement('div');
  shareMenu.innerHTML = `
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; background: rgba(0,0,0,0.95); padding: 30px; border-radius: 20px; border: 2px solid #FFD700;">
      <h3 style="color: #FFD700; margin-bottom: 20px; text-align: center; font-size: 20px;">Поділитися:</h3>
      <div style="display: flex; flex-direction: column; gap: 12px; min-width: 250px;">
        <a href="viber://forward?text=${encodeURIComponent(shareText + ' ' + shareUrl)}" style="background: #7360F2; color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; text-align: center; font-weight: bold;">
          💜 Viber
        </a>
        <a href="https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" style="background: #0088CC; color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; text-align: center; font-weight: bold;">
          ✈️ Telegram
        </a>
        <a href="https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}" target="_blank" style="background: #25D366; color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; text-align: center; font-weight: bold;">
          💬 WhatsApp
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" style="background: #1877F2; color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; text-align: center; font-weight: bold;">
          📘 Facebook
        </a>
        <button onclick="navigator.clipboard.writeText('${shareText} ${shareUrl}'); alert('Скопійовано!');" style="background: #888; color: white; padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer; font-weight: bold;">
          📋 Копіювати посилання
        </button>
        <button id="closeShareMenu" style="background: #DC143C; color: white; padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer; font-weight: bold;">
          ❌ Закрити
        </button>
      </div>
    </div>
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9998;" id="shareOverlay"></div>
  `;
  
  document.body.appendChild(shareMenu);
  
  // Закриття меню
  const closeBtn = document.getElementById('closeShareMenu');
  const overlay = document.getElementById('shareOverlay');
  
  const closeMenu = () => {
    document.body.removeChild(shareMenu);
  };
  
  if (closeBtn) closeBtn.onclick = closeMenu;
  if (overlay) overlay.onclick = closeMenu;
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
