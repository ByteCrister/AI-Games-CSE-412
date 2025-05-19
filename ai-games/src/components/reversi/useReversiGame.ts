import { useState, useCallback, useEffect } from 'react';
import { GameState, Position, Difficulty } from './types';
import {
  createInitialBoard,
  makeMove,
  getValidMoves,
  calculateScores,
  isGameOver,
  getWinner,
  isValidMove
} from './GameLogic';
import { getAIMove } from './AILogic';

const INITIAL_STATE: GameState = {
  board: createInitialBoard(),
  currentPlayer: 'black',
  scores: { black: 2, white: 2 },
  gameOver: false,
  winner: null,
  lastMove: null,
  validMoves: []
};

export const useReversiGame = (difficulty: Difficulty = 'medium') => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialBoard = createInitialBoard();
    return {
      ...INITIAL_STATE,
      board: initialBoard,
      validMoves: getValidMoves(initialBoard, 'black')
    };
  });
  const [moveHistory, setMoveHistory] = useState<GameState[]>([]);

  const updateGameState = useCallback((newState: Partial<GameState>) => {
    setGameState(prev => {
      const updated = { ...prev, ...newState };
      const scores = calculateScores(updated.board);
      const validMoves = getValidMoves(updated.board, updated.currentPlayer);
      
      return {
        ...updated,
        scores,
        validMoves,
        gameOver: isGameOver(updated.board),
        winner: isGameOver(updated.board) ? getWinner(scores) : null
      };
    });
  }, []);

  const handleMove = useCallback((position: Position) => {
    const { board, currentPlayer, gameOver } = gameState;
    
    // Don't allow moves if game is over
    if (gameOver) return;
    
    // Validate move
    if (!isValidMove(board, position, currentPlayer)) {
      return;
    }

    // Save current state to history before making the move
    setMoveHistory(prev => [...prev, { ...gameState }]);

    // Make player's move
    const newBoard = makeMove(board, position, currentPlayer);
    const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
    
    updateGameState({
      board: newBoard,
      currentPlayer: nextPlayer,
      lastMove: position
    });
  }, [gameState, updateGameState]);

  const handleAIMove = useCallback(async () => {
    const { board, currentPlayer, validMoves, gameOver } = gameState;
    
    if (currentPlayer === 'white' && validMoves.length > 0 && !gameOver) {
      // Add a small delay for realism
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const aiMove = getAIMove(board, validMoves, difficulty);
      if (aiMove) {
        handleMove(aiMove);
      }
    }
  }, [gameState, handleMove, difficulty]);

  const restart = useCallback(() => {
    const initialBoard = createInitialBoard();
    setGameState({
      ...INITIAL_STATE,
      board: initialBoard,
      validMoves: getValidMoves(initialBoard, 'black')
    });
    setMoveHistory([]);
  }, []);

  const undo = useCallback(() => {
    if (moveHistory.length > 0) {
      // Get the last state from history
      const previousState = moveHistory[moveHistory.length - 1];
      
      // Update game state with the previous state
      setGameState(previousState);
      
      // Remove the last state from history
      setMoveHistory(prev => prev.slice(0, -1));
    }
  }, [moveHistory]);

  // Handle AI moves
  useEffect(() => {
    if (!gameState.gameOver && gameState.currentPlayer === 'white') {
      handleAIMove();
    }
  }, [gameState.currentPlayer, gameState.gameOver, handleAIMove]);

  return {
    gameState,
    handleMove,
    restart,
    undo,
    validMoves: gameState.validMoves,
    canUndo: moveHistory.length > 0
  };
}; 