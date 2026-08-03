import React, { useState } from "react";
import { Transaction, SavingsGoal } from "../types";
import { formatRp, formatRpCompact } from "../utils/format";
import { soundEffects } from "../utils/audio";
import { NavTab } from "./BottomNav";
import { RetroProgressBar } from "./RetroProgressBar";

interface DashboardViewProps {
  saldoBebas: number;
  totalIn: number;
  totalOut: number;
  totalSavings: number;
  transactions: Transaction[];
  goals: SavingsGoal[];
  onNavigate: (tab: NavTab) => void;
  onOpenConfig: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  saldoBebas,
  totalIn,
  totalOut,
  totalSavings,
  transactions,
  goals,
  onNavigate,
  onOpenConfig,
}) => {
  const [minimizedStatus, setMinimizedStatus] = useState(false);

  // Calculate Health percentage
  const healthPercent = Math.min(
    100,
    Math.max(0, totalIn > 0 ? Math.round((saldoBebas / totalIn) * 100) : 100)
  );

  // Recent 3 transactions
  const recentTransactions = transactions.slice(-3).reverse();

  // Assistant status tip
  const getAssistantMessage = () => {
    if (saldoBebas < 0) {
      return "Peringatan! Saldo Bebas kamu dalam angka minus. Segera evaluasi pengeluaranmu!";
    }
    if (totalSavings > 0 && goals.length > 0) {
      const topGoal = goals[0];
      const goalProgress = Math.round((topGoal.current_amount / topGoal.target_amount) * 100);
      return `Target "${topGoal.title}" sudah ${goalProgress}% tercapai. Pertahankan konsistensi menabungmu!`;
    }
    if (saldoBebas > 1000000) {
      return "Kondisi keuangan sangat sehat! Pertimbangkan untuk menambah Alokasi Tabungan.";
    }
    return "Sistem berjalan normal. Jangan lupa catat setiap transaksi agar laporan tetap akurat.";
  };

  return (
    <div className="space-y-4">
      {/* 1. Status Center Window */}
      <section className="bg-[#FFFDF7] pixel-border window-shadow overflow-hidden transition-all duration-200">
        <div className="h-8 bg-[#00696e] pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none">
          <div className="flex items-center gap-1.5 text-[#9ff0f5] font-label-sm uppercase tracking-wider text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
            <span>Status Center</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => {
                soundEffects.playClick();
                setMinimizedStatus(!minimizedStatus);
              }}
              className="w-4 h-4 bg-[#FFFDF7] pixel-border flex items-center justify-center text-[10px] font-bold active:bg-gray-200"
              title="Minimize"
            >
              _
            </button>
          </div>
        </div>

        {!minimizedStatus && (
          <div className="p-4 text-center">
            <div className="flex justify-between items-center mb-1">
              <p className="font-label-sm text-[#3e4949] uppercase text-[11px] tracking-wide font-medium">
                SALDO BEBAS
              </p>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#f0eded] pixel-border font-mono text-[#6e797a]">
                ONLINE
              </span>
            </div>

            <h2
              className={`font-headline-lg-mobile text-[28px] sm:text-[34px] font-bold mb-3 tracking-tight ${
                saldoBebas < 0 ? "text-[#ba1a1a]" : "text-[#00696e]"
              }`}
            >
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
                <p
                  className="font-headline-sm text-[12px] sm:text-[14px] font-bold text-[#003437] truncate"
                  title={formatRp(totalIn)}
                >
                  {formatRpCompact(totalIn)}
                </p>
              </div>

              <div className="bg-[#ffb4a1] p-2 pixel-border text-left">
                <p className="font-label-sm text-[9px] text-[#7e2b14] uppercase font-bold">Total Out</p>
                <p
                  className="font-headline-sm text-[12px] sm:text-[14px] font-bold text-[#3c0800] truncate"
                  title={formatRp(totalOut)}
                >
                  -{formatRpCompact(totalOut).replace(/^[+-]/, "")}
                </p>
              </div>

              <div className="bg-[#d8e2ff] p-2 pixel-border text-left">
                <p className="font-label-sm text-[9px] text-[#004395] uppercase font-bold">In Target</p>
                <p
                  className="font-headline-sm text-[12px] sm:text-[14px] font-bold text-[#001a42] truncate"
                  title={formatRp(totalSavings)}
                >
                  {formatRpCompact(totalSavings)}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Retro Health & Energy Meter */}
      <section className="bg-[#FFFDF7] pixel-border window-shadow p-3.5 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="flex items-center gap-1 font-bold text-[#3e4949] uppercase">
            <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">favorite</span>
            FINANCIAL HEALTH
          </span>
          <span className="font-bold text-[#00696e]">{healthPercent}% HP</span>
        </div>

        {/* 8-bit Progress Bar */}
        <RetroProgressBar
          percentage={healthPercent}
          color="health"
          height="lg"
          blockCount={12}
          showPercentageText={true}
        />
        <div className="flex justify-between text-[10px] font-mono text-[#6e797a]">
          <span>0% CRITICAL</span>
          <span>50% STABLE</span>
          <span>100% HEALTHY</span>
        </div>
      </section>

      {/* 3. Quick Action Launcher */}
      <section className="bg-[#FFFDF7] pixel-border window-shadow p-3.5">
        <p className="font-label-sm text-[10px] uppercase font-bold text-[#3e4949] mb-2.5 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">rocket_launch</span>
          QUICK LAUNCHER
        </p>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate("log");
            }}
            className="p-2.5 bg-[#83d4d9] hover:bg-[#a1e5e9] active:bg-[#004f53] active:text-white pixel-border flex flex-col items-center justify-center text-center transition-transform active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[20px] text-[#003437] mb-1">
              edit_note
            </span>
            <span className="font-label-sm text-[10px] font-bold text-[#003437] leading-tight">
              + Transaksi
            </span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate("target");
            }}
            className="p-2.5 bg-[#5893ff] hover:bg-[#7baaff] active:bg-[#002c65] active:text-white pixel-border flex flex-col items-center justify-center text-center transition-transform active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[20px] text-[#001a42] mb-1">
              savings
            </span>
            <span className="font-label-sm text-[10px] font-bold text-[#001a42] leading-tight">
              + Tabungan
            </span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenConfig();
            }}
            className="p-2.5 bg-[#ffb4a1] hover:bg-[#ffd1c4] active:bg-[#7e2b14] active:text-white pixel-border flex flex-col items-center justify-center text-center transition-transform active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[20px] text-[#3c0800] mb-1">
              tune
            </span>
            <span className="font-label-sm text-[10px] font-bold text-[#3c0800] leading-tight">
              System Config
            </span>
          </button>
        </div>
      </section>

      {/* 4. Latest Activity Feed (Mini Terminal) */}
      <section className="bg-[#FFFDF7] pixel-border window-shadow overflow-hidden">
        <div className="h-7 bg-[#3e4949] px-2 flex justify-between items-center text-white text-[11px] font-mono font-bold select-none">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            <span>Latest_Activity.log</span>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate("log");
            }}
            className="text-[10px] underline hover:text-[#9ff0f5]"
          >
            Lihat Semua &rarr;
          </button>
        </div>

        <div className="p-3 space-y-2">
          {recentTransactions.length === 0 ? (
            <p className="text-center font-mono text-xs text-[#6e797a] py-3">
              Belum ada aktivitas transaksi.
            </p>
          ) : (
            recentTransactions.map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-[#f0eded] pixel-border text-xs font-mono"
              >
                <div className="flex items-center gap-2 overflow-hidden pr-1">
                  <span
                    className={`material-symbols-outlined text-[16px] shrink-0 ${
                      tx.type === "in" ? "text-[#00696e]" : "text-[#ba1a1a]"
                    }`}
                  >
                    {tx.type === "in" ? "arrow_downward" : "arrow_upward"}
                  </span>
                  <div className="truncate">
                    <p className="font-bold text-[#1b1b1c] truncate">{tx.category}</p>
                    <p className="text-[10px] text-[#6e797a] truncate">{tx.note || tx.date}</p>
                  </div>
                </div>
                <span
                  className={`font-bold shrink-0 text-right ${
                    tx.type === "in" ? "text-[#00696e]" : "text-[#ba1a1a]"
                  }`}
                >
                  {tx.type === "in" ? "+" : "-"}{formatRpCompact(tx.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. Retro Assistant Bot Widget */}
      <section className="bg-[#f0fdfd] pixel-border border-[#00696e] window-shadow p-3.5 flex items-start gap-3">
        <div className="w-10 h-10 bg-[#00696e] text-white pixel-border flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">smart_toy</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="font-label-sm text-[10px] font-bold text-[#00696e] uppercase tracking-wider">
              SAVEBOT_OS_v1.0
            </span>
            <span className="inline-block w-2 h-2 bg-[#00696e] rounded-full animate-ping" />
          </div>
          <p className="text-xs font-mono text-[#3e4949] leading-relaxed">
            "{getAssistantMessage()}"
          </p>
        </div>
      </section>
    </div>
  );
};
