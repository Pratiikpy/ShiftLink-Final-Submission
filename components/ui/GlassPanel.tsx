'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type GlassPanelVariant = 'prominent' | 'subtle' | 'bordered';

interface GlassPanelProps {
    children: React.ReactNode;
    variant?: GlassPanelVariant;
    className?: string;
    hover?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
    children,
    variant = 'prominent',
    className = "",
    hover = true
}) => {
    const variantClasses = {
        prominent: 'glass-prominent',
        subtle: 'glass-subtle',
        bordered: 'glass border-2 border-neon-green/20'
    };

    const Component = hover ? motion.div : 'div';
    const hoverProps = hover ? {
        whileHover: { scale: 1.01, y: -2 },
        transition: { type: "spring", stiffness: 300, damping: 25 }
    } : {};

    return (
        <Component
            {...hoverProps}
            className={`${variantClasses[variant]} rounded-2xl p-6 ${className}`}
        >
            {children}
        </Component>
    );
};
