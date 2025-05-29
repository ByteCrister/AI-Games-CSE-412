import { Square } from './Square';
import { GameState, Piece, Square as SquareType } from './types';

interface ChessBoardProps {
  gameState: GameState;
  onSquareClick: (square: SquareType) => void;
}

export function ChessBoard({ gameState, onSquareClick }: ChessBoardProps) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  function getPieceSymbol(piece: Piece): string {
    const symbols: Record<Piece['type'], { white: string; black: string }> = {
      king: { white: '♔', black: '♚' },
      queen: { white: '♕', black: '♛' },
      rook: { white: '♖', black: '♜' },
      bishop: { white: '♗', black: '♝' },
      knight: { white: '♘', black: '♞' },
      pawn: { white: '♙', black: '♟' },
    };
    return symbols[piece.type][piece.color];
  }

  return (
    <div className="relative w-full aspect-square">
      <div className="absolute inset-0 rounded-lg border-4 border-amber-900 bg-amber-900 p-3">
        <div className="grid h-full grid-cols-8 grid-rows-8 gap-[2px]">
          {ranks.map((rank) =>
            files.map((file) => {
              const square = `${file}${rank}` as SquareType;
              const piece = gameState.board[square];
              const isSelected = gameState.selectedSquare === square;
              const isValidMove = gameState.validMoves.some(move => move.to === square);

              return (
                <Square
                  key={square}
                  square={square}
                  piece={piece}
                  getPieceSymbol={getPieceSymbol}
                  isSelected={isSelected}
                  isValidMove={isValidMove}
                  onClick={onSquareClick}
                />
              );
            })
          )}
        </div>
      </div>
      {/* File labels */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-3">
        {files.map((file) => (
          <span key={file} className="text-sm font-medium text-amber-900">
            {file}
          </span>
        ))}
      </div>
      {/* Rank labels */}
      <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-3">
        {ranks.map((rank) => (
          <span key={rank} className="text-sm font-medium text-amber-900">
            {rank}
          </span>
        ))}
      </div>
    </div>
  );
} 