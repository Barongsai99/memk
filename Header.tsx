import React, { useState, useEffect } from "react";
import { soundEffects } from "../utils/audio";

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenConfig,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#00696e] sticky top-0 z-50 flex justify-between items-center h-10 px-3 w-full pixel-border border-t-0 border-x-0 window-shadow">
      <div className="flex items-center gap-2 text-white">
        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
        <h1 className="font-headline-sm text-sm font-bold tracking-wider flex items-center gap-2">
          <span>Financial Manager v1.0</span>
          <span className="hidden sm:inline-block text-[10px] bg-[#fe8b6d] text-[#75240e] px-1 py-0.5 font-mono border border-[#1b1b1c]">
            90s_OS
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden xs:inline-block font-mono text-[11px] text-[#9ff0f5] bg-[#004f53] px-2 py-0.5 pixel-border">
          {timeStr || "09:41:00"}
        </span>

        <button
          onClick={() => {
            soundEffects.playClick();
            onToggleSound();
          }}
          title={soundEnabled ? "Mute Retro Audio" : "Unmute Retro Audio"}
          className="bg-[#50a2a7] text-white px-1.5 py-0.5 pixel-border hover:bg-[#83d4d9] hover:text-[#002021] transition-colors button-active flex items-center gap-1 text-[11px]"
        >
          <span className="material-symbols-outlined text-[14px]">
            {soundEnabled ? "volume_up" : "volume_off"}
          </span>
          <span className="hidden sm:inline font-mono text-[10px]">
            {soundEnabled ? "SFX: ON" : "SFX: OFF"}
          </span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenConfig();
          }}
          className="bg-[#fe8b6d] p-1 pixel-border hover:bg-[#7e2b14] hover:text-white transition-colors group flex items-center justify-center button-active"
          title="System Settings"
        >
          <span className="material-symbols-outlined text-[#75240e] group-hover:text-white text-[16px] transition-transform group-active:scale-90">
            settings
          </span>
        </button>
      </div>
    </header>
  );
};
