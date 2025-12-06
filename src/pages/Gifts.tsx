import { useState } from "react";
import { Download, Share2, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const cardTemplates = [
  {
    id: 1,
    title: "Класичне IT-привітання",
    emoji: "🎄",
    preview: "if (christmas) return { joy: true, bugs: false };",
    bgClass: "bg-gradient-christmas",
  },
  {
    id: 2,
    title: "DevOps стиль",
    emoji: "🐳",
    preview: "kubectl apply -f christmas-joy.yaml",
    bgClass: "bg-gradient-to-br from-blue-600 to-cyan-500",
  },
  {
    id: 3,
    title: "Frontend Magic",
    emoji: "⚛️",
    preview: "<ChristmasTree sparkle={true} />",
    bgClass: "bg-gradient-to-br from-purple-600 to-pink-500",
  },
  {
    id: 4,
    title: "Backend Wisdom",
    emoji: "🔧",
    preview: "SELECT * FROM wishes WHERE year = 2024;",
    bgClass: "bg-gradient-to-br from-green-600 to-emerald-500",
  },
  {
    id: 5,
    title: "Сисадмін Special",
    emoji: "🖥️",
    preview: "uptime: 365 days of happiness",
    bgClass: "bg-gradient-to-br from-orange-600 to-amber-500",
  },
];

const techMemes = [
  { id: 1, emoji: "🎅", text: "git commit -m 'Ho ho ho!'" },
  { id: 2, emoji: "🎁", text: "npm install christmas-spirit" },
  { id: 3, emoji: "❄️", text: "docker run -d santa/sleigh:latest" },
  { id: 4, emoji: "🔔", text: "SELECT joy FROM holidays WHERE name='Christmas'" },
  { id: 5, emoji: "⭐", text: "while(christmas) { celebrate(); }" },
  { id: 6, emoji: "🎄", text: "sudo make christmas-cake" },
];

const Gifts = () => {
  const [selectedCard, setSelectedCard] = useState(cardTemplates[0]);
  const [recipientName, setRecipientName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Різдвяне привітання від IT-фахівця",
          text: `${selectedCard.preview} - З Різдвом! 🎄`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({
      title: "✅ Посилання скопійовано!",
      description: "Тепер ви можете поділитися ним з друзями.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

 const handleDownload = (giftTitle: string, giftEmoji: string) => {
  // Створюємо HTML сертифікат
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${giftTitle}</title>
  <style>
    body { margin: 0; padding: 40px; background: linear-gradient(135deg, #C41E3A, #FFD700, #0F8A5F); font-family: Arial; }
    .card { background: white; padding: 60px; border-radius: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 600px; margin: 0 auto; text-align: center; }
    h1 { color: #C41E3A; font-size: 48px; margin: 20px 0; }
    .emoji { font-size: 120px; margin: 20px 0; }
    p { color: #666; font-size: 20px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">${giftEmoji}</div>
    <h1>🎄 ${giftTitle} 🎄</h1>
    <p>З Різдвом Христовим!</p>
    <p style="font-style: italic; margin-top: 40px; font-size: 16px; color: #999;">Різдвяний ІТ Challenge 2024</p>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${giftTitle.replace(/ /g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast({
    title: "📥 Завантажено!",
    description: "Відкрийте файл → Ctrl+P → Save as PDF",
  });
};

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              <span className="text-gradient-gold">🎁 Подарунки</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Створіть та завантажте різдвяні листівки для колег
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card Creator */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-heading font-bold text-xl mb-4 text-foreground">
                  ✨ Створити листівку
                </h3>
                
                {/* Card Templates */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {cardTemplates.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className={cn(
                        "p-4 rounded-xl text-left transition-all duration-300",
                        selectedCard.id === card.id
                          ? "ring-2 ring-christmas-gold bg-secondary"
                          : "bg-secondary/50 hover:bg-secondary"
                      )}
                    >
                      <span className="text-2xl mb-2 block">{card.emoji}</span>
                      <p className="text-sm font-medium text-foreground">
                        {card.title}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Customization */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Ім'я отримувача
                    </label>
                    <Input
                      placeholder="Введіть ім'я..."
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Персональне привітання
                    </label>
                    <Textarea
                      placeholder="Напишіть ваше побажання..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="bg-secondary border-border resize-none h-24"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="gold" className="flex-1" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Завантажити PDF
                </Button>
                <Button variant="silver" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Поділитися
                </Button>
                <Button variant="outline" onClick={handleCopyLink}>
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div className={cn(
                "rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center transition-all duration-500",
                selectedCard.bgClass
              )}>
                <span className="text-6xl mb-4 animate-float">{selectedCard.emoji}</span>
                <h3 className="font-heading font-bold text-2xl text-white mb-2">
                  {recipientName ? `Для ${recipientName}` : "З Різдвом Христовим!"}
                </h3>
                <p className="text-white/90 font-mono text-lg mb-4">
                  {selectedCard.preview}
                </p>
                {customMessage && (
                  <p className="text-white/80 text-sm max-w-xs">
                    {customMessage}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-2 text-white/60 text-sm">
                  <Sparkles className="w-4 h-4" />
                  IT Christmas 2024
                </div>
              </div>
            </div>
          </div>

          {/* Tech Memes Section */}
          <div className="mt-16">
            <h2 className="font-heading font-bold text-2xl text-center mb-8">
              <span className="text-gradient-gold">💻 Tech-меми</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {techMemes.map((meme) => (
                <div
                  key={meme.id}
                  className="glass-card rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(meme.text);
                    toast({
                      title: "📋 Скопійовано!",
                      description: meme.text,
                    });
                  }}
                >
                  <span className="text-4xl mb-3 block">{meme.emoji}</span>
                  <p className="font-mono text-sm text-christmas-gold">
                    {meme.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4">
              💡 Натисніть на мем, щоб скопіювати
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gifts;
