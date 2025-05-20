"use client";

import { useState, useCallback, useEffect } from 'react';
import { GameState, Square, AIDifficulty, TurnOrder, PieceColor, Move, Piece } from './types';
import { initializeBoard, getValidMoves } from './GameLogic';
import { getAIMove } from './AI';

// Helper functions
function findKingPosition(board: Record<Square, Piece | null>, color: PieceColor): Square | null {
  for (const [square, piece] of Object.entries(board)) {
    if (piece?.type === 'king' && piece.color === color) {
      return square as Square;
    }
  }
  return null;
}

function isSquareUnderAttack(
  board: Record<Square, Piece | null>,
  square: Square,
  attackingColor: PieceColor
): boolean {
  for (const [fromSquare, piece] of Object.entries(board)) {
    if (piece && piece.color === attackingColor) {
      const validMoves = getValidMoves(fromSquare as Square, { board, currentTurn: attackingColor } as GameState);
      if (validMoves.includes(square)) {
        return true;
      }
    }
  }
  return false;
}

function isInCheck(gameState: GameState, color: PieceColor): boolean {
  const kingSquare = findKingPosition(gameState.board, color);
  if (!kingSquare) return false;

  const opponentColor = color === 'white' ? 'black' : 'white';
  return isSquareUnderAttack(gameState.board, kingSquare, opponentColor);
}

