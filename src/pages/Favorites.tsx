import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { getUserFavorites, removeFavorite } from "../services/favoriteService";
import type { Favorite } from "../types/favorite";
import ErrorMessage from "../components/common/ErrorMessage";
import FavoriteSkeleton from "../components/skeleton/FavoriteSkeleton";
import Toast from "../components/common/Toast";

import { Heart, Image } from "lucide-react";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const userFavorites = await getUserFavorites(currentUser.uid);
      setFavorites(userFavorites);
    } catch (err) {
      console.error("즐겨찾기 목록 조회 실패:", err);
      setError(t("error.apiError"));
    } finally {
      setLoading(false);
    }
  }, [currentUser, t]);

  useEffect(() => {
    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser, fetchFavorites]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await removeFavorite(favoriteId);
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      setToast({ message: t("place.removeFromFavorite"), type: "success" });
    } catch (error) {
      console.error("즐겨찾기 제거 실패:", error);
      setToast({ message: t("place.removeFromFavoriteError"), type: "error" });
    }
  };

  const handlePlaceClick = (placeId: string, contentTypeId: string) => {
    navigate(`/place/${placeId}`, { state: { contentTypeId } });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 sm:px-12 py-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Heart
              className="w-8 h-10 text-gray-900 sm:w-9"
              strokeWidth={1.5}
            />
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              {t("nav.myFavorites")}
            </h1>
          </div>
          {!loading && (
            <p className="text-gray-600 text-lg">
              {t("common.totalPlaces")} {favorites.length}
              {t("common.placeCount")}
            </p>
          )}
        </div>

        {error && <ErrorMessage message={error} onRetry={fetchFavorites} />}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FavoriteSkeleton count={6} />
          </div>
        )}

        {!loading && !error && favorites.length === 0 && (
          <div className="text-center py-20">
            <Heart
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              strokeWidth={1.5}
            />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
              {t("nav.noFavorites")}
            </h2>
            <p className="text-gray-600 mb-8">{t("nav.addFavoritesDesc")}</p>
          </div>
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="aspect-video bg-gray-200 cursor-pointer"
                  onClick={() =>
                    handlePlaceClick(favorite.placeId, favorite.contentTypeId)
                  }
                >
                  {favorite.firstimage ? (
                    <img
                      src={favorite.firstimage}
                      alt={favorite.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Image className="w-16 h-16" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3
                    className="text-lg font-bold text-text-primary mb-1 cursor-pointer hover:text-primary line-clamp-2"
                    onClick={() =>
                      handlePlaceClick(favorite.placeId, favorite.contentTypeId)
                    }
                  >
                    {favorite.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-1">
                    {favorite.addr1}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handlePlaceClick(
                          favorite.placeId,
                          favorite.contentTypeId
                        )
                      }
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                    >
                      {t("common.viewDetails")}
                    </button>
                    <button
                      onClick={() =>
                        favorite.id && handleRemoveFavorite(favorite.id)
                      }
                      className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      aria-label="즐겨찾기 제거"
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Favorites;
