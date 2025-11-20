import React, { useEffect, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

type ToastType = "success" | "error" | "info" | "confirm";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

const iconMap: Record<
  ToastType,
  { icon: React.ReactNode; accent: string; badge: string; badgeText: string }
> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2} />,
    accent: "shadow-[0_0_0_4px_rgba(16,185,129,0.12)]",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-700",
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-rose-600" strokeWidth={2} />,
    accent: "shadow-[0_0_0_4px_rgba(244,63,94,0.12)]",
    badge: "bg-rose-100",
    badgeText: "text-rose-700",
  },
  info: {
    icon: <Info className="w-5 h-5 text-sky-600" strokeWidth={2} />,
    accent: "shadow-[0_0_0_4px_rgba(37,99,235,0.12)]",
    badge: "bg-sky-100",
    badgeText: "text-sky-700",
  },
  confirm: {
    icon: (
      <AlertTriangle className="w-5 h-5 text-amber-600" strokeWidth={2} />
    ),
    accent: "shadow-[0_0_0_4px_rgba(245,158,11,0.15)]",
    badge: "bg-amber-100",
    badgeText: "text-amber-700",
  },
};

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) => {
  const isConfirm = type === "confirm";

  useEffect(() => {
    if (isConfirm) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, isConfirm, onClose]);

  const handleConfirm = async () => {
    try {
      await onConfirm?.();
    } finally {
      onClose();
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const styles = useMemo(() => iconMap[type], [type]);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto relative min-w-[320px] max-w-md rounded-2xl border border-gray-200 bg-white p-3.5 text-gray-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${styles.accent} animate-toast-slide-in`}
      >
        <div className="flex gap-3 items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.badge} ${styles.badgeText}`}
          >
            {styles.icon}
          </div>
          <div className="flex-1 text-sm leading-relaxed">
            <p>{message}</p>
            {isConfirm && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={handleCancel}
                  className="w-full rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 sm:w-auto"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 sm:w-auto"
                >
                  {confirmText}
                </button>
              </div>
            )}
          </div>
          {!isConfirm && (
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label="닫기"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;
