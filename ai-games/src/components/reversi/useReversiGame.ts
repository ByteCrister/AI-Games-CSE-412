import { useState, useCallback, useEffect, useRef } from 'react';
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
  const [isProcessingMove, setIsProcessingMove] = useState(false);
  const gameStateRef = useRef(gameState);

  // Keep gameStateRef in sync with gameState
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const updateGameState = useCallback((newState: Partial<GameState>) => {
    setGameState(prev => {
      const updated = { ...prev, ...newState };
      const scores = calculateScores(updated.board);
      const validMoves = getValidMoves(updated.board, updated.currentPlayer);
      const gameOver = isGameOver(updated.board);

      return {
        ...updated,
        scores,
        validMoves,
        gameOver,
        winner: gameOver ? getWinner(scores) : null
      };
    });
  }, []);

  const saveToHistory = useCallback((state: GameState) => {
    setMoveHistory(prev => [...prev, { ...state }]);
  }, []);

  const handleMove = useCallback((position: Position) => {
    const { board, currentPlayer, gameOver } = gameState;

    // Don't allow moves if game is over or a move is being processed
    if (gameOver || isProcessingMove) return;

    // Validate move
    if (!isValidMove(board, position, currentPlayer)) {
      return;
    }

    setIsProcessingMove(true);

    // Save current state to history before making the move
    saveToHistory({
      ...gameState,
      validMoves: getValidMoves(board, currentPlayer)
    });

    // Make player's move
    const newBoard = makeMove(board, position, currentPlayer);
    const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
    const nextValidMoves = getValidMoves(newBoard, nextPlayer);

    // If next player has no valid moves, switch back to current player
    const finalPlayer = nextValidMoves.length === 0 ? currentPlayer : nextPlayer;
    const finalValidMoves = nextValidMoves.length === 0 ? 
      getValidMoves(newBoard, currentPlayer) : nextValidMoves;

    updateGameState({
      board: newBoard,
      currentPlayer: finalPlayer,
      lastMove: position,
      validMoves: finalValidMoves
    });

    setIsProcessingMove(false);
  }, [gameState, updateGameState, isProcessingMove, saveToHistory]);

  const handleAIMove = useCallback(async () => {
    const currentState = gameStateRef.current;
    const { board, currentPlayer, validMoves, gameOver } = currentState;

    if (currentPlayer === 'white' && validMoves.length > 0 && !gameOver && !isProcessingMove) {
      setIsProcessingMove(true);

      // Add a small delay for realism
      await new Promise(resolve => setTimeout(resolve, 500));

      // Save current state to history before AI move
      saveToHistory({
        ...currentState,
        validMoves: getValidMoves(board, currentPlayer)
      });

      const aiMove = getAIMove(board, validMoves, difficulty);
      if (aiMove) {
        const newBoard = makeMove(board, aiMove, currentPlayer);
        const nextPlayer = 'black';
        const nextValidMoves = getValidMoves(newBoard, nextPlayer);

        // If next player has no valid moves, switch back to AI
        const finalPlayer = nextValidMoves.length === 0 ? currentPlayer : nextPlayer;
        const finalValidMoves = nextValidMoves.length === 0 ? 
          getValidMoves(newBoard, currentPlayer) : nextValidMoves;

        const scores = calculateScores(newBoard);
        const gameIsOver = isGameOver(newBoard);

        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: finalPlayer,
          lastMove: aiMove,
          scores,
          validMoves: finalValidMoves,
          gameOver: gameIsOver,
          winner: gameIsOver ? getWinner(scores) : null
        }));
      }

      setIsProcessingMove(false);
    }
  }, [difficulty, isProcessingMove, saveToHistory]);

  const undo = useCallback(() => {
    if (moveHistory.length > 0 && !isProcessingMove) {
      setIsProcessingMove(true);

      // Get the last state from history
      const previousState = moveHistory[moveHistory.length - 1];

      // Update game state with the previous state
      setGameState({
        ...previousState,
        validMoves: getValidMoves(previousState.board, previousState.currentPlayer)
      });

      // Remove the last state from history
      setMoveHistory(prev => prev.slice(0, -1));

      setIsProcessingMove(false);
    }
  }, [moveHistory, isProcessingMove]);

  const restart = useCallback(() => {
    const initialBoard = createInitialBoard();
    const initialValidMoves = getValidMoves(initialBoard, 'black');
    
    setGameState({
      ...INITIAL_STATE,
      board: initialBoard,
      validMoves: initialValidMoves
    });
    setMoveHistory([]);
    setIsProcessingMove(false);
  }, []);

  // Handle AI moves
  useEffect(() => {
    const currentState = gameStateRef.current;
    if (!currentState.gameOver && 
        currentState.currentPlayer === 'white' && 
        !isProcessingMove && 
        currentState.validMoves.length > 0) {
      handleAIMove();
    }
  }, [gameState.currentPlayer, gameState.gameOver, handleAIMove, isProcessingMove]);

  return {
    gameState,
    handleMove,
    restart,
    undo,
    validMoves: gameState.validMoves,
    canUndo: moveHistory.length > 0 && !isProcessingMove
  };
}; 