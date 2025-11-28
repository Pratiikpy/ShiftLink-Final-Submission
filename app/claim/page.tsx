'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import ClaimLink from '@/components/ClaimLink';

export default function ClaimPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center font-sans antialiased text-slate-100 selection:bg-blue-500/30 overflow-hidden">
      <AuroraBackground />

      <div className="w-full max-w-md px-4 z-10 relative">
        {/* Logo Header */}
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-2 mb-8"
        >
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 transform rotate-3 hover:rotate-6 transition-transform">
                <ArrowRight className="text-white transform -rotate-45" size={20} strokeWidth={3} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 font-display">
                ShiftLink
            </h1>
        </motion.div>

        {/* Main Card Container */}
        <div className="h-[600px]">
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