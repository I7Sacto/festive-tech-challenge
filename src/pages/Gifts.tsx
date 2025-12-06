import { useState } from "react";
import { Download, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const cardTemplates = [
  { id: 1, title: "IT-привітання", emoji: "🎄", preview: "if (christmas) return { joy: true };" },
  { id: 2, title: "DevOps", emoji: "🐳", preview: "kubectl apply -f joy.yaml" },
  { id: 3, title: "Frontend", emoji: "⚛️", preview: "<ChristmasTree />" },
  { id: 4, title: "Backend", emoji: "🔧", preview: "SELECT * FROM wishes;" },
  { id: 5, title: "Сисадмін", emoji: "🖥️", preview: "uptime: ∞ happiness" },
];

const Gifts = () => {
  const [selectedCard, setSelectedCard] = useState(cardTemplates[0]);
  const [recipientName, setRecipientName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Подарунок</title><style>body{margin:0;padding:20px;background:linear-gradient(135deg,#C41E3A,#FFD700,#0F8A5F);font-family:Arial}.card{background:white;padding:40px;border-radius:20px;max-width:600px;margin:0 auto;text-align:center}h1{color:#C41E3A;font-size:36px;margin:10px 0}.emoji{font-size:80px;margin:10px 0}</style></head><body><div class="card"><div class="emoji">${selectedCard.emoji}</div><h1>🎄 ${selectedCard.title} 🎄</h1><p style="color:#666;font-size:18px">Для: ${recipientName || "Колеги"}</p><p style="color:#666;font-size:16px;margin:20px 0">${customMessage || selectedCard.preview}</p></div></body></html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Podaru nok.html';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📥 Завантажено!" });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Різдво", text: selectedCard.preview });
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: "✅ Скопійовано!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes /><Garland /><Header />

      <main className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-2 sm:px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              🎁 Подарунки
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Створіть листівку</p>
          </div>

          <div className="glass-card rounded-2xl p-3 sm:p-6 mb-4">
            <h3 className="font-bold text-base sm:text-xl mb-3 sm:mb-4">✨ Оберіть шаблон</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
              {cardTemplates.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={cn(
                    "p-2 sm:p-3 rounded-lg text-center transition-all",
                    selectedCard.id === card.id
                      ? "ring-2 ring-christmas-gold bg-white/10"
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <span className="text-3xl sm:text-4xl block mb-1">{card.emoji}</span>
                  <p className="text-[10px] sm:text-xs font-medium">{card.title}</p>
                </button>
              ))}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Input
                placeholder="Ім'я отримувача..."
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="bg-white/5 border-white/20 text-sm sm:text-base h-9 sm:h-10"
              />
              <Textarea
                placeholder="Ваше побажання..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="bg-white/5 border-white/20 resize-none h-20 sm:h-24 text-sm sm:text-base"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleDownload} className="flex-1 bg-gradient-to-r from-christmas-red to-christmas-gold text-sm sm:text-base h-9 sm:h-10">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Завантажити
              </Button>
              <Button onClick={handleShare} variant="outline" className="text-sm sm:text-base h-9 sm:h-10">
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button onClick={handleCopyLink} variant="outline" className="h-9 sm:h-10">
                {copied ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gifts;
