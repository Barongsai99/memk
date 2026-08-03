import React, { useState } from "react";
import { Transaction, SavingsGoal, SavingsDeposit } from "../types";
import { soundEffects } from "../utils/audio";
import { ConfirmModal } from "./ConfirmModal";
import { RETRO_CHARACTERS, RetroCharacter } from "./ConfigView";

interface ConfigModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose: () => void;
  transactions: Transaction[];
  goals: SavingsGoal[];
  deposits: SavingsDeposit[];
  onImportData: (data: {
    transactions: Transaction[];
    goals: SavingsGoal[];
    deposits: SavingsDeposit[];
  }) => void;
  onResetData: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  soundEnabled,
  onToggleSound,
  onClose,
  transactions,
  goals,
  deposits,
  onImportData,
  onResetData,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedCharId, setSelectedCharId] = useState<string>(() => {
    return localStorage.getItem("selected_retro_char") || "savebot";
  });

  if (!isOpen) return null;

  const activeChar =
    RETRO_CHARACTERS.find((c) => c.id === selectedCharId) || RETRO_CHARACTERS[0];

  const handleSelectChar = (char: RetroCharacter) => {
    soundEffects.playSuccess();
    setSelectedCharId(char.id);
    localStorage.setItem("selected_retro_char", char.id);
  };

  const handleExport = () => {
    soundEffects.playClick();
    const dataObj = {
      app: "FinancialManager",
      version: "1.0",
      exportDate: new Date().toISOString(),
      transactions,
      goals,
      deposits,
    };
    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Export JSON berhasil!");
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.transactions) && Array.isArray(parsed.goals)) {
          onImportData({
            transactions: parsed.transactions,
            goals: parsed.goals,
            deposits: parsed.deposits || [],
          });
          soundEffects.playSuccess();
          setStatusMessage("Data berhasil diimport!");
        } else {
          throw new Error("Format JSON tidak valid.");
        }
      } catch (err) {
        soundEffects.playError();
        setStatusMessage("Gagal mengimpor file: Format data tidak sesuai.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px]">
      <div className="bg-[#FFFDF7] pixel-border window-shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
        {/* Title Bar */}
        <div className="h-8 bg-[#fe8b6d] pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none sticky top-0 z-10">
          <div className="flex items-center gap-1.5 text-[#75240e] font-label-sm uppercase text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">settings</span>
            <span>System Config & Retro Mascot</span>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="w-4 h-4 bg-[#9e4229] pixel-border text-white flex items-center justify-center text-[10px] font-bold"
          >
            X
          </button>
        </div>

        <div className="p-4 space-y-4">
          {statusMessage && (
            <div className="p-2 bg-[#83d4d9] text-[#003437] text-xs font-mono pixel-border flex justify-between items-center">
              <span>{statusMessage}</span>
              <button
                onClick={() => setStatusMessage(null)}
                className="font-bold text-xs px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Active Retro Mascot */}
          <div
            className="p-3 pixel-border flex items-start gap-3"
            style={{
              backgroundColor: activeChar.bgColor,
              borderColor: activeChar.borderColor,
            }}
          >
            <div
              className="w-12 h-12 pixel-border flex items-center justify-center shrink-0"
              style={{
                backgroundColor: activeChar.color,
                color: "#ffffff",
              }}
            >
              <span className="material-symbols-outlined text-[28px]">
                {activeChar.icon}
              </span>
            </div>
            <div className="space-y-1 overflow-hidden">
              <span
                className="font-headline-sm text-xs font-bold uppercase tracking-wide block"
                style={{ color: activeChar.textColor }}
              >
                {activeChar.name} ({activeChar.role})
              </span>
              <div className="p-1.5 bg-[#FFFDF7] pixel-border text-[11px] font-mono text-[#1b1b1c]">
                "{activeChar.quote}"
              </div>
            </div>
          </div>

          {/* Character Selector */}
          <div>
            <p className="font-label-sm text-[10px] uppercase font-bold text-[#3e4949] mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">face</span>
              PILIH KARAKTER MASCOT:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {RETRO_CHARACTERS.map((char) => {
                const isSelected = char.id === selectedCharId;
                return (
                  <button
                    key={char.id}
                    onClick={() => handleSelectChar(char)}
                    className={`p-2 pixel-border flex items-center gap-2 text-left transition-transform active:translate-y-0.5 ${
                      isSelected
                        ? "bg-[#1b1b1c] text-white"
                        : "bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#1b1b1c]"
                    }`}
                  >
                    <div
                      className="w-7 h-7 pixel-border flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: char.color }}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {char.icon}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-label-sm text-[10px] font-bold truncate">
                        {char.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio toggle */}
          <div className="p-3 bg-[#f6f3f2] pixel-border flex items-center justify-between">
            <div>
              <p className="font-label-sm text-xs font-bold text-[#1b1b1c]">
                Efek Suara 8-Bit (SFX)
              </p>
              <p className="text-[10px] font-mono text-[#6e797a]">
                Audio synth retro saat tombol diklik
              </p>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                onToggleSound();
              }}
              className={`px-3 py-1 pixel-border font-label-sm text-xs font-bold button-active ${
                soundEnabled ? "bg-[#00696e] text-white" : "bg-[#e5e2e1] text-[#6e797a]"
              }`}
            >
              {soundEnabled ? "ON" : "OFF"}
            </button>
          </div>

          {/* Backup & Restore */}
          <div className="p-3 bg-[#f6f3f2] pixel-border space-y-2">
            <p className="font-label-sm text-xs font-bold text-[#1b1b1c]">
              BACKUP & RESTORE DATA
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="py-2 bg-[#83d4d9] hover:bg-[#9ff0f5] text-[#002021] pixel-border font-label-sm text-[11px] font-bold button-active flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>EXPORT JSON</span>
              </button>
              <label className="py-2 bg-[#d8e2ff] hover:bg-[#adc6ff] text-[#001a42] pixel-border font-label-sm text-[11px] font-bold button-active flex items-center justify-center gap-1 cursor-pointer text-center">
                <span className="material-symbols-outlined text-[14px]">upload</span>
                <span>IMPORT JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="p-3 bg-[#ffdad6] pixel-border space-y-2">
            <p className="font-label-sm text-xs font-bold text-[#93000a]">
              RESET DATABASE OS
            </p>
            <p className="text-[10px] font-mono text-[#7e2b14]">
              Kembalikan semua data ke sampel awal.
            </p>
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowResetConfirm(true);
              }}
              className="w-full py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white pixel-border font-label-sm text-xs font-bold button-active flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>RESET DATA SAMPLES</span>
            </button>
          </div>

          {/* Developer Credit Card with Retro Character */}
          <div className="p-2.5 bg-[#eff4ff] pixel-border border-[#005ac2] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#005ac2] text-white pixel-border flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">videogame_asset</span>
              </div>
              <div>
                <p className="font-label-sm text-[9px] uppercase font-bold text-[#004395] tracking-wider">
                  CREDITS & AUTHOR
                </p>
                <p className="font-mono text-[11px] font-bold text-[#001a42]">
                  aplikasi ini di buat ilyasviel 13
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#005ac2] text-[18px]">smart_toy</span>
              <span className="font-mono text-[9px] font-bold text-[#005ac2] bg-[#FFFDF7] px-1 pixel-border">8-BIT</span>
            </div>
          </div>

          <div className="pt-1 text-center font-mono text-[10px] text-[#6e797a]">
            Financial Manager 90s OS • Powered by React & Tailwind 8-Bit
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Data"
        message="Reset seluruh data transaksi dan target tabungan ke kondisi awal demo?"
        confirmText="YA, RESET"
        cancelText="BATAL"
        isDanger={true}
        onConfirm={() => {
          onResetData();
          setShowResetConfirm(false);
          onClose();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
