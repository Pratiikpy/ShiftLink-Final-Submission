'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowRight, ExternalLink, Clock, ArrowLeftRight } from 'lucide-react';

interface ShiftStatus {
  id: string;
  status: 'waiting' | 'pending' | 'processing' | 'settling' | 'settled' | 'refund' | 'expired';
  depositHash?: string;
  settleHash?: string;
  depositCoin?: string;
  depositNetwork?: string;
  settleCoin?: string;
  settleNetwork?: string;
}

const STEPS = [
  { id: 'waiting', label: 'WAITING' },
  { id: 'pending', label: 'DETECTED' },
  { id: 'processing', label: 'SWAPPING' },
  { id: 'settled', label: 'DONE' },
];

const CHAIN_EXPLORERS: Record<string, string> = {
  'base': 'https://basescan.org',
  'polygon': 'https://polygonscan.com',
  'arbitrum': 'https://arbiscan.io',
  'optimism': 'https://optimistic.etherscan.io',
  'bsc': 'https://bscscan.com',
  'avalanche': 'https://snowtrace.io',
  'ethereum': 'https://etherscan.io',
  'bitcoin': 'https://blockchair.com/bitcoin',
  'solana': 'https://solscan.io',
};

function getExplorerLink(hash: string, network: string | undefined, type: 'tx' | 'address') {
  const net = network?.toLowerCase() || 'ethereum';
  const explorer = CHAIN_EXPLORERS[net] || 'https://blockscan.com';
  if (['bitcoin', 'litecoin', 'dogecoin'].includes(net)) return `${explorer}/transaction/${hash}`;
  if (net === 'solana') return `${explorer}/tx/${hash}`;
  return `${explorer}/${type}/${hash}`;
}

export function ShiftTracker({ shiftId }: { shiftId: string }) {
  const [status, setStatus] = useState<ShiftStatus | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/sideshift/shifts/${shiftId}`);
        const data = await res.json();
        setStatus(data);
      } catch (e) { }
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [shiftId]);

  if (!status) return <div className="text-center p-8 text-blue-400/40 text-xs font-mono animate-pulse">INITIALIZING UPLINK...</div>;

  let activeStep = 0;
  if (status.status === 'pending') activeStep = 1;
  if (status.status === 'processing' || status.status === 'settling') activeStep = 2;
  if (status.status === 'settled') activeStep = 3;

  return (
    <div className="w-full">
      {/* Timeline */}
      <div className="relative flex justify-between items-center mb-8 px-2">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10"></div>
        <motion.div 
          className="absolute top-1/2 left-0 h-[1px] bg-blue-500 -z-10"
          initial={{ width: '0%' }}
          animate={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 1 }}
        ></motion.div>

        {STEPS.map((step, idx) => {
          const isActive = idx <= activeStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 relative group">
              <motion.div 
                className={`w-3 h-3 rounded-full z-10 border transition-colors duration-500 ${isActive ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-black border-white/20'}`}
                animate={{ scale: isActive ? 1.5 : 1 }}
              />
              <div className={`text-[8px] font-bold uppercase tracking-widest absolute -bottom-6 transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-white/20'}`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 mt-10 font-mono">
        {status.depositHash && (
          <div className="flex items-center justify-between p-2 border-b border-white/5">
            <span className="text-[10px] text-gray-500 uppercase">Inbound</span>
            <a href={getExplorerLink(status.depositHash, status.depositNetwork, 'tx')} target="_blank" className="text-xs text-blue-400 hover:text-white truncate max-w-[200px] block">
              {status.depositHash}
            </a>
          </div>
        )}
        {status.settleHash && (
          <div className="flex items-center justify-between p-2 border-b border-white/5">
            <span className="text-[10px] text-gray-500 uppercase">Outbound</span>
            <a href={getExplorerLink(status.settleHash, status.settleNetwork, 'tx')} target="_blank" className="text-xs text-green-400 hover:text-white truncate max-w-[200px] block">
              {status.settleHash}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}