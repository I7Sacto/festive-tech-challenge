import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Gamepad2, BookOpen, Music, Gift, Image } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Головна", icon: Home },
    { path: "/games", label: "Ігри", icon: Gamepad2 },
    { path: "/stories", label: "Історії", icon: BookOpen },
    { path: "/music", label: "Музика", icon: Music },
    { path: "/gifts", label: "Подарунки", icon: Gift },
    { path: "/gallery", label: "Галерея", icon: Image },
  ];

  return (
    <header className="fixed top-12 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎄</span>
            <span className="font-heading font-bold text-lg hidden sm:block text-gradient-gold">
              IT Christmas
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
