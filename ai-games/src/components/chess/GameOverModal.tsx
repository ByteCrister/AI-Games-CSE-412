import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'white' | 'black' | null;
  onRestart: () => void;
}

export function GameOverModal({ isOpen, winner, onRestart }: GameOverModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {winner ? `Checkmate! ${winner === 'white' ? 'White' : 'Black'} wins!` : 'Game Over'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-center text-lg">
            {winner 
              ? `Congratulations to ${winner === 'white' ? 'White' : 'Black'}!`
              : 'The game has ended.'}
          </p>
          <Button 
            onClick={onRestart}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 