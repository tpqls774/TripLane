import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Image,
} from "lucide-react";
import { getAreaBasedList } from "../services/tourismApi";
import { ContentType } from "../types";
import type { TourismPlace, CoursePlace } from "../types";
import ErrorMessage from "../components/common/ErrorMessage";
import Button from "../components/common/Button";
import PlaceSkeleton from "../components/skeleton/PlaceSkeleton";
import Toast from "../components/common/Toast";

const Places: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [places, setPlaces] = useState<TourismPlace[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<CoursePlace[]>(() => {
    const saved = sessionStorage.getItem("selectedPlaces");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    sessionStorage.setItem("selectedPlaces", JSON.stringify(selectedPlaces));
  }, [selectedPlaces]);

  // Debounce: 1초 대기 후 검색어 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const contentTypes = [
    { id: "all", label: t("common.all") },
    { id: ContentType.TOURIST_SPOT, label: t("place.touristSpot") },
    { id: ContentType.CULTURE, label: t("place.culture") },
    { id: ContentType.FESTIVAL, label: t("place.festival") },
    { id: ContentType.LEPORTS, label: t("place.leports") },
    { id: ContentType.ACCOMMODATION, label: t("place.accommodation") },
    { id: ContentType.SHOPPING, label: t("place.shopping") },
    { id: ContentType.RESTAURANT, label: t("place.restaurant") },
  ];

  const fetchPlaces = async (page: number = currentPage, keyword: string = "") => {
    setLoading(true);
    setError(null);

    try {
      const contentTypesToFetch =
        selectedContentType === "all"
          ? [
              ContentType.TOURIST_SPOT,
              ContentType.CULTURE,
              ContentType.RESTAURANT,
            ]
          : [selectedContentType];

      const allPlaces: TourismPlace[] = [];
      let total = 0;

      for (const contentType of contentTypesToFetch) {
        const response = await getAreaBasedList({
          contentTypeId: contentType,
          numOfRows: itemsPerPage,
          pageNo: page,
        });

        if (response.response.body.items.item) {
          allPlaces.push(...response.response.body.items.item);
        }
        total += response.response.body.totalCount || 0;
      }

      // 검색어가 있으면 클라이언트 측 필터링
      const filteredPlaces = keyword.trim()
        ? allPlaces.filter(
            (place) =>
              place.title.toLowerCase().includes(keyword.toLowerCase()) ||
              place.addr1.toLowerCase().includes(keyword.toLowerCase())
          )
        : allPlaces;

      setPlaces(filteredPlaces);
      setTotalCount(total);
    } catch (err) {
      console.error("Failed to fetch places:", err);
      setError(t("error.apiError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchPlaces(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContentType]);

  // debounced 검색어 변경 시 자동 검색
  useEffect(() => {
    setCurrentPage(1);
    fetchPlaces(1, debouncedKeyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPlaces(page, debouncedKeyword);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceClick = (place: TourismPlace) => {
    navigate(`/place/${place.contentid}`, {
      state: { contentTypeId: place.contenttypeid },
    });
  };

  const togglePlaceSelection = (place: TourismPlace) => {
    const isSelected = selectedPlaces.some(
      (p) => p.placeId === place.contentid
    );

    if (isSelected) {
      setSelectedPlaces(
        selectedPlaces.filter((p) => p.placeId !== place.contentid)
      );
      setToast({ message: t("common.removedFromCourse"), type: "info" });
    } else {
      const newPlace: CoursePlace = {
        placeId: place.contentid,
        title: place.title,
        address: place.addr1,
        image: place.firstimage,
        contentType: place.contenttypeid,
        lat: parseFloat(place.mapy),
        lng: parseFloat(place.mapx),
        order: selectedPlaces.length,
      };
      setSelectedPlaces([...selectedPlaces, newPlace]);
      setToast({ message: t("common.addedToCourse"), type: "success" });
    }
  };

  const handleSaveCourse = () => {
    if (selectedPlaces.length === 0) {
      setToast({
        message: t("course.addMinPlace"),
        type: "error",
      });
      return;
    }
    sessionStorage.removeItem("selectedPlaces");
    navigate("/course/new", { state: { places: selectedPlaces } });
  };

  const isPlaceSelected = (placeId: string) => {
    return selectedPlaces.some((p) => p.placeId === placeId);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 sm:px-12 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <MapPin
              className="w-8 h-10 text-gray-900 sm:w-9"
              strokeWidth={1.5}
            />
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              {t("nav.places")}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">{t("place.searchPlaces")}</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              strokeWidth={2}
            />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={t("place.searchPlaceholder")}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            {searchKeyword && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className="text-xs text-gray-400">
                  {t("common.searching")}...
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SlidersHorizontal
              className="w-5 h-5 text-gray-700"
              strokeWidth={2}
            />
            <span className="font-semibold text-gray-900">
              {t("common.category")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedContentType(type.id)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  selectedContentType === type.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={fetchPlaces} />}

        {!error && places.length === 0 && !loading && (
          <div className="text-center py-20">
            <MapPin
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              strokeWidth={1.5}
            />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
              검색 결과가 없습니다
            </h2>
            <p className="text-gray-600 mb-8">
              다른 검색어나 카테고리를 선택해보세요
            </p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            <PlaceSkeleton count={20} />
          </div>
        )}

        {!error && !loading && places.length > 0 && (
          <>
            {selectedPlaces.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mt-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-gray-900 font-semibold text-lg">
                      {selectedPlaces.length}
                      {t("common.placeCount")} {t("common.selected")}
                    </span>
                    <p className="text-gray-600 text-sm mt-1">
                      {t("common.createCourseDesc")}
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveCourse}
                    className="whitespace-nowrap"
                  >
                    {t("common.createCourse")}
                  </Button>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    {t("common.selectedPlaces")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedPlaces.map((place, index) => (
                      <div
                        key={place.placeId}
                        className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center justify-center w-6 h-6 bg-gray-900 text-white rounded-full text-xs font-semibold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {place.title}
                          </h4>
                          <p className="text-xs text-gray-600 truncate">
                            {place.address}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const originalPlace = places.find(
                              (p) => p.contentid === place.placeId
                            );
                            if (originalPlace) {
                              togglePlaceSelection(originalPlace);
                            }
                          }}
                          className="shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={t("common.remove")}
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {t("common.totalPlaces")}{" "}
                <span className="font-semibold text-gray-900">
                  {places.length}
                </span>
                {t("common.placeCount")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {places.map((place) => (
                <div key={place.contentid} className="group cursor-pointer">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                    {place.firstimage ? (
                      <img
                        src={place.firstimage}
                        alt={place.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onClick={() => handlePlaceClick(place)}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300"
                        onClick={() => handlePlaceClick(place)}
                      >
                        <Image className="w-16 h-16" strokeWidth={1.5} />
                      </div>
                    )}

                    <button
                      onClick={() => togglePlaceSelection(place)}
                      className={`absolute top-4 right-4 p-2.5 rounded-full transition-all ${
                        isPlaceSelected(place.contentid)
                          ? "bg-gray-900 text-white"
                          : "bg-white/90 hover:bg-white text-gray-700"
                      }`}
                    >
                      {isPlaceSelected(place.contentid) ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="pl-1" onClick={() => handlePlaceClick(place)}>
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-1">
                      {place.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {place.addr1}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalCount > itemsPerPage && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="이전 페이지"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                </button>

                {(() => {
                  const totalPages = Math.ceil(totalCount / itemsPerPage);
                  const maxVisiblePages = 5;
                  let startPage = Math.max(
                    1,
                    currentPage - Math.floor(maxVisiblePages / 2)
                  );
                  const endPage = Math.min(
                    totalPages,
                    startPage + maxVisiblePages - 1
                  );

                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                          currentPage === i
                            ? "bg-[#00d9b4] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
                })()}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                  className="p-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="다음 페이지"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            )}
          </>
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

export default Places;
