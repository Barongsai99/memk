import React, { useState } from "react";
import { Transaction, SavingsGoal, SavingsDeposit } from "../types";
import { soundEffects } from "../utils/audio";
import { ConfirmModal } from "./ConfirmModal";

export interface RetroCharacter {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  quote: string;
  stat: string;
}

export const RETRO_CHARACTERS: RetroCharacter[] = [
  {
    id: "savebot",
    name: "SaveBot-3000",
    role: "Robot Keuangan OS",
    icon: "smart_toy",
    color: "#00696e",
    bgColor: "#f0fdfd",
    borderColor: "#00696e",
    textColor: "#004f53",
    quote: "Beep boop! Semua transaksi tercatat aman di memori 8-Bit saya!",
    stat: "Audit Rate: 100% | CPU: Z80",
  },
  {
    id: "wizard",
    name: "Master Wizard",
    role: "Penyihir Tabungan",
    icon: "auto_fix_high",
    color: "#5893ff",
    bgColor: "#eff4ff",
    borderColor: "#005ac2",
    textColor: "#002c65",
    quote: "Mantra hemat: 'Abracadabra, Saldo Bebas Jangan Boncos!'",
    stat: "Mana Tabungan: 999 MP",
  },
  {
    id: "neko",
    name: "Neko Saver",
    role: "Kucing Hoki 8-Bit",
    icon: "pets",
    color: "#fe8b6d",
    bgColor: "#fff5f2",
    borderColor: "#ba1a1a",
    textColor: "#75240e",
    quote: "Nyaa~ Sisihkan sedikit uang jajannmu untuk masa depan!",
    stat: "Hoki Hemat: +99 Luck",
  },
  {
    id: "ninja",
    name: "Ninja Finansial",
    role: "Penjaga Saldo Rahasia",
    icon: "sports_kabaddi",
    color: "#3e4949",
    bgColor: "#f0eded",
    borderColor: "#1b1b1c",
    textColor: "#1b1b1c",
    quote: "Hilangkan pengeluaran tak terduga dengan jurus efisiensi!",
    stat: "Stealth Stealth: MAX",
  },
];

interface ConfigViewProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
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

