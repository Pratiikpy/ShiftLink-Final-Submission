'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Wallet, ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { createGiftWallet, generateLink } from '@/lib/wallet';

export default function CreateLink() {
  const { isConnected } = useAccount();

  // Refs (matching HTML getElementById)
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const viewConnectRef = useRef<HTMLDivElement>(null);
  const viewInputRef = useRef<HTMLDivElement>(null);
  const viewSuccessRef = useRef<HTMLDivElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  // State
  const [usdValue, setUsdValue] = useState('34.50');
  const [selectedName, setSelectedName] = useState('ETH');
  const [selectedIcon, setSelectedIcon] = useState('E');
  const [dropdownHidden, setDropdownHidden] = useState(true);
  const [amount, setAmount] = useState('0.01');
  const [magicLink, setMagicLink] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const { data: hash, sendTransactionAsync } = useSendTransaction();
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash });

  // Generate QR when link is created
  useEffect(() => {
    if (magicLink) {
      QRCode.toDataURL(magicLink, { width: 400, margin: 0 }).then(setQrDataUrl);
    }
  }, [magicLink]);

  // Spotlight Effect (EXACT copy from HTML)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current || !spotlightRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.setProperty('--x', `${x}px`);
    spotlightRef.current.style.setProperty('--y', `${y}px`);
  };

  // State Transitions (EXACT copy from HTML)
  const transitionToInput = () => {
    if (!viewConnectRef.current || !viewInputRef.current) return;
    // Fade out connect
    viewConnectRef.current.style.opacity = '0';
    viewConnectRef.current.style.pointerEvents = 'none';

    // Show input view
    viewInputRef.current.style.opacity = '1';
    viewInputRef.current.style.pointerEvents = 'all';

    // Focus input slightly after transition
    setTimeout(() => {
      amountInputRef.current?.focus();
    }, 500);
  };

  const transitionToSuccess = async () => {
    if (!viewInputRef.current || !viewSuccessRef.current || !actionButtonRef.current) return;

    // Show loading state on button (Simulated)
    const originalContent = actionButtonRef.current.innerHTML;
    actionButtonRef.current.innerHTML = `<span class="animate-spin mr-2">/</span> MINTING...`;

    try {
      // Create gift wallet and send transaction
      const giftWallet = createGiftWallet();
      await sendTransactionAsync({
        to: giftWallet.address as `0x${string}`,
        value: parseEther(amount),
      });
      const link = generateLink(window.location.origin, giftWallet.privateKey);
      setMagicLink(link);

      setTimeout(() => {
        viewInputRef.current!.style.opacity = '0';
        viewInputRef.current!.style.pointerEvents = 'none';

        viewSuccessRef.current!.style.opacity = '1';
        viewSuccessRef.current!.style.pointerEvents = 'all';
        actionButtonRef.current!.innerHTML = originalContent;
      }, 1500);
    } catch (error) {
      actionButtonRef.current.innerHTML = originalContent;
      toast.error('Transaction failed');
    }
  };

  const resetApp = () => {
    if (!viewSuccessRef.current || !viewInputRef.current) return;
    viewSuccessRef.current.style.opacity = '0';
    viewSuccessRef.current.style.pointerEvents = 'none';

    viewInputRef.current.style.opacity = '1';
    viewInputRef.current.style.pointerEvents = 'all';
  };

  // Dropdown Logic (EXACT copy from HTML)
  const toggleDropdown = () => {
    setDropdownHidden(!dropdownHidden);
  };

  const selectCoin = (name: string, icon: string) => {
    setSelectedName(name);
    setSelectedIcon(icon);
    setDropdownHidden(true);
  };

  // Live USD Calc (EXACT copy from HTML)
  const updateUSD = (val: string) => {
    const rate = 3450;
    const total = (parseFloat(val) * rate).toFixed(2);
    setUsdValue(isNaN(Number(total)) ? '0.00' : total);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);
    updateUSD(val);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(magicLink);
    toast.success('Copied to clipboard');
  };

  // Auto-transition when connected
  useEffect(() => {
    if (isConnected && viewConnectRef.current?.style.opacity !== '0') {
      transitionToInput();
    }
  }, [isConnected]);

  return (
    <div ref={cardContainerRef} id="card-container" className="relative z-10 w-full max-w-[460px] group" onMouseMove={handleMouseMove}>
      {/* Dynamic Spotlight Overlay */}
      <div ref={spotlightRef} id="spotlight" className="absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none z-0 spotlight"></div>

      {/* Main Card */}
      <div className="glass-panel w-full min-h-[550px] rounded-sm relative overflow-hidden flex flex-col z-10">

        {/* Scanline Animation */}
        <div className="animate-scanline absolute top-0 left-0 w-full h-full z-0 pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-20 border-b border-white/20 bg-white/5 p-5 flex justify-between items-start">
          <div className="absolute top-0 left-0 w-1 h-full bg-lime-neon"></div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">
              SHIFT<span className="text-lime-neon">_LINK</span>
            </h1>
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1 font-bold">
              V1.0 // Protocol
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-lime-neon text-[10px] font-bold">
              <span className="w-1.5 h-1.5 bg-lime-neon rounded-full animate-pulse shadow-[0_0_5px_#bef264]"></span>
              SYS: ONLINE
            </div>
            <div className="text-[9px] text-gray-500 font-mono mt-1">NET: BASE</div>
            <div className="text-[9px] text-gray-500 font-mono">PING: 24ms</div>
          </div>
        </div>

        {/* Content Views */}
        <div id="view-container" className="flex-1 flex flex-col relative z-10">

          {/* VIEW 1: CONNECT WALLET */}
          <div ref={viewConnectRef} id="view-connect" className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 absolute inset-0 transition-all duration-500 bg-black/80 z-30">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-lime-neon/20 blur-2xl rounded-full animate-pulse-slow"></div>
              <div className="relative w-24 h-24 border border-lime-neon/30 bg-black/50 backdrop-blur-md flex items-center justify-center">
                <Wallet className="w-10 h-10 text-lime-neon" />
                {/* Decorators */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-lime-neon"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-lime-neon"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-block px-2 py-1 bg-black border border-white/20 text-white font-bold uppercase tracking-widest text-xs">
                Locked // Auth Required
              </div>
              <p className="text-gray-500 text-xs max-w-[220px] mx-auto leading-relaxed">
                Connect terminal to initialize secure transfer channel.
              </p>
            </div>

            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button onClick={openConnectModal} className="w-full max-w-[240px] py-4 border border-white/20 text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest text-xs transition-all duration-200">
                  [ INITIALIZE_UPLINK ]
                </button>
              )}
            </ConnectButton.Custom>
          </div>

          {/* VIEW 2: INPUT (Hidden by default) */}
          <div ref={viewInputRef} id="view-input" className="flex-1 flex flex-col opacity-0 pointer-events-none transition-all duration-500 absolute inset-0 z-20 bg-black">

            {/* Screen Area */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-6 border-b border-white/10 bg-black overflow-hidden">
              {/* Inner Grid */}
              <div className="absolute inset-0 opacity-20 bg-screen-grid pointer-events-none"></div>

              {/* HUD Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/20"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/20"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/20"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/20"></div>

              <label className="text-[10px] text-lime-neon/80 uppercase tracking-widest mb-6 font-bold bg-lime-neon/10 px-2 py-1 border border-lime-neon/20 z-10">
                // Input_Value
              </label>

              <div className="relative z-10 flex items-center justify-center w-full">
                <input
                  ref={amountInputRef}
                  type="number"
                  id="amount-input"
                  value={amount}
                  onChange={handleAmountChange}
                  className="bg-transparent text-7xl font-black text-white text-center w-full max-w-[320px] outline-none placeholder-white/10 caret-lime-neon text-glow border-none focus:ring-0 p-0 m-0"
                  placeholder="0.00"
                />
              </div>

              <div className="mt-6 flex items-center gap-2 z-10">
                <div className="text-lime-neon font-bold text-sm bg-lime-neon/10 px-3 py-1 border border-lime-neon/20 font-mono">
                  ≈ $<span id="usd-value">{usdValue}</span> USD
                </div>
              </div>
            </div>

            {/* Controls Area */}
            <div className="bg-black relative z-20">
              {/* Selector */}
              <div className="border-b border-white/10">
                <button onClick={toggleDropdown} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-lime-neon/50">
                      <span className="font-bold text-lg text-white" id="selected-icon">{selectedIcon}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-white text-lg leading-none" id="selected-name">{selectedName}</div>
                      <div className="text-[10px] text-gray-500 uppercase mt-1">ON: BASE</div>
                    </div>
                  </div>
                  <ChevronDown className="text-gray-500 w-5 h-5" />
                </button>

                {/* Dropdown Menu (Hidden) */}
                <div id="coin-dropdown" className={`${dropdownHidden ? 'hidden' : ''} bg-black border-t border-white/10 absolute bottom-full left-0 w-full z-50 shadow-2xl`}>
                  <div className="p-2 border-b border-white/10">
                    <input type="text" placeholder="SEARCH ASSET..." className="w-full bg-white/5 border border-white/10 p-2 text-xs text-white uppercase focus:outline-none focus:border-lime-neon placeholder-gray-600" />
                  </div>
                  <div onClick={() => selectCoin('ETH', 'E')} className="p-3 flex items-center gap-3 hover:bg-lime-neon hover:text-black text-gray-400 cursor-pointer border-b border-white/5 transition-colors group">
                    <span className="font-bold text-sm">ETH</span>
                    <span className="text-[10px] opacity-50 ml-auto">BASE</span>
                  </div>
                  <div onClick={() => selectCoin('USDC', '$')} className="p-3 flex items-center gap-3 hover:bg-lime-neon hover:text-black text-gray-400 cursor-pointer border-b border-white/5 transition-colors group">
                    <span className="font-bold text-sm">USDC</span>
                    <span className="text-[10px] opacity-50 ml-auto">POLYGON</span>
                  </div>
                  <div onClick={() => selectCoin('SOL', 'S')} className="p-3 flex items-center gap-3 hover:bg-lime-neon hover:text-black text-gray-400 cursor-pointer transition-colors group">
                    <span className="font-bold text-sm">SOL</span>
                    <span className="text-[10px] opacity-50 ml-auto">SOLANA</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button ref={actionButtonRef} onClick={transitionToSuccess} className="w-full bg-lime-neon hover:bg-lime-400 text-black font-black text-xl py-6 uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 bg-stripes pointer-events-none"></div>
                <span className="relative z-10 flex items-center gap-2">
                  INITIATE_LINK <ArrowRight className="w-6 h-6 stroke-[3px] group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* VIEW 3: SUCCESS (Hidden by default) */}
          <div ref={viewSuccessRef} id="view-success" className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 opacity-0 pointer-events-none transition-all duration-500 absolute inset-0 z-10 bg-black/90">
            <div className="relative">
              <div className="absolute -inset-4 bg-lime-neon/20 blur-xl rounded-full animate-pulse"></div>
              <ShieldCheck className="w-20 h-20 text-lime-neon relative z-10" />
            </div>

            <div className="text-center z-10">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Asset Secured</h2>
              <p className="text-xs text-gray-500 font-mono mt-1">Encrypted payload ready.</p>
            </div>

            {qrDataUrl && (
              <div className="bg-white p-2">
                <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
              </div>
            )}

            <div onClick={copyToClipboard} className="w-full bg-black border border-lime-neon/30 p-4 relative overflow-hidden group cursor-pointer hover:border-lime-neon transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-lime-neon"></div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 pl-2">// Secret Key</p>
              <p className="text-xs text-lime-neon font-mono break-all pl-2 tracking-widest">{magicLink || 'https://shift.link/#k8j29...'}</p>
            </div>

            <div className="flex gap-3 w-full z-10">
              <button onClick={copyToClipboard} className="flex-1 py-3 border border-white/20 text-white text-xs font-bold uppercase hover:bg-white/10 transition-colors">
                [ Copy ]
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(magicLink)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-[#25D366] text-black text-xs font-bold uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                WhatsApp
              </a>
            </div>

            <button onClick={resetApp} className="text-[10px] text-gray-600 uppercase tracking-widest hover:text-white transition-colors mt-4">
              &lt;&lt; Reset Terminal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
