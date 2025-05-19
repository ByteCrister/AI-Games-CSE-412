export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export type GameStatus = 'playing' | 'won' | 'draw';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'pvp';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningLine: number[] | null;
}

export interface GameSquareProps {
  value: CellValue;
  index: number;
  onClick: (index: number) => void;
  isWinning: boolean;
}

export interface GameBoardProps {
  board: Board;
  onSquareClick: (index: number) => void;
  winningLine: number[] | null;
}

export interface ScorePanelProps {
  playerScore: number;
  aiScore: number;
  draws: number;
}

export interface DifficultySelectorProps {
  onSelect: (difficulty: AIDifficulty) => void;
} 