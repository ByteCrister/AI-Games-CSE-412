import { Button } from "@/components/ui/button";
import { PieceColor } from "./types";

interface GameControlsProps {
  onRestart: () => void;
  onUndo: () => void;
  onResign: () => void;
  currentTurn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
}

export function GameControls({
  onRestart,
  onUndo,
  onResign,
  currentTurn,
  isCheck,
  isCheckmate,
}: GameControlsProps) {
  return (
    <div className="flex gap-4">
      <Button
        onClick={onRestart}
        className="bg-amber-600 hover:bg-amber-700 text-white"
      >
        Restart
      </Button>
      <Button
        onClick={onUndo}
        className="bg-amber-600 hover:bg-amber-700 text-white"
      >
        Undo
      </Button>
      <Button
        onClick={onResign}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Resign
      </Button>
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full ${currentTurn === 'white' ? 'bg-white' : 'bg-black'} border border-gray-400`} />
        <span className="font-semibold">
          {currentTurn === 'white' ? 'White' : 'Black'}'s turn
          {isCheck && ' (Check)'}
          {isCheckmate && ' (Checkmate)'}
        </span>
      </div>
    </div>
  );
} 