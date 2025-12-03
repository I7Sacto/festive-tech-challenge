import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, User, UserPlus, Chrome } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валідація
    if (password !== confirmPassword) {
      toast({
        title: "❌ Помилка",
        description: "Паролі не співпадають",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "❌ Помилка",
        description: "Пароль повинен містити мінімум 6 символів",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        toast({
          title: "❌ Помилка реєстрації",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "✅ Реєстрація успішна!",
          description: "Перевірте email для підтвердження (або увійдіть одразу)",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Sign up error:", error);
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
              🎄 Реєстрація
            </h1>
            <p className="text-muted-foreground">
              Створіть акаунт щоб розпочати різдвяний челендж
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="glass-card p-8 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Повне ім'я
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Іван Іваненко"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-white/5 border-white/20"
                />
              </div>

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
                  placeholder="Мінімум 6 символів"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/5 border-white/20"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Підтвердіть пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Повторіть пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
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
                  "Реєстрація..."
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Зареєструватися
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
              Зареєструватися через Google
            </Button>

            {/* Login Link */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Вже маєте акаунт?{" "}
              <Link
                to="/login"
                className="text-christmas-gold hover:underline font-semibold"
              >
                Увійти
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

export default SignUp;
