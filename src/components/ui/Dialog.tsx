"use client";

import * as React from "react";
import { X, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 space-y-4 animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {variant === "danger" ? (
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : variant === "warning" ? (
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F5B38] flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3
                id="confirm-dialog-title"
                className="text-base font-extrabold text-gray-900 leading-snug"
              >
                {title}
              </h3>
            </div>
          </div>
          {!loading && (
            <button
              onClick={onCancel}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed pl-13">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  variant?: "success" | "danger" | "info";
  onClose: () => void;
}

export function AlertDialog({
  isOpen,
  title,
  message,
  buttonLabel = "Understood",
  variant = "info",
  onClose,
}: AlertDialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 text-center space-y-4 animate-scaleUp"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
          {variant === "success" ? (
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : variant === "danger" ? (
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0F5B38] flex items-center justify-center">
              <Info className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <Button className="w-full" size="sm" onClick={onClose}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
