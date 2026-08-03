import React, { useState } from "react";
import { formatRp, formatRpCompact } from "../utils/format";
import { soundEffects } from "../utils/audio";

interface StatusCenterProps {
  saldoBebas: number;
  totalIn: number;
  totalOut: number;
  totalSavings: number;
}

export const StatusCenterWindow: React.FC<StatusCenterProps> = ({
  saldoBebas,
  totalIn,
  totalOut,
  totalSavings,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  return (
    <section className="bg-[#FFFDF7] pixel-border window-shadow overflow-hidden transition-all duration-200">
      {/* Title Bar */}
      <div className="h-8 bg-[#00696e] pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none">
        <div className="flex items-center gap-1.5 text-[#9ff0f5] font-label-sm uppercase tracking-wider text-[11px] font-bold">
          <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
          <span>Status Center</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => {
              soundEffects.playClick();
              setMinimized(!minimized);
            }}
            className="w-4 h-4 bg-[#FFFDF7] pixel-border flex items-center justify-center text-[10px] font-bold active:bg-gray-200"
            title="Minimize"
          >
            _
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setMaximized(!maximized);
            }}
            className="w-4 h-4 bg-[#FFFDF7] pixel-border flex items-center justify-center text-[10px] font-bold active:bg-gray-200"
            title="Maximize"
          >
            []
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setMinimized(true);
            }}
            className="w-4 h-4 bg-[#9e4229] pixel-border text-white flex items-center justify-center text-[10px] font-bold active:bg-[#7e2b14]"
            title="Close"
          >
            X
          </button>
        </div>
      </div>

      {!minimized && (
        <div className={`p-4 text-center ${maximized ? "bg-[#fcf9f8]" : ""}`}>
          <div className="flex justify-between items-center mb-1">
            <p className="font-label-sm text-[#3e4949] uppercase text-[11px] tracking-wide font-medium">
              SALDO BEBAS
            </p>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#f0eded] pixel-border font-mono text-[#6e797a]">
              ONLINE
            </span>
          </div>

          <h2 className={`font-headline-lg-mobile text-[28px] sm:text-[34px] font-bold mb-3 tracking-tight ${saldoBebas < 0 ? "text-[#ba1a1a]" : "text-[#00696e]"}`}>
            {formatRp(saldoBebas)}
          </h2>

          {saldoBebas < 0 && (
            <div className="mb-3 p-1.5 bg-[#ffdad6] pixel-border text-[#93000a] text-[11px] font-mono flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span>Peringatan: Saldo Bebas Minus!</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#83d4d9] p-2 pixel-border text-left">
              <p className="font-label-sm text-[9px] text-[#004f53] uppercase font-bold">Total In</p>
              <p className="font-headline-sm text-[13px] sm:text-[15px] font-bold text-[#003437] truncate" title={formatRp(totalIn)}>
                {formatRpCompact(totalIn)}
              </p>
            </div>

            <div className="bg-[#ffb4a1] p-2 pixel-border text-left">
              <p className="font-label-sm text-[9px] text-[#7e2b14] uppercase font-bold">Total Out</p>
              <p className="font-headline-sm text-[13px] sm:text-[15px] font-bold text-[#3c0800] truncate" title={formatRp(totalOut)}>
                -{formatRpCompact(totalOut).replace(/^[+-]/, "")}
              </p>
            </div>

            <div className="bg-[#d8e2ff] p-2 pixel-border text-left">
              <p className="font-label-sm text-[9px] text-[#004395] uppercase font-bold">In Target</p>
              <p className="font-headline-sm text-[13px] sm:text-[15px] font-bold text-[#001a42] truncate" title={formatRp(totalSavings)}>
                {formatRpCompact(totalSavings)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
