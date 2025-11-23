import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getDetailCommon,
  getDetailIntro,
  getDetailImage,
} from "../services/tourismApi";
import {
  addFavorite,
  removeFavorite,
  getFavoriteByPlace,
} from "../services/favoriteService";
import { useAuth } from "../hooks/useAuth";
import PlaceDetailSkeleton from "../components/skeleton/PlaceDetailSkeleton";
import ErrorMessage from "../components/common/ErrorMessage";
import KakaoMap from "../components/map/KakaoMap";
import Toast from "../components/common/Toast";

import { Calendar, Car, Clock, Earth, Phone, Pin, Dog, Heart, Image } from "lucide-react";

interface PlaceDetail {
  title: string;
  addr1: string;
  addr2?: string;
  tel?: string;
  homepage?: string;
  overview?: string;
  firstimage?: string;
  mapx: string;
  mapy: string;
}

interface PlaceIntro {
  infocenter?: string;
  restdate?: string;
  usetime?: string;
  parking?: string;
  chkpet?: string;
}

const PlaceDetail: React.FC = () => {
  const { t } = useTranslation();
  const { placeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const contentTypeId = location.state?.contentTypeId || "12";

  const [detail, setDetail] = useState<PlaceDetail | null>(null);
  const [intro, setIntro] = useState<PlaceIntro | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const fetchPlaceDetails = useCallback(async () => {
    if (!placeId) return;

    setLoading(true);
    setError(null);

    try {
      const commonResponse = await getDetailCommon(placeId);

      if (commonResponse.response?.header?.resultCode !== "0000") {
        throw new Error(
          commonResponse.response?.header?.resultMsg || "API Error"
        );
      }

      if (commonResponse.response?.body?.items?.item?.[0]) {
        setDetail(commonResponse.response.body.items.item[0]);
      }

      // 소개 정보 조회
      try {
        const introResponse = await getDetailIntro(placeId, contentTypeId);
        if (introResponse.response.body.items.item?.[0]) {
          setIntro(introResponse.response.body.items.item[0]);
        }
      } catch {
        console.error("Intro data not available");
      }

      try {
        const imageResponse = await getDetailImage(placeId);
        if (imageResponse.response.body.items.item) {
          const imageUrls = imageResponse.response.body.items.item
            .map((img: { originimgurl?: string }) => img.originimgurl)
            .filter(Boolean);
          setImages(imageUrls);
        }
      } catch {
        console.error("Image data not available");
      }
    } catch (err) {
      console.error("Failed to fetch place details:", err);
      setError(t("error.apiError"));
    } finally {
      setLoading(false);
    }
  }, [placeId, contentTypeId, t]);

  useEffect(() => {
    if (placeId) {
      fetchPlaceDetails();
    }
  }, [placeId, fetchPlaceDetails]);

  const checkFavoriteStatus = useCallback(async () => {
    if (!placeId || !currentUser) return;

    try {
      const favorite = await getFavoriteByPlace(currentUser.uid, placeId);
      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite.id || null);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error("즐겨찾기 상태 확인 실패:", error);
    }
  }, [placeId, currentUser]);

  useEffect(() => {
    if (placeId && currentUser) {
      checkFavoriteStatus();
    }
  }, [placeId, currentUser, checkFavoriteStatus]);

  const getContentTypeName = (typeId: string) => {
    const types: Record<string, string> = {
      "12": t("place.touristSpot"),
      "14": t("place.culture"),
      "15": t("place.festival"),
      "28": t("place.leports"),
      "32": t("place.accommodation"),
      "39": t("place.restaurant"),
    };
    return types[typeId] || t("place.touristSpot");
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      setToast({ message: t("auth.loginRequired"), type: "error" });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!placeId || !detail) return;

    setFavoriteLoading(true);

    try {
      if (isFavorite && favoriteId) {
        await removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
        setToast({ message: t("place.removeFromFavorite"), type: "info" });
      } else {
        const newFavoriteId = await addFavorite({
          userId: currentUser.uid,
          placeId,
          title: detail.title,
          addr1: detail.addr1,
          firstimage: detail.firstimage,
          contentTypeId,
        });
        setIsFavorite(true);
        setFavoriteId(newFavoriteId);
        setToast({ message: t("place.addToFavorite"), type: "success" });
      }
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
      setToast({
        message: isFavorite
          ? t("place.removeFromFavoriteError")
          : t("place.addToFavoriteError"),
        type: "error",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return <PlaceDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchPlaceDetails} />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-text-secondary">{t("error.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 sm:px-12 py-8 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-900 font-medium hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("common.back")}
        </button>

        <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-8">
          {detail.firstimage || images[0] ? (
            <img
              src={detail.firstimage || images[0]}
              alt={detail.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Image className="w-24 h-24" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="pb-8 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg mb-3">
                    {getContentTypeName(contentTypeId)}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
                    {detail.title}
                  </h1>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  disabled={favoriteLoading}
                  className={`shrink-0 ml-4 p-2.5 rounded-full transition-all ${
                    isFavorite
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } ${favoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  aria-label={isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
                >
                  <Heart
                    className="w-6 h-6"
                    fill={isFavorite ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>

            {detail.overview && (
              <div className="pb-10 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("place.overview")}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {stripHtml(detail.overview)}
                </p>
              </div>
            )}

            {images.length > 1 && (
              <div className="pb-10 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t("place.images")}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-200 rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`${detail.title} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail.mapx && detail.mapy && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  위치
                </h2>
                <div className="w-full h-96 rounded-2xl overflow-hidden">
                  {(() => {
                    const lat = parseFloat(detail.mapy);
                    const lng = parseFloat(detail.mapx);

                    if (isNaN(lat) || isNaN(lng)) {
                      return (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                          좌표 정보를 사용할 수 없습니다.
                        </div>
                      );
                    }

                    return (
                      <KakaoMap
                        latitude={lat}
                        longitude={lng}
                        title={detail.title}
                        address={`${detail.addr1} ${detail.addr2 || ""}`}
                      />
                    );
                  })()}
                </div>
                {detail.addr1 && (
                  <p className="mt-4 text-gray-600">
                    {detail.addr1} {detail.addr2}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-gray-200 rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 pb-4 border-b border-gray-200">
                  {t("place.details")}
                </h2>

                <div className="space-y-4">
                  {detail.addr1 && (
                    <div className="flex items-start gap-3">
                      <Pin size={24} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {t("place.address")}
                        </p>
                        <p className="text-sm text-gray-600">
                          {detail.addr1} {detail.addr2}
                        </p>
                      </div>
                    </div>
                  )}

                  {detail.tel && (
                    <div className="flex items-start gap-3">
                      <Phone size={24} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {t("place.phone")}
                        </p>
                        <p className="text-sm text-gray-600">{detail.tel}</p>
                      </div>
                    </div>
                  )}

                  {intro?.usetime && (
                    <div className="flex items-start gap-3">
                      <Clock size={24} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {t("place.openingHours")}
                        </p>
                        <div
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: intro.usetime }}
                        />
                      </div>
                    </div>
                  )}

                  {intro?.restdate && (
                    <div className="flex items-start gap-3">
                      <Calendar size={24} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {t("place.restDate")}
                        </p>
                        <div
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: intro.restdate }}
                        />
                      </div>
                    </div>
                  )}

                  {intro?.parking && (
                    <div className="flex items-start gap-3">
                      <Car size={24} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {t("place.parking")}
                        </p>
                        <div
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: intro.parking }}
                        />
                      </div>
                    </div>
                  )}

                  {intro?.chkpet && (
                    <div className="flex items-start gap-3">
                      <Dog size={24} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {t("place.petFriendly")}
                        </p>
                        <div
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: intro.chkpet }}
                        />
                      </div>
                    </div>
                  )}

                  {detail.homepage && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        <Earth size={24} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {t("place.website")}
                        </p>
                        <div
                          className="text-sm text-gray-600 break-all"
                          dangerouslySetInnerHTML={{ __html: detail.homepage }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default PlaceDetail;
