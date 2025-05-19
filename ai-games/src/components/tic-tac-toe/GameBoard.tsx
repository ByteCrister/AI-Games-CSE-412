"use client";

import { GameBoardProps } from './types';
import { GameSquare } from './GameSquare';

export function GameBoard({ board, onSquareClick, winningLine }: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full aspect-square bg-gray-100 p-2 rounded-lg">
      {board.map((value, index) => (
        <GameSquare
          key={index}
          value={value}
          index={index}
          onClick={onSquareClick}
          isWinning={winningLine?.includes(index) ?? false}
        />
      ))}
    </div>
  );
} 