export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';
export type Square = `${'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'}${1|2|3|4|5|6|7|8}`;

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface GameState {
  board: Record<Square, Piece | null>;
  currentTurn: PieceColor;
  selectedSquare: Square | null;
  validMoves: Square[];
  moveHistory: Move[];
  isCheck: boolean;
  isCheckmate: boolean;
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  capturedPiece?: Piece;
  isCastling?: boolean;
  isEnPassant?: boolean;
  promotion?: PieceType;
}

export type GameMode = 'pvp' | 'ai';
export type AIDifficulty = 'easy' | 'medium' | 'hard'; 