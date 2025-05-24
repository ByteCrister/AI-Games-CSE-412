import { Difficulty } from './types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const difficulties = [
  {
    level: 'easy',
    label: 'Easy',
    description: 'Perfect for beginners. AI makes simple moves.',
    icon: '🎮',
    color: 'from-green-400 to-green-600',
    borderColor: 'border-green-200',
  },
  {
    level: 'medium',
    label: 'Medium',
    description: 'A balanced challenge. AI uses basic strategy.',
    icon: '🎯',
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    level: 'hard',
    label: 'Hard',
    description: 'For the brave. AI uses advanced strategy.',
    icon: '🏆',
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-200',
  },
] as const;

export const DifficultySelector = ({
  onDifficultyChange
}: DifficultySelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
    >
      {difficulties.map(({ level, label, description, icon, color, borderColor }, index) => (
        <motion.div
          key={level}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm border-2 overflow-hidden group",
              borderColor)}
            onClick={() => onDifficultyChange(level)}
          >
            <div className={cn("h-2 bg-gradient-to-r", color)} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{icon}</span>
                <CardTitle className="text-2xl font-bold text-gray-800">{label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 text-lg">{description}</p>
              <div className="mt-4 flex items-center justify-center text-blue-600 font-medium">
                Select
                <svg
                  className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}; 