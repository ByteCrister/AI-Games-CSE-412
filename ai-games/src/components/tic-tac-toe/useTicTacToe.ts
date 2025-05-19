"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Player, AIDifficulty } from './types';
import { checkWinner, isBoardFull, getAIMove } from './GameLogic';

const initialGameState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  status: 'playing',
  winner: null,
  winningLine: null,
};

interface MoveHistory {
  board: (Player | null)[];
  player: Player;
  position: number;
}

interface GameStats {
  player: number;
  ai: number;
  draws: number;
  totalGames: number;
  averageMovesPerGame: number;
  totalMoves: number;
}

export function useTicTacToe(difficulty: AIDifficulty) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
  const [moveHistory, setMoveHistory] = useState<MoveHistory[]>([]);
  const [stats, setStats] = useState<GameStats>({
    player: 0,
    ai: 0,
    draws: 0,
    totalGames: 0,
    averageMovesPerGame: 0,
    totalMoves: 0,
  });
  const [isAIMoving, setIsAIMoving] = useState(false);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAIMovingRef = useRef(false);
  const gameStateRef = useRef(gameState);

  // Keep gameStateRef in sync with gameState
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const resetGame = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    isAIMovingRef.current = false;
    setIsAIMoving(false);
    setGameState(initialGameState);
    setMoveHistory([]);
  }, []);

  const undoLastMove = useCallback(() => {
    if (moveHistory.length === 0) return;

    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    isAIMovingRef.current = false;
    setIsAIMoving(false);

    const lastMove = moveHistory[moveHistory.length - 1];
    const newHistory = moveHistory.slice(0, -1);
    setMoveHistory(newHistory);

    setGameState(prev => ({
      ...prev,
      board: lastMove.board,
      currentPlayer: lastMove.player,
      status: 'playing',
      winner: null,
      winningLine: null,
    }));
  }, [moveHistory]);

  const updateGameState = useCallback((newBoard: (Player | null)[]) => {
    const { winner, winningLine } = checkWinner(newBoard);
    const isDraw = !winner && isBoardFull(newBoard);

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
      status: winner || isDraw ? (winner ? 'won' : 'draw') : 'playing',
      winner: winner || null,
      winningLine: winningLine || null,
    }));

    if (winner || isDraw) {
      setStats(prev => {
        const newStats = {
          player: winner === 'X' ? prev.player + 1 : prev.player,
          ai: winner === 'O' ? prev.ai + 1 : prev.ai,
          draws: isDraw ? prev.draws + 1 : prev.draws,
          totalGames: prev.totalGames + 1,
          totalMoves: prev.totalMoves + moveHistory.length + 1,
          averageMovesPerGame: (prev.totalMoves + moveHistory.length + 1) / (prev.totalGames + 1),
        };
        setScores({
          player: newStats.player,
          ai: newStats.ai,
          draws: newStats.draws,
        });
        return newStats;
      });
    }
  }, [moveHistory.length]);

  const makeMove = useCallback((index: number) => {
    if (
      gameState.board[index] !== null ||
      gameState.status !== 'playing' ||
      (gameState.currentPlayer === 'O' && difficulty !== 'pvp') ||
      isAIMovingRef.current
    ) {
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    setMoveHistory(prev => [
      ...prev,
      {
        board: [...gameState.board],
        player: gameState.currentPlayer,
        position: index,
      },
    ]);

    updateGameState(newBoard);
  }, [gameState, difficulty, updateGameState]);

  const makeAIMove = useCallback(() => {
    const currentState = gameStateRef.current;
    
    if (
      currentState.status !== 'playing' ||
      currentState.currentPlayer !== 'O' ||
      difficulty === 'pvp' ||
      isAIMovingRef.current
    ) {
      return;
    }

    isAIMovingRef.current = true;
    setIsAIMoving(true);

    const aiMove = getAIMove([...currentState.board], difficulty, 'O');
    
    if (
      typeof aiMove === 'number' &&
      aiMove >= 0 &&
      aiMove < 9 &&
      currentState.board[aiMove] === null
    ) {
      aiTimeoutRef.current = setTimeout(() => {
        const newBoard = [...currentState.board];
        newBoard[aiMove] = 'O';
        
        setMoveHistory(prev => [
          ...prev,
          {
            board: [...currentState.board],
            player: 'O',
            position: aiMove,
          },
        ]);

        updateGameState(newBoard);
        isAIMovingRef.current = false;
        setIsAIMoving(false);
        aiTimeoutRef.current = null;
      }, 500);
    } else {
      console.warn('Invalid AI move:', aiMove);
      isAIMovingRef.current = false;
      setIsAIMoving(false);
    }
  }, [difficulty, updateGameState]);

  useEffect(() => {
    if (gameState.currentPlayer === 'O' && difficulty !== 'pvp') {
      makeAIMove();
    }

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
      isAIMovingRef.current = false;
      setIsAIMoving(false);
    };
  }, [gameState.currentPlayer, difficulty, makeAIMove]);

  return {
    gameState,
    scores,
    stats,
    moveHistory,
    makeMove,
    resetGame,
    undoLastMove,
    isAIMoving,
  };
} 