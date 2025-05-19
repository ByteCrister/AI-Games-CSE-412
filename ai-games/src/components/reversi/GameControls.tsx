import { Button } from '@/components/ui/button';
import { GameControls as GameControlsType } from './types';
import { cn } from '@/lib/utils';

export const GameControls = ({
  onRestart,
  onNewGame,
  onUndo,
  canUndo
}: GameControlsType) => {
  return (
    <div 
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow"
      role="toolbar"
      aria-label="Game controls"
    >
      <Button
        variant="outline"
        onClick={onNewGame}
        className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
        aria-label="Start new game"
      >
        New Game
      </Button>

      <Button
        variant="outline"
        onClick={onRestart}
        className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
        aria-label="Restart current game"
      >
        Restart
      </Button>
      
      <Button
        variant="outline"
        onClick={onUndo}
        disabled={!canUndo}
        className={cn(
          "flex-1 transition-colors",
          canUndo 
            ? "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200" 
            : "opacity-50 cursor-not-allowed"
        )}
        aria-label={canUndo ? "Undo last move" : "Cannot undo"}
      >
        Undo Move
      </Button>
    </div>
  );
}; 