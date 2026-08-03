import React, { useState } from "react";
import { parseNumberInput, formatRp } from "../utils/format";
import { soundEffects } from "../utils/audio";

interface DepositModalProps {
  isOpen: boolean;
  goalTitle: string;
  currentAmount: number;
  targetAmount: number;
  saldoBebas: number;
  onClose: () => void;
  onConfirmDeposit: (goalTitle: string, amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  goalTitle,
  currentAmount,
  targetAmount,
  saldoBebas,
  onClose,
  onConfirmDeposit,
}) => {
  const [amountRaw, setAmountRaw] = useState("500000");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseNumberInput(amountRaw);
    if (!num || num <= 0) {
      soundEffects.playError();
      alert("Masukkan nominal setoran tabungan yang valid!");
      return;
    }

    if (num > saldoBebas) {
      soundEffects.playError();
      const proceed = confirm(
        `Setoran (Rp ${num.toLocaleString("id-ID")}) melebihi Saldo Bebas kamu (${formatRp(saldoBebas)}).\nApakah kamu tetap ingin memotong saldo bebas ini?`
      );
      if (!proceed) return;
    }

    soundEffects.playCoin();
    onConfirmDeposit(goalTitle, num);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px]">
      <div className="bg-[#FFFDF7] pixel-border window-shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Title Bar */}
        <div className="h-8 bg-[#005ac2] pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none">
          <div className="flex items-center gap-1.5 text-white font-label-sm uppercase text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">savings</span>
            <span>Setor Tabungan</span>
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

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-[#d8e2ff] text-[#004395] px-1.5 py-0.5 pixel-border font-bold">
              TARGET TABUNGAN
            </span>
            <h3 className="font-headline-sm text-lg font-bold text-[#005ac2] mt-1">
              {goalTitle}
            </h3>
            <p className="text-[11px] font-mono text-[#3e4949]">
              Terkumpul: <strong>{formatRp(currentAmount)}</strong> / {formatRp(targetAmount)}
            </p>
          </div>

          <div className="p-2.5 bg-[#f0eded] pixel-border font-mono text-xs text-[#3e4949]">
            <span>Saldo Bebas Tersedia: </span>
            <strong className={saldoBebas < 0 ? "text-red-600 font-bold" : "text-[#00696e] font-bold"}>
              {formatRp(saldoBebas)}
            </strong>
          </div>

          <div className="relative pt-1">
            <label className="absolute -top-1.5 left-3 bg-[#FFFDF7] px-1 font-label-sm text-[10px] font-bold text-[#3e4949] z-10 uppercase">
              NOMINAL SETORAN (RP)
            </label>
            <input
              type="text"
              autoFocus
              value={amountRaw ? parseInt(amountRaw, 10).toLocaleString("id-ID") : ""}
              onChange={(e) => setAmountRaw(parseNumberInput(e.target.value).toString())}
              className="w-full h-11 px-3 pixel-border bg-[#ffffff] font-mono text-base font-bold text-[#1b1b1c] focus:ring-2 focus:ring-[#005ac2]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="flex-1 py-2.5 bg-[#e5e2e1] hover:bg-[#eae7e7] pixel-border font-label-lg text-xs font-bold text-[#3e4949] button-active"
            >
              BATAL
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#5893ff] hover:bg-[#005ac2] hover:text-white pixel-border font-label-lg text-xs font-bold text-[#002c65] button-active flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>SETOR</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
