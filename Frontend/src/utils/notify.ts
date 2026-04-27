import toast from "react-hot-toast";
import type { CSSProperties } from "react";

type NotifyVariant = "success" | "error" | "info" | "warning";

const baseStyle = {
  borderRadius: "14px",
  border: "1px solid transparent",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
  padding: "12px 14px",
  maxWidth: "420px",
};

const variantStyles: Record<
  NotifyVariant,
  { icon: string; style: CSSProperties }
> = {
  success: {
    icon: "✅",
    style: {
      background: "#ecfdf3",
      borderColor: "#4ade80",
      color: "#14532d",
    },
  },
  error: {
    icon: "⛔",
    style: {
      background: "#fef2f2",
      borderColor: "#f87171",
      color: "#7f1d1d",
    },
  },
  info: {
    icon: "🔔",
    style: {
      background: "#eff6ff",
      borderColor: "#60a5fa",
      color: "#1e3a8a",
    },
  },
  warning: {
    icon: "⚠️",
    style: {
      background: "#fff7ed",
      borderColor: "#fb923c",
      color: "#7c2d12",
    },
  },
};

const showToast = (message: string, variant: NotifyVariant) => {
  const option = variantStyles[variant];

  toast(message, {
    icon: option.icon,
    duration: 3600,
    style: {
      ...baseStyle,
      ...option.style,
    },
  });
};

export const notifySuccess = (message: string) => showToast(message, "success");
export const notifyError = (message: string) => showToast(message, "error");
export const notifyInfo = (message: string) => showToast(message, "info");
export const notifyWarning = (message: string) => showToast(message, "warning");
