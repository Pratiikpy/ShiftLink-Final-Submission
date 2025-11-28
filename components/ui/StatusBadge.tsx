'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type StatusType = 'active' | 'pending' | 'success' | 'error' | 'warning';

interface StatusBadgeProps {
    status: StatusType;
    label: string;
    className?: string;
    animated?: boolean;
}

const statusConfig: Record<StatusType, { bg: string, text: string, border: string, glow: string }> = {
    active: {
        bg: 'bg-neon-green/10',
        text: 'text-neon-green',
        border: 'border-neon-green/30',
        glow: 'shadow-neon-green'
    },
    pending: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]'
    },
    success: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30',
        glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]'
    },
    error: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]'
    },
    warning: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]'
    },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    label,
    className = "",
    animated = true
}) => {
    const { bg, text, border, glow } = statusConfig[status];

    return (
        <motion.div
            initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
            animate={animated ? { scale: 1, opacity: 1 } : undefined}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${bg} ${border} ${text} ${glow} font-mono text-xs font-bold uppercase tracking-wider ${className}`}
        >
            {/* Animated Pulse Indicator */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`w-2 h-2 rounded-full ${bg.replace('/10', '')}`}
                style={{ boxShadow: `0 0 10px currentColor` }}
            />
            <span>{label}</span>
        </motion.div>
    );
};
