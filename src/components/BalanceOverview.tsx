interface BalanceOverviewProps {
  totalBalance: number;
  perDayBudget: number;
  remainingDays: number;
}

export function BalanceOverview({ totalBalance, perDayBudget, remainingDays }: BalanceOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Total Balance */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="text-neutral-500 text-sm mb-2">Total Balance</div>
        <div className="text-neutral-900">
          ₹{totalBalance.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Per Day Budget */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="text-neutral-500 text-sm mb-2">Per Day Spent</div>
        <div className="text-neutral-900">
          ₹{Math.round(perDayBudget).toLocaleString('en-IN')}
        </div>
        <div className="text-neutral-400 text-xs mt-1">
          for remaining days
        </div>
      </div>
    </div>
  );
}
