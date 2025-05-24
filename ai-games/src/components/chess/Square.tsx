import { Square as SquareType, Piece } from './types';
import { cn } from '@/lib/utils';

interface SquareProps {
  square: SquareType;
  piece: Piece | null;
  getPieceSymbol: (piece: Piece) => string
  isSelected: boolean;
  isValidMove: boolean;
  onClick: (square: SquareType) => void;
}

export function Square({ square, piece, getPieceSymbol, isSelected, isValidMove, onClick }: SquareProps) {
  const [file, rank] = square.split('');
  const isLight = (file.charCodeAt(0) + parseInt(rank)) % 2 === 0;

  return (
    <button
      className={cn(
        'relative aspect-square w-full transition-colors',
        isLight ? 'bg-amber-100' : 'bg-amber-800',
        isSelected && 'bg-blue-400',
        isValidMove && 'bg-green-400/50',
        'hover:bg-opacity-80'
      )}
      onClick={() => onClick(square)}
      aria-label={`${square} ${piece ? `${piece.color} ${piece.type}` : 'empty'}`}
    >
      {piece && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span 
            className={cn(
              'select-none font-chess',
              piece.color === 'white' 
                ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' 
                : 'text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]'
            )}
            style={{ 
              fontSize: 'min(6vw, 3rem)',
              lineHeight: 1,
              textShadow: piece.color === 'white' 
                ? '0 0 2px rgba(0,0,0,0.5)' 
                : '0 0 2px rgba(255,255,255,0.5)'
            }}
          >
            {getPieceSymbol(piece)}
          </span>
        </div>
      )}
    </button>
  );
}