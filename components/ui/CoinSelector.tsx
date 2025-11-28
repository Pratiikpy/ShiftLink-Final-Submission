'use client';

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Coin {
  coin: string;
  networks: string[];
  name: string;
  mainnet: string;
}

interface CoinSelectorProps {
  label: string;
  selectedCoin: string;
  selectedNetwork: string;
  onSelect: (coin: string, network: string) => void;
  coins: Coin[];
}

export function CoinSelector({ label, selectedCoin, selectedNetwork, onSelect, coins }: CoinSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-white hover:text-black transition-colors bg-[#050505] group text-white"
      >
        <div className="flex flex-col items-start">
            <div className="text-[9px] font-bold text-[#555] uppercase tracking-[0.2em] mb-1 group-hover:text-black transition-colors">{label}</div>
            <div className="flex items-baseline gap-3">
                <span className="font-black text-2xl leading-none">{selectedCoin}</span>
                <span className="text-[10px] text-[#bef264] group-hover:text-black group-hover:border-black font-bold uppercase border border-[#bef264]/30 px-1.5 py-0.5 bg-[#bef264]/10 group-hover:bg-[#bef264]/20">
                    {selectedNetwork}
                </span>
            </div>
        </div>
        <div className={`w-8 h-8 border border-[#333] flex items-center justify-center text-white transition-all group-hover:border-black group-hover:text-black ${isOpen ? 'rotate-180 bg-black text-white' : ''}`}>
          <ChevronDown size={14} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute bottom-full left-0 w-full bg-black border-t border-x border-[#333] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] max-h-[320px] overflow-y-auto z-50 scrollbar-hide"
          >
            <div className="sticky top-0 bg-black border-b border-[#333] p-2 text-[9px] text-[#666] uppercase tracking-widest font-bold">
                // AVAILABLE_ASSETS
            </div>
            
            {coins.map((coin) => (
              <div key={coin.coin}>
                 {coin.networks.map(network => {
                   const isSelected = selectedCoin === coin.coin && selectedNetwork === network;
                   return (
                     <button
                      key={`${coin.coin}-${network}`}
                      onClick={() => {
                        onSelect(coin.coin, network);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 p-4 transition-colors border-b border-[#1a1a1a] group ${isSelected ? 'bg-[#bef264] text-black' : 'hover:bg-white hover:text-black text-white'}`}
                     >
                      <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border ${isSelected ? 'border-black' : 'border-[#333] group-hover:border-black'}`}>
                        {coin.coin[0]}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-sm font-mono leading-none">{coin.name}</div>
                        <div className={`text-[9px] uppercase tracking-wider mt-1 ${isSelected ? 'opacity-70' : 'text-[#666] group-hover:text-black'}`}>{network}</div>
                      </div>
                      {isSelected && <Check size={14} />}
                     </button>
                   )
                 })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}