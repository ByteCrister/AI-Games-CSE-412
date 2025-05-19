import { Board, CellState, Player, Position } from './types';

const BOARD_SIZE = 8;
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export const createInitialBoard = (): Board => {
  const board: Board = Array(BOARD_SIZE).fill(null).map(() => 
    Array(BOARD_SIZE).fill(null)
  );
  
  // Set up initial pieces
  const center = BOARD_SIZE / 2;
  board[center - 1][center - 1] = 'white';
  board[center - 1][center] = 'black';
  board[center][center - 1] = 'black';
  board[center][center] = 'white';
  
  return board;
};

export const isValidMove = (
  board: Board,
  position: Position,
  player: Player
): boolean => {
  const { row, col } = position;
  
  // Check if position is within bounds and empty
  if (
    row < 0 || row >= BOARD_SIZE ||
    col < 0 || col >= BOARD_SIZE ||
    board[row][col] !== null
  ) {
    return false;
  }
  
  // Check each direction for valid flips
  return DIRECTIONS.some(([dx, dy]) => {
    const flips = wouldFlip(board, position, player, dx, dy);
    return flips.length > 0;
  });
};

export const wouldFlip = (
  board: Board,
  position: Position,
  player: Player,
  dx: number,
  dy: number
): Position[] => {
  const { row, col } = position;
  const flips: Position[] = [];
  let x = row + dx;
  let y = col + dy;
  const opponent = player === 'black' ? 'white' : 'black';
  
  // First cell must be opponent's piece
  if (
    x < 0 || x >= BOARD_SIZE ||
    y < 0 || y >= BOARD_SIZE ||
    board[x][y] !== opponent
  ) {
    return [];
  }
  
  // Keep going in the direction until we hit our piece or empty cell
  while (
    x >= 0 && x < BOARD_SIZE &&
    y >= 0 && y < BOARD_SIZE
  ) {
    const cell = board[x][y];
    if (cell === null) return [];
    if (cell === player) return flips;
    flips.push({ row: x, col: y });
    x += dx;
    y += dy;
  }
  
  return [];
};

export const getValidMoves = (board: Board, player: Player): Position[] => {
  const validMoves: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(board, { row, col }, player)) {
        validMoves.push({ row, col });
      }
    }
  }
  
  return validMoves;
};

export const makeMove = (
  board: Board,
  position: Position,
  player: Player
): Board => {
  if (!isValidMove(board, position, player)) {
    return board;
  }

  const newBoard = board.map(row => [...row]);
  const { row, col } = position;
  
  // Place the piece
  newBoard[row][col] = player;
  
  // Flip pieces in all valid directions
  DIRECTIONS.forEach(([dx, dy]) => {
    const flips = wouldFlip(board, position, player, dx, dy);
    flips.forEach(({ row: flipRow, col: flipCol }) => {
      newBoard[flipRow][flipCol] = player;
    });
  });
  
  return newBoard;
};

export const calculateScores = (board: Board): { black: number; white: number } => {
  let black = 0;
  let white = 0;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];
      if (cell === 'black') black++;
      if (cell === 'white') white++;
    }
  }
  
  return { black, white };
};

export const isGameOver = (board: Board): boolean => {
  const hasValidMoves = (player: Player) => 
    getValidMoves(board, player).length > 0;
    
  return !hasValidMoves('black') && !hasValidMoves('white');
};

export const getWinner = (scores: { black: number; white: number }): 'black' | 'white' | 'draw' => {
  if (scores.black > scores.white) return 'black';
  if (scores.white > scores.black) return 'white';
  return 'draw';
}; 