import React, { useState, useEffect, useMemo } from "react";
import { Transaction, SavingsGoal, SavingsDeposit } from "./types";
import { soundEffects } from "./utils/audio";
import { Header } from "./components/Header";
import { StatusCenterWindow } from "./components/StatusCenterWindow";
import { NewTransactionWindow } from "./components/NewTransactionWindow";
import { SavingsTargetWindow } from "./components/SavingsTargetWindow";
import { LogHistoryWindow } from "./components/LogHistoryWindow";
import { DepositModal } from "./components/DepositModal";
import { AddGoalModal } from "./components/AddGoalModal";
import { ConfigModal } from "./components/ConfigModal";
import { BottomNav, NavTab } from "./components/BottomNav";
import { DashboardView } from "./components/DashboardView";
import { ConfigView } from "./components/ConfigView";

const INITIAL_TRANSACTIONS: Transaction[] = [
  { type: "in", amount: 2400000, category: "Gaji", date: "2026-08-01", note: "Gaji Bulan Agustus" },
  { type: "out", amount: 150000, category: "Nabung", date: "2026-08-02", note: "Setor Tabungan" },
  { type: "in", amount: 400000, category: "Reimburse", date: "2026-08-02", note: "Reimburse Kantor" },
  { type: "in", amount: 250000, category: "Bonus", date: "2026-08-03", note: "Bonus Project" },
  { type: "in", amount: 100000, category: "Gift", date: "2026-08-03", note: "Kado Ultah" },
];

const INITIAL_GOALS: SavingsGoal[] = [
  {
    title: "Beli Laptop",
    target_amount: 10000000,
    current_amount: 0,
    deadline: "2026-12-31",
  },
];

