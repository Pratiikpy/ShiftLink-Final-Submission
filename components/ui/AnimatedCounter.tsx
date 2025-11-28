'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCounterProps {
    value: number | string;
    decimals?: number;
    className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    decimals = 2,
    className = ""
}) => {
    const displayValue = typeof value === 'number' ? value.toFixed(decimals) : value;

    return (
        <motion.span
            key={displayValue}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={className}
        >
            {displayValue}
        </motion.span>
    );
};

// Individual digit morph effect
export const MorphingDigits: React.FC<AnimatedCounterProps> = ({
    value,
    decimals = 2,
    className = ""
}) => {
    const numStr = typeof value === 'number' ? value.toFixed(decimals) : String(value);

    return (
        <span className={`inline-flex ${className}`}>
            {numStr.split('').map((char, i) => (
                <motion.span
                    key={`${i}-${char}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                        delay: i * 0.02
                    }}
                    className="inline-block"
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
};
