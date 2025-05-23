import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'white' | 'black' | null;
  onRestart: () => void;
}

export function GameOverModal({ isOpen, winner, onRestart }: GameOverModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              {winner ? `Checkmate! ${winner === 'white' ? 'White' : 'Black'} wins!` : 'Game Over'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <motion.div 
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={`w-12 h-12 rounded-full ${winner === 'white' ? 'bg-white' : 'bg-black'} border-4 border-gray-400 shadow-lg`} />
              <p className="text-center text-xl font-medium text-gray-700">
                {winner 
                  ? `Congratulations to ${winner === 'white' ? 'White' : 'Black'}!`
                  : 'The game has ended.'}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={onRestart}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all duration-300 px-8 py-3 text-lg font-semibold"
              >
                Play Again
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 