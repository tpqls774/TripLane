import React, { useState, useEffect } from "react";
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
import { useAuth } from "../contexts/AuthContext";
import PlaceDetailSkeleton from "../components/PlaceDetailSkeleton";
import ErrorMessage from "../components/ErrorMessage";
import KakaoMap from "../components/KakaoMap";

import { Calendar, Car, Clock, Earth, Phone, Pin } from "lucide-react";

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

  useEffect(() => {
    if (placeId) {
      fetchPlaceDetails();
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId && currentUser) {
      checkFavoriteStatus();
    }
  }, [placeId, currentUser]);

  const fetchPlaceDetails = async () => {
    if (!placeId) return;

    setLoading(true);
    setError(null);

    try {
      // 공통 정보 조회
      const commonResponse = await getDetailCommon(placeId);

      // API 에러 응답 체크
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
      } catch (err) {
        console.log("Intro data not available");
      }

      // 이미지 정보 조회
      try {
        const imageResponse = await getDetailImage(placeId);
        if (imageResponse.response.body.items.item) {
          const imageUrls = imageResponse.response.body.items.item
            .map((img: any) => img.originimgurl)
            .filter(Boolean);
          setImages(imageUrls);
        }
      } catch (err) {
        console.log("Image data not available");
      }
    } catch (err) {
      console.error("Failed to fetch place details:", err);
      setError(t("error.apiError"));
    } finally {
      setLoading(false);
    }
  };

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

  const checkFavoriteStatus = async () => {
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
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      alert(t("auth.loginRequired"));
      navigate("/login");
      return;
    }

    if (!placeId || !detail) return;

    setFavoriteLoading(true);

    try {
      if (isFavorite && favoriteId) {
        // 즐겨찾기 제거
        await removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        // 즐겨찾기 추가
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
      }
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
      alert(
        isFavorite
          ? "즐겨찾기 제거에 실패했습니다."
          : "즐겨찾기 추가에 실패했습니다."
      );
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
        {/* Back Button */}
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

        {/* Main Image */}
        <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-8">
          {detail.firstimage || images[0] ? (
            <img
              src={detail.firstimage || images[0]}
              alt={detail.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-8xl">
              📷
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header */}
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
                {/* Favorite Button */}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={isFavorite ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Overview */}
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

            {/* Additional Images */}
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

            {/* Map Section */}
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

          {/* Right Column - Info Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-gray-200 rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 pb-4 border-b border-gray-200">
                  상세 정보
                </h2>

                <div className="space-y-4">
                  {detail.addr1 && (
                    <div className="flex items-start gap-3">
                      <Pin size={24} />
                      {/* <span className="text-2xl">📍</span> */}
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
                      {/* <span className="text-2xl">📞</span> */}
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
                      {/* <span className="text-2xl">🕐</span> */}
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
                      {/* <span className="text-2xl">📅</span> */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          휴무일
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
                      {/* <span className="text-2xl">🚗</span> */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          주차 정보
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
                      <span className="text-2xl">🐕</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          반려동물 동반
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
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {t("place.website")}
                        </p>
                        <div
                          className="text-sm text-gray-600"
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
    </div>
  );
};

export default PlaceDetail;
