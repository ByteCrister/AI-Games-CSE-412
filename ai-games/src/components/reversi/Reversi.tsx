'use client';

import { useEffect } from 'react';
import { Board } from './Board';
import { ScoreBoard } from './ScoreBoard';
import { GameControls } from './GameControls';
import { useReversiGame } from './useReversiGame';
import { Difficulty } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useParams, useRouter } from 'next/navigation';

export default function Reversi() {
    const params = useParams();
    const router = useRouter();
    const difficulty = params.difficulty as Difficulty;
    const {
        gameState,
        handleMove,
        restart,
        undo,
        validMoves,
        canUndo
    } = useReversiGame(difficulty);

    const handleNewGame = () => {
        router.push('/reversi');
    };

    // Announce game state changes for screen readers
    useEffect(() => {
        if (gameState.gameOver) {
            const message = gameState.winner === 'draw'
                ? "Game over! It's a draw!"
                : `Game over! ${gameState.winner === 'black' ? 'You' : 'AI'} won!`;
            const announcement = new SpeechSynthesisUtterance(message);
            window.speechSynthesis.speak(announcement);
        }
    }, [gameState.gameOver, gameState.winner]);

    return (
        <main
            className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center"
            role="main"
            aria-label="Reversi game"
        >
            <div className="max-w-4xl w-full space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Reversi - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </h1>

                <ScoreBoard
                    scores={gameState.scores}
                    currentPlayer={gameState.currentPlayer}
                />

                <div className="flex justify-center">
                    <Board
                        board={gameState.board}
                        validMoves={validMoves}
                        lastMove={gameState.lastMove}
                        onCellClick={handleMove}
                    />
                </div>

                <GameControls
                    onRestart={restart}
                    onNewGame={handleNewGame}
                    onUndo={undo}
                    canUndo={canUndo}
                />

                {gameState.gameOver && (
                    <Alert
                        className="text-center animate-in fade-in slide-in-from-bottom-4"
                        role="alert"
                    >
                        <AlertDescription className="text-lg font-semibold">
                            {gameState.winner === 'draw'
                                ? "It's a draw!"
                                : `Game Over! ${gameState.winner === 'black' ? 'You' : 'AI'} won!`}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </main>
    );
}