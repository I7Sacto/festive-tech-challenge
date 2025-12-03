import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { LogIn, User } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Не показувати header на сторінках login/signup
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent"
          >
            🎄 Різдвяний Challenge
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6">
              <NavLink to="/">Головна</NavLink>
              <NavLink to="/games">Ігри</NavLink>
              <NavLink to="/stories">Історії</NavLink>
              <NavLink to="/music">Музика</NavLink>
              <NavLink to="/gifts">Подарунки</NavLink>
              <NavLink to="/gallery">Галерея</NavLink>
            </div>

            {/* Auth buttons */}
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" className="border-christmas-gold text-christmas-gold hover:bg-christmas-gold/20">
                  <User className="mr-2 h-4 w-4" />
                  Мій кабінет
                </Button>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="mr-2 h-4 w-4" />
                    Вхід
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-christmas-red to-christmas-gold">
                    Реєстрація
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
