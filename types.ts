/**
 * PixelSave 8-Bit Data Types
 * Aligned with PRD & Data Structure specifications.
 */

export interface Transaction {
  type: "in" | "out";
  amount: number;
  category: string;
  date: string;
  note: string;
}

export interface SavingsGoal {
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

export interface SavingsDeposit {
  target_title: string;
  amount: number;
  date: string;
}

export const INCOME_CATEGORIES = [
  "Gaji",
  "Nabung",
  "Gift",
  "Bonus",
  "Reimburse"
] as const;

export const EXPENSE_CATEGORIES = [
  "Gaji",
  "Nabung",
  "Gift",
  "Bonus",
  "Reimburse"
] as const;
