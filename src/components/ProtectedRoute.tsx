import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  if (!currentUser) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <p className="text-xl font-semibold text-text-primary mb-4">
            {t("auth.loginRequired")}
          </p>
          <p className="text-text-secondary mb-6">{t("auth.loginDesc")}</p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
