'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getWalletFromPrivateKey, parseLink } from '@/lib/wallet';
import { useSideShiftCoins } from '@/lib/hooks';
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Scan,
  Zap,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ShiftTracker } from './ShiftTracker';
import { toast } from 'sonner';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ModernInput } from '@/components/ui/ModernInput';

const CHAINS = [
  { name: 'base', id: 8453, rpc: 'https://mainnet.base.org', symbol: 'ETH', coinId: 'ETH', networkId: 'base' },
  { name: 'polygon', id: 137, rpc: 'https://polygon-rpc.com', symbol: 'MATIC', coinId: 'MATIC', networkId: 'polygon' },
  { name: 'arbitrum', id: 42161, rpc: 'https://arb1.arbitrum.io/rpc', symbol: 'ETH', coinId: 'ETH', networkId: 'arbitrum' },
  { name: 'optimism', id: 10, rpc: 'https://mainnet.optimism.io', symbol: 'ETH', coinId: 'ETH', networkId: 'optimism' },
  { name: 'bsc', id: 56, rpc: 'https://binance.llvm.kr', symbol: 'BNB', coinId: 'BNB', networkId: 'bsc' },
  { name: 'avalanche', id: 43114, rpc: 'https://api.avax.network/ext/bc/C/rpc', symbol: 'AVAX', coinId: 'AVAX', networkId: 'avalanche' },
];

// Top crypto options for receiver
const POPULAR_COINS = [
  { coin: 'BTC', network: 'bitcoin', color: 'bg-[#F7931A]', label: 'Bitcoin' },
  { coin: 'USDC', network: 'ethereum', color: 'bg-[#2775CA]', label: 'USDC' },
  { coin: 'ETH', network: 'ethereum', color: 'bg-[#627EEA]', label: 'Ethereum' },
];

