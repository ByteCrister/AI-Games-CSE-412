import { Square, Piece, GameState, PieceType, PieceColor } from './types';

export function initializeBoard(): Record<Square, Piece | null> {
  const board: Record<Square, Piece | null> = {} as Record<Square, Piece | null>;
  
  // Initialize empty board
  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      const square = `${String.fromCharCode(97 + file)}${rank + 1}` as Square;
      board[square] = null;
    }
  }

  // Set up pawns
  for (let file = 0; file < 8; file++) {
    const whitePawnSquare = `${String.fromCharCode(97 + file)}2` as Square;
    const blackPawnSquare = `${String.fromCharCode(97 + file)}7` as Square;
    board[whitePawnSquare] = { type: 'pawn', color: 'white', hasMoved: false };
    board[blackPawnSquare] = { type: 'pawn', color: 'black', hasMoved: false };
  }

  // Set up other pieces
  const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let file = 0; file < 8; file++) {
    const whitePieceSquare = `${String.fromCharCode(97 + file)}1` as Square;
    const blackPieceSquare = `${String.fromCharCode(97 + file)}8` as Square;
    board[whitePieceSquare] = { type: pieceOrder[file], color: 'white', hasMoved: false };
    board[blackPieceSquare] = { type: pieceOrder[file], color: 'black', hasMoved: false };
  }

  return board;
}

export function getValidMoves(
  square: Square,
  gameState: GameState
): Square[] {
  const piece = gameState.board[square];
  if (!piece) return [];

  const moves: Square[] = [];

  switch (piece.type) {
    case 'pawn':
      addPawnMoves(moves, square, piece, gameState);
      break;
    case 'knight':
      addKnightMoves(moves, square, piece, gameState);
      break;
    case 'bishop':
      addBishopMoves(moves, square, piece, gameState);
      break;
    case 'rook':
      addRookMoves(moves, square, piece, gameState);
      break;
    case 'queen':
      addQueenMoves(moves, square, piece, gameState);
      break;
    case 'king':
      addKingMoves(moves, square, piece, gameState);
      break;
  }

  return moves;
}

// Helper functions for move generation
function addPawnMoves(
  moves: Square[],
  square: Square,
  piece: Piece,
  gameState: GameState
) {
  const [file, rank] = square.split('');
  const direction = piece.color === 'white' ? 1 : -1;
  const newRank = parseInt(rank) + direction;

  // Forward move
  if (newRank >= 1 && newRank <= 8) {
    const forwardSquare = `${file}${newRank}` as Square;
    if (!gameState.board[forwardSquare]) {
      moves.push(forwardSquare);
      
      // Double move from starting position
      if ((piece.color === 'white' && rank === '2') || 
          (piece.color === 'black' && rank === '7')) {
        const doubleSquare = `${file}${newRank + direction}` as Square;
        if (!gameState.board[doubleSquare]) {
          moves.push(doubleSquare);
        }
      }
    }
  }

  // Captures
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  [-1, 1].forEach(offset => {
    const newFileIndex = fileIndex + offset;
    if (newFileIndex >= 0 && newFileIndex < 8) {
      const captureSquare = `${String.fromCharCode('a'.charCodeAt(0) + newFileIndex)}${newRank}` as Square;
      const targetPiece = gameState.board[captureSquare];
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push(captureSquare);
      }
    }
  });
}

function addKnightMoves(moves: Square[], square: Square, piece: Piece, gameState: GameState) {
  const [file, rank] = square.split('');
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankIndex = parseInt(rank) - 1;

  // All possible knight moves
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  knightMoves.forEach(([fileOffset, rankOffset]) => {
    const newFileIndex = fileIndex + fileOffset;
    const newRankIndex = rankIndex + rankOffset;

    if (newFileIndex >= 0 && newFileIndex < 8 && newRankIndex >= 0 && newRankIndex < 8) {
      const newFile = String.fromCharCode('a'.charCodeAt(0) + newFileIndex);
      const newRank = (newRankIndex + 1).toString();
      const targetSquare = `${newFile}${newRank}` as Square;
      const targetPiece = gameState.board[targetSquare];

      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(targetSquare);
      }
    }
  });
}

function addBishopMoves(moves: Square[], square: Square, piece: Piece, gameState: GameState) {
  const [file, rank] = square.split('');
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankIndex = parseInt(rank) - 1;

  // Diagonal directions: top-left, top-right, bottom-left, bottom-right
  const directions = [
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  directions.forEach(([fileDir, rankDir]) => {
    let newFileIndex = fileIndex + fileDir;
    let newRankIndex = rankIndex + rankDir;

    while (newFileIndex >= 0 && newFileIndex < 8 && newRankIndex >= 0 && newRankIndex < 8) {
      const newFile = String.fromCharCode('a'.charCodeAt(0) + newFileIndex);
      const newRank = (newRankIndex + 1).toString();
      const targetSquare = `${newFile}${newRank}` as Square;
      const targetPiece = gameState.board[targetSquare];

      if (!targetPiece) {
        moves.push(targetSquare);
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push(targetSquare);
        }
        break;
      }

      newFileIndex += fileDir;
      newRankIndex += rankDir;
    }
  });
}

