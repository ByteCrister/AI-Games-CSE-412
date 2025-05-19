'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTicTacToe } from './useTicTacToe';
import { GameBoard } from './GameBoard';
import { ScorePanel } from './ScorePanel';
import { Button } from '@/components/ui/button';
import { AIDifficulty } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const difficulty = params.difficulty as AIDifficulty;

  const {
    gameState,
    scores,
    stats,
    moveHistory,
    makeMove,
    resetGame,
    undoLastMove,
    isAIMoving,
  } = useTicTacToe(difficulty);

  const getStatusMessage = () => {
    if (gameState.status === 'won') {
      return `${gameState.winner === 'X' ? 'Player' : 'AI'} wins!`;
    }
    if (gameState.status === 'draw') {
      return "It's a draw!";
    }
    if (isAIMoving) {
      return 'AI is thinking...';
    }
    return gameState.currentPlayer === 'X' ? 'Your turn' : 'AI is thinking...';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl flex flex-col items-center gap-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Tic-Tac-Toe - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </h1>

        <div className="w-full grid grid-cols-1 gap-8">
          {/* Left Column: Game + Controls */}
          <div className="flex flex-col items-center gap-6">
            <ScorePanel
              playerScore={scores.player}
              aiScore={scores.ai}
              draws={scores.draws}
            />

            <p className="text-xl font-semibold text-gray-700">{getStatusMessage()}</p>

            <div className={`relative w-full max-w-[400px] ${isAIMoving ? 'opacity-50 pointer-events-none' : ''}`}>
              <GameBoard
                board={gameState.board}
                onSquareClick={makeMove}
                winningLine={gameState.winningLine}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                id='change-difficulty'
                onClick={() => router.push('/tic-tac-toe')}
                disabled={isAIMoving}
              >
                Change Difficulty
              </Button>
              <Button
                id='new-game'
                onClick={resetGame} disabled={isAIMoving}>
                New Game
              </Button>
              <Button
                variant="outline"
                id='undo-move'
                onClick={undoLastMove}
                disabled={moveHistory.length === 0 || isAIMoving}
              >
                Undo Move
              </Button>
            </div>
          </div>

          {/* Right Column: Stats + History */}
          <div className="flex flex-col gap-4 items-center">
            <Card className="w-full md:w-[50%]">
              <CardHeader>
                <CardTitle>Game Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-left">
                  <p>Total Games: {stats.totalGames}</p>
                  <p>Total Moves: {stats.totalMoves}</p>
                  <p>Average Moves per Game: {stats.averageMovesPerGame.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full md:w-[50%]">
              <CardHeader>
                <CardTitle>Move History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-left max-h-60 overflow-y-auto">
                  {moveHistory.length === 0 ? (
                    <p className="text-sm text-gray-500">No moves yet.</p>
                  ) : (
                    moveHistory.map((move, index) => (
                      <p key={index}>
                        Move {index + 1}: {move.player} at position {move.position}
                      </p>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
