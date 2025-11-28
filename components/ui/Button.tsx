'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  icon: Icon
}: ButtonProps) {
  const baseStyle = "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group";

  const variants = {
    primary: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] border border-white/10",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md",
    outline: "border border-white/20 text-white/70 hover:text-white hover:border-white/40",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {Icon && <Icon size={18} />}
      </span>
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      )}
    </motion.button>
  );
}
