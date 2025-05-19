import { Square } from './Square';
import { GameState, Square as SquareType } from './types';

interface ChessBoardProps {
  gameState: GameState;
  onSquareClick: (square: SquareType) => void;
}

export function ChessBoard({ gameState, onSquareClick }: ChessBoardProps) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <div className="relative w-full max-w-[min(90vw,90vh)] aspect-square">
      <div className="absolute inset-0 rounded-lg border-4 border-amber-900 bg-amber-900 p-3">
        <div className="grid h-full grid-cols-8 grid-rows-8 gap-[2px]">
          {ranks.map((rank) =>
            files.map((file) => {
              const square = `${file}${rank}` as SquareType;
              return (
                <Square
                  key={square}
                  square={square}
                  piece={gameState.board[square]}
                  isSelected={gameState.selectedSquare === square}
                  isValidMove={gameState.validMoves.includes(square)}
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