import { useState } from "react";
import { Heart, Upload, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const famousProgrammers = [
  {
    id: 1,
    name: "Linus Torvalds",
    title: "Творець Linux та Git",
    description: "У різдвяному светрі з пінгвіном",
    emoji: "🐧",
    likes: 42,
  },
  {
    id: 2,
    name: "Guido van Rossum",
    title: "Творець Python",
    description: "Прикрашає ялинку Python-скриптами",
    emoji: "🐍",
    likes: 38,
  },
  {
    id: 3,
    name: "Grace Hopper",
    title: "Піонерка програмування",
    description: "З гірляндами та першим компілятором",
    emoji: "👩‍💻",
    likes: 55,
  },
  {
    id: 4,
    name: "Dennis Ritchie",
    title: "Творець C",
    description: "Santa Claus написаний на C",
    emoji: "📟",
    likes: 33,
  },
  {
    id: 5,
    name: "Ken Thompson",
    title: "Співтворець Unix",
    description: "chmod 777 christmas_tree",
    emoji: "🖥️",
    likes: 28,
  },
  {
    id: 6,
    name: "Margaret Hamilton",
    title: "Інженерка Apollo",
    description: "Місячна місія доставки подарунків",
    emoji: "🚀",
    likes: 47,
  },
];

// Mock user photos
const userPhotos = [
  { id: 1, caption: "Наш офіс готовий до свят! 🎄", likes: 15, author: "DevTeam" },
  { id: 2, caption: "Різдвяний код рев'ю 😄", likes: 23, author: "SeniorDev" },
  { id: 3, caption: "Святкова ретро з командою", likes: 19, author: "ScrumMaster" },
];

// Mock wishes
const mockWishes = [
  { id: 1, text: "Бажаю всім zero bugs у новому році! 🐛", author: "Anonymous Dev", timestamp: "2 год тому" },
  { id: 2, text: "Нехай ваші деплої будуть успішними, а rollbacks - непотрібними! 🚀", author: "DevOps Santa", timestamp: "4 год тому" },
  { id: 3, text: "З Різдвом! Нехай код компілюється з першого разу! ⭐", author: "Junior Dev", timestamp: "6 год тому" },
];

const Gallery = () => {
  const [likedProgrammers, setLikedProgrammers] = useState<number[]>([]);
  const [likedPhotos, setLikedPhotos] = useState<number[]>([]);
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState(mockWishes);

  const toggleLikeProgrammer = (id: number) => {
    setLikedProgrammers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleLikePhoto = (id: number) => {
    setLikedPhotos((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Перевірка розміру (макс 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "❌ Файл занадто великий",
      description: "Максимум 5MB",
      variant: "destructive",
    });
    return;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "⚠️ Потрібна авторизація",
        description: "Увійдіть в акаунт",
        variant: "destructive",
      });
      return;
    }

    // Завантаження в Supabase Storage
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('user-photos')
      .upload(fileName, file);

    if (error) throw error;

    // Отримання публічного URL
    const { data: urlData } = supabase.storage
      .from('user-photos')
      .getPublicUrl(fileName);

    if (urlData) {
      // Зберегти в базу
      await supabase.from('user_photos').insert({
        user_id: user.id,
        photo_url: urlData.publicUrl,
        caption: ''
      });

      toast({
        title: "✅ Фото завантажено!",
        description: "Ваше фото додано до галереї",
      });

      // Оновити список фото
      fetchPhotos();
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "❌ Помилка завантаження",
      description: "Спробуйте ще раз",
      variant: "destructive",
    });
  }
};

  const handlePublishWish = () => {
    if (!wishText.trim()) {
      toast({
        title: "✏️ Напишіть побажання",
        description: "Поле не може бути порожнім",
        variant: "destructive",
      });
      return;
    }

    const newWish = {
      id: wishes.length + 1,
      text: wishText,
      author: "Гість",
      timestamp: "Щойно",
    };

    setWishes([newWish, ...wishes]);
    setWishText("");
    
    toast({
      title: "🎉 Побажання опубліковано!",
      description: "Дякуємо за ваші теплі слова!",
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              <span className="text-gradient-gold">🖼️ Галерея</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Різдвяні портрети легенд програмування та фото спільноти
            </p>
          </div>

          {/* Famous Programmers */}
          <section className="mb-16">
            <h2 className="font-heading font-bold text-2xl mb-6 flex items-center gap-3">
              <span className="text-christmas-gold">⭐</span>
              Легенди програмування у святковому настрої
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {famousProgrammers.map((programmer) => (
                <div
                  key={programmer.id}
                  className="glass-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Image placeholder */}
                  <div className="aspect-square bg-gradient-christmas flex items-center justify-center">
                    <span className="text-8xl group-hover:scale-110 transition-transform">
                      {programmer.emoji}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-lg text-foreground">
                      {programmer.name}
                    </h3>
                    <p className="text-sm text-christmas-gold mb-1">
                      {programmer.title}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {programmer.description}
                    </p>
                    
                    <button
                      onClick={() => toggleLikeProgrammer(programmer.id)}
                      className="flex items-center gap-2 text-sm transition-colors"
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5 transition-all",
                          likedProgrammers.includes(programmer.id)
                            ? "fill-christmas-red text-christmas-red scale-110"
                            : "text-muted-foreground hover:text-christmas-red"
                        )}
                      />
                      <span className="text-muted-foreground">
                        {programmer.likes + (likedProgrammers.includes(programmer.id) ? 1 : 0)}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* User Photos */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-2xl flex items-center gap-3">
                <span className="text-christmas-gold">📸</span>
                Фото спільноти
              </h2>
              <Button variant="christmas" onClick={handleUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Завантажити фото
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <div className="aspect-video bg-secondary flex items-center justify-center">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <p className="text-foreground mb-2">{photo.caption}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        @{photo.author}
                      </span>
                      <button
                        onClick={() => toggleLikePhoto(photo.id)}
                        className="flex items-center gap-2"
                      >
                        <Heart
                          className={cn(
                            "w-5 h-5 transition-all",
                            likedPhotos.includes(photo.id)
                              ? "fill-christmas-red text-christmas-red"
                              : "text-muted-foreground hover:text-christmas-red"
                          )}
                        />
                        <span className="text-sm text-muted-foreground">
                          {photo.likes + (likedPhotos.includes(photo.id) ? 1 : 0)}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Upload placeholder */}
              <button
                onClick={handleUpload}
                className="glass-card rounded-2xl border-2 border-dashed border-border hover:border-christmas-gold transition-colors flex flex-col items-center justify-center min-h-[250px]"
              >
                <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Додати своє фото</p>
              </button>
            </div>
          </section>

          {/* Wishes Section */}
          <section>
            <h2 className="font-heading font-bold text-2xl mb-6 flex items-center gap-3">
              <span className="text-christmas-gold">💬</span>
              Побажання спільноти
            </h2>

            {/* Add wish form */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <Textarea
                placeholder="Напишіть ваше різдвяне побажання для IT-спільноти..."
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                className="bg-secondary border-border resize-none h-24 mb-4"
              />
              <Button variant="gold" onClick={handlePublishWish}>
                <Send className="w-4 h-4 mr-2" />
                Опублікувати
              </Button>
            </div>

            {/* Wishes list */}
            <div className="space-y-4">
              {wishes.map((wish) => (
                <div key={wish.id} className="glass-card rounded-xl p-4">
                  <p className="text-foreground mb-2">{wish.text}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>@{wish.author}</span>
                    <span>{wish.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Gallery;
