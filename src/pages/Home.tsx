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
import Button from "../components/Button";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const themes = [
    {
      type: ThemeType.WELLNESS,
      icon: Sparkles,
      color: "bg-green-100 border-green-300",
      actionText: "스파, 템플스테이 등 힐링 장소 찾기",
    },
    {
      type: ThemeType.PET_FRIENDLY,
      icon: PawPrint,
      color: "bg-yellow-100 border-yellow-300",
      actionText: "반려동물과 함께 갈 수 있는 장소 찾기",
    },
    {
      type: ThemeType.HALLYU,
      icon: Theater,
      color: "bg-purple-100 border-purple-300",
      actionText: "드라마·영화 촬영지와 K-POP 명소 찾기",
    },
    {
      type: ThemeType.GOURMET,
      icon: UtensilsCrossed,
      color: "bg-red-100 border-red-300",
      actionText: "맛집과 전통 음식 체험 장소 찾기",
    },
    {
      type: ThemeType.CULTURE,
      icon: Landmark,
      color: "bg-blue-100 border-blue-300",
      actionText: "박물관, 미술관, 공연장 등 문화시설 찾기",
    },
    {
      type: ThemeType.NATURE,
      icon: TreePine,
      color: "bg-emerald-100 border-emerald-300",
      actionText: "국립공원, 트레킹 코스 등 자연 명소 찾기",
    },
  ];

  const handleThemeSelect = (theme: ThemeTypeValue) => {
    navigate(`/recommend?theme=${theme}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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

          {/* Hero CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => document.getElementById('theme-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-4"
            >
              테마 선택하고 시작하기
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/places")}
              className="text-lg px-8 py-4"
            >
              모든 장소 둘러보기
            </Button>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div id="theme-section" className="container mx-auto px-6 sm:px-12 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            {t("theme.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            원하는 테마를 선택하면 맞춤형 장소를 추천해드립니다
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
                  {theme.actionText}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            나만의 여행 코스 만들기
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            원하는 테마를 선택하고, 추천 장소를 골라 나만의 완벽한 여행 코스를
            만들어보세요
          </p>
          <Button onClick={() => navigate("/my-courses")} size="lg">
            {t("nav.myCourses")} 보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
