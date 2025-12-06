import { useState, useEffect } from "react";
import { Heart, Upload, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const famousProgrammers = [
  { id: 1, name: "Linus Torvalds", title: "Творець Linux", emoji: "🐧" },
  { id: 2, name: "Guido van Rossum", title: "Творець Python", emoji: "🐍" },
  { id: 3, name: "Grace Hopper", title: "Піонерка програмування", emoji: "👩‍💻" },
  { id: 4, name: "Dennis Ritchie", title: "Творець C", emoji: "📟" },
  { id: 5, name: "Ken Thompson", title: "Співтворець Unix", emoji: "🖥️" },
  { id: 6, name: "Bjarne Stroustrup", title: "Творець C++", emoji: "⚙️" },
];

interface UserPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  caption: string;
  comment: string;
  likes_count: number;
  created_at: string;
}

const Gallery = () => {
  const { user } = useAuth();
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
  const [caption, setCaption] = useState("");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserPhotos();
  }, []);

  const fetchUserPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('user_gallery_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setUserPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast({
        title: "⚠️ Потрібна авторизація",
        description: "Увійдіть в акаунт",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ Файл завеликий",
        description: "Максимум 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      if (urlData) {
        await supabase.from('user_gallery_photos').insert({
          user_id: user.id,
          photo_url: urlData.publicUrl,
          caption: caption || 'Різдвяне фото',
          comment: comment || ''
        });

        toast({
          title: "✅ Фото завантажено!",
          description: "Ваше фото додано до галереї",
        });

        setCaption("");
        setComment("");
        fetchUserPhotos();
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "❌ Помилка",
        description: error.message || "Спробуйте ще раз",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              🖼️ Галерея
            </h1>
            <p className="text-lg text-muted-foreground">
              Святкові фото відомих програмістів та ваші фото
            </p>
          </div>

          {/* Famous Programmers */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-christmas-gold">⭐ Легенди ІТ</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {famousProgrammers.map((person) => (
                <div key={person.id} className="glass-card p-6 rounded-3xl hover:scale-105 transition-transform">
                  <div className="text-8xl mb-4 text-center">{person.emoji}</div>
                  <h3 className="text-xl font-bold mb-1">{person.name}</h3>
                  <p className="text-sm text-muted-foreground">{person.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Section */}
          {user && (
            <div className="glass-card p-6 rounded-3xl mb-12">
              <h2 className="text-2xl font-bold mb-4 text-christmas-gold">📸 Завантажити своє фото</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Опис фото..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="bg-white/5 border-white/20"
                />
                <Textarea
                  placeholder="Ваш коментар..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white/5 border-white/20"
                />
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="photo-upload" className="flex-1">
                    <Button
                      type="button"
                      disabled={uploading}
                      className="w-full bg-gradient-to-r from-christmas-red to-christmas-gold"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? "Завантаження..." : "Вибрати фото"}
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* User Photos */}
          {userPhotos.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-christmas-gold">📷 Фото користувачів</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPhotos.map((photo) => (
                  <div key={photo.id} className="glass-card rounded-3xl overflow-hidden">
                    <img
                      src={photo.photo_url}
                      alt={photo.caption}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{photo.caption}</h3>
                      {photo.comment && (
                        <p className="text-sm text-muted-foreground mb-3">{photo.comment}</p>
                      )}
                      <div className="flex items-center gap-2 text-christmas-red">
                        <Heart className="h-5 w-5" />
                        <span>{photo.likes_count}</span>
                      </div>
                    </div>
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

export default Gallery;
