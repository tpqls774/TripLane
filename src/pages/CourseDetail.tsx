import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Edit,
  Share2,
  Navigation,
  Image as ImageIcon,
} from "lucide-react";
import { getCourse } from "../services/courseService";
import type { SavedCourse } from "../types";
import CourseDetailSkeleton from "../components/skeleton/CourseDetailSkeleton";
import ErrorMessage from "../components/common/ErrorMessage";
import MultiPlaceMap from "../components/map/MultiPlaceMap";
import Toast from "../components/common/Toast";
import Button from "../components/common/Button";

const CourseDetail: React.FC = () => {
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<SavedCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showRoute, setShowRoute] = useState(true);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;

    setLoading(true);
    setError(null);

    try {
      const courseData = await getCourse(courseId);
      if (courseData) {
        setCourse(courseData);
      } else {
        setError(t("course.notFound"));
      }
    } catch (err) {
      console.error("Failed to fetch course:", err);
      setError(t("error.apiError"));
    } finally {
      setLoading(false);
    }
  }, [courseId, t]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/course/${courseId}/view`;
    navigator.clipboard.writeText(shareUrl);
    setToast({ message: t("course.linkCopied"), type: "success" });
  };

  const calculateTotalDistance = (): number => {
    if (!course || course.places.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < course.places.length - 1; i++) {
      const place1 = course.places[i];
      const place2 = course.places[i + 1];

      // 하버사인 공식을 사용한 거리 계산 (km)
      const R = 6371; // 지구 반지름 (km)
      const dLat = ((place2.lat - place1.lat) * Math.PI) / 180;
      const dLng = ((place2.lng - place1.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((place1.lat * Math.PI) / 180) *
          Math.cos((place2.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }

    return Math.round(totalDistance * 10) / 10;
  };

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ErrorMessage message={error || t("course.notFound")} />
      </div>
    );
  }

  const totalDistance = calculateTotalDistance();

  return (
    <div className="min-h-screen bg-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-6 sm:px-12 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/my-courses")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            <span className="font-medium">{t("course.backToMyCourses")}</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight">
                  {course.title}
                </h1>
                <span className="text-sm bg-gray-100 text-gray-900 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap">
                  {t(`theme.${course.theme}`)}
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" strokeWidth={2} />
                  <span className="font-medium">
                    {course.places.length}{t("common.placeCount")}
                  </span>
                </div>
                {course.travelers && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" strokeWidth={2} />
                    <span className="font-medium">{course.travelers} {t("course.travelers")}</span>
                  </div>
                )}
                {course.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" strokeWidth={2} />
                    <span className="font-medium">{course.startDate}</span>
                  </div>
                )}
                {totalDistance > 0 && (
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5" strokeWidth={2} />
                    <span className="font-medium">
                      {t("course.totalDistance")}: {t("course.about")} {totalDistance}km
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => navigate(`/course/${courseId}/edit`)}
                className="flex items-center gap-2"
              >
                <Edit className="w-5 h-5" strokeWidth={2} />
                {t("common.edit")}
              </Button>
              <Button
                onClick={handleShare}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" strokeWidth={2} />
                {t("course.share")}
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">{t("course.courseMap")}</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRoute}
                onChange={(e) => setShowRoute(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                {t("course.showRoute")}
              </span>
            </label>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <MultiPlaceMap
              places={course.places.map((place) => ({
                placeId: place.placeId,
                title: place.title,
                lat: place.lat,
                lng: place.lng,
                address: place.address,
              }))}
              showRoute={showRoute}
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {t("course.visitPlaces")} ({course.places.length})
          </h2>
          <div className="space-y-4">
            {course.places.map((place, index) => (
              <div
                key={place.placeId}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-64 aspect-video sm:aspect-square bg-gray-200 shrink-0">
                    {place.image ? (
                      <img
                        src={place.image}
                        alt={place.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-16 h-16" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full font-semibold text-sm shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {place.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 flex items-start gap-2">
                          <MapPin
                            className="w-4 h-4 shrink-0 mt-0.5"
                            strokeWidth={2}
                          />
                          {place.address}
                        </p>
                        {index < course.places.length - 1 && totalDistance > 0 && (
                          <p className="text-sm text-gray-500">
                            {t("course.toNextPlace")}:{" "}
                            {(() => {
                              const nextPlace = course.places[index + 1];
                              const R = 6371;
                              const dLat =
                                ((nextPlace.lat - place.lat) * Math.PI) / 180;
                              const dLng =
                                ((nextPlace.lng - place.lng) * Math.PI) / 180;
                              const a =
                                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                Math.cos((place.lat * Math.PI) / 180) *
                                  Math.cos((nextPlace.lat * Math.PI) / 180) *
                                  Math.sin(dLng / 2) *
                                  Math.sin(dLng / 2);
                              const c =
                                2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                              const distance = R * c;
                              return `${t("course.about")} ${(Math.round(distance * 10) / 10).toFixed(1)}km`;
                            })()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