export const ConfigView: React.FC<ConfigViewProps> = ({
  soundEnabled,
  onToggleSound,
  transactions,
  goals,
  deposits,
  onImportData,
  onResetData,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(() => {
    return localStorage.getItem("selected_retro_char") || "savebot";
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
    setStatusMessage("Export data JSON berhasil!");
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
    <div className="space-y-4">
      {/* Header Banner */}
      <section className="bg-[#FFFDF7] pixel-border window-shadow overflow-hidden">
        <div className="h-8 bg-[#fe8b6d] pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none">
          <div className="flex items-center gap-1.5 text-[#75240e] font-label-sm uppercase tracking-wider text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">settings</span>
            <span>System Config & Retro Mascot</span>
          </div>
          <span className="text-[10px] bg-[#FFFDF7] px-1.5 font-mono text-[#75240e] pixel-border">
            v1.0
          </span>
        </div>

        {/* Status Message Notice */}
        {statusMessage && (
          <div className="m-3 p-2 bg-[#83d4d9] text-[#003437] text-xs font-mono pixel-border flex justify-between items-center">
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="font-bold text-xs px-1 hover:text-black"
            >
              ✕
            </button>
          </div>
        )}

        {/* Active Mascot Display Card */}
        <div className="p-4 space-y-3">
          <div
            className="p-3.5 pixel-border flex items-start gap-3 transition-all duration-150"
            style={{
              backgroundColor: activeChar.bgColor,
              borderColor: activeChar.borderColor,
            }}
          >
            <div
              className="w-14 h-14 pixel-border flex items-center justify-center shrink-0 shadow-sm"
              style={{
                backgroundColor: activeChar.color,
                color: "#ffffff",
              }}
            >
              <span className="material-symbols-outlined text-[32px]">
                {activeChar.icon}
              </span>
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span
                  className="font-headline-sm text-sm font-bold uppercase tracking-wide"
                  style={{ color: activeChar.textColor }}
                >
                  {activeChar.name}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#FFFDF7] pixel-border font-bold">
                  ACTIVE MASCOT
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#6e797a]">
                {activeChar.role} • <span className="font-bold">{activeChar.stat}</span>
              </p>

              {/* Pixel Speech Bubble */}
              <div className="mt-2 p-2 bg-[#FFFDF7] pixel-border text-xs font-mono text-[#1b1b1c] relative">
                <p className="italic">"{activeChar.quote}"</p>
              </div>
            </div>
          </div>

          {/* Character Selector Grid */}
          <div>
            <p className="font-label-sm text-[10px] uppercase font-bold text-[#3e4949] mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">face</span>
              PILIH KARAKTER MASCOT 8-BIT:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {RETRO_CHARACTERS.map((char) => {
                const isSelected = char.id === selectedCharId;
                return (
                  <button
                    key={char.id}
                    onClick={() => handleSelectChar(char)}
                    className={`p-2.5 pixel-border flex items-center gap-2 text-left transition-transform active:translate-y-0.5 ${
                      isSelected
                        ? "bg-[#1b1b1c] text-white"
                        : "bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#1b1b1c]"
                    }`}
                  >
                    <div
                      className="w-8 h-8 pixel-border flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: char.color,
                        color: "#ffffff",
                      }}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {char.icon}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-label-sm text-[11px] font-bold truncate">
                        {char.name}
                      </p>
                      <p
                        className={`text-[9px] font-mono truncate ${
                          isSelected ? "text-[#83d4d9]" : "text-[#6e797a]"
                        }`}
                      >
                        {char.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Audio & System Preferences */}
      <section className="bg-[#FFFDF7] pixel-border window-shadow p-3.5 space-y-3">
        <p className="font-label-sm text-[10px] uppercase font-bold text-[#3e4949] flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">tune</span>
          SYSTEM & AUDIO PREFERENCES
        </p>

        {/* Audio SFX Toggle */}
        <div className="p-3 bg-[#f6f3f2] pixel-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#50a2a7] text-white pixel-border flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">
                {soundEnabled ? "volume_up" : "volume_off"}
              </span>
            </div>
            <div>
              <p className="font-label-sm text-xs font-bold text-[#1b1b1c]">
                Efek Suara 8-Bit (SFX)
              </p>
              <p className="text-[10px] font-mono text-[#6e797a]">
                Audio synth retro saat tombol diklik
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onToggleSound();
            }}
            className={`px-3 py-1.5 pixel-border font-label-sm text-xs font-bold button-active ${
              soundEnabled
                ? "bg-[#00696e] text-white"
                : "bg-[#e5e2e1] text-[#6e797a]"
            }`}
          >
            {soundEnabled ? "ON [8-BIT]" : "OFF"}
          </button>
        </div>
      </section>

      {/* Backup & Restore Section */}
      <section className="bg-[#FFFDF7] pixel-border window-shadow p-3.5 space-y-3">
        <p className="font-label-sm text-[10px] uppercase font-bold text-[#3e4949] flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">save</span>
          BACKUP & RESTORE DATA
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="p-3 bg-[#83d4d9] hover:bg-[#9ff0f5] text-[#002021] pixel-border font-label-sm text-xs font-bold button-active flex flex-col items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>EXPORT JSON</span>
          </button>

          <label className="p-3 bg-[#d8e2ff] hover:bg-[#adc6ff] text-[#001a42] pixel-border font-label-sm text-xs font-bold button-active flex flex-col items-center justify-center gap-1 cursor-pointer text-center">
            <span className="material-symbols-outlined text-[20px]">upload</span>
            <span>IMPORT JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>
      </section>

      {/* Danger Zone / Reset */}
      <section className="bg-[#ffdad6] pixel-border window-shadow p-3.5 space-y-2">
        <p className="font-label-sm text-[10px] uppercase font-bold text-[#93000a] flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          RESET DATABASE OS
        </p>
        <p className="text-[11px] font-mono text-[#7e2b14]">
          Kembalikan semua transaksi dan target tabungan ke sampel awal.
        </p>
        <button
          onClick={() => {
            soundEffects.playClick();
            setShowResetConfirm(true);
          }}
          className="w-full py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white pixel-border font-label-sm text-xs font-bold button-active flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>RESET SAMPLE DATA</span>
        </button>
      </section>

      {/* Developer Credit Card with Retro Character */}
      <div className="p-2.5 bg-[#eff4ff] pixel-border border-[#005ac2] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#005ac2] text-white pixel-border flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">videogame_asset</span>
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
          <span className="material-symbols-outlined text-[#005ac2] text-[20px]">smart_toy</span>
          <span className="font-mono text-[10px] font-bold text-[#005ac2] bg-[#FFFDF7] px-1 pixel-border">8-BIT</span>
        </div>
      </div>

      {/* Confirm Reset Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Data"
        message="Apakah Anda yakin ingin mereset seluruh data ke sampel awal?"
        confirmText="YA, RESET"
        cancelText="BATAL"
        isDanger={true}
        onConfirm={() => {
          onResetData();
          setShowResetConfirm(false);
          setStatusMessage("Data berhasil direset ke sampel awal.");
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
