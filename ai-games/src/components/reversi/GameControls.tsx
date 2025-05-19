import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GameControls as GameControlsType, Difficulty } from './types';
import { cn } from '@/lib/utils';

export const GameControls = ({
  onRestart,
  onUndo,
  onDifficultyChange,
  currentDifficulty,
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
        onClick={onRestart}
        className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        aria-label="Restart game"
      >
        Restart Game
      </Button>
      
      <Button
        variant="outline"
        onClick={onUndo}
        disabled={!canUndo}
        className={cn(
          "flex-1 transition-colors",
          canUndo 
            ? "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" 
            : "opacity-50 cursor-not-allowed"
        )}
        aria-label={canUndo ? "Undo last move" : "Cannot undo"}
      >
        Undo Move
      </Button>
      
      <Select
        value={currentDifficulty}
        onValueChange={(value: Difficulty) => onDifficultyChange(value)}
      >
        <SelectTrigger 
          className={cn(
            "flex-1 transition-colors",
            currentDifficulty === 'easy' && "text-green-600 border-green-200",
            currentDifficulty === 'medium' && "text-yellow-600 border-yellow-200",
            currentDifficulty === 'hard' && "text-red-600 border-red-200"
          )}
          aria-label="Select difficulty level"
        >
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem 
            value="easy" 
            className="text-green-600 hover:bg-green-50"
          >
            Easy
          </SelectItem>
          <SelectItem 
            value="medium" 
            className="text-yellow-600 hover:bg-yellow-50"
          >
            Medium
          </SelectItem>
          <SelectItem 
            value="hard" 
            className="text-red-600 hover:bg-red-50"
          >
            Hard
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}; 