import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Settings, Lock, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { updateUserProfile, changePassword } from "../services/authService";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Toast from "../components/common/Toast";

const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();

  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || ""
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (!displayName.trim()) {
      setToast({ message: t("profile.enterDisplayName"), type: "error" });
      return;
    }

    setLoading(true);

    try {
      await updateUserProfile(currentUser, displayName);
      setToast({ message: t("profile.updateSuccess"), type: "success" });
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("profile.updateError");
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (!currentPassword) {
      setToast({ message: t("profile.enterCurrentPassword"), type: "error" });
      return;
    }

    if (!newPassword) {
      setToast({ message: t("profile.enterNewPassword"), type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: t("auth.passwordTooShort"), type: "error" });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setToast({ message: t("auth.passwordMismatch"), type: "error" });
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentUser, currentPassword, newPassword);
      setToast({
        message: t("profile.passwordUpdateSuccess"),
        type: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("profile.passwordUpdateError");
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string | null | undefined) => {
    if (!timestamp) return "-";
    const locale = i18n.language === "en" ? "en-US" : "ko-KR";
    return new Date(timestamp).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 sm:px-12 py-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Settings className="w-8 h-8 text-gray-900" strokeWidth={1.5} />
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              {t("profile.title")}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">{t("profile.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-gray-900" strokeWidth={2} />
              <h2 className="text-xl font-semibold text-gray-900">
                {t("profile.accountInfo")}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {t("auth.email")}
                </label>
                <p className="text-gray-900 font-medium">{currentUser.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {t("profile.memberSince")}
                </label>
                <p className="text-gray-900 font-medium">
                  {formatDate(currentUser.metadata.creationTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-gray-900" strokeWidth={2} />
              <h2 className="text-xl font-semibold text-gray-900">
                {t("profile.profileInfo")}
              </h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {t("auth.displayName")}
                </label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t("auth.displayNamePlaceholder")}
                  disabled={loading}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t("common.loading") : t("profile.updateProfile")}
              </Button>
            </form>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-gray-900" strokeWidth={2} />
              <h2 className="text-xl font-semibold text-gray-900">
                {t("profile.securityInfo")}
              </h2>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="space-y-4 max-w-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {t("profile.currentPassword")}
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t("profile.currentPassword")}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {t("profile.newPassword")}
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t("profile.newPassword")}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {t("profile.confirmNewPassword")}
                  </label>
                  <Input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder={t("profile.confirmNewPassword")}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? t("common.loading") : t("profile.changePassword")}
              </Button>
            </form>
          </div>
        </div>
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

export default Profile;
