import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import {
  getCourse,
  createCourse,
  updateCourse,
} from "../services/courseService";
import { ThemeType } from "../types";
import type { CoursePlace, ThemeTypeValue } from "../types";
import CourseEditSkeleton from "../components/skeleton/CourseEditSkeleton";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Toast from "../components/common/Toast";
import { Image } from "lucide-react";

// 두 지점 간의 거리를 계산하는 함수 (Haversine 공식)
const getDistance = (p1: CoursePlace, p2: CoursePlace) => {
  const R = 6371; // 지구의 반경 (km)
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Nearest Neighbor 알고리즘으로 장소 순서 최적화
const optimizeOrderByNearestNeighbor = (
  places: CoursePlace[]
): CoursePlace[] => {
  if (places.length < 2) return places;

  const unvisited = [...places];
  const orderedPlaces: CoursePlace[] = [];

  // 첫 번째 장소를 시작점으로 설정
  let currentPlace = unvisited.shift();
  if (currentPlace) {
    orderedPlaces.push(currentPlace);
  }

  while (unvisited.length > 0) {
    let nearestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const distance = getDistance(currentPlace!, unvisited[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    if (nearestIndex !== -1) {
      currentPlace = unvisited.splice(nearestIndex, 1)[0];
      orderedPlaces.push(currentPlace);
    }
  }

  // 최종 순서(order) 업데이트
  return orderedPlaces.map((place, index) => ({ ...place, order: index }));
};

const CourseEdit: React.FC = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const initialData = location.state as {
    theme?: ThemeTypeValue;
    places?: CoursePlace[];
  };

  const [loading, setLoading] = useState(!!courseId);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState<ThemeTypeValue>(
    initialData?.theme || ThemeType.WELLNESS
  );
  const [places, setPlaces] = useState<CoursePlace[]>(initialData?.places || []);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId || courseId === "new") return;

        try {
      const course = await getCourse(courseId);
      if (course) {
        setTitle(course.title);
        setDescription(course.description);
        setTheme(course.theme);
        setPlaces(course.places);
        setStartDate(course.startDate || "");
        setEndDate(course.endDate || "");
        setTravelers(course.travelers || 2);
      }
    } catch (err) {
      console.error("Failed to fetch course:", err);
      setToast({ message: t("error.apiError"), type: "error" });
    } finally {
      setLoading(false);
    }
  }, [courseId, t]);

  useEffect(() => {
    if (courseId && courseId !== "new") {
      fetchCourse();
    } else if (initialData?.places) {
      // 새 코스 생성 시 전달된 장소들의 순서를 최적화합니다.
      const optimizedPlaces = optimizeOrderByNearestNeighbor(initialData.places);
      setPlaces(optimizedPlaces);
    }
  }, [courseId, fetchCourse, initialData]);

  const handleSave = async () => {
    if (!title.trim()) {
      setToast({ message: t("course.enterTitle"), type: "error" });
      return;
    }

    if (places.length === 0) {
      setToast({
        message: t("course.addMinPlace"),
        type: "error",
      });
      return;
    }

    if (!description.trim()) {
      setToast({ message: t("course.enterDescription"), type: "error" });
      return;
    }

    if (!startDate) {
      setToast({ message: t("course.enterStartDate"), type: "error" });
      return;
    }

    if (!endDate) {
      setToast({ message: t("course.enterEndDate"), type: "error" });
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setToast({ message: t("course.invalidDateRange"), type: "error" });
      return;
    }

    if (!currentUser) {
      setToast({ message: t("auth.loginRequired"), type: "error" });
      return;
    }

    setSaving(true);
    try {
      const courseData = {
        userId: currentUser.uid,
        title,
        description,
        theme,
        places,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        travelers,
      };

      if (courseId === "new" || !courseId) {
        await createCourse(courseData);
        setToast({ message: t("course.saveSuccess"), type: "success" });
        setTimeout(() => navigate("/my-courses"), 1500);
      } else {
        await updateCourse(courseId, courseData);
        setToast({ message: t("course.updateSuccess"), type: "success" });
        setTimeout(() => navigate("/my-courses"), 1500);
      }
    } catch (err) {
      console.error("Failed to save course:", err);
      if (err instanceof Error && err.message.includes("permission-denied")) {
        setToast({ message: t("course.missingFields"), type: "error" });
      } else {
        setToast({ message: t("course.saveError"), type: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePlace = (index: number) => {
    const newPlaces = places.filter((_, i) => i !== index);
    newPlaces.forEach((place, idx) => {
      place.order = idx;
    });
    setPlaces(newPlaces);
  };

  const handleMovePlace = (index: number, direction: "up" | "down") => {
    const newPlaces = [...places];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPlaces.length) return;

    [newPlaces[index], newPlaces[targetIndex]] = [
      newPlaces[targetIndex],
      newPlaces[index],
    ];

    newPlaces.forEach((place, idx) => {
      place.order = idx;
    });

    setPlaces(newPlaces);
  };

  if (loading) {
    return <CourseEditSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-6 sm:px-12 py-8 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
            {!courseId ? t("course.create") : t("common.edit")}
          </h1>
          <p className="text-gray-600 text-lg">{t("course.enterInfo")}</p>
        </div>

        <div className="space-y-8">
          <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-white">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("common.basicInfo")}
            </h2>
            <div className="space-y-5">
              <Input
                label={t("course.title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("course.titlePlaceholder")}
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t("course.description")}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("course.descriptionPlaceholder")}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t("course.theme")}
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeTypeValue)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                >
                  {Object.values(ThemeType).map((themeValue) => (
                    <option key={themeValue} value={themeValue}>
                      {t(`theme.${themeValue}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={t("course.startDate")}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                />
                <Input
                  label={t("course.endDate")}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                />
                <Input
                  label={t("course.travelers")}
                  type="number"
                  min={1}
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                  fullWidth
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t("course.places")} ({places.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/recommend?theme=" + theme)}
              >
                + {t("common.addPlace")}
              </Button>
            </div>

            {places.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                {t("common.noPlacesAdded")}
              </div>
            ) : (
              <div className="space-y-3">
                {places.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMovePlace(index, "up")}
                        disabled={index === 0}
                        className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                      >
                        ▲
                      </button>
                      <span className="text-sm font-semibold text-gray-900">
                        {index + 1}
                      </span>
                      <button
                        onClick={() => handleMovePlace(index, "down")}
                        disabled={index === places.length - 1}
                        className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                      >
                        ▼
                      </button>
                    </div>

                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                      {place.image ? (
                        <img
                          src={place.image}
                          alt={place.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Image className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {place.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {place.address}
                      </p>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemovePlace(index)}
                    >
                      {t("common.delete")}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => navigate("/my-courses")}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t("common.loading") : t("common.save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEdit;
