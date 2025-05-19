"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { GameControls } from '@/components/chess/GameControls';
import { GameOverModal } from '@/components/chess/GameOverModal';
import { useChessGame } from '@/components/chess/useChessGame';
import { AIDifficulty, TurnOrder } from './types';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

export default function ChessGame() {
  const params = useParams();
  const difficulty = params.difficulty as AIDifficulty;
  const [turnOrder, setTurnOrder] = useState<TurnOrder>('player');
  const [isBoardRotated, setIsBoardRotated] = useState(false);

  const {
    gameState,
    handleSquareClick,
    handleRestart,
    handleUndo,
    handleResign,
  } = useChessGame(difficulty, turnOrder);

  const handleTurnOrderChange = (newTurnOrder: TurnOrder) => {
    setTurnOrder(newTurnOrder);
    setIsBoardRotated(newTurnOrder === 'ai');
    handleRestart(); // Restart the game when turn order changes
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Chess</h1>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Difficulty:</span>
              <span className="font-semibold capitalize px-3 py-1 bg-gray-100 rounded-lg">
                {difficulty}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Who goes first?</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleTurnOrderChange('player')}
                  className={`px-4 py-2 rounded-lg transition-all ${turnOrder === 'player'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  You
                </Button>
                <Button
                  onClick={() => handleTurnOrderChange('ai')}
                  className={`px-4 py-2 rounded-lg transition-all ${turnOrder === 'ai'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  AI
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-2 w-full max-w-[min(90vw,500px)]"
          >
            <ChessBoard
              gameState={gameState}
              onSquareClick={handleSquareClick}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-[min(90vw,500px)]"
          >
            <GameControls
              currentTurn={gameState.currentTurn}
              onRestart={handleRestart}
              onUndo={handleUndo}
              onResign={handleResign}
              isRotated={isBoardRotated}
            />
          </motion.div>
        </div>

        <GameOverModal
          isOpen={gameState.isCheckmate || gameState.isResigned}
          winner={gameState.currentTurn === 'white' ? 'black' : 'white'}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}