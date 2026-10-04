'use client';

import React from 'react';

interface UrnaKeypadProps {
  onNumberPress: (num: string) => void;
  onBrancoPress: () => void;
  onCorrigePress: () => void;
  onConfirmaPress: () => void;
  disabled?: boolean;
}

export const UrnaKeypad: React.FC<UrnaKeypadProps> = ({
  onNumberPress,
  onBrancoPress,
  onCorrigePress,
  onConfirmaPress,
  disabled = false,
}) => {
  const numericKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  return (
    <div className="bg-[#1e1e1e] p-4 md:p-6 rounded-lg border-4 border-[#121212] shadow-2xl flex flex-col items-center select-none w-full max-w-sm">
      {/* Brand Header */}
      <div className="w-full flex justify-between items-center mb-4 text-[#888888] font-bold text-xs md:text-sm tracking-wider">
        <span>JUSTIÇA ELEITORAL</span>
        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse"></span>
      </div>

      {/* Numeric Grid */}
      <div className="space-y-3 w-full flex flex-col items-center">
        {numericKeys.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-3 md:gap-4 w-full">
            {row.map((num) => (
              <button
                key={num}
                disabled={disabled}
                onClick={() => onNumberPress(num)}
                className="w-14 h-12 md:w-16 md:h-14 bg-gradient-to-b from-[#2b2b2b] to-[#1a1a1a] hover:from-[#3a3a3a] hover:to-[#222222] active:scale-95 text-white font-bold text-xl md:text-2xl rounded shadow-md border-b-4 border-black flex items-center justify-center transition-all disabled:opacity-50"
              >
                {num}
              </button>
            ))}
          </div>
        ))}

        {/* 0 Button Row */}
        <div className="flex justify-center w-full">
          <button
            disabled={disabled}
            onClick={() => onNumberPress('0')}
            className="w-14 h-12 md:w-16 md:h-14 bg-gradient-to-b from-[#2b2b2b] to-[#1a1a1a] hover:from-[#3a3a3a] hover:to-[#222222] active:scale-95 text-white font-bold text-xl md:text-2xl rounded shadow-md border-b-4 border-black flex items-center justify-center transition-all disabled:opacity-50"
          >
            0
          </button>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-end justify-between gap-2 md:gap-3 w-full mt-6">
        {/* BRANCO */}
        <button
          disabled={disabled}
          onClick={onBrancoPress}
          className="flex-1 h-12 md:h-14 bg-gradient-to-b from-gray-100 to-gray-300 hover:from-white hover:to-gray-200 active:scale-95 text-gray-900 font-extrabold text-xs md:text-sm uppercase rounded shadow-md border-b-4 border-gray-500 flex items-center justify-center transition-all disabled:opacity-50"
        >
          BRANCO
        </button>

        {/* CORRIGE */}
        <button
          disabled={disabled}
          onClick={onCorrigePress}
          className="flex-1 h-12 md:h-14 bg-gradient-to-b from-[#ff7700] to-[#e65c00] hover:from-[#ff8811] hover:to-[#ff6600] active:scale-95 text-black font-extrabold text-xs md:text-sm uppercase rounded shadow-md border-b-4 border-[#b34700] flex items-center justify-center transition-all disabled:opacity-50"
        >
          CORRIGE
        </button>

        {/* CONFIRMA */}
        <button
          disabled={disabled}
          onClick={onConfirmaPress}
          className="flex-1 h-14 md:h-16 bg-gradient-to-b from-[#00b862] to-[#008a47] hover:from-[#00cb6c] hover:to-[#009b50] active:scale-95 text-black font-black text-xs md:text-sm uppercase rounded shadow-md border-b-4 border-[#005c2f] flex items-center justify-center transition-all disabled:opacity-50 -mt-2"
        >
          CONFIRMA
        </button>
      </div>
    </div>
  );
};
