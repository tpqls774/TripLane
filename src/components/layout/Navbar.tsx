import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Sparkles, BookOpen, Heart, Map, Globe } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/authService";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ko" ? "en" : "ko";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Map className="w-8 h-8 text-gray-900" strokeWidth={2} />
            <span className="text-xl font-semibold text-gray-900 hidden sm:inline tracking-tight">
              {t("home.title")}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                isActive("/") && !location.pathname.startsWith("/recommend")
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-900"
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
                className="w-4 h-4"
                strokeWidth={2}
                fill={isActive("/favorites") ? "currentColor" : "none"}
              />
              <span className="hidden lg:inline">{t("nav.favorites")}</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 mx-2"></div>

            {/* Language Toggle */}
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

            {/* Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-3 ml-2">
                <span className="text-sm text-gray-700 hidden md:inline font-medium">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors text-sm font-medium"
                >
                  {t("auth.logout")}
                </button>
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