const STORAGE_KEY = "pixelsave_v1_store";

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_tx");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_goals");
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [deposits, setDeposits] = useState<SavingsDeposit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_deposits");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_sound");
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        soundEffects.enabled = parsed;
        return parsed;
      }
    } catch {}
    return soundEffects.enabled;
  });

  const [activeTab, setActiveTab] = useState<NavTab>("dash");
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedGoalTitle, setSelectedGoalTitle] = useState("");
  const [addGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "_tx", JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "_goals", JSON.stringify(goals));
    } catch {}
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "_deposits", JSON.stringify(deposits));
    } catch {}
  }, [deposits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "_sound", JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    soundEffects.enabled = nextVal;
    setSoundEnabled(nextVal);
  };

  // Financial Calculations according to Business Logic
  const totalIn = useMemo(() => {
    return transactions
      .filter((t) => t.type === "in")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalOut = useMemo(() => {
    return transactions
      .filter((t) => t.type === "out")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalSavings = useMemo(() => {
    return goals.reduce((sum, g) => sum + g.current_amount, 0);
  }, [goals]);

  // Total Saldo Bebas = Total Pemasukan - Total Pengeluaran - Total Uang yang Dimasukkan ke Tabungan
  const saldoBebas = useMemo(() => {
    return totalIn - totalOut - totalSavings;
  }, [totalIn, totalOut, totalSavings]);

  // Transaction Actions
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (index: number) => {
    setTransactions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearAllTransactions = () => {
    setTransactions([]);
  };

  // Savings Goal Actions
  const handleOpenDepositModal = (goalTitle: string) => {
    setSelectedGoalTitle(goalTitle);
    setDepositModalOpen(true);
  };

  const handleConfirmDeposit = (goalTitle: string, depositAmount: number) => {
    // 1. Update current_amount in target savings goal
    setGoals((prev) =>
      prev.map((g) => {
        if (g.title === goalTitle) {
          return {
            ...g,
            current_amount: g.current_amount + depositAmount,
          };
        }
        return g;
      })
    );

    // 2. Add deposit record
    const todayStr = new Date().toISOString().split("T")[0];
    const newDeposit: SavingsDeposit = {
      target_title: goalTitle,
      amount: depositAmount,
      date: todayStr,
    };
    setDeposits((prev) => [newDeposit, ...prev]);

    // 3. Add to transaction log as well for explicit record tracking
    const autoLogTx: Transaction = {
      type: "out",
      amount: depositAmount,
      category: "Setor Tabungan",
      date: todayStr,
      note: `Setor Tabungan: ${goalTitle}`,
    };
    // Note: Saldo Bebas deducts via totalSavings in formula; to avoid double deduction if autoLogTx is added to totalOut,
    // we only log it if desired, or let formula handle it cleanly.
    // In our formula: Saldo Bebas = Total In - Total Out (standard expenses) - Total Savings.
    // So Setor Tabungan is accounted for directly in Total Savings!
  };

  const handleAddGoal = (newGoal: SavingsGoal) => {
    // Prevent duplicate title
    const exists = goals.some((g) => g.title.toLowerCase() === newGoal.title.toLowerCase());
    if (exists) {
      soundEffects.playError();
      alert(`Target tabungan "${newGoal.title}" sudah ada!`);
      return;
    }
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleDeleteGoal = (goalTitle: string) => {
    setGoals((prev) => prev.filter((g) => g.title !== goalTitle));
  };

  const handleImportData = (data: {
    transactions: Transaction[];
    goals: SavingsGoal[];
    deposits: SavingsDeposit[];
  }) => {
    setTransactions(data.transactions);
    setGoals(data.goals);
    setDeposits(data.deposits);
  };

  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setGoals(INITIAL_GOALS);
    setDeposits([]);
  };

  const activeGoal = goals.find((g) => g.title === selectedGoalTitle) || goals[0];

  return (
    <div className="font-body-md text-[#1b1b1c] min-h-screen pb-24 relative select-none sm:select-text">
      {/* Retro Scanline subtle texture */}
      <div className="scanline-overlay fixed inset-0 z-40" />

      {/* Top Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenConfig={() => setConfigModalOpen(true)}
      />

      {/* Main Container */}
      <main className="p-4 space-y-4 max-w-md mx-auto">
        {/* Render views based on activeTab */}
        {activeTab === "dash" && (
          <DashboardView
            saldoBebas={saldoBebas}
            totalIn={totalIn}
            totalOut={totalOut}
            totalSavings={totalSavings}
            transactions={transactions}
            goals={goals}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenConfig={() => setConfigModalOpen(true)}
          />
        )}

        {activeTab === "target" && (
          <>
            <StatusCenterWindow
              saldoBebas={saldoBebas}
              totalIn={totalIn}
              totalOut={totalOut}
              totalSavings={totalSavings}
            />

            <SavingsTargetWindow
              goals={goals}
              saldoBebas={saldoBebas}
              onOpenDepositModal={handleOpenDepositModal}
              onOpenAddGoalModal={() => setAddGoalModalOpen(true)}
              onDeleteGoal={handleDeleteGoal}
            />
          </>
        )}

        {activeTab === "log" && (
          <>
            <NewTransactionWindow onAddTransaction={handleAddTransaction} />

            <LogHistoryWindow
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onClearAll={handleClearAllTransactions}
            />
          </>
        )}

        {activeTab === "config" && (
          <ConfigView
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            transactions={transactions}
            goals={goals}
            deposits={deposits}
            onImportData={handleImportData}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Deposit Modal */}
      {activeGoal && (
        <DepositModal
          isOpen={depositModalOpen}
          goalTitle={activeGoal.title}
          currentAmount={activeGoal.current_amount}
          targetAmount={activeGoal.target_amount}
          saldoBebas={saldoBebas}
          onClose={() => setDepositModalOpen(false)}
          onConfirmDeposit={handleConfirmDeposit}
        />
      )}

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={addGoalModalOpen}
        onClose={() => setAddGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />

      {/* System Config Modal */}
      <ConfigModal
        isOpen={configModalOpen}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onClose={() => setConfigModalOpen(false)}
        transactions={transactions}
        goals={goals}
        deposits={deposits}
        onImportData={handleImportData}
        onResetData={handleResetData}
      />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}
