import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { LogIn, User, Menu, X } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent"
          >
            🎄 Різдвяний Challenge
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-6">
              <NavLink to="/">Головна</NavLink>
              <NavLink to="/games">Ігри</NavLink>
              <NavLink to="/stories">Історії</NavLink>
              <NavLink to="/music">Музика</NavLink>
              <NavLink to="/gifts">Подарунки</NavLink>
              <NavLink to="/gallery">Галерея</NavLink>
            </div>

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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-white/10 pt-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 text-center font-semibold">
              🏠 Головна
            </Link>
            <Link to="/games" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 text-center font-semibold">
              🎮 Ігри
            </Link>
            <Link to="/stories" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 text-center font-semibold">
              📖 Історії
            </Link>
            <Link to="/music" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 text-center font-semibold">
              🎵 Музика
            </Link>
            <Link to="/gifts" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 text-center font-semibold">
              🎁 Подарунки
            </Link>
            <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 text-center font-semibold">
              🖼️ Галерея
            </Link>

            <div className="pt-4 border-t border-white/10">
              {user ? (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-christmas-gold text-black">
                    <User className="mr-2 h-4 w-4" />
                    Мій кабінет
                  </Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Вхід
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-christmas-red to-christmas-gold">
                      Реєстрація
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
