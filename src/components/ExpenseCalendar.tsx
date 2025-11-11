import { Expense } from "../App";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExpenseCalendarProps {
  currentDate: Date;
  viewDate: Date;
  expenses: Expense[];
  perDayBudget: number;
  onDateClick: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}

export function ExpenseCalendar({
  currentDate,
  viewDate,
  expenses,
  perDayBudget,
  onDateClick,
  onMonthChange,
}: ExpenseCalendarProps) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = currentDate.getDate();
  const isCurrentMonth =
    currentDate.getFullYear() === year && currentDate.getMonth() === month;

  // Get first day of month (0 = Sunday)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getExpensesForDate = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return expenses.filter((e) => e.date === dateString);
  };

  const getDayColor = (day: number) => {
    const dayExpenses = getExpensesForDate(day);
    if (dayExpenses.length === 0) return "bg-white";

    const totalForDay = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    if (totalForDay > perDayBudget) {
      return "bg-red-100 border-red-300";
    } else {
      return "bg-green-100 border-green-300";
    }
  };

  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === today;

    const dayExpenses = getExpensesForDate(day);
    const totalForDay = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

    const dayColor =
      totalForDay > 0
        ? totalForDay > perDayBudget
          ? "bg-red-100 border-red-300"
          : "bg-green-100 border-green-300"
        : "bg-white";

    days.push(
      <button
        key={day}
        onClick={() => onDateClick(new Date(year, month, day))}
        className={`
          aspect-square rounded-xl border transition-all duration-200
          hover:shadow-md cursor-pointer flex flex-col items-center justify-center
          ${dayColor}
          ${
            isToday
              ? "ring-2 ring-[#1A73E8] ring-offset-2"
              : "border-neutral-200"
          }
        `}
      >
        <span
          className={`text-sm ${
            isToday ? "text-[#1A73E8]" : "text-neutral-700"
          }`}
        >
          {day}
        </span>
        {totalForDay > 0 && (
          <span className="text-[10px] text-neutral-500 mt-0.5">
            ₹{totalForDay}
          </span>
        )}
      </button>
    );
  }

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    onMonthChange(newDate);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} className="text-neutral-600" />
        </button>
        <h2 className="text-neutral-800">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} className="text-neutral-600" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-center text-neutral-400 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">{days}</div>

      {/* Legend */}
      {/* <div className="mt-4 pt-4 border-t border-neutral-100 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
          <span className="text-neutral-600">Under budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
          <span className="text-neutral-600">Over budget</span>
        </div>
      </div> */}
    </div>
  );
}
