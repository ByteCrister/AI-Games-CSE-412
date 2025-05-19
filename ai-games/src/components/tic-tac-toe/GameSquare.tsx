"use client";

import { GameSquareProps } from './types';
import { motion } from 'framer-motion';

export function GameSquare({ value, index, onClick, isWinning }: GameSquareProps) {
  return (
    <motion.button
      className={`
        aspect-square w-full h-full
        flex items-center justify-center
        text-4xl font-bold
        bg-white
        border-2 border-gray-300
        hover:bg-gray-50
        transition-colors
        ${isWinning ? 'bg-green-100' : ''}
      `}
      onClick={() => onClick(index)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {value && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            text-5xl md:text-6xl
            ${value === 'X' ? 'text-blue-600' : 'text-red-600'}
          `}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  );
} 