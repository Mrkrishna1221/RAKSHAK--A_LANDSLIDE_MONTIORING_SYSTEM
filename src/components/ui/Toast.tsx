import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface ToastProps {
  visible: boolean;
  title: string;
  message: string;
  detail?: string;
  onClose: () => void;
}

export default function Toast({ visible, title, message, detail, onClose }: ToastProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[9999] max-w-sm"
      role="alert"
      style={{ animation: "slideIn 0.3s ease-out" }}
    >
      <div className="glass-strong rounded-xl p-4 border border-amber-500/20 shadow-lg shadow-amber-500/5">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-300">{title}</h4>
            <p className="text-xs text-gray-300 mt-1">{message}</p>
            {detail && (
              <p className="text-xs text-gray-500 mt-1">{detail}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
