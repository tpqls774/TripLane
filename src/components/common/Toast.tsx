import React, { useEffect, useMemo } from "react";
import { X } from "lucide-react";

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
  { icon: string; accent: string; badge: string; badgeText: string }
> = {
  success: {
    icon: "✓",
    accent: "shadow-[0_4px_10px_rgba(0,0,0,0.06)]",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-600",
  },
  error: {
    icon: "✕",
    accent: "shadow-[0_4px_10px_rgba(0,0,0,0.06)]",
    badge: "bg-rose-100",
    badgeText: "text-rose-600",
  },
  info: {
    icon: "i",
    accent: "shadow-[0_4px_10px_rgba(0,0,0,0.06)]",
    badge: "bg-sky-100",
    badgeText: "text-sky-600",
  },
  confirm: {
    icon: "?",
    accent: "shadow-[0_4px_10px_rgba(0,0,0,0.06)]",
    badge: "bg-amber-100",
    badgeText: "text-amber-600",
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
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto relative min-w-[320px] max-w-[420px] rounded-[10px] border border-gray-200 bg-white p-4 text-gray-900 ${styles.accent} animate-toast-slide-in`}
      >
        <div className="flex gap-3 items-start">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${styles.badge}`}
          >
            <span className={`text-sm font-bold ${styles.badgeText}`}>
              {styles.icon}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed wrap-break-word">{message}</p>
            {isConfirm && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleConfirm}
                  className="px-3 py-1.5 rounded bg-red-600 text-white text-sm cursor-pointer transition-colors hover:bg-red-700"
                >
                  {confirmText}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded bg-gray-600 text-white text-sm cursor-pointer transition-colors hover:bg-gray-700"
                >
                  {cancelText}
                </button>
              </div>
            )}
          </div>
          {!isConfirm && (
            <button
              onClick={onClose}
              className="shrink-0 bg-transparent border-none text-gray-400 cursor-pointer opacity-60 transition-opacity hover:opacity-100"
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
