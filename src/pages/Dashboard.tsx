import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, GameProgress, Achievement, Certificate } from "@/lib/supabase";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Medal, LogOut, User, Download } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [gameProgress, setGameProgress] = useState<GameProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else if (user) {
      fetchUserData();
    }
  }, [user, authLoading]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Завантажити прогрес ігор
      const { data: progressData } = await supabase
        .from("game_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("game_number", { ascending: true });

      if (progressData) setGameProgress(progressData);

      // Завантажити досягнення
      const { data: achievementsData } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      if (achievementsData) setAchievements(achievementsData);

      // Завантажити сертифікати
      const { data: certificatesData } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });

      if (certificatesData) setCertificates(certificatesData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const completedGames = gameProgress.filter((g) => g.completed).length;
  const totalScore = gameProgress.reduce((sum, g) => sum + g.score, 0);
  const averageScore = completedGames > 0 ? Math.round(totalScore / completedGames) : 0;
  const overallProgress = Math.round((completedGames / 6) * 100);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
                🎄 Особистий кабінет
              </h1>
              <p className="text-xl text-muted-foreground">
                Вітаємо, {profile?.full_name || profile?.email}!
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Вийти
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 rounded-3xl text-center">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-christmas-gold" />
              <div className="text-3xl font-bold mb-1">{completedGames}/6</div>
              <div className="text-sm text-muted-foreground">Ігор пройдено</div>
            </div>

            <div className="glass-card p-6 rounded-3xl text-center">
              <Medal className="h-12 w-12 mx-auto mb-3 text-christmas-red" />
              <div className="text-3xl font-bold mb-1">{totalScore}</div>
              <div className="text-sm text-muted-foreground">Загальний бал</div>
            </div>

            <div className="glass-card p-6 rounded-3xl text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-christmas-green" />
              <div className="text-3xl font-bold mb-1">{averageScore}%</div>
              <div className="text-sm text-muted-foreground">Середній результат</div>
            </div>

            <div className="glass-card p-6 rounded-3xl text-center">
              <User className="h-12 w-12 mx-auto mb-3 text-blue-400" />
              <div className="text-3xl font-bold mb-1">{achievements.length}</div>
              <div className="text-sm text-muted-foreground">Досягнень</div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="glass-card p-8 rounded-3xl mb-8">
            <h2 className="text-2xl font-bold mb-4">Загальний прогрес</h2>
            <ProgressBar progress={overallProgress} />
            <p className="text-center mt-2 text-muted-foreground">
              {overallProgress}% завершено
            </p>
          </div>

          {/* Game Progress */}
          <div className="glass-card p-8 rounded-3xl mb-8">
            <h2 className="text-2xl font-bold mb-6">Прогрес ігор</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameProgress.map((game) => (
                <div
                  key={game.id}
                  className={`p-4 rounded-xl border-2 ${
                    game.completed
                      ? "border-green-500 bg-green-500/10"
                      : game.unlocked
                      ? "border-christmas-gold/50 bg-white/5"
                      : "border-white/20 bg-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Гра {game.game_number}</span>
                    {game.completed ? (
                      <Trophy className="h-5 w-5 text-green-500" />
                    ) : game.unlocked ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-christmas-gold/20 text-christmas-gold">
                        Доступна
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                        Заблокована
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-christmas-gold">
                    {game.score} балів
                  </div>
                  {game.completed && game.completed_at && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Пройдено:{" "}
                      {new Date(game.completed_at).toLocaleDateString("uk-UA")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="glass-card p-8 rounded-3xl mb-8">
              <h2 className="text-2xl font-bold mb-6">🏆 Досягнення</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 rounded-xl bg-gradient-to-r from-christmas-gold/20 to-christmas-red/20 border-2 border-christmas-gold/30"
                  >
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-christmas-gold flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {achievement.achievement_name}
                        </h3>
                        {achievement.achievement_description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.achievement_description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Отримано:{" "}
                          {new Date(achievement.earned_at).toLocaleDateString("uk-UA")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <div className="glass-card p-8 rounded-3xl mb-8">
              <h2 className="text-2xl font-bold mb-6">🎓 Сертифікати</h2>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-6 rounded-xl bg-gradient-to-r from-christmas-green/20 to-christmas-red/20 border-2 border-christmas-gold"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {cert.certificate_type}
                        </h3>
                        <div className="flex gap-4 text-sm">
                          <span>Ігор пройдено: {cert.games_completed}/6</span>
                          <span>Загальний бал: {cert.total_score}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Видано:{" "}
                          {new Date(cert.issued_at).toLocaleDateString("uk-UA")}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-christmas-gold text-christmas-gold"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Завантажити
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/games")}
              className="bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90"
            >
              Продовжити ігри
            </Button>
            <Button onClick={() => navigate("/")} variant="outline">
              На головну
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
