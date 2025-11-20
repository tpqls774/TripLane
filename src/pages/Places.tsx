import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import { getAreaBasedList } from "../services/tourismApi";
import { ContentType } from "../types";
import type { TourismPlace, CoursePlace } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import PlaceSkeleton from "../components/PlaceSkeleton";
import Toast from "../components/Toast";

const Places: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [places, setPlaces] = useState<TourismPlace[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<CoursePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const contentTypes = [
    { id: "all", label: "전체" },
    { id: ContentType.TOURIST_SPOT, label: "관광지" },
    { id: ContentType.CULTURE, label: "문화시설" },
    { id: ContentType.FESTIVAL, label: "축제/행사" },
    { id: ContentType.LEPORTS, label: "레포츠" },
    { id: ContentType.ACCOMMODATION, label: "숙박" },
    { id: ContentType.SHOPPING, label: "쇼핑" },
    { id: ContentType.RESTAURANT, label: "음식점" },
  ];

  useEffect(() => {
    setCurrentPage(1);
    fetchPlaces(1);
  }, [selectedContentType]);

  const fetchPlaces = async (page: number = currentPage) => {
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

      setPlaces(allPlaces);
      setTotalCount(total);
    } catch (err) {
      console.error("Failed to fetch places:", err);
      setError(t("error.apiError"));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPlaces(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      const filtered = places.filter(
        (place) =>
          place.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          place.addr1.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setPlaces(filtered);
    } else {
      fetchPlaces();
    }
  };

  const handlePlaceClick = (place: TourismPlace) => {
    navigate(`/place/${place.contentid}`, {
      state: { contentTypeId: place.contenttypeid },
    });
  };

  const togglePlaceSelection = (e: React.MouseEvent, place: TourismPlace) => {
    e.stopPropagation();
    const isSelected = selectedPlaces.some((p) => p.placeId === place.contentid);

    if (isSelected) {
      setSelectedPlaces(
        selectedPlaces.filter((p) => p.placeId !== place.contentid)
      );
      setToast({ message: "코스에서 제거되었습니다", type: "info" });
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
      setToast({ message: "코스에 추가되었습니다", type: "success" });
    }
  };

  const handleSaveCourse = () => {
    if (selectedPlaces.length === 0) {
      setToast({ message: "최소 1개 이상의 장소를 선택해주세요", type: "error" });
      return;
    }
    navigate("/course/new", { state: { places: selectedPlaces } });
  };

  const isPlaceSelected = (placeId: string) => {
    return selectedPlaces.some((p) => p.placeId === placeId);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 sm:px-12 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-10 text-gray-900 sm:w-9" strokeWidth={1.5} />
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              {t("nav.places")}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            전국의 다양한 관광지와 장소를 찾아보세요
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                strokeWidth={2}
              />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="장소 이름이나 주소로 검색하세요"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <span className="hidden sm:inline">검색</span>
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SlidersHorizontal
              className="w-5 h-5 text-gray-700"
              strokeWidth={2}
            />
            <span className="font-semibold text-gray-900">카테고리</span>
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

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={fetchPlaces} />}

        {/* Empty State */}
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

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            <PlaceSkeleton count={20} />
          </div>
        )}

        {/* Places Grid */}
        {!error && !loading && places.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                총 <span className="font-semibold text-gray-900">{places.length}</span>개의 장소
              </p>
              {selectedPlaces.length > 0 && (
                <Button
                  onClick={handleSaveCourse}
                  className="flex items-center gap-2"
                >
                  <Check className="w-5 h-5" strokeWidth={2} />
                  코스 생성 ({selectedPlaces.length})
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {places.map((place) => (
                <div
                  key={place.contentid}
                  onClick={() => handlePlaceClick(place)}
                  className="group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                    {place.firstimage ? (
                      <img
                        src={place.firstimage}
                        alt={place.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-6xl">
                        📷
                      </div>
                    )}

                    {/* Add to Course Button */}
                    <button
                      onClick={(e) => togglePlaceSelection(e, place)}
                      className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all ${
                        isPlaceSelected(place.contentid)
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-900 hover:bg-gray-100"
                      }`}
                      aria-label={
                        isPlaceSelected(place.contentid)
                          ? "코스에서 제거"
                          : "코스에 추가"
                      }
                    >
                      {isPlaceSelected(place.contentid) ? (
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                      ) : (
                        <Plus className="w-5 h-5" strokeWidth={2.5} />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="pl-1">
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

            {/* Pagination */}
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
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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

export default Places;
