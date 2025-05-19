import { Board, Position, Difficulty } from './types';
import { getValidMoves, wouldFlip } from './GameLogic';

// Evaluation function for the board state
const evaluateBoard = (board: Board): number => {
  const weights = [
    [120, -20, 20, 5, 5, 20, -20, 120],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [20, -5, 15, 3, 3, 15, -5, 20],
    [5, -5, 3, 3, 3, 3, -5, 5],
    [5, -5, 3, 3, 3, 3, -5, 5],
    [20, -5, 15, 3, 3, 15, -5, 20],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [120, -20, 20, 5, 5, 20, -20, 120]
  ];

  let score = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === 'white') {
        score += weights[i][j];
      } else if (board[i][j] === 'black') {
        score -= weights[i][j];
      }
    }
  }
  return score;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number => {
  if (depth === 0) {
    return evaluateBoard(board);
  }

  const validMoves = getValidMoves(board, isMaximizing ? 'white' : 'black');
  
  if (validMoves.length === 0) {
    return evaluateBoard(board);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoard = board.map(row => [...row]);
      newBoard[move.row][move.col] = 'white';
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newBoard = board.map(row => [...row]);
      newBoard[move.row][move.col] = 'black';
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

// Get AI move based on difficulty
export const getAIMove = (
  board: Board,
  validMoves: Position[],
  difficulty: Difficulty
): Position | null => {
  if (validMoves.length === 0) return null;

  switch (difficulty) {
    case 'easy':
      // Random move
      return validMoves[Math.floor(Math.random() * validMoves.length)];

    case 'medium':
      // Greedy move - choose move that flips the most pieces
      return validMoves.reduce((best, current) => {
        let currentFlips = 0;
        let bestFlips = 0;
        
        // Count flips in all directions for both moves
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            
            currentFlips += wouldFlip(board, current, 'white', dx, dy).length;
            bestFlips += wouldFlip(board, best, 'white', dx, dy).length;
          }
        }
        
        return currentFlips > bestFlips ? current : best;
      });

    case 'hard':
      // Minimax with alpha-beta pruning
      let bestScore = -Infinity;
      let bestMove = validMoves[0];

      for (const move of validMoves) {
        const newBoard = board.map(row => [...row]);
        newBoard[move.row][move.col] = 'white';
        const score = minimax(newBoard, 3, -Infinity, Infinity, false);
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;

    default:
      return validMoves[0];
  }
}; 