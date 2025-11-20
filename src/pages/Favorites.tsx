import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserFavorites, removeFavorite } from "../services/favoriteService";
import type { Favorite } from "../types/favorite";
import ErrorMessage from "../components/ErrorMessage";
import PlaceSkeleton from "../components/PlaceSkeleton";
import Toast from "../components/Toast";

import { Heart } from "lucide-react";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  const fetchFavorites = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const userFavorites = await getUserFavorites(currentUser.uid);
      setFavorites(userFavorites);
    } catch (err) {
      console.error("즐겨찾기 목록 조회 실패:", err);
      setError("즐겨찾기 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await removeFavorite(favoriteId);
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      setToast({ message: "즐겨찾기에서 제거되었습니다", type: "success" });
    } catch (error) {
      console.error("즐겨찾기 제거 실패:", error);
      setToast({ message: "즐겨찾기 제거에 실패했습니다", type: "error" });
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
              내 즐겨찾기
            </h1>
          </div>
          {!loading && (
            <p className="text-gray-600 text-lg">
              총 {favorites.length}개의 장소
            </p>
          )}
        </div>

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={fetchFavorites} />}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PlaceSkeleton count={6} />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && favorites.length === 0 && (
          <div className="text-center py-20">
            <Heart
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              strokeWidth={1.5}
            />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
              즐겨찾기한 장소가 없습니다
            </h2>
            <p className="text-gray-600 mb-8">관심있는 장소를 즐겨찾기에 추가해보세요</p>
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
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
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                      📷
                    </div>
                  )}
                </div>

                {/* Content */}
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

                  {/* Actions */}
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
                      상세보기
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

      {/* Toast */}
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
