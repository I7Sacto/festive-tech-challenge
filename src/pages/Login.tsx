import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, LogIn, Chrome } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: "❌ Помилка входу",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "✅ Вхід успішний!",
          description: "Вітаємо назад!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "❌ Помилка входу",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <Snowflakes />
      <Garland />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              🎄 Вхід
            </h1>
            <p className="text-muted-foreground">
              Увійдіть щоб продовжити різдвяний челендж
            </p>
          </div>

          {/* Login Form */}
          <div className="glass-card p-8 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/20"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/20"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  "Вхід..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Увійти
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Або</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Увійти через Google
            </Button>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Ще немає акаунту?{" "}
              <Link
                to="/signup"
                className="text-christmas-gold hover:underline font-semibold"
              >
                Зареєструватися
              </Link>
            </p>

            {/* Back to Home */}
            <p className="text-center mt-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-white">
                ← Повернутися на головну
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
