export type Player = 'black' | 'white';
export type CellState = Player | null;
export type Board = CellState[][];
export type Position = {
  row: number;
  col: number;
};

export type GameState = {
  board: Board;
  currentPlayer: Player;
  scores: {
    black: number;
    white: number;
  };
  gameOver: boolean;
  winner: Player | 'draw' | null;
  lastMove: Position | null;
  validMoves: Position[];
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameControls {
  onRestart: () => void;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export interface ScoreBoardProps {
  scores: {
    black: number;
    white: number;
  };
  currentPlayer: Player;
} 