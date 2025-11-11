import { useState } from "react";
import { X } from "lucide-react";

interface Bank {
  id: string;
  shortName: string;
  balance: number;
  color: string;
}

interface ExpenseDialogProps {
  date: Date;
  existingAmount: number;
  banks: Bank[];
  onSave: (date: Date, amount: number, bankId: string) => void; // ✅ updated
  onClose: () => void;
}

// Bank logos
const bankLogos: Record<string, string> = {
  ubi: "https://companieslogo.com/img/orig/UNIONBANK.NS-5bba728d.png?t=1720244494",
  sbi: "https://companieslogo.com/img/orig/SBIN.NS_BIG-b060a2ff.png?t=1720244493",
  idfc: "https://companieslogo.com/img/orig/IDFCFIRSTB.NS_BIG-f326a18d.png?t=1720244492",
};

export function ExpenseDialog({
  date,
  existingAmount,
  banks,
  onSave,
  onClose,
}: ExpenseDialogProps) {
  const [amount, setAmount] = useState<string>(""); // 👈 empty input initially
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const handleSave = () => {
    const newAmountValue = parseFloat(amount) || 0;
    const totalAmount = existingAmount + newAmountValue;

    if (!isNaN(newAmountValue) && newAmountValue > 0 && selectedBank) {
      onSave(date, newAmountValue, selectedBank);
    }
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDate = `${date.getDate()} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}, ${dayNames[date.getDay()]}`;

  // Calculate total after adding new amount
  const newAmountValue = parseFloat(amount) || 0;
  const totalAmount = existingAmount + newAmountValue;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Date */}
        <div className="mb-4">
          <h3 className="text-neutral-800 font-medium">{formattedDate}</h3>
        </div>

        {/* Last amount + total preview */}
        <div className="mb-4 bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-sm text-neutral-600">Total Amount </p>
          <p className="text-green-600 font-semibold text-xl transition-all duration-200">
            ₹{totalAmount.toLocaleString()}
          </p>

          {amount !== "" && newAmountValue > 0 && (
            <>
              <p className="text-neutral-500 text-xs mt-1">
                + ₹{newAmountValue.toLocaleString()}
              </p>
              <hr className="my-2 border-green-200" />
              <p className="text-green-700 font-semibold transition-all duration-200">
                Total: ₹{totalAmount.toLocaleString()}
              </p>
            </>
          )}
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label className="block text-neutral-600 text-sm mb-2">
            Enter Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
              ₹
            </span>
            <input
              type="number"
              value={amount} // 👈 controlled input
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
              placeholder="0"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
        </div>

        {/* Bank selection */}
        <div className="mb-4">
          <label className="block text-neutral-600 text-sm mb-2">
            Select Bank
          </label>

          <div className="flex flex-wrap gap-4 justify-center">
            {banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => setSelectedBank(bank.id)}
                className={`
                  flex flex-col items-center justify-center
                  rounded-2xl p-2 w-16 h-16
                  border transition-all duration-200
                  hover:shadow-md
                  ${
                    selectedBank === bank.id
                      ? "border-green-500 ring-2 ring-green-300 bg-green-50"
                      : "border-neutral-200"
                  }
                `}
              >
                {bankLogos[bank.id] ? (
                  <img
                    src={bankLogos[bank.id]}
                    alt={bank.shortName}
                    className="w-8 h-8 object-contain mx-auto"
                    style={{
                      imageRendering: "auto",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: `${bank.color}15` }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: bank.color }}
                    >
                      {bank.shortName}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full bg-[#1A73E8] hover:bg-[#1557b0] text-white py-3 rounded-xl transition-colors duration-200"
        >
          Done
        </button>
      </div>
    </div>
  );
}
