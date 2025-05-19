"use client";

import { useState, useCallback } from 'react';
import { GameState, Square, GameMode, AIDifficulty } from './types';
import { initializeBoard, getValidMoves, makeMove } from './GameLogic';
import { getAIMove } from './AI';

export function useChessGame(mode: GameMode, aiDifficulty: AIDifficulty = 'medium') {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: initializeBoard(),
    currentTurn: 'white',
    selectedSquare: null,
    validMoves: [],
    moveHistory: [],
    isCheck: false,
    isCheckmate: false,
  }));

  const handleSquareClick = useCallback((square: Square) => {
    setGameState(prevState => {
      // If a square is already selected
      if (prevState.selectedSquare) {
        // If clicking the same square, deselect it
        if (prevState.selectedSquare === square) {
          return {
            ...prevState,
            selectedSquare: null,
            validMoves: [],
          };
        }

        // If clicking a valid move square
        if (prevState.validMoves.includes(square)) {
          const newState = makeMove(prevState.selectedSquare, square, prevState);
          
          // If it's AI's turn and we're in AI mode, make AI move
          if (mode === 'ai' && newState.currentTurn === 'black') {
            setTimeout(() => {
              const aiMove = getAIMove(newState, aiDifficulty);
              setGameState(prev => makeMove(aiMove.from, aiMove.to, prev));
            }, 500);
          }

          return newState;
        }

        // If clicking a different piece of the same color, select that piece
        const piece = prevState.board[square];
        if (piece && piece.color === prevState.currentTurn) {
          return {
            ...prevState,
            selectedSquare: square,
            validMoves: getValidMoves(square, prevState),
          };
        }

        // If clicking an invalid square, deselect
        return {
          ...prevState,
          selectedSquare: null,
          validMoves: [],
        };
      }

      // If no square is selected, select the clicked square if it has a piece
      const piece = prevState.board[square];
      if (piece && piece.color === prevState.currentTurn) {
        return {
          ...prevState,
          selectedSquare: square,
          validMoves: getValidMoves(square, prevState),
        };
      }

      return prevState;
    });
  }, [mode, aiDifficulty]);

  const handleRestart = useCallback(() => {
    setGameState({
      board: initializeBoard(),
      currentTurn: 'white',
      selectedSquare: null,
      validMoves: [],
      moveHistory: [],
      isCheck: false,
      isCheckmate: false,
    });
  }, []);

  const handleUndo = useCallback(() => {
    setGameState(prevState => {
      if (prevState.moveHistory.length === 0) return prevState;

      const lastMove = prevState.moveHistory[prevState.moveHistory.length - 1];
      const newBoard = { ...prevState.board };
      
      // Restore the moved piece to its original position
      newBoard[lastMove.from] = { ...lastMove.piece, hasMoved: lastMove.piece.hasMoved };
      
      // Restore the captured piece if any
      if (lastMove.capturedPiece) {
        newBoard[lastMove.to] = { ...lastMove.capturedPiece };
      } else {
        newBoard[lastMove.to] = null;
      }

      // Handle castling undo
      if (lastMove.isCastling) {
        const fromRank = lastMove.from[1];
        if (lastMove.to[0] === 'g') {
          // Kingside castling undo
          newBoard[`h${fromRank}` as Square] = { type: 'rook', color: lastMove.piece.color, hasMoved: false };
          newBoard[`f${fromRank}` as Square] = null;
        } else if (lastMove.to[0] === 'c') {
          // Queenside castling undo
          newBoard[`a${fromRank}` as Square] = { type: 'rook', color: lastMove.piece.color, hasMoved: false };
          newBoard[`d${fromRank}` as Square] = null;
        }
      }

      return {
        ...prevState,
        board: newBoard,
        currentTurn: prevState.currentTurn === 'white' ? 'black' : 'white',
        selectedSquare: null,
        validMoves: [],
        moveHistory: prevState.moveHistory.slice(0, -1),
        isCheck: false,
        isCheckmate: false,
      };
    });
  }, []);

  const handleResign = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isCheckmate: true,
      currentTurn: prevState.currentTurn === 'white' ? 'black' : 'white',
    }));
  }, []);

  return {
    gameState,
    handleSquareClick,
    handleRestart,
    handleUndo,
    handleResign,
  };
} 