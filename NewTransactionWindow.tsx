import React, { useState } from "react";
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../types";
import { parseNumberInput, formatRp } from "../utils/format";
import { soundEffects } from "../utils/audio";

interface NewTransactionProps {
  onAddTransaction: (tx: Transaction) => void;
}

export const NewTransactionWindow: React.FC<NewTransactionProps> = ({
  onAddTransaction,
}) => {
  const [type, setType] = useState<"in" | "out">("in");
  const [amountRaw, setAmountRaw] = useState<string>("100000");
  const [category, setCategory] = useState<string>("Gaji");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [minimized, setMinimized] = useState<boolean>(false);
  const [isCustomCat, setIsCustomCat] = useState<boolean>(false);
  const [pressActive, setPressActive] = useState<boolean>(false);

  const currentCategories = type === "in" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeSwitch = (newType: "in" | "out") => {
    soundEffects.playClick();
    setType(newType);
    const newCats = newType === "in" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setCategory(newCats[0]);
    setIsCustomCat(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const num = parseNumberInput(val);
    setAmountRaw(num > 0 ? num.toString() : "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseNumberInput(amountRaw);

    if (!numericAmount || numericAmount <= 0) {
      soundEffects.playError();
      alert("Masukkan jumlah nominal transaksi yang valid!");
      return;
    }

    const finalCategory = isCustomCat && customCategory.trim() ? customCategory.trim() : category;

    const todayStr = new Date().toISOString().split("T")[0];

    const newTx: Transaction = {
      type,
      amount: numericAmount,
      category: finalCategory,
      date: todayStr,
      note: note.trim() || (type === "in" ? "Pemasukan Baru" : "Pengeluaran Baru"),
    };

    if (type === "in") {
      soundEffects.playSuccess();
    } else {
      soundEffects.playClick();
    }

    onAddTransaction(newTx);

    // Reset form
    setNote("");
    setAmountRaw("100000");
  };

  return (
    <section className="bg-[#FFFDF7] pixel-border window-shadow overflow-hidden transition-all duration-200">
      {/* Title Bar */}
      <div className="h-8 bg-[#00696e] pixel-border border-t-0 border-x-0 px-2 flex justify-between items-center select-none">
        <div className="flex items-center gap-1.5 text-[#9ff0f5] font-label-sm uppercase tracking-wider text-[11px] font-bold">
          <span className="material-symbols-outlined text-[14px]">edit_square</span>
          <span>Transaksi</span>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setMinimized(!minimized);
            }}
            className="w-4 h-4 bg-[#FFFDF7] pixel-border flex items-center justify-center text-[10px] font-bold"
          >
            _
          </button>
          <button
            type="button"
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
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Transaction Type Segmented Switcher */}
          <div className="flex pixel-border bg-[#f0eded]">
            <button
              type="button"
              onClick={() => handleTypeSwitch("in")}
              className={`flex-1 py-2 font-label-lg text-[13px] font-bold transition-colors ${
                type === "in"
                  ? "bg-[#50a2a7] text-[#003437] border-r-2 border-[#1b1b1c]"
                  : "bg-[#f0eded] text-[#3e4949] hover:bg-[#eae7e7]"
              }`}
            >
              + Pemasukan
            </button>
            <button
              type="button"
              onClick={() => handleTypeSwitch("out")}
              className={`flex-1 py-2 font-label-lg text-[13px] font-bold transition-colors ${
                type === "out"
                  ? "bg-[#fe8b6d] text-[#75240e]"
                  : "bg-[#f0eded] text-[#3e4949] hover:bg-[#eae7e7]"
              }`}
            >
              - Pengeluaran
            </button>
          </div>

          <div className="space-y-3">
            {/* Amount Field */}
            <div className="relative pt-1">
              <label className="absolute -top-1.5 left-3 bg-[#FFFDF7] px-1 font-label-sm text-[10px] font-bold text-[#3e4949] z-10 uppercase tracking-wider">
                NOMINAL (AMOUNT)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-mono font-bold text-sm text-[#00696e]">
                  Rp
                </span>
                <input
                  type="text"
                  value={amountRaw ? parseInt(amountRaw, 10).toLocaleString("id-ID") : ""}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full h-11 pl-10 pr-3 pixel-border bg-[#ffffff] focus:ring-2 focus:ring-[#00696e] font-mono text-base font-bold text-[#1b1b1c]"
                />
              </div>
              {amountRaw && parseInt(amountRaw, 10) > 0 && (
                <p className="text-[10px] font-mono text-[#6e797a] mt-1 text-right">
                  Preview: {formatRp(parseInt(amountRaw, 10))}
                </p>
              )}
            </div>

            {/* Category Field */}
            <div className="relative pt-1">
              <div className="flex justify-between items-center mb-0.5">
                <label className="absolute -top-1.5 left-3 bg-[#FFFDF7] px-1 font-label-sm text-[10px] font-bold text-[#3e4949] z-10 uppercase tracking-wider">
                  KATEGORI
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomCat(!isCustomCat)}
                  className="ml-auto text-[10px] font-mono text-[#005ac2] underline hover:text-[#002c65]"
                >
                  {isCustomCat ? "Pilih dari daftar" : "+ Kategori Kustom"}
                </button>
              </div>

              {!isCustomCat ? (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 pixel-border bg-[#ffffff] focus:ring-2 focus:ring-[#00696e] font-body-md text-sm text-[#1b1b1c]"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Ketik kategori kustom..."
                  className="w-full h-11 px-3 pixel-border bg-[#ffffff] focus:ring-2 focus:ring-[#00696e] font-body-md text-sm text-[#1b1b1c]"
                />
              )}
            </div>

            {/* Note Field */}
            <div className="relative pt-1">
              <label className="absolute -top-1.5 left-3 bg-[#FFFDF7] px-1 font-label-sm text-[10px] font-bold text-[#3e4949] z-10 uppercase tracking-wider">
                CATATAN (NOTE)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Masukkan catatan rincian transaksi..."
                rows={2}
                className="w-full p-2.5 pixel-border bg-[#ffffff] focus:ring-2 focus:ring-[#00696e] font-body-md text-xs text-[#1b1b1c] resize-none"
              />
            </div>
          </div>

          {/* OK Submit Button */}
          <button
            type="submit"
            onMouseDown={() => setPressActive(true)}
            onMouseUp={() => setPressActive(false)}
            onMouseLeave={() => setPressActive(false)}
            style={{
              transform: pressActive ? "translate(3px, 3px)" : "translate(0, 0)",
              boxShadow: pressActive ? "0px 0px 0px 0px rgba(27,27,28,1)" : "4px 4px 0px 0px rgba(27,27,28,1)",
            }}
            className="w-full py-3.5 bg-[#fe8b6d] hover:bg-[#ffb4a1] active:bg-[#7e2b14] active:text-white pixel-border font-headline-sm font-bold uppercase tracking-widest text-[#75240e] cursor-pointer transition-transform duration-75 text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>SIMPAN TRANSAKSI</span>
          </button>
        </form>
      )}
    </section>
  );
};
