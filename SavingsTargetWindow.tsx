import React, { useState } from "react";
import { SavingsGoal } from "../types";
import { formatRp, formatRpCompact } from "../utils/format";
import { soundEffects } from "../utils/audio";
import { ConfirmModal } from "./ConfirmModal";
import { RetroProgressBar } from "./RetroProgressBar";

interface SavingsTargetProps {
  goals: SavingsGoal[];
  saldoBebas: number;
  onOpenDepositModal: (goalTitle: string) => void;
  onOpenAddGoalModal: () => void;
  onDeleteGoal?: (goalTitle: string) => void;
}

export const SavingsTargetWindow: React.FC<SavingsTargetProps> = ({
  goals,
  saldoBebas,
  onOpenDepositModal,
  onOpenAddGoalModal,
  onDeleteGoal,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string | null>(null);

  return (
    <section className="bg-[#FFFDF7] pixel-border window-shadow overflow-hidden transition-all duration-200">
      {/* Title Bar */}
      <div className="h-8 bg-[#005ac2] pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none">
        <div className="flex items-center gap-1.5 text-white font-label-sm uppercase tracking-wider text-[11px] font-bold">
          <span className="material-symbols-outlined text-[14px]">savings</span>
          <span>Savings Target</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => {
              soundEffects.playClick();
              setMinimized(!minimized);
            }}
            className="w-4 h-4 bg-[#FFFDF7] pixel-border flex items-center justify-center text-[10px] font-bold"
          >
            _
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setMinimized(!minimized);
            }}
            className="w-4 h-4 bg-[#9e4229] pixel-border text-white flex items-center justify-center text-[10px] font-bold"
          >
            X
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-label-sm text-[11px] uppercase font-bold text-[#3e4949]">
                TARGET TABUNGAN KAMU
              </h3>
              <p className="text-[10px] font-mono text-[#6e797a]">
                Saldo Bebas Tersedia: <strong className={saldoBebas < 0 ? "text-red-600" : "text-[#00696e]"}>{formatRp(saldoBebas)}</strong>
              </p>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenAddGoalModal();
              }}
              className="bg-[#83d4d9] hover:bg-[#9ff0f5] text-[#002021] px-2.5 py-1 pixel-border font-label-sm text-[11px] font-bold button-active flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>+ Target Baru</span>
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-[#6e797a] bg-[#f6f3f2]">
              <span className="material-symbols-outlined text-[32px] text-[#6e797a] mb-1">
                savings
              </span>
              <p className="font-label-sm text-xs font-bold text-[#3e4949]">
                Belum ada target tabungan
              </p>
              <p className="text-[11px] font-mono text-[#6e797a] mb-3">
                Buat target tabungan pertamamu untuk mulai menyisihkan uang!
              </p>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenAddGoalModal();
                }}
                className="bg-[#005ac2] text-white px-3 py-1.5 pixel-border font-label-sm text-xs font-bold button-active"
              >
                + Buat Target Tabungan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const percentage = goal.target_amount > 0 
                  ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
                  : 0;
                const isCompleted = goal.current_amount >= goal.target_amount;

                return (
                  <div
                    key={goal.title}
                    className="p-3 bg-[#fcf9f8] pixel-border window-shadow-sm space-y-2 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-headline-sm text-base font-bold text-[#005ac2]">
                            {goal.title}
                          </h4>
                          {isCompleted && (
                            <span className="bg-[#50a2a7] text-white text-[9px] font-mono px-1.5 py-0.5 pixel-border uppercase">
                              LUNAS / TERCAPAI
                            </span>
                          )}
                        </div>
                        <p className="font-label-sm text-[10px] text-[#3e4949] font-medium">
                          Target: <span className="font-bold">{formatRp(goal.target_amount)}</span>
                          {goal.deadline && (
                            <span className="ml-2 text-[#6e797a]">| Deadline: {goal.deadline}</span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            onOpenDepositModal(goal.title);
                          }}
                          className="bg-[#83d4d9] hover:bg-[#9ff0f5] text-[#002021] px-3 py-1 pixel-border font-label-sm text-xs font-bold button-active flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">savings</span>
                          <span>+ Setor</span>
                        </button>
                        {onDeleteGoal && (
                          <button
                            onClick={() => {
                              soundEffects.playClick();
                              setDeleteTargetTitle(goal.title);
                            }}
                            className="bg-[#ffb4a1] hover:bg-[#fe8b6d] text-[#75240e] p-1 pixel-border button-active"
                            title="Hapus Target"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-label-sm text-[10px] font-mono">
                        <span className="text-[#3e4949]">
                          Progres: {formatRpCompact(goal.current_amount)} / {formatRpCompact(goal.target_amount)}
                        </span>
                        <span className="font-bold text-[#005ac2]">{percentage}%</span>
                      </div>
                      
                      {/* Segmented Retro 8-Bit Progress Bar */}
                      <RetroProgressBar
                        percentage={percentage}
                        color={isCompleted ? "green" : "blue"}
                        height="md"
                        blockCount={10}
                        showPercentageText={true}
                      />
                    </div>

                    <p className="text-center font-label-sm text-[11px] text-[#3e4949]">
                      Terkumpul: <span className="text-[#1b1b1c] font-bold font-mono">{formatRp(goal.current_amount)}</span>
                      {goal.target_amount > goal.current_amount && (
                        <span className="text-[10px] text-[#6e797a] ml-1">
                          (Kurang {formatRp(goal.target_amount - goal.current_amount)})
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirm Delete Goal Modal */}
      <ConfirmModal
        isOpen={deleteTargetTitle !== null}
        title="Hapus Target Tabungan"
        message={`Apakah Anda yakin ingin menghapus target tabungan "${deleteTargetTitle}"?`}
        confirmText="HAPUS"
        cancelText="BATAL"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetTitle && onDeleteGoal) {
            onDeleteGoal(deleteTargetTitle);
            setDeleteTargetTitle(null);
          }
        }}
        onCancel={() => setDeleteTargetTitle(null)}
      />
    </section>
  );
};
