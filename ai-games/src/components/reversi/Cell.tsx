import { cn } from '@/lib/utils';

interface CellProps {
  state: 'black' | 'white' | null;
  position: { row: number; col: number };
  isValidMove: boolean;
  onClick: (position: { row: number; col: number }) => void;
  isLastMove?: boolean;
}

export const Cell = ({
  state,
  position,
  isValidMove,
  onClick,
  isLastMove
}: CellProps) => {
  const handleClick = () => {
    if (isValidMove || state) {
      onClick(position);
    }
  };

  return (
    <button
      name={`cell-${position.row}-${position.col}`}
      className={cn(
        'relative w-full aspect-square border border-gray-300',
        'flex items-center justify-center',
        'transition-all duration-200',
        'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
        'active:scale-95',
        isValidMove && 'bg-gray-200/50 hover:bg-gray-300/50 cursor-pointer',
        !isValidMove && !state && 'cursor-not-allowed',
        isLastMove && 'ring-2 ring-blue-500'
      )}
      onClick={handleClick}
      disabled={!isValidMove && !state}
      aria-label={`Cell at row ${position.row + 1}, column ${position.col + 1}`}
      aria-pressed={!!state}
    >
      {state && (
        <div
          className={cn(
            'w-[80%] h-[80%] rounded-full',
            'transition-all duration-300',
            'transform hover:scale-105',
            'animate-in fade-in zoom-in',
            state === 'black' ? 'bg-black' : 'bg-white',
            state === 'white' && 'border-2 border-gray-300'
          )}
        />
      )}
      {isValidMove && !state && (
        <div
          className="absolute w-3 h-3 rounded-full bg-gray-400/50 animate-pulse"
          aria-hidden="true"
        />
      )}
    </button>
  );
}; 