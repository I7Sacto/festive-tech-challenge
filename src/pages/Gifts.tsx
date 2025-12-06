import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";

const gifts = [
  { id: 1, title: "Різдвяна листівка", emoji: "🎄", type: "Листівка" },
  { id: 2, title: "DevOps стікер", emoji: "🐳", type: "Стікер" },
  { id: 3, title: "Coding GIF", emoji: "💻", type: "GIF" },
  { id: 4, title: "IT мем", emoji: "😄", type: "Мем" },
  { id: 5, title: "Різдвяний бейдж", emoji: "🏆", type: "Бейдж" },
];

const Gifts = () => {
  const handleDownload = (giftTitle: string) => {
    const svg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#C41E3A"/>
      <text x="300" y="200" text-anchor="middle" font-size="48" fill="white" font-weight="bold">🎄 ${giftTitle} 🎄</text>
    </svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${giftTitle}.svg`;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: "📥 Завантажено!", description: giftTitle });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              🎁 Подарунки
            </h1>
            <p className="text-lg text-muted-foreground">
              Завантажте різдвяні подарунки
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift) => (
              <div key={gift.id} className="glass-card p-6 rounded-3xl text-center hover:scale-105 transition-transform">
                <div className="text-6xl mb-4">{gift.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{gift.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{gift.type}</p>
                <Button
                  onClick={() => handleDownload(gift.title)}
                  className="w-full bg-gradient-to-r from-christmas-red to-christmas-gold"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Завантажити
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gifts;
