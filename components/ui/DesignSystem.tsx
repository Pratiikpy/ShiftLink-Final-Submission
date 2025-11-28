'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';

// --- Types ---
interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
}

// --- Dynamic Theme Context ---
export const THEMES: Record<string, ThemeConfig> = {
  base: { primary: '#3b82f6', secondary: '#2563eb', accent: '#60a5fa' },
  eth: { primary: '#6366f1', secondary: '#4f46e5', accent: '#818cf8' },
  polygon: { primary: '#a855f7', secondary: '#9333ea', accent: '#c084fc' },
  bitcoin: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
  default: { primary: '#bef264', secondary: '#a3e635', accent: '#22d3ee' },
};

export const Spotlight = ({
  children,
  className = "",
  theme = "default"
}: {
  children: React.ReactNode,
  className?: string,
  theme?: string
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const activeTheme = THEMES[theme] || THEMES.default;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl border border-white/10 glass-prominent shadow-lifted ${className}`}
    >
      {/* 1. Animated Border Beam */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <div
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] animate-spin-slow opacity-20 pointer-events-none transition-colors duration-700"
          style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${activeTheme.primary} 90deg, transparent 180deg)` }}
        />
      </div>

      {/* 2. Mouse Tracking Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${activeTheme.accent}20, transparent 40%)`,
        }}
      />

      {/* 3. Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] z-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Content */}
      <div className="relative z-30 h-full">{children}</div>
    </div>
  );
};

export const AuroraBackground = ({ theme = "default" }: { theme?: string }) => {
  const activeTheme = THEMES[theme] || THEMES.default;
  const [stars, setStars] = useState<Array<{ x: string, y: string, opacity: number }>>([]);

  // Generate stars only on client to avoid hydration mismatch
  useEffect(() => {
    const clientStars = [...Array(30)].map(() => ({
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      opacity: Math.random()
    }));
    setStars(clientStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0 w-full h-full bg-[#020204] overflow-hidden transition-colors duration-1000">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Primary Orb - Enhanced */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] mix-blend-screen transition-colors duration-1000"
        style={{ backgroundColor: `${activeTheme.primary}30` }}
      />

      {/* Secondary Orb - Enhanced */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[120px] mix-blend-screen transition-colors duration-1000"
        style={{ backgroundColor: `${activeTheme.secondary}30` }}
      />

      {/* Tertiary Orb - New */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[30%] right-[20%] w-[600px] h-[600px] rounded-full blur-[100px] mix-blend-screen transition-colors duration-1000"
        style={{ backgroundColor: `${activeTheme.accent}25` }}
      />

      {/* Enhanced Starfield - Client-side only */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: star.x,
              top: star.y
            }}
            initial={{ opacity: star.opacity }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};

// --- New: Glow Card Component ---
export const GlowCard = ({
  children,
  className = "",
  glowColor = "#bef264"
}: {
  children: React.ReactNode,
  className?: string,
  glowColor?: string
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-prominent rounded-2xl p-6 relative group ${className}`}
      style={{
        boxShadow: `0 0 20px ${glowColor}30, 0 8px 32px rgba(0, 0, 0, 0.5)`
      }}
    >
      {/* Hover Glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 40px ${glowColor}60`
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// --- New: Floating Element Wrapper ---
export const FloatingElement = ({
  children,
  delay = 0
}: {
  children: React.ReactNode,
  delay?: number
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
};