import { GameState, Move, Piece, Square, AIDifficulty } from './types';
import { getValidMoves, makeMove } from './GameLogic';

// Piece values for material evaluation
const PIECE_VALUES: Record<Piece['type'], number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

// Position tables for positional evaluation
const PAWN_POSITION_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_POSITION_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_POSITION_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_POSITION_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_POSITION_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_POSITION_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

function getPositionValue(piece: Piece, square: Square): number {
  const [file, rank] = square.split('');
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankIndex = piece.color === 'white' ? 7 - (parseInt(rank) - 1) : parseInt(rank) - 1;

  switch (piece.type) {
    case 'pawn':
      return PAWN_POSITION_TABLE[rankIndex][fileIndex];
    case 'knight':
      return KNIGHT_POSITION_TABLE[rankIndex][fileIndex];
    case 'bishop':
      return BISHOP_POSITION_TABLE[rankIndex][fileIndex];
    case 'rook':
      return ROOK_POSITION_TABLE[rankIndex][fileIndex];
    case 'queen':
      return QUEEN_POSITION_TABLE[rankIndex][fileIndex];
    case 'king':
      return KING_POSITION_TABLE[rankIndex][fileIndex];
    default:
      return 0;
  }
}

function evaluatePosition(gameState: GameState): number {
  let score = 0;

  // Material and positional evaluation
  for (const [square, piece] of Object.entries(gameState.board)) {
    if (piece) {
      const value = PIECE_VALUES[piece.type] + getPositionValue(piece, square as Square);
      score += piece.color === 'white' ? value : -value;
    }
  }

  // Mobility evaluation (number of legal moves)
  const whiteMoves = getAllLegalMoves(gameState, 'white').length;
  const blackMoves = getAllLegalMoves(gameState, 'black').length;
  score += (whiteMoves - blackMoves) * 10;

  return score;
}

function getAllLegalMoves(gameState: GameState, color: 'white' | 'black'): Move[] {
  const moves: Move[] = [];
  for (const [square, piece] of Object.entries(gameState.board)) {
    if (piece && piece.color === color) {
      const validMoves = getValidMoves(square as Square, gameState);
      validMoves.forEach(to => {
        moves.push({
          from: square as Square,
          to,
          piece,
          capturedPiece: gameState.board[to] || undefined,
        });
      });
    }
  }
  return moves;
}

function minimax(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean
): [number, Move | null] {
  if (depth === 0) {
    return [evaluatePosition(gameState), null];
  }

  const moves = getAllLegalMoves(
    gameState,
    maximizingPlayer ? 'white' : 'black'
  );

  if (moves.length === 0) {
    return [maximizingPlayer ? -Infinity : Infinity, null];
  }

  let bestMove: Move | null = null;
  let bestValue = maximizingPlayer ? -Infinity : Infinity;

  for (const move of moves) {
    const newState = makeMove(move.from, move.to, gameState);
    const [value] = minimax(newState, depth - 1, alpha, beta, !maximizingPlayer);

    if (maximizingPlayer) {
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestValue);
    } else {
      if (value < bestValue) {
        bestValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, bestValue);
    }

    if (beta <= alpha) {
      break;
    }
  }

  return [bestValue, bestMove];
}

export function getAIMove(gameState: GameState, difficulty: AIDifficulty): Move {
  const aiColor = gameState.currentTurn;
  const moves = getAllLegalMoves(gameState, aiColor);

  if (moves.length === 0) {
    throw new Error('No valid moves available for AI');
  }

  switch (difficulty) {
    case 'easy': {
      // Random move
      return moves[Math.floor(Math.random() * moves.length)];
    }

    case 'medium': {
      // One-ply lookahead with evaluation
      let bestMove = moves[0];
      let bestScore = -Infinity;

      for (const move of moves) {
        const newState = makeMove(move.from, move.to, gameState);
        const score = aiColor === 'white' ? evaluatePosition(newState) : -evaluatePosition(newState);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    }

    case 'hard': {
      // Minimax with alpha-beta pruning
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, bestMove] = minimax(gameState, 3, -Infinity, Infinity, aiColor === 'white');
      return bestMove || moves[0];
    }

    default:
      return moves[0];
  }
} 