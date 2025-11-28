'use client';

import React from 'react';
import ClaimLink from '@/components/ClaimLink';

export default function ClaimPage() {
  return (
    <main className="font-mono min-h-screen flex items-center justify-center p-4 relative text-slate-100 selection:bg-blue-500/30 overflow-hidden">
      {/* Ambient Background - Matching Sender Page */}
      <div className="absolute inset-0 bg-tactical-grid z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none z-0"></div>

      <div className="w-full max-w-md px-4 z-10 relative">
        {/* Logo Header - Matching Sender Page aesthetic */}
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
            {/* Displaying a placeholder for network/ping as it's not dynamic here */}
            <div className="text-[9px] text-gray-500 font-mono mt-1">NET: SCAN</div>
            <div className="text-[9px] text-gray-500 font-mono">PING: --ms</div>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="h-[600px] relative"> {/* Added relative to contain absolute children */}
            <ClaimLink />
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-[10px] mt-8 font-mono uppercase tracking-[0.3em]">
            Zero UI • Non-Custodial • Multi-Chain
        </p>
      </div>
    </main>
  );
}
