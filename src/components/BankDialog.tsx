import { useState } from 'react';
import { X } from 'lucide-react';
import { Bank } from '../App';

interface BankDialogProps {
  bank: Bank;
  onSave: (bankId: string, newBalance: number) => void;
  onClose: () => void;
}

export function BankDialog({ bank, onSave, onClose }: BankDialogProps) {
  const [balance, setBalance] = useState(bank.balance.toString());

  const handleSave = () => {
    const numBalance = parseFloat(balance);
    if (!isNaN(numBalance) && numBalance >= 0) {
      onSave(bank.id, numBalance);
    }
  };

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

        {/* Bank Info */}
        <div className="mb-6 flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${bank.color}15` }}
          >
            <span style={{ color: bank.color }}>
              {bank.shortName}
            </span>
          </div>
          <div>
            <h3 className="text-neutral-800">{bank.name}</h3>
          </div>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-neutral-600 text-sm mb-2">
            Update Balance
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
              ₹
            </span>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
              placeholder="0"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        {/* Button */}
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