export default function ClaimLink() {
  const { coins: allCoins } = useSideShiftCoins();
  const [status, setStatus] = useState<'scanning' | 'found' | 'empty' | 'error' | 'withdrawing' | 'success'>('scanning');
  const [balance, setBalance] = useState<{ amount: string; chain: typeof CHAINS[0]; wallet: ethers.Wallet } | null>(null);

  const [withdrawCoin, setWithdrawCoin] = useState('BTC');
  const [withdrawNetwork, setWithdrawNetwork] = useState('bitcoin');
  const [destAddress, setDestAddress] = useState('');
  const [shiftId, setShiftId] = useState<string | null>(null);

  useEffect(() => {
    const scan = async () => {
      const key = parseLink(window.location.href);
      if (!key) {
        setStatus('error');
        return;
      }

      try {
        const wallet = getWalletFromPrivateKey(key);
        for (const chain of CHAINS) {
          try {
            const provider = new ethers.providers.JsonRpcProvider(chain.rpc);
            const bal = await provider.getBalance(wallet.address);
            if (bal.gt(parseEther('0.001'))) {
              // Quick 0.5s delay for visual polish, then show
              setTimeout(() => {
                setBalance({ amount: formatEther(bal), chain, wallet: wallet.connect(provider) });
                toast.success('Funds detected!');
                setStatus('found');
              }, 500);
              return;
            }
          } catch (e) {}
        }
        setTimeout(() => setStatus('empty'), 1000);
      } catch (e) {
        setStatus('error');
      }
    };
    setTimeout(scan, 300);
  }, []);

  const handleWithdraw = async () => {
    if (!balance || !destAddress) return;
    setStatus('withdrawing');
    const toastId = toast.loading('Initiating Transfer...');

    try {
      const provider = balance.wallet.provider;
      const gasPrice = await provider.getGasPrice();
      const gasLimit = ethers.BigNumber.from(21000);
      const gasCost = gasPrice.mul(gasLimit).mul(120).div(100);
      const sendAmountWei = parseEther(balance.amount).sub(gasCost);

      if (sendAmountWei.lte(0)) throw new Error('Insufficient gas');

      const res = await fetch('/api/sideshift/shifts/variable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositCoin: balance.chain.coinId,
          depositNetwork: balance.chain.networkId,
          settleCoin: withdrawCoin,
          settleNetwork: withdrawNetwork,
          settleAddress: destAddress,
        }),
      });

      const shift = await res.json();
      if (!res.ok) throw new Error(shift.error?.message);
      setShiftId(shift.id);

      toast.loading('Signing Transaction...', { id: toastId });
      const tx = await balance.wallet.sendTransaction({
        to: shift.depositAddress,
        value: sendAmountWei,
        gasLimit,
        gasPrice,
      });

      toast.success('Transfer Complete', { id: toastId });
      await tx.wait();
      setStatus('success');
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
      setStatus('found');
    }
  };

  return (
    <div className="h-full w-full relative">
      <AnimatePresence mode="wait">
        {/* Step 1: Quick Radar Scan */}
        {status === 'scanning' && (
          <GlassCard key="scanning" className="h-full flex flex-col items-center justify-center py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Radar Visual */}
              <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                {/* Ripples */}
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'easeOut' }}
                  className="absolute inset-0 border border-blue-500/30 rounded-full"
                />

                {/* Central Orb */}
                <div className="w-24 h-24 rounded-full bg-slate-900 border border-white/10 z-20 flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                  <Loader2 className="text-white/50 animate-spin relative z-10" size={32} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">Scanning Networks</h3>
              <p className="text-white/50 font-mono text-sm">Detecting funds...</p>
            </motion.div>
          </GlassCard>
        )}

        {/* Step 2: Withdraw Options */}
        {status === 'found' && (
          <GlassCard key="withdraw" className="h-full flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl relative overflow-hidden shadow-2xl shadow-blue-900/20">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Zap size={48} />
                </div>
                <div className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Gift Found</div>
                <div className="text-4xl font-mono font-bold text-white mb-2">
                  {Number(balance?.amount).toFixed(4)}{' '}
                  <span className="text-2xl opacity-80">{balance?.chain.symbol}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs font-medium text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  On {balance?.chain.name.toUpperCase()}
                </div>
              </div>

              {/* Withdraw As */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Withdraw As
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {POPULAR_COINS.map((option) => (
                    <button
                      key={option.coin}
                      onClick={() => {
                        setWithdrawCoin(option.coin);
                        setWithdrawNetwork(option.network);
                      }}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        withdrawCoin === option.coin
                          ? 'bg-blue-500/20 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center font-bold text-white text-xs`}
                      >
                        {option.coin[0]}
                      </div>
                      <span className="font-bold text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Address */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  To Address
                </label>
                <ModernInput
                  type="text"
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value)}
                  placeholder={`Your ${withdrawCoin} Wallet`}
                  icon={Wallet}
                />
              </div>

              <p className="text-xs text-white/30 text-center">
                Powered by SideShift. No gas required for receiver.
              </p>
            </motion.div>

            {/* Withdraw Button */}
            <div className="mt-6">
              <Button
                onClick={handleWithdraw}
                disabled={status === 'withdrawing' || !destAddress}
                icon={status === 'withdrawing' ? undefined : Download}
              >
                {status === 'withdrawing' ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  `Withdraw to ${withdrawCoin}`
                )}
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Step 3: Processing Tracker */}
        {status === 'success' && shiftId && (
          <GlassCard key="success" className="h-full">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                <CheckCircle2 className="w-10 h-10 text-green-400 relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
              <p className="text-gray-400 mb-8 text-sm">Funds detected. Bridging to your wallet.</p>

              <ShiftTracker shiftId={shiftId} />
            </motion.div>
          </GlassCard>
        )}

        {/* Empty/Error State */}
        {(status === 'empty' || status === 'error') && (
          <GlassCard key="error" className="h-full flex flex-col items-center justify-center text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertCircle className="w-20 h-20 text-red-500/50 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Link Invalid</h2>
              <p className="text-gray-400 mb-8">This gift has already been claimed.</p>
              <a
                href="/"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl inline-block transition-colors"
              >
                Create New Gift
              </a>
            </motion.div>
          </GlassCard>
        )}
      </AnimatePresence>
    </div>
  );
}