function addRookMoves(moves: Square[], square: Square, piece: Piece, gameState: GameState) {
  const [file, rank] = square.split('');
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankIndex = parseInt(rank) - 1;

  // Horizontal and vertical directions
  const directions = [
    [0, -1], [0, 1], [-1, 0], [1, 0]
  ];

  directions.forEach(([fileDir, rankDir]) => {
    let newFileIndex = fileIndex + fileDir;
    let newRankIndex = rankIndex + rankDir;

    while (newFileIndex >= 0 && newFileIndex < 8 && newRankIndex >= 0 && newRankIndex < 8) {
      const newFile = String.fromCharCode('a'.charCodeAt(0) + newFileIndex);
      const newRank = (newRankIndex + 1).toString();
      const targetSquare = `${newFile}${newRank}` as Square;
      const targetPiece = gameState.board[targetSquare];

      if (!targetPiece) {
        moves.push(targetSquare);
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push(targetSquare);
        }
        break;
      }

      newFileIndex += fileDir;
      newRankIndex += rankDir;
    }
  });
}

function addQueenMoves(moves: Square[], square: Square, piece: Piece, gameState: GameState) {
  // Queen moves are a combination of bishop and rook moves
  addBishopMoves(moves, square, piece, gameState);
  addRookMoves(moves, square, piece, gameState);
}

function addKingMoves(moves: Square[], square: Square, piece: Piece, gameState: GameState) {
  const [file, rank] = square.split('');
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankIndex = parseInt(rank) - 1;

  // All possible king moves (including diagonals)
  const kingMoves = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  kingMoves.forEach(([fileOffset, rankOffset]) => {
    const newFileIndex = fileIndex + fileOffset;
    const newRankIndex = rankIndex + rankOffset;

    if (newFileIndex >= 0 && newFileIndex < 8 && newRankIndex >= 0 && newRankIndex < 8) {
      const newFile = String.fromCharCode('a'.charCodeAt(0) + newFileIndex);
      const newRank = (newRankIndex + 1).toString();
      const targetSquare = `${newFile}${newRank}` as Square;
      const targetPiece = gameState.board[targetSquare];

      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(targetSquare);
      }
    }
  });

  // Add castling moves if king hasn't moved
  if (!piece.hasMoved) {
    // Kingside castling
    const kingsideRook = gameState.board[`h${rank}` as Square];
    if (kingsideRook?.type === 'rook' && !kingsideRook.hasMoved) {
      const canCastle = ['f', 'g'].every(file => !gameState.board[`${file}${rank}` as Square]);
      if (canCastle) {
        moves.push(`g${rank}` as Square);
      }
    }

    // Queenside castling
    const queensideRook = gameState.board[`a${rank}` as Square];
    if (queensideRook?.type === 'rook' && !queensideRook.hasMoved) {
      const canCastle = ['b', 'c', 'd'].every(file => !gameState.board[`${file}${rank}` as Square]);
      if (canCastle) {
        moves.push(`c${rank}` as Square);
      }
    }
  }
}

// Helper function to find king position
function findKingPosition(board: Record<Square, Piece | null>, color: PieceColor): Square | null {
  for (const [square, piece] of Object.entries(board)) {
    if (piece?.type === 'king' && piece.color === color) {
      return square as Square;
    }
  }
  return null;
}

// Helper function to check if a square is under attack
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

// Helper function to check if a king is in check
function isInCheck(board: Record<Square, Piece | null>, color: PieceColor): boolean {
  const kingSquare = findKingPosition(board, color);
  if (!kingSquare) return false;

  const opponentColor = color === 'white' ? 'black' : 'white';
  return isSquareUnderAttack(board, kingSquare, opponentColor);
}

// Helper function to check if a move would put or leave the king in check
function wouldBeInCheck(
  board: Record<Square, Piece | null>,
  from: Square,
  to: Square,
  color: PieceColor
): boolean {
  const newBoard = { ...board };
  newBoard[to] = newBoard[from];
  delete newBoard[from];
  return isInCheck(newBoard, color);
}

// Helper function to check if a player can move out of check
function canMoveOutOfCheck(board: Record<Square, Piece | null>, color: PieceColor): boolean {
  for (const [fromSquare, piece] of Object.entries(board)) {
    if (piece && piece.color === color) {
      const validMoves = getValidMoves(fromSquare as Square, { board, currentTurn: color } as GameState);
      for (const toSquare of validMoves) {
        if (!wouldBeInCheck(board, fromSquare as Square, toSquare, color)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function makeMove(
  from: Square,
  to: Square,
  gameState: GameState
): GameState {
  const piece = gameState.board[from];
  if (!piece) return gameState;

  // Create new board state
  const newBoard = { ...gameState.board };
  newBoard[to] = { ...piece, hasMoved: true };
  delete newBoard[from];

  // Create new game state
  const newState: GameState = {
    ...gameState,
    board: newBoard,
    currentTurn: gameState.currentTurn === 'white' ? 'black' : 'white',
    selectedSquare: null,
    validMoves: [],
  };

  // Check if the move would put the player's own king in check
  if (wouldBeInCheck(gameState.board, from, to, piece.color)) {
    return gameState;
  }

  // Update check and checkmate status
  const isInCheckState = isInCheck(newBoard, newState.currentTurn);
  const isCheckmateState = isInCheckState && !canMoveOutOfCheck(newBoard, newState.currentTurn);

  return {
    ...newState,
    isCheck: isInCheckState,
    isCheckmate: isCheckmateState,
  };
} 