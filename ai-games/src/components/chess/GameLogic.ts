import { Square, Piece, GameState, Move } from './types';

export function initializeBoard(): Record<Square, Piece | null> {
  // Initialize with all squares set to null
  const board = {} as Record<Square, Piece | null>;
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
  // Initialize empty board
  for (let rank = 1; rank <= 8; rank++) {
    for (const file of files) {
      board[`${file}${rank}` as Square] = null;
    }
  }

  // Set up pawns
  for (const file of files) {
    board[`${file}2` as Square] = { type: 'pawn', color: 'white', hasMoved: false };
    board[`${file}7` as Square] = { type: 'pawn', color: 'black', hasMoved: false };
  }

  // Set up other pieces
  const pieces: Piece[] = [
    { type: 'rook', color: 'white', hasMoved: false },
    { type: 'knight', color: 'white', hasMoved: false },
    { type: 'bishop', color: 'white', hasMoved: false },
    { type: 'queen', color: 'white', hasMoved: false },
    { type: 'king', color: 'white', hasMoved: false },
    { type: 'bishop', color: 'white', hasMoved: false },
    { type: 'knight', color: 'white', hasMoved: false },
    { type: 'rook', color: 'white', hasMoved: false },
  ];

  pieces.forEach((piece, index) => {
    const file = files[index];
    board[`${file}1` as Square] = piece;
    board[`${file}8` as Square] = { ...piece, color: 'black' };
  });

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

export function makeMove(
  from: Square,
  to: Square,
  gameState: GameState
): GameState {
  const newState = { ...gameState };
  const piece = gameState.board[from];
  
  if (!piece) return gameState;

  // Create move record
  const move: Move = {
    from,
    to,
    piece,
    capturedPiece: gameState.board[to] || undefined,
  };

  // Update board - create a new board object to ensure immutability
  const newBoard = { ...gameState.board };
  
  // Remove the piece from its original position
  newBoard[from] = null;
  
  // Place the piece in its new position
  newBoard[to] = { ...piece, hasMoved: true };
  
  // Update the board in the new state
  newState.board = newBoard;

  // Handle castling
  if (piece.type === 'king' && !piece.hasMoved) {
    const fromRank = from[1];
    const toFile = to[0];
    
    // Kingside castling
    if (toFile === 'g') {
      const rook = gameState.board[`h${fromRank}` as Square];
      if (rook?.type === 'rook') {
        newState.board[`h${fromRank}` as Square] = null;
        newState.board[`f${fromRank}` as Square] = { ...rook, hasMoved: true };
        move.isCastling = true;
      }
    }
    // Queenside castling
    else if (toFile === 'c') {
      const rook = gameState.board[`a${fromRank}` as Square];
      if (rook?.type === 'rook') {
        newState.board[`a${fromRank}` as Square] = null;
        newState.board[`d${fromRank}` as Square] = { ...rook, hasMoved: true };
        move.isCastling = true;
      }
    }
  }

  // Handle pawn promotion
  if (piece.type === 'pawn' && (to[1] === '8' || to[1] === '1')) {
    newState.board[to] = { type: 'queen', color: piece.color, hasMoved: true };
    move.promotion = 'queen';
  }

  // Update game state
  newState.currentTurn = gameState.currentTurn === 'white' ? 'black' : 'white';
  newState.selectedSquare = null;
  newState.validMoves = [];
  newState.moveHistory = [...gameState.moveHistory, move];

  // Check for check/checkmate
  newState.isCheck = isInCheck(newState);
  newState.isCheckmate = isCheckmate(newState);

  // If it's checkmate, update the current turn to the winner
  if (newState.isCheckmate) {
    newState.currentTurn = gameState.currentTurn; // Keep the turn with the winning player
  }

  return newState;
}

function isInCheck(gameState: GameState): boolean {
  const kingColor = gameState.currentTurn;
  let kingSquare: Square | null = null;

  // Find the king's position
  for (const [square, piece] of Object.entries(gameState.board)) {
    if (piece?.type === 'king' && piece.color === kingColor) {
      kingSquare = square as Square;
      break;
    }
  }

  if (!kingSquare) return false;

  // Check if any opponent piece can capture the king
  for (const [square, piece] of Object.entries(gameState.board)) {
    if (piece && piece.color !== kingColor) {
      const moves = getValidMoves(square as Square, gameState);
      if (moves.includes(kingSquare)) {
        return true;
      }
    }
  }

  return false;
}

function isCheckmate(gameState: GameState): boolean {
  // First check if the current player is in check
  if (!isInCheck(gameState)) return false;

  // Try all possible moves for all pieces of the current player
  for (const [square, piece] of Object.entries(gameState.board)) {
    if (piece?.color === gameState.currentTurn) {
      const moves = getValidMoves(square as Square, gameState);
      
      // Try each move to see if it gets out of check
      for (const move of moves) {
        const newState = makeMove(square as Square, move, gameState);
        // If any move gets out of check, it's not checkmate
        if (!isInCheck(newState)) {
          return false;
        }
      }
    }
  }

  // If no moves get out of check, it's checkmate
  return true;
} 