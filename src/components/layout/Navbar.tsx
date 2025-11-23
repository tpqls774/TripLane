import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  Sparkles,
  BookOpen,
  Heart,
  Map,
  Globe,
  User,
  Menu,
  Compass,
  ChevronDown,
  PawPrint,
  Theater,
  UtensilsCrossed,
  Landmark,
  TreePine,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/authService";
import { ThemeType } from "../../types";
import type { ThemeTypeValue } from "../../types";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ko" ? "en" : "ko";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleThemeSelect = (theme: ThemeTypeValue) => {
    setIsThemeDropdownOpen(false);
    navigate(`/recommend?theme=${theme}`);
  };

  const themes = [
    { id: ThemeType.WELLNESS, Icon: Sparkles },
    { id: ThemeType.PET_FRIENDLY, Icon: PawPrint },
    { id: ThemeType.HALLYU, Icon: Theater },
    { id: ThemeType.GOURMET, Icon: UtensilsCrossed },
    { id: ThemeType.CULTURE, Icon: Landmark },
    { id: ThemeType.NATURE, Icon: TreePine },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <Map className="w-8 h-8 text-gray-900" strokeWidth={2} />
            <span className="text-xl font-semibold text-gray-900 hidden sm:inline tracking-tight">
              {t("home.title")}
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                isActive("/") && !location.pathname.startsWith("/recommend")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Home className="w-4 h-4 lg:hidden" strokeWidth={2} />
              <span className="hidden lg:inline">{t("nav.home")}</span>
            </Link>
            <Link
              to="/places"
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                isActive("/places")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Sparkles className="w-4 h-4 lg:hidden" strokeWidth={2} />
              <span className="hidden lg:inline">{t("nav.places")}</span>
            </Link>
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                  isActive("/recommend")
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Compass className="w-4 h-4 lg:hidden" strokeWidth={2} />
                <span className="hidden lg:inline">{t("nav.recommend")}</span>
                <ChevronDown className="w-3 h-3 hidden lg:inline" strokeWidth={2} />
              </button>
              {isThemeDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  {themes.map((theme) => {
                    const IconComponent = theme.Icon;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeSelect(theme.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <IconComponent className="w-5 h-5 text-gray-600" strokeWidth={2} />
                        <span className="text-sm text-gray-700 font-medium">
                          {t(`theme.${theme.id}`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <Link
              to="/my-courses"
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                isActive("/my-courses")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <BookOpen className="w-4 h-4 lg:hidden" strokeWidth={2} />
              <span className="hidden lg:inline">{t("nav.myCourses")}</span>
            </Link>
            <Link
              to="/favorites"
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                isActive("/favorites")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Heart
                className="w-4 h-4 lg:hidden"
                strokeWidth={2}
                fill={isActive("/favorites") ? "currentColor" : "none"}
              />
              <span className="hidden lg:inline">{t("nav.favorites")}</span>
            </Link>

            <div className="w-px h-8 bg-gray-200 mx-2"></div>

            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              aria-label={t("nav.language")}
            >
              <Globe className="w-4 h-4" strokeWidth={2} />
              <span className="hidden sm:inline">
                {i18n.language === "ko" ? "KO" : "EN"}
              </span>
            </button>

            {currentUser ? (
              <div className="relative ml-2" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-2 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors text-sm font-medium"
                >
                  <Menu className="w-4 h-4" strokeWidth={2} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.displayName || currentUser.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-600" strokeWidth={2} />
                        <span className="text-sm text-gray-700 font-medium">
                          {t("nav.profile")}
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 font-medium">
                          {t("auth.logout")}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-colors text-sm font-medium"
              >
                {t("auth.login")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
