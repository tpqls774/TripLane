import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import {
  getCourse,
  createCourse,
  updateCourse,
} from "../services/courseService";
import { ThemeType } from "../types";
import type { CoursePlace, ThemeTypeValue } from "../types";
import CourseEditSkeleton from "../components/CourseEditSkeleton";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Toast from "../components/Toast";

const CourseEdit: React.FC = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // 새 코스 생성시 Recommend 페이지에서 전달된 데이터
  const initialData = location.state as {
    theme?: ThemeTypeValue;
    places?: CoursePlace[];
  };

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState<ThemeTypeValue>(
    initialData?.theme || ThemeType.WELLNESS
  );
  const [places, setPlaces] = useState<CoursePlace[]>(
    initialData?.places || []
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (courseId && courseId !== "new") {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId || courseId === "new") return;

    setLoading(true);
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
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setToast({ message: "코스 제목을 입력해주세요", type: "error" });
      return;
    }

    if (places.length === 0) {
      setToast({
        message: "최소 1개 이상의 장소를 추가해주세요",
        type: "error",
      });
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
        // 새 코스 생성
        await createCourse(courseData);
        setToast({ message: t("course.saveSuccess"), type: "success" });
        setTimeout(() => navigate("/my-courses"), 1500);
      } else {
        // 기존 코스 수정
        await updateCourse(courseId, courseData);
        setToast({ message: t("course.updateSuccess"), type: "success" });
        setTimeout(() => navigate("/my-courses"), 1500);
      }
    } catch (err) {
      console.error("Failed to save course:", err);
      setToast({ message: t("course.saveError"), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePlace = (index: number) => {
    const newPlaces = places.filter((_, i) => i !== index);
    // 순서 재조정
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

    // 순서 재조정
    newPlaces.forEach((place, idx) => {
      place.order = idx;
    });

    setPlaces(newPlaces);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {courseId === "new" ? t("course.create") : t("common.edit")}
          </h1>
          <p className="text-text-secondary">여행 코스의 정보를 입력해주세요</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <h2 className="text-xl font-bold text-text-primary mb-4">
              기본 정보
            </h2>
            <div className="space-y-4">
              <Input
                label={t("course.title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 서울 힐링 1박 2일 코스"
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  {t("course.description")}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="코스에 대한 설명을 입력해주세요"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  {t("course.theme")}
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeTypeValue)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.values(ThemeType).map((t) => (
                    <option key={t} value={t}>
                      {t}
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
          </Card>

          {/* Places Card */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                {t("course.places")} ({places.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/recommend?theme=" + theme)}
              >
                + 장소 추가하기
              </Button>
            </div>

            {places.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                추가된 장소가 없습니다
              </div>
            ) : (
              <div className="space-y-3">
                {places.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    {/* Order */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMovePlace(index, "up")}
                        disabled={index === 0}
                        className="text-xs text-gray-500 hover:text-primary disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <span className="text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <button
                        onClick={() => handleMovePlace(index, "down")}
                        disabled={index === places.length - 1}
                        className="text-xs text-gray-500 hover:text-primary disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden shrink-0">
                      {place.image ? (
                        <img
                          src={place.image}
                          alt={place.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📷
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary truncate">
                        {place.title}
                      </h3>
                      <p className="text-sm text-text-secondary truncate">
                        {place.address}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemovePlace(index)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Actions */}
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
