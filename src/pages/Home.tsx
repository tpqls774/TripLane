import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  PawPrint,
  Theater,
  UtensilsCrossed,
  Landmark,
  TreePine,
  Map,
} from "lucide-react";
import { ThemeType } from "../types";
import type { ThemeTypeValue } from "../types";
import Button from "../components/common/Button";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const themes = [
    {
      type: ThemeType.WELLNESS,
      icon: Sparkles,
      color: "bg-green-100 border-green-300",
    },
    {
      type: ThemeType.PET_FRIENDLY,
      icon: PawPrint,
      color: "bg-yellow-100 border-yellow-300",
    },
    {
      type: ThemeType.HALLYU,
      icon: Theater,
      color: "bg-purple-100 border-purple-300",
    },
    {
      type: ThemeType.GOURMET,
      icon: UtensilsCrossed,
      color: "bg-red-100 border-red-300",
    },
    {
      type: ThemeType.CULTURE,
      icon: Landmark,
      color: "bg-blue-100 border-blue-300",
    },
    {
      type: ThemeType.NATURE,
      icon: TreePine,
      color: "bg-emerald-100 border-emerald-300",
    },
  ];

  const handleThemeSelect = (theme: ThemeTypeValue) => {
    navigate(`/recommend?theme=${theme}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[60vh] min-h-[500px] bg-linear-to-br from-rose-50 via-white to-teal-50 flex items-center justify-center">
        <div className="container mx-auto px-6 sm:px-12 text-center">
          <div className="flex justify-center mb-6">
            <Map className="w-16 h-16 text-gray-900" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-gray-900 mb-6 tracking-tight">
            {t("home.title")}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 font-light">
            {t("home.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById("theme-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-lg px-8 py-4"
            >
              {t("home.selectTheme")}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/places")}
              className="text-lg px-8 py-4"
            >
              {t("home.browseAllPlaces")}
            </Button>
          </div>
        </div>
      </div>

      <div id="theme-section" className="container mx-auto px-6 sm:px-12 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            {t("theme.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("home.themeSelectDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            return (
              <div
                key={theme.type}
                onClick={() => handleThemeSelect(theme.type)}
                className="group cursor-pointer bg-white rounded-2xl p-6 hover:border-gray-300 transition-all duration-300"
              >
                <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-4">
                  <div
                    className={`absolute inset-0 ${theme.color
                      .replace("border-", "bg-")
                      .replace(
                        "-300",
                        "-50"
                      )} transition-transform group-hover:scale-105 duration-300 flex items-center justify-center`}
                  >
                    <IconComponent
                      className="w-20 h-20 text-gray-700"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t(`theme.${theme.type}`)}
                </h3>
                <p className="text-gray-600 text-sm mb-3 font-light">
                  {t(`theme.description.${theme.type}`)}
                </p>
                <p className="text-[#00d9b4] text-sm font-medium flex items-center gap-1">
                  {t(`home.action.${theme.type}`)}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            {t("home.createOwnCourse")}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("home.createCourseFeature")}
          </p>
          <Button onClick={() => navigate("/my-courses")} size="lg">
            {t("nav.myCourses")} {t("home.viewMyCourses")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
