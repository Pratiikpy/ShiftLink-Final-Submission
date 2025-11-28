'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-slate-950/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden ${className}`}
    >
      {/* Inner top highlight for glass effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </motion.div>
  );
}
