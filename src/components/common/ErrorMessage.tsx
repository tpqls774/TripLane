import React from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-error-light border-error rounded-lg p-6 text-center">
      <div className="text-error mb-4 flex justify-center">
        <AlertTriangle color="red" className="w-12 h-12" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold text-error mb-2">
        {t("common.error")}
      </h3>
      <p className="text-text-secondary mb-4">
        {message || t("error.apiError")}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          {t("error.retry")}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
