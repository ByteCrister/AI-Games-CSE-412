import { Board as BoardType, Position } from './types';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardType;
  validMoves: Position[];
  lastMove: Position | null;
  onCellClick: (position: Position) => void;
}

export const Board = ({
  board,
  validMoves,
  lastMove,
  onCellClick
}: BoardProps) => {
  return (
    <div 
      className="w-full max-w-[min(600px,90vw)] aspect-square bg-green-800 p-2 sm:p-4 rounded-lg shadow-lg"
      role="grid"
      aria-label="Reversi game board"
    >
      <div className="grid grid-cols-8 gap-0.5 sm:gap-1 h-full">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const isValidMove = validMoves.some(
              move => move.row === rowIndex && move.col === colIndex
            );
            const isLastMove = lastMove?.row === rowIndex && lastMove?.col === colIndex;

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                state={cell}
                position={position}
                isValidMove={isValidMove}
                onClick={onCellClick}
                isLastMove={isLastMove}
              />
            );
          })
        )}
      </div>
    </div>
  );
}; 