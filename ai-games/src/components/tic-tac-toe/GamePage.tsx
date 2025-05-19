'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTicTacToe } from './useTicTacToe';
import { GameBoard } from './GameBoard';
import { ScorePanel } from './ScorePanel';
import { Button } from '@/components/ui/button';
import { AIDifficulty, FirstPlayer } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

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
    firstPlayer,
    setFirstPlayerAndReset,
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-5xl flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-4">
          <Image
            src="/images/tic-tac-toe.png"
            alt="Tic Tac Toe"
            width={48}
            height={48}
            className="rounded-lg shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-900">
            Tic-Tac-Toe - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </h1>
        </div>

        <div className="w-full grid grid-cols-1 gap-8">
          {/* Left Column: Game + Controls */}
          <div className="flex flex-col items-center gap-6">
            <ScorePanel
              playerScore={scores.player}
              aiScore={scores.ai}
              draws={scores.draws}
            />

            {gameState.status === 'playing' && moveHistory.length === 0 && (
              <Card className="w-full max-w-[400px] bg-white/80 backdrop-blur-sm shadow-lg border-2 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-gray-800">Choose who goes first</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={firstPlayer}
                    onValueChange={(value) => setFirstPlayerAndReset(value as FirstPlayer)}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <RadioGroupItem value="player" id="player-first" className="h-5 w-5" />
                      <Label htmlFor="player-first" className="text-lg font-medium text-gray-700 cursor-pointer">
                        Player goes first
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <RadioGroupItem value="ai" id="ai-first" className="h-5 w-5" />
                      <Label htmlFor="ai-first" className="text-lg font-medium text-gray-700 cursor-pointer">
                        AI goes first
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            <p className="text-xl font-semibold text-gray-700 bg-white/80 px-6 py-2 rounded-full shadow-sm">
              {getStatusMessage()}
            </p>

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
                id='restart-tic-tac-toe'
                onClick={() => router.push('/tic-tac-toe')}
                disabled={isAIMoving}
                className="hover:bg-gray-100 transition-colors"
              >
                Restart
              </Button>
              <Button
                id='new-game'
                onClick={resetGame}
                disabled={isAIMoving}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                New Game
              </Button>
              <Button
                variant="outline"
                id='undo-move'
                onClick={undoLastMove}
                disabled={moveHistory.length === 0 || isAIMoving}
                className="hover:bg-gray-100 transition-colors"
              >
                Undo Move
              </Button>
            </div>
          </div>

          {/* Stats + History */}
          <div className="flex flex-col gap-4 items-center">
            <Card className="w-full md:w-[50%] bg-white/80 backdrop-blur-sm shadow-lg border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Game Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-left">
                  <p className="text-gray-700">Total Games: {stats.totalGames}</p>
                  <p className="text-gray-700">Total Moves: {stats.totalMoves}</p>
                  <p className="text-gray-700">Average Moves per Game: {stats.averageMovesPerGame.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full md:w-[50%] bg-white/80 backdrop-blur-sm shadow-lg border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Move History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-left max-h-60 overflow-y-auto">
                  {moveHistory.length === 0 ? (
                    <p className="text-sm text-gray-500">No moves yet.</p>
                  ) : (
                    moveHistory.map((move, index) => (
                      <p key={index} className="text-gray-700">
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
