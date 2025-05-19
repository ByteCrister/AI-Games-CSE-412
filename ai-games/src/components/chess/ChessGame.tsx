"use client";

import { useChessGame } from '@/components/chess/useChessGame';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { GameControls } from '@/components/chess/GameControls';
import { GameOverModal } from '@/components/chess/GameOverModal';
import { useState } from 'react';
import { GameMode } from './types';

export default function ChessGame({ mode }: { mode: GameMode }) {
  const [showGameOver, setShowGameOver] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | null>(null);

  const {
    gameState,
    handleSquareClick,
    handleRestart,
    handleUndo,
    handleResign,
  } = useChessGame(mode as 'pvp' | 'ai');

  // Show game over modal when checkmate occurs
  if (gameState.isCheckmate && !showGameOver) {
    setShowGameOver(true);
    setWinner(gameState.currentTurn === 'white' ? 'black' : 'white');
  }

  const handleRestartGame = () => {
    handleRestart();
    setShowGameOver(false);
    setWinner(null);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-amber-900">
          {mode === 'pvp' ? 'Player vs Player' : 'Player vs AI'}
        </h1>

        <div className="relative w-full flex justify-center">
          <ChessBoard
            gameState={gameState}
            onSquareClick={handleSquareClick}
          />
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {gameState.isCheck && (
              <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
            )}
          </div>
        </div>

        <GameControls
          onRestart={handleRestartGame}
          onUndo={handleUndo}
          onResign={handleResign}
          currentTurn={gameState.currentTurn}
          isCheck={gameState.isCheck}
          isCheckmate={gameState.isCheckmate}
        />

        <GameOverModal
          isOpen={showGameOver}
          winner={winner}
          onRestart={handleRestartGame}
        />
      </div>
    </div>
  );
}