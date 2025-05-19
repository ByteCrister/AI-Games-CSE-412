'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, Undo2, Flag } from 'lucide-react';

interface GameControlsProps {
  currentTurn: 'white' | 'black';
  onRestart: () => void;
  onUndo: () => void;
  onResign: () => void;
  isRotated: boolean;
}

export function GameControls({
  currentTurn,
  onRestart,
  onUndo,
  onResign,
  isRotated,
}: GameControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-xl p-6 space-y-6"
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Game Controls</h2>
        <div className="inline-block px-4 py-2 rounded-lg bg-gray-100">
          <span className="text-gray-600">Current Turn: </span>
          <span className={`font-bold ${currentTurn === 'white' ? 'text-gray-800' : 'text-gray-400'}`}>
            {currentTurn === 'white' ? 'White' : 'Black'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart Game
        </Button>

        <Button
          onClick={onUndo}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Undo Move
        </Button>

        <Button
          onClick={onResign}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Flag className="w-4 h-4 mr-2" />
          Resign
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Board is {isRotated ? 'rotated' : 'normal'}</p>
        <p className="mt-1">
          {isRotated ? 'AI plays as White' : 'You play as White'}
        </p>
      </div>
    </motion.div>
  );
} 