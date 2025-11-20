import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  BookOpen,
  Share2,
  Trash2,
  MapPin,
  Users,
  Calendar,
  Eye,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getUserCourses, deleteCourse } from "../services/courseService";
import type { SavedCourse } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import CourseSkeleton from "../components/CourseSkeleton";
import Toast from "../components/Toast";

const MyCourses: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [courses, setCourses] = useState<SavedCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "confirm";
    onConfirm?: () => void | Promise<void>;
  } | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchCourses();
    }
  }, [currentUser]);

  const fetchCourses = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const userCourses = await getUserCourses(currentUser.uid);
      setCourses(userCourses);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError(t("error.apiError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter((c) => c.id !== courseId));
      setToast({ message: t("course.deleteSuccess"), type: "success" });
    } catch (err) {
      console.error("Failed to delete course:", err);
      setToast({ message: t("course.deleteError"), type: "error" });
    }
  };

  const confirmDeleteCourse = (courseId: string) => {
    setToast({
      message: t("course.deleteConfirm"),
      type: "confirm",
      onConfirm: async () => {
        await handleDeleteCourse(courseId);
      },
    });
  };

  const handleShareCourse = (courseId: string) => {
    const shareUrl = `${window.location.origin}/course/${courseId}/view`;
    navigator.clipboard.writeText(shareUrl);
    setToast({ message: t("course.linkCopied"), type: "success" });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 sm:px-12 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <BookOpen
                  className="w-8 h-10 text-gray-900 sm:w-9"
                  strokeWidth={1.5}
                />
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                  {t("nav.myCourses")}
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                {t("course.manageCourses")}
              </p>
            </div>
            <Button
              onClick={() => navigate("/places")}
              className="whitespace-nowrap flex items-center gap-2"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              {t("course.create")}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={fetchCourses} />}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <CourseSkeleton count={6} />
          </div>
        )}

        {/* Empty State */}
        {!error && courses.length === 0 && !loading && (
          <div className="text-center py-20">
            <BookOpen
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              strokeWidth={1.5}
            />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
              {t("course.noCourses")}
            </h2>
            <p className="text-gray-600 mb-8">{t("course.createNew")}</p>
          </div>
        )}

        {/* Courses Grid */}
        {!error && !loading && courses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="relative group">
                {/* Course Card */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Places Preview Images */}
                  <div className="aspect-4/3 bg-gray-200 overflow-hidden">
                    {course.places.length > 0 && course.places[0].image ? (
                      <img
                        src={course.places[0].image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">
                        📷
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-semibold text-gray-900 flex-1 line-clamp-1">
                        {course.title}
                      </h2>
                      <span className="text-xs bg-gray-100 text-gray-900 px-2.5 py-1 rounded-lg font-medium ml-2 whitespace-nowrap">
                        {t(`theme.${course.theme}`)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" strokeWidth={2} />
                        {course.places.length}{t("common.placeCount")}
                      </span>
                      {course.travelers && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" strokeWidth={2} />
                          {course.travelers}{t("course.travelers")}
                        </span>
                      )}
                    </div>

                    {course.startDate && (
                      <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                        <Calendar className="w-4 h-4" strokeWidth={2} />
                        {course.startDate}
                      </p>
                    )}

                    {/* Metadata */}
                    <p className="text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                      {formatDate(course.updatedAt)} {t("common.update")}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/course/${course.id}/view`)}
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-2"
                        variant="secondary"
                      >
                        <Eye className="w-4 h-4" strokeWidth={2} />
                        {t("common.viewDetails")}
                      </Button>
                      <button
                        onClick={() => navigate(`/course/${course.id}/edit`)}
                        className="px-4 py-2.5 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
                        title={t("common.edit")}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        onClick={() => handleShareCourse(course.id)}
                        className="px-4 py-2.5 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
                        title={t("course.share")}
                      >
                        <Share2 className="w-5 h-5" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => confirmDeleteCourse(course.id)}
                        className="px-4 py-2.5 bg-gray-100 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors text-sm"
                        title={t("common.delete")}
                      >
                        <Trash2 className="w-5 h-5" strokeWidth={2} />
                      </button>
                    </div>
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
          onConfirm={toast.onConfirm}
          confirmText={t("common.delete")}
          cancelText={t("common.cancel")}
        />
      )}
    </div>
  );
};

export default MyCourses;
