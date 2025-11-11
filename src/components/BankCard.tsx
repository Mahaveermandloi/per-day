import React from "react";
import { Bank } from "../App";

interface BankCardProps {
  bank: Bank;
  onClick: () => void;
}

// Bank logos (using URLs)
const bankLogos: Record<string, string> = {
  ubi: "https://companieslogo.com/img/orig/UNIONBANK.NS-5bba728d.png?t=1720244494",
  sbi: "https://companieslogo.com/img/orig/SBIN.NS_BIG-b060a2ff.png?t=1720244493",
  idfc: "https://companieslogo.com/img/orig/IDFCFIRSTB.NS_BIG-f326a18d.png?t=1720244492",
};

export function BankCard({ bank, onClick }: BankCardProps) {
  const logoSrc = bankLogos[bank.id];

  return (
    <>
      <button
        onClick={onClick}
        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border-0 w-full"
      >
        <div className="flex flex-col items-center gap-2">
          {/* Bank Logo */}
          <div className="w-12 h-12 flex items-center justify-center">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={`${bank.shortName} logo`}
                className="max-w-[48px] max-h-[48px] object-contain"
                style={{ imageRendering: "crisp-edges" }}
                loading="lazy"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${bank.color}15` }}
              >
                <span className="text-sm" style={{ color: bank.color }}>
                  {bank.shortName}
                </span>
              </div>
            )}
          </div>

          {/* Bank Name */}
          <div className="text-xs text-neutral-600">{bank.shortName}</div>

          {/* Balance */}
          <div className="text-neutral-900">
            ₹{bank.balance.toLocaleString("en-IN")}
          </div>
        </div>
      </button>
    </>
  );
}
