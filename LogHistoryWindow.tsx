import React, { useState, useMemo } from "react";
import { Transaction } from "../types";
import { formatRp, formatRpCompact, formatDateIndo } from "../utils/format";
import { soundEffects } from "../utils/audio";
import { ConfirmModal } from "./ConfirmModal";

interface LogHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (index: number) => void;
  onClearAll: () => void;
}

export const LogHistoryWindow: React.FC<LogHistoryProps> = ({
  transactions,
  onDeleteTransaction,
  onClearAll,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "in" | "out">("all");

  // State for confirm modals
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const getCategoryIcon = (category: string, type: "in" | "out") => {
    const catLower = category.toLowerCase();
    if (catLower.includes("salary") || catLower.includes("gaji")) {
      return <span className="material-symbols-outlined text-[#9e4229]" style={{ fontVariationSettings: '"FILL" 1' }}>favorite</span>;
    }
    if (catLower.includes("subscribe") || catLower.includes("langganan") || catLower.includes("mail")) {
      return <span className="material-symbols-outlined text-[#00696e]">mail</span>;
    }
    if (catLower.includes("grocer") || catLower.includes("belanja") || catLower.includes("food")) {
      return <span className="material-symbols-outlined text-[#5893ff]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>;
    }
    if (catLower.includes("concert") || catLower.includes("music") || catLower.includes("hiburan")) {
      return <span className="material-symbols-outlined text-[#fe8b6d]">music_note</span>;
    }
    if (catLower.includes("bonus") || catLower.includes("found")) {
      return <span className="material-symbols-outlined text-[#83d4d9]">search</span>;
    }
    if (catLower.includes("tabungan") || catLower.includes("savings") || catLower.includes("setor")) {
      return <span className="material-symbols-outlined text-[#005ac2]">savings</span>;
    }
    if (type === "in") {
      return <span className="material-symbols-outlined text-[#00696e]">trending_up</span>;
    }
    return <span className="material-symbols-outlined text-[#9e4229]">trending_down</span>;
  };

  const filteredTransactionsWithIndex = useMemo(() => {
    return transactions
      .map((tx, originalIndex) => ({ tx, originalIndex }))
      .filter(({ tx }) => {
        const matchType = typeFilter === "all" || tx.type === typeFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q ||
          tx.category.toLowerCase().includes(q) ||
          tx.note.toLowerCase().includes(q) ||
          tx.amount.toString().includes(q);
        return matchType && matchSearch;
      });
  }, [transactions, typeFilter, searchQuery]);

  const selectedTransactionToDelete = deleteTargetIndex !== null ? transactions[deleteTargetIndex] : null;

  return (
    <section className="bg-[#FFFDF7] pixel-border window-shadow overflow-hidden transition-all duration-200">
      {/* Title Bar */}
      <div className="h-8 bg-[#6e797a] pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none">
        <div className="flex items-center gap-1.5 text-white font-label-sm uppercase tracking-wider text-[11px] font-bold">
          <span className="material-symbols-outlined text-[14px]">receipt_long</span>
          <span>Log History</span>
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
        <div>
          {/* Search & Filter Bar */}
          <div className="p-2.5 bg-[#f6f3f2] pixel-border border-t-0 border-x-0 flex flex-wrap gap-2 items-center justify-between">
            <div className="relative flex-1 min-w-[140px]">
              <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-[#6e797a]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi..."
                className="w-full h-8 pl-7 pr-2 pixel-border bg-[#ffffff] font-mono text-[11px] text-[#1b1b1c] focus:ring-1 focus:ring-[#00696e]"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-2 py-1 font-mono text-[10px] font-bold pixel-border ${
                  typeFilter === "all" ? "bg-[#1b1b1c] text-white" : "bg-[#ffffff] text-[#1b1b1c]"
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setTypeFilter("in")}
                className={`px-2 py-1 font-mono text-[10px] font-bold pixel-border ${
                  typeFilter === "in" ? "bg-[#50a2a7] text-white" : "bg-[#ffffff] text-[#1b1b1c]"
                }`}
              >
                +IN
              </button>
              <button
                onClick={() => setTypeFilter("out")}
                className={`px-2 py-1 font-mono text-[10px] font-bold pixel-border ${
                  typeFilter === "out" ? "bg-[#fe8b6d] text-white" : "bg-[#ffffff] text-[#1b1b1c]"
                }`}
              >
                -OUT
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="custom-scrollbar max-h-[320px] overflow-y-auto">
            {filteredTransactionsWithIndex.length === 0 ? (
              <div className="p-8 text-center text-[#6e797a] font-mono text-xs">
                Tidak ada riwayat transaksi yang cocok.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f0eded] sticky top-0 z-10 select-none">
                  <tr>
                    <th className="px-3 py-2 font-label-sm text-[10px] border-b-2 border-r-2 border-[#1b1b1c] text-center w-10">
                      SRC
                    </th>
                    <th className="px-3 py-2 font-label-sm text-[10px] border-b-2 border-r-2 border-[#1b1b1c]">
                      DESC / NOTE
                    </th>
                    <th className="px-3 py-2 font-label-sm text-[10px] border-b-2 border-r-2 border-[#1b1b1c]">
                      JUMLAH
                    </th>
                    <th className="px-2 py-2 font-label-sm text-[10px] border-b-2 border-[#1b1b1c] text-center w-8">
                      DEL
                    </th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-[12px] sm:text-[13px]">
                  {filteredTransactionsWithIndex.map(({ tx, originalIndex }) => (
                    <tr
                      key={originalIndex + "-" + tx.date + "-" + tx.amount}
                      className={`border-b border-[#1b1b1c]/10 hover:bg-[#9ff0f5]/20 transition-colors ${
                        originalIndex % 2 === 1 ? "bg-[#f6f3f2]" : "bg-[#FFFDF7]"
                      }`}
                    >
                      <td className="px-3 py-2.5 border-r-2 border-[#1b1b1c]/10 text-center">
                        {getCategoryIcon(tx.category, tx.type)}
                      </td>
                      <td className="px-3 py-2.5 border-r-2 border-[#1b1b1c]/10">
                        <div className="font-bold text-[#1b1b1c]">{tx.note || tx.category}</div>
                        <div className="text-[10px] font-mono text-[#6e797a] flex items-center gap-1">
                          <span className="bg-[#e5e2e1] px-1 py-0.2 border border-[#6e797a]/30">
                            {tx.category}
                          </span>
                          <span>• {formatDateIndo(tx.date)}</span>
                        </div>
                      </td>
                      <td
                        className={`px-3 py-2.5 border-r-2 border-[#1b1b1c]/10 font-mono font-bold whitespace-nowrap ${
                          tx.type === "in" ? "text-[#00696e]" : "text-[#9e4229]"
                        }`}
                        title={formatRp(tx.amount)}
                      >
                        {tx.type === "in" ? "+" : "-"}
                        {formatRpCompact(tx.amount)}
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setDeleteTargetIndex(originalIndex);
                          }}
                          className="text-[#9e4229] hover:text-[#75240e] hover:bg-[#ffb4a1] p-1 rounded transition-colors cursor-pointer"
                          title="Hapus Transaksi"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer Status */}
          <div className="bg-[#eae7e7] h-8 px-3 flex items-center justify-between border-t-2 border-[#1b1b1c] font-mono select-none">
            <span className="text-[9px] font-label-sm uppercase font-bold text-[#3e4949]">
              Total: {filteredTransactionsWithIndex.length} / {transactions.length}
            </span>
            <div className="flex items-center gap-3">
              {transactions.length > 0 && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setShowClearAllConfirm(true);
                  }}
                  className="text-[10px] text-[#ba1a1a] underline font-bold hover:text-[#7e2b14] cursor-pointer"
                >
                  Clear History
                </button>
              )}
              <span className="text-[9px] font-label-sm text-[#3e4949]">Page 1/1</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirm Hapus Transaksi Tunggal */}
      <ConfirmModal
        isOpen={deleteTargetIndex !== null}
        title="Hapus Transaksi"
        message={
          selectedTransactionToDelete
            ? `Apakah Anda yakin ingin menghapus transaksi "${selectedTransactionToDelete.note || selectedTransactionToDelete.category}" (${formatRp(selectedTransactionToDelete.amount)})?`
            : "Hapus transaksi ini?"
        }
        confirmText="HAPUS"
        cancelText="BATAL"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetIndex !== null) {
            onDeleteTransaction(deleteTargetIndex);
            setDeleteTargetIndex(null);
          }
        }}
        onCancel={() => setDeleteTargetIndex(null)}
      />

      {/* Modal Confirm Clear All History */}
      <ConfirmModal
        isOpen={showClearAllConfirm}
        title="Clear All History"
        message="Apakah Anda yakin ingin menghapus SELURUH riwayat transaksi? Tindakan ini tidak dapat dibatalkan!"
        confirmText="YA, CLEAR ALL"
        cancelText="BATAL"
        isDanger={true}
        onConfirm={() => {
          onClearAll();
          setShowClearAllConfirm(false);
        }}
        onCancel={() => setShowClearAllConfirm(false)}
      />
    </section>
  );
};
