import React from "react";
import { soundEffects } from "../utils/audio";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "YA, HAPUS",
  cancelText = "BATAL",
  isDanger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px] animate-fadeIn">
      <div className="bg-[#FFFDF7] pixel-border window-shadow w-full max-w-sm overflow-hidden animate-scaleUp">
        {/* Title Bar */}
        <div
          className={`h-8 pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none ${
            isDanger ? "bg-[#ba1a1a] text-white" : "bg-[#00696e] text-white"
          }`}
        >
          <div className="flex items-center gap-1.5 font-label-sm uppercase tracking-wider text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">
              {isDanger ? "warning" : "help"}
            </span>
            <span>{title}</span>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onCancel();
            }}
            className="w-4 h-4 bg-[#FFFDF7] pixel-border text-[#1b1b1c] flex items-center justify-center text-[10px] font-bold active:bg-gray-200"
          >
            X
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="font-mono text-xs text-[#1b1b1c] leading-relaxed">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#1b1b1c]/10">
            <button
              onClick={() => {
                soundEffects.playClick();
                onCancel();
              }}
              className="px-3 py-1.5 bg-[#e5e2e1] hover:bg-[#d8d5d4] pixel-border font-label-sm text-xs font-bold text-[#3e4949] button-active"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                soundEffects.playError();
                onConfirm();
              }}
              className={`px-3 py-1.5 pixel-border font-label-sm text-xs font-bold button-active flex items-center gap-1 ${
                isDanger
                  ? "bg-[#ba1a1a] hover:bg-[#93000a] text-white"
                  : "bg-[#00696e] hover:bg-[#004f53] text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isDanger ? "delete" : "check"}
              </span>
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
