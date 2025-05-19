import { ScoreBoardProps } from './types';
import { cn } from '@/lib/utils';

export const ScoreBoard = ({ scores, currentPlayer }: ScoreBoardProps) => {
  return (
    <div className="flex justify-between items-center gap-4 p-4 bg-white rounded-lg shadow">
      <div className={cn(
        "flex items-center gap-2 transition-colors duration-200",
        currentPlayer === 'black' && "text-blue-600"
      )}>
        <div className="w-6 h-6 rounded-full bg-black" />
        <span className="font-semibold">Black: {scores.black}</span>
      </div>
      
      <div className={cn(
        "text-sm transition-colors duration-200",
        currentPlayer === 'black' ? "text-blue-600" : "text-gray-600"
      )}>
        {currentPlayer === 'black' ? "Your turn" : "AI's turn"}
      </div>
      
      <div className={cn(
        "flex items-center gap-2 transition-colors duration-200",
        currentPlayer === 'white' && "text-blue-600"
      )}>
        <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
        <span className="font-semibold">White: {scores.white}</span>
      </div>
    </div>
  );
}; 