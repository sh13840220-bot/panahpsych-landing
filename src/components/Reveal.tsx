import React from 'react';
import { motion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  hoverEffect?: boolean;
  key?: React.Key;
}

export function Reveal({ children, className = '', style = {}, delay = 0, hoverEffect = true }: RevealProps) {
  const isCard = hoverEffect && (className.includes('glass') || className.includes('card') || className.includes('soon-card'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        isCard
          ? {
              scale: 1.015,
              y: -4,
              transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  staggerDelay?: number;
}

export function StaggerGrid({ children, className = '', style = {}, staggerDelay = 0.12 }: StaggerGridProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hoverEffect?: boolean;
  key?: React.Key;
}

export function StaggerItem({ children, className = '', style = {}, hoverEffect = true }: StaggerItemProps) {
  const isCard = hoverEffect && (className.includes('glass') || className.includes('card') || className.includes('card-small') || className.includes('card-large') || className.includes('card-side'));

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      whileHover={
        isCard
          ? {
              scale: 1.015,
              y: -4,
              transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

