import React, { useState } from "react";
import { SavingsGoal } from "../types";
import { parseNumberInput, formatRp } from "../utils/format";
import { soundEffects } from "../utils/audio";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: SavingsGoal) => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onAddGoal,
}) => {
  const [title, setTitle] = useState("");
  const [targetAmountRaw, setTargetAmountRaw] = useState("5000000");
  const [initialAmountRaw, setInitialAmountRaw] = useState("0");
  const [deadline, setDeadline] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      soundEffects.playError();
      alert("Masukkan nama/judul target tabungan!");
      return;
    }

    const targetAmount = parseNumberInput(targetAmountRaw);
    if (!targetAmount || targetAmount <= 0) {
      soundEffects.playError();
      alert("Masukkan nominal target tabungan yang valid!");
      return;
    }

    const currentAmount = parseNumberInput(initialAmountRaw);

    const newGoal: SavingsGoal = {
      title: title.trim(),
      target_amount: targetAmount,
      current_amount: currentAmount,
      deadline: deadline || "",
    };

    soundEffects.playSuccess();
    onAddGoal(newGoal);
    onClose();

    // Reset form
    setTitle("");
    setTargetAmountRaw("5000000");
    setInitialAmountRaw("0");
    setDeadline("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px]">
      <div className="bg-[#FFFDF7] pixel-border window-shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Title Bar */}
        <div className="h-8 bg-[#83d4d9] pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none">
          <div className="flex items-center gap-1.5 text-[#003437] font-label-sm uppercase text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">add_task</span>
            <span>Target Baru</span>
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

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="relative pt-1">
            <label className="absolute -top-1.5 left-3 bg-[#FFFDF7] px-1 font-label-sm text-[10px] font-bold text-[#3e4949] z-10 uppercase">
              NAMA TARGET TABUNGAN
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: Beli Laptop, Dana Darurat"
              className="w-full h-11 px-3 pixel-border bg-[#ffffff] font-body-md text-xs text-[#1b1b1c] focus:ring-2 focus:ring-[#00696e]"
            />
          </div>

          <div className="relative pt-1">
            <label className="absolute -top-1.5 left-3 bg-[#FFFDF7] px-1 font-label-sm text-[10px] font-bold text-[#3e4949] z-10 uppercase">
              TARGET NOMINAL (RP)
            </label>
            <input
              type="text"
              value={targetAmountRaw ? parseInt(targetAmountRaw, 10).toLocaleString("id-ID") : ""}
              onChange={(e) => setTargetAmountRaw(parseNumberInput(e.target.value).toString())}
              placeholder="10000000"
              className="w-full h-11 px-3 pixel-border bg-[#ffffff] font-mono text-sm font-bold text-[#1b1b1c] focus:ring-2 focus:ring-[#00696e]"
            />
          </div>

          <div className="relative pt-1">
            <label className="absolute -top-1.5 left-3 bg-[#FFFDF7] px-1 font-label-sm text-[10px] font-bold text-[#3e4949] z-10 uppercase">
              SETORAN AWAL (OPSIONAL)
            </label>
            <input
              type="text"
              value={initialAmountRaw ? parseInt(initialAmountRaw, 10).toLocaleString("id-ID") : ""}
              onChange={(e) => setInitialAmountRaw(parseNumberInput(e.target.value).toString())}
              placeholder="0"
              className="w-full h-11 px-3 pixel-border bg-[#ffffff] font-mono text-sm text-[#1b1b1c] focus:ring-2 focus:ring-[#00696e]"
            />
          </div>

          <div className="relative pt-1">
            <label className="absolute -top-1.5 left-3 bg-[#FFFDF7] px-1 font-label-sm text-[10px] font-bold text-[#3e4949] z-10 uppercase">
              DEADLINE TARGET (OPSIONAL)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-11 px-3 pixel-border bg-[#ffffff] font-mono text-xs text-[#1b1b1c] focus:ring-2 focus:ring-[#00696e]"
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
              className="flex-1 py-2.5 bg-[#83d4d9] hover:bg-[#9ff0f5] pixel-border font-label-lg text-xs font-bold text-[#002021] button-active flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>BUAT TARGET</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
