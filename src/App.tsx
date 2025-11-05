import { useState, useEffect, useMemo } from "react";
import { BankCard } from "./components/BankCard";
import { BalanceOverview } from "./components/BalanceOverview";
import { ExpenseCalendar } from "./components/ExpenseCalendar";
import { ExpenseDialog } from "./components/ExpenseDialog";
import { BankDialog } from "./components/BankDialog";

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  balance: number;
  color: string;
}

export interface Expense {
  date: string; // YYYY-MM-DD format
  amount: number;
}

export default function App() {
  // --- Load from localStorage or set defaults ---
  const [banks, setBanks] = useState<Bank[]>(() => {
    const saved = localStorage.getItem("banks");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "sbi",
            name: "State Bank of India",
            shortName: "SBI",
            balance: 12000,
            color: "#1A73E8",
          },
          {
            id: "ubi",
            name: "Union Bank of India",
            shortName: "UBI",
            balance: 9500,
            color: "#EA4335",
          },
          {
            id: "idfc",
            name: "IDFC First Bank",
            shortName: "IDFC",
            balance: 7800,
            color: "#8B1A1A",
          },
        ];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [viewDate, setViewDate] = useState(new Date(2025, 10, 4)); // November 4, 2025

  // --- Persist changes to localStorage ---
  useEffect(() => {
    localStorage.setItem("banks", JSON.stringify(banks));
  }, [banks]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // --- Derived values ---
  const totalBankBalance = useMemo(
    () => banks.reduce((sum, bank) => sum + bank.balance, 0),
    [banks]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const remainingBalance = totalBankBalance - totalExpenses;

  const currentDate = new Date(2025, 10, 4); // November 4, 2025
  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  ).getDate();
  const remainingDays = daysInMonth - currentDate.getDate() + 1;

  const perDayBudget = useMemo(
    () => (remainingDays > 0 ? remainingBalance / remainingDays : 0),
    [remainingBalance, remainingDays]
  );

  // --- Handlers ---
  const handleAddExpense = (date: Date, amount: number) => {
    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setExpenses((prev) => {
      const existingIndex = prev.findIndex((e) => e.date === dateString);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { date: dateString, amount };
        return updated;
      }
      return [...prev, { date: dateString, amount }];
    });
    setSelectedDate(null);
  };

  const handleUpdateBank = (bankId: string, newBalance: number) => {
    setBanks((prev) =>
      prev.map((bank) =>
        bank.id === bankId ? { ...bank, balance: newBalance } : bank
      )
    );
    setSelectedBank(null);
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-md mx-auto p-4 pb-8 space-y-6">
        {/* --- Header --- */}
        <h1 className="text-2xl font-semibold text-center text-neutral-800 mt-2">
          💰 Expense Tracker
        </h1>

        {/* --- Bank Cards --- */}
        <div className="grid grid-cols-3 gap-3">
          {banks.map((bank) => (
            <BankCard
              key={bank.id}
              bank={bank}
              onClick={() => setSelectedBank(bank)}
            />
          ))}
        </div>

        {/* --- Balance Overview --- */}
        <BalanceOverview
          totalBalance={remainingBalance}
          perDayBudget={perDayBudget}
          remainingDays={remainingDays}
        />

        {/* --- Expense Calendar --- */}
        <ExpenseCalendar
          currentDate={currentDate}
          viewDate={viewDate}
          expenses={expenses}
          perDayBudget={perDayBudget}
          onDateClick={(date) => setSelectedDate(date)}
          onMonthChange={(newDate) => setViewDate(newDate)}
        />
      </div>

      {/* --- Expense Dialog --- */}
      {selectedDate && (
        <ExpenseDialog
          date={selectedDate}
          existingAmount={
            expenses.find(
              (e) =>
                e.date ===
                `${selectedDate.getFullYear()}-${String(
                  selectedDate.getMonth() + 1
                ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
                  2,
                  "0"
                )}`
            )?.amount || 0
          }
          onSave={handleAddExpense}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {/* --- Bank Dialog --- */}
      {selectedBank && (
        <BankDialog
          bank={selectedBank}
          onSave={handleUpdateBank}
          onClose={() => setSelectedBank(null)}
        />
      )}
    </div>
  );
}
