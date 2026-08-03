import React from "react";
import { soundEffects } from "../utils/audio";

export type NavTab = "dash" | "target" | "log" | "config";

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const handleTabClick = (tab: NavTab) => {
    soundEffects.playClick();
    onSelectTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-evenly items-center h-16 px-2 bg-[#f0eded] border-t-2 border-[#1b1b1c] max-w-md mx-auto right-0 window-shadow">
      {/* Dashboard Tab */}
      <button
        onClick={() => handleTabClick("dash")}
        className={`flex flex-col items-center justify-center min-w-[70px] h-12 px-1 transition-all ${
          activeTab === "dash"
            ? "bg-[#fe8b6d] text-[#75240e] border-2 border-[#1b1b1c] translate-x-[1px] translate-y-[1px] window-shadow-sm font-bold"
            : "text-[#3e4949] hover:bg-[#e5e2e1] border border-transparent"
        }`}
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === "dash" ? '"FILL" 1' : '"FILL" 0' }}>
          dashboard
        </span>
        <span className="font-label-sm text-[8px] sm:text-[9px] uppercase mt-0.5 tracking-tight font-bold whitespace-nowrap">
          Dashboard
        </span>
      </button>

      {/* Target Tab */}
      <button
        onClick={() => handleTabClick("target")}
        className={`flex flex-col items-center justify-center min-w-[70px] h-12 px-1 transition-all ${
          activeTab === "target"
            ? "bg-[#5893ff] text-[#002c65] border-2 border-[#1b1b1c] translate-x-[1px] translate-y-[1px] window-shadow-sm font-bold"
            : "text-[#3e4949] hover:bg-[#e5e2e1] border border-transparent"
        }`}
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === "target" ? '"FILL" 1' : '"FILL" 0' }}>
          savings
        </span>
        <span className="font-label-sm text-[8px] sm:text-[9px] uppercase mt-0.5 tracking-tight font-bold whitespace-nowrap">
          Target
        </span>
      </button>

      {/* Log Tab */}
      <button
        onClick={() => handleTabClick("log")}
        className={`flex flex-col items-center justify-center min-w-[70px] h-12 px-1 transition-all ${
          activeTab === "log"
            ? "bg-[#83d4d9] text-[#003437] border-2 border-[#1b1b1c] translate-x-[1px] translate-y-[1px] window-shadow-sm font-bold"
            : "text-[#3e4949] hover:bg-[#e5e2e1] border border-transparent"
        }`}
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === "log" ? '"FILL" 1' : '"FILL" 0' }}>
          receipt_long
        </span>
        <span className="font-label-sm text-[8px] sm:text-[9px] uppercase mt-0.5 tracking-tight font-bold whitespace-nowrap">
          Log
        </span>
      </button>

      {/* Config Tab */}
      <button
        onClick={() => handleTabClick("config")}
        className={`flex flex-col items-center justify-center min-w-[70px] h-12 px-1 transition-all ${
          activeTab === "config"
            ? "bg-[#ffb4a1] text-[#7e2b14] border-2 border-[#1b1b1c] translate-x-[1px] translate-y-[1px] window-shadow-sm font-bold"
            : "text-[#3e4949] hover:bg-[#e5e2e1] border border-transparent"
        }`}
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === "config" ? '"FILL" 1' : '"FILL" 0' }}>
          settings
        </span>
        <span className="font-label-sm text-[8px] sm:text-[9px] uppercase mt-0.5 tracking-tight font-bold whitespace-nowrap">
          Config
        </span>
      </button>
    </nav>
  );
};
