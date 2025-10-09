'use client';
import { motion } from 'framer-motion';

export default function Spinner({ size = 32, color = '#385C32' }) {
  return (
    <motion.div
      className="flex justify-center items-center"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: 'linear',
      }}
      style={{
        width: size,
        height: size,
        border: `${size / 8}px solid #e5e7eb`, // Tailwind gray-200
        borderTopColor: color,
        borderRadius: '50%',
      }}
    />
  );
}
