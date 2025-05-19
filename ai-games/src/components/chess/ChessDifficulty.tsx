'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { AIDifficulty, TurnOrder } from './types';
import { useState } from 'react';

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

export default function ChessDifficulty() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty | null>(null);
  const [turnOrder, setTurnOrder] = useState<TurnOrder>('player');

  const handleDifficultySelect = (difficulty: AIDifficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStartGame = () => {
    if (selectedDifficulty) {
      router.push(`/chess/${selectedDifficulty}?turn=${turnOrder}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image
              src="/images/chess.png"
              alt="Chess"
              width={48}
              height={48}
              className="rounded-lg shadow-md"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Select Difficulty
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your challenge level. Each difficulty offers a unique gaming experience.
          </p>
        </motion.div>

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
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm border-2 ${borderColor} overflow-hidden group ${
                  selectedDifficulty === level ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleDifficultySelect(level)}
              >
                <div className={`h-2 bg-gradient-to-r ${color}`} />
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

        {selectedDifficulty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 max-w-md mx-auto"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-amber-200">
              <CardHeader>
                <CardTitle className="text-center text-xl font-bold text-gray-800">
                  Who Goes First?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 justify-center">
                  <button
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                      turnOrder === 'player'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setTurnOrder('player')}
                  >
                    I Go First
                  </button>
                  <button
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                      turnOrder === 'ai'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setTurnOrder('ai')}
                  >
                    AI Goes First
                  </button>
                </div>
                <button
                  onClick={handleStartGame}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Start Game
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 text-sm">
            Don&apos;t worry! You can always change the difficulty level during the game.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 