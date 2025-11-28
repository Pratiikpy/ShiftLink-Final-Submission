'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

// --- 1. Enhanced Magnetic Button ---
export const MagneticButton = ({ children, onClick, disabled, className = '' }: any) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const center = { x: left + width / 2, y: top + height / 2 };
    x.set((clientX - center.x) * 0.25); // Stronger magnetic pull
    y.set((clientY - center.y) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative w-full py-5 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group shadow-glow-blue ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 100%'
        }}
      />

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
          backgroundSize: '200% 100%'
        }}
        animate={{
          backgroundPosition: ['-100% 0', '200% 0']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};

// --- 2. Enhanced Scramble Text ---
const CYPHER = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";

export const ScrambleText = ({ text, className = "" }: { text: string, className?: string }) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (index < iterations) return text[index];
            return CYPHER[Math.floor(Math.random() * CYPHER.length)];
          })
          .join("")
      );
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{display}</span>;
};

// --- 3. Enhanced Warp Background with Parallax ---
export const WarpBackground = () => {
  const [stars, setStars] = useState<Array<{ x: string, y: string, width: string, height: string, opacity: number, duration: number }>>([]);

  useEffect(() => {
    // Generate more stars for richer effect
    const newStars = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * 100 + "vw",
      y: Math.random() * 100 + "vh",
      width: (Math.random() * 3 + 1) + "px",
      height: (Math.random() * 80 + 20) + "px",
      opacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 8 + 8
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      {/* Warp Speed Stars */}
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-b from-white to-transparent rounded-full"
          initial={{
            x: star.x,
            y: star.y,
            width: star.width,
            height: star.height,
            opacity: 0,
          }}
          animate={{
            y: ["0%", "110%"],
            opacity: [0, star.opacity, 0]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-purple-900/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/5 to-transparent" />

      {/* Scanlines */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)'
        }}
      />
    </div>
  );
};

// --- 4. NEW: Particle Field Component ---
export const ParticleField = ({ count = 50 }: { count?: number }) => {
  const [particles, setParticles] = useState<Array<{ x: number, y: number, size: number, delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute bg-neon-green/30 rounded-full blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
};

// --- 5. NEW: Gradient Text Component ---
export const GradientText = ({
  children,
  className = "",
  from = "#bef264",
  to = "#22d3ee"
}: {
  children: React.ReactNode,
  className?: string,
  from?: string,
  to?: string
}) => {
  return (
    <span
      className={`gradient-text ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {children}
    </span>
  );
};

// --- 6. NEW: Ripple Effect Button ---
export const RippleButton = ({
  children,
  onClick,
  className = ""
}: {
  children: React.ReactNode,
  onClick?: () => void,
  className?: string
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number, y: number, id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples([...ripples, { x, y, id: Date.now() }]);

    setTimeout(() => {
      setRipples(ripples => ripples.slice(1));
    }, 600);

    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full"
          initial={{
            width: 0,
            height: 0,
            x: ripple.x,
            y: ripple.y,
            opacity: 1
          }}
          animate={{
            width: 400,
            height: 400,
            x: ripple.x - 200,
            y: ripple.y - 200,
            opacity: 0
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </button>
  );
};