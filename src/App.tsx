


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
  date: string; // YYYY-MM-DD
  amount: number;
  bankId: string;
}

export default function App() {
  // --- Load from localStorage or defaults ---
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
  const [viewDate, setViewDate] = useState(new Date());

  // --- Save changes to localStorage ---
  useEffect(() => {
    localStorage.setItem("banks", JSON.stringify(banks));
  }, [banks]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // --- Derived Values ---
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const totalBalance = useMemo(
    () => banks.reduce((sum, b) => sum + b.balance, 0),
    [banks]
  );

  const remainingBalance = totalBalance;
  const currentDate = new Date();
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

  // --- Handle Adding/Updating Expenses ---
  const handleAddExpense = (date: Date, amount: number, bankId: string) => {
    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setExpenses((prev) => {
      // Add new expense (can have multiple per date)
      const updated = [...prev, { date: dateString, amount, bankId }];

      // Deduct from selected bank
      setBanks((prevBanks) =>
        prevBanks.map((bank) =>
          bank.id === bankId ? { ...bank, balance: bank.balance - amount } : bank
        )
      );

      return updated;
    });

    setSelectedDate(null);
  };

  // --- Handle Manual Bank Balance Update ---
  const handleUpdateBank = (bankId: string, newBalance: number) => {
    setBanks((prev) =>
      prev.map((bank) =>
        bank.id === bankId ? { ...bank, balance: newBalance } : bank
      )
    );
    setSelectedBank(null);
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-md mx-auto p-4 pb-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center text-neutral-800 mt-2">
          💰 Expense Tracker
        </h1>

        {/* Banks */}
        <div className="grid grid-cols-3 gap-3">
          {banks.map((bank) => (
            <BankCard
              key={bank.id}
              bank={bank}
              onClick={() => setSelectedBank(bank)}
            />
          ))}
        </div>

        {/* Summary */}
        <BalanceOverview
          totalBalance={remainingBalance}
          perDayBudget={perDayBudget}
          remainingDays={remainingDays}
        />

        {/* Calendar */}
        <ExpenseCalendar
          currentDate={currentDate}
          viewDate={viewDate}
          expenses={expenses}
          perDayBudget={perDayBudget}
          onDateClick={(date) => setSelectedDate(date)}
          onMonthChange={(newDate) => setViewDate(newDate)}
        />
      </div>

      {/* Expense Dialog */}
      {selectedDate && (
        <ExpenseDialog
          banks={banks}
          date={selectedDate}
          existingAmount={expenses
            .filter(
              (e) =>
                e.date ===
                `${selectedDate.getFullYear()}-${String(
                  selectedDate.getMonth() + 1
                ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
                  2,
                  "0"
                )}`
            )
            .reduce((sum, e) => sum + e.amount, 0)}
          onSave={handleAddExpense}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {/* Bank Dialog */}
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