function canMoveOutOfCheck(gameState: GameState, color: PieceColor): boolean {
  // Try all possible moves for all pieces of the given color
  for (const [fromSquare, piece] of Object.entries(gameState.board)) {
    if (piece && piece.color === color) {
      const validMoves = getValidMoves(fromSquare as Square, gameState);

      // Try each valid move
      for (const toSquare of validMoves) {
        // Create a copy of the board for testing the move
        const testBoard = { ...gameState.board } as Record<Square, Piece | null>;
        const fromPiece = testBoard[fromSquare as Square];

        // Make the move on the test board
        testBoard[toSquare] = fromPiece;
        delete testBoard[fromSquare as Square];

        // Check if the king is still in check after this move
        const kingSquare = findKingPosition(testBoard, color);
        if (kingSquare) {
          const opponentColor = color === 'white' ? 'black' : 'white';
          if (!isSquareUnderAttack(testBoard, kingSquare, opponentColor)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function isCheckmate(gameState: GameState, color: PieceColor): boolean {
  // First check if the king is in check
  if (!isInCheck(gameState, color)) {
    return false;
  }

  // If the king is in check, check if any move can get out of check
  return !canMoveOutOfCheck(gameState, color);
}

function makeMoveOnBoard(
  board: Record<Square, Piece | null>,
  from: Square,
  to: Square
): Record<Square, Piece | null> {
  const newBoard = { ...board } as Record<Square, Piece | null>;
  newBoard[to] = newBoard[from];
  delete newBoard[from];
  return newBoard;
}

function isKingKilled(board: Record<Square, Piece | null>, color: PieceColor): boolean {
  // Check if the king of the given color exists on the board
  for (const piece of Object.values(board)) {
    if (piece?.type === 'king' && piece.color === color) {
      return false; // King is still alive
    }
  }
  return true; // King is not found, meaning it was killed
}

export function useChessGame(difficulty: AIDifficulty = 'medium', turnOrder: TurnOrder = 'player') {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: initializeBoard(),
    currentTurn: 'white' as PieceColor,
    selectedSquare: null,
    validMoves: [] as Move[],
    moveHistory: [] as Move[],
    isCheck: false,
    isCheckmate: false,
    isResigned: false,
  }));

  // Effect to handle AI's first move
  useEffect(() => {
    if (turnOrder === 'ai' && gameState.currentTurn === 'white' && gameState.moveHistory.length === 0) {
      setTimeout(() => {
        setGameState(prev => {
          try {
            const aiMove = getAIMove(prev, difficulty);
            if (aiMove) {
              const newBoard = makeMoveOnBoard(prev.board, aiMove.from, aiMove.to);
              const newState: GameState = {
                ...prev,
                board: newBoard,
                currentTurn: 'black',
                moveHistory: [...prev.moveHistory, aiMove],
              };

              // Check if a king was killed
              const isWhiteKingKilled = isKingKilled(newBoard, 'white');
              const isBlackKingKilled = isKingKilled(newBoard, 'black');

              if (isWhiteKingKilled || isBlackKingKilled) {
                return {
                  ...newState,
                  isCheckmate: true,
                  isCheck: true,
                };
              }

              const isInCheckState = isInCheck(newState, newState.currentTurn);
              const isCheckmateState = isInCheckState && isCheckmate(newState, newState.currentTurn);

              return {
                ...newState,
                isCheck: isInCheckState,
                isCheckmate: isCheckmateState,
              };
            }
          } catch (error) {
            console.error('Error making AI move:', error);
          }
          return prev;
        });
      }, 500);
    }
  }, [turnOrder, difficulty, gameState.currentTurn, gameState.moveHistory.length]);

  const handleSquareClick = useCallback((square: Square) => {
    setGameState(prevState => {
      // If it's AI's turn, ignore player clicks
      const isPlayerTurn = (turnOrder === 'player' && prevState.currentTurn === 'white') ||
        (turnOrder === 'ai' && prevState.currentTurn === 'black');

      // Prevent any moves if the game is over
      if (!isPlayerTurn || prevState.isCheckmate || prevState.isResigned) {
        return prevState;
      }

      // If a square is already selected
      if (prevState.selectedSquare) {
        // If clicking the same square, deselect it
        if (prevState.selectedSquare === square) {
          return {
            ...prevState,
            selectedSquare: null,
            validMoves: [] as Move[],
          };
        }

        // If clicking a valid move square
        const validMove = prevState.validMoves.find(move => move.to === square);
        if (validMove) {
          const newBoard = makeMoveOnBoard(prevState.board, prevState.selectedSquare, square);
          const newState: GameState = {
            ...prevState,
            board: newBoard,
            currentTurn: prevState.currentTurn === 'white' ? 'black' : 'white',
            selectedSquare: null,
            validMoves: [] as Move[],
            moveHistory: [...prevState.moveHistory, validMove],
          };

          // Check if a king was killed
          const isWhiteKingKilled = isKingKilled(newBoard, 'white');
          const isBlackKingKilled = isKingKilled(newBoard, 'black');

          if (isWhiteKingKilled || isBlackKingKilled) {
            return {
              ...newState,
              isCheckmate: true,
              isCheck: true,
            };
          }

          const isInCheckState = isInCheck(newState, newState.currentTurn);
          const isCheckmateState = isInCheckState && isCheckmate(newState, newState.currentTurn);

          const updatedState = {
            ...newState,
            isCheck: isInCheckState,
            isCheckmate: isCheckmateState,
          };

          // If it's AI's turn after player's move and the game isn't over, make AI move
          const isAITurn = (turnOrder === 'player' && updatedState.currentTurn === 'black') ||
            (turnOrder === 'ai' && updatedState.currentTurn === 'white');

          if (isAITurn && !updatedState.isCheckmate && !updatedState.isResigned) {
            setTimeout(() => {
              setGameState(prev => {
                try {
                  const aiMove = getAIMove(prev, difficulty);
                  if (aiMove) {
                    const aiBoard = makeMoveOnBoard(prev.board, aiMove.from, aiMove.to);
                    const aiState: GameState = {
                      ...prev,
                      board: aiBoard,
                      currentTurn: prev.currentTurn === 'white' ? 'black' : 'white',
                      moveHistory: [...prev.moveHistory, aiMove],
                    };

                    // Check if a king was killed
                    const isWhiteKingKilled = isKingKilled(aiBoard, 'white');
                    const isBlackKingKilled = isKingKilled(aiBoard, 'black');

                    if (isWhiteKingKilled || isBlackKingKilled) {
                      return {
                        ...aiState,
                        isCheckmate: true,
                        isCheck: true,
                      };
                    }

                    const aiInCheck = isInCheck(aiState, aiState.currentTurn);
                    const aiCheckmate = aiInCheck && isCheckmate(aiState, aiState.currentTurn);

                    return {
                      ...aiState,
                      isCheck: aiInCheck,
                      isCheckmate: aiCheckmate,
                    };
                  }
                } catch (error) {
                  console.error('Error making AI move:', error);
                }
                return prev;
              });
            }, 500);
          }

          return updatedState;
        }

        // If clicking a different piece of the same color, select that piece
        const piece = prevState.board[square];
        if (piece && piece.color === prevState.currentTurn) {
          const validSquares = getValidMoves(square, prevState);
          const validMoves: Move[] = validSquares.map(to => ({
            from: square,
            to,
            piece,
            capturedPiece: prevState.board[to] || undefined,
          }));
          return {
            ...prevState,
            selectedSquare: square,
            validMoves,
          };
        }

        // If clicking an invalid square, deselect
        return {
          ...prevState,
          selectedSquare: null,
          validMoves: [] as Move[],
        };
      }

      // If no square is selected, select the clicked square if it has a piece
      const piece = prevState.board[square];
      if (piece && piece.color === prevState.currentTurn) {
        const validSquares = getValidMoves(square, prevState);
        const validMoves: Move[] = validSquares.map(to => ({
          from: square,
          to,
          piece,
          capturedPiece: prevState.board[to] || undefined,
        }));
        return {
          ...prevState,
          selectedSquare: square,
          validMoves,
        };
      }

      return prevState;
    });
  }, [difficulty, turnOrder]);

  const handleRestart = useCallback(() => {
    setGameState({
      board: initializeBoard(),
      currentTurn: 'white' as PieceColor,
      selectedSquare: null,
      validMoves: [] as Move[],
      moveHistory: [] as Move[],
      isCheck: false,
      isCheckmate: false,
      isResigned: false,
    });
  }, []);

  const handleUndo = useCallback(() => {
    setGameState(prevState => {
      if (prevState.moveHistory.length < 2) return prevState;

      // Remove last two moves (player's and AI's)
      const newMoveHistory = prevState.moveHistory.slice(0, -2);

      // Reset the board and replay all moves except the last two
      let newState: GameState = {
        ...prevState,
        board: initializeBoard(),
        moveHistory: newMoveHistory,
        currentTurn: 'white' as PieceColor,
        selectedSquare: null,
        validMoves: [] as Move[],
        isCheck: false,
        isCheckmate: false,
      };

      // Replay all moves
      newMoveHistory.forEach(move => {
        newState = {
          ...newState,
          board: makeMoveOnBoard(newState.board, move.from, move.to),
          currentTurn: newState.currentTurn === 'white' ? 'black' : 'white',
        };
      });

      // Update check and checkmate status
      newState.isCheck = isInCheck(newState, newState.currentTurn);
      newState.isCheckmate = newState.isCheck && isCheckmate(newState, newState.currentTurn);

      return newState;
    });
  }, []);

  const handleResign = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isResigned: true,
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