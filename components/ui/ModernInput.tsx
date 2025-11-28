'use client';

import { LucideIcon } from 'lucide-react';

interface ModernInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'large';
}

export function ModernInput({
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  className = '',
  icon: Icon,
  variant = 'default'
}: ModernInputProps) {
  if (variant === 'large') {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`bg-transparent text-center text-7xl font-bold text-white outline-none w-full max-w-[300px] placeholder-white/20 z-10 relative font-mono tracking-tight ${className}`}
      />
    );
  }

  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-4 text-white/30 z-10" size={20} />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 ${Icon ? 'pl-12' : ''} text-white placeholder-white/30 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)] outline-none transition-all ${className}`}
      />
    </div>
  );
}
