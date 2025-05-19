"use client";

import { DifficultySelectorProps } from './types';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const difficulties = [
  { level: 'easy', label: 'Easy', description: 'AI makes random moves' },
  { level: 'medium', label: 'Medium', description: 'AI blocks obvious wins' },
  { level: 'hard', label: 'Hard', description: 'AI uses advanced strategy' },
] as const;

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Select Difficulty</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {difficulties.map(({ level, label, description }) => (
          <motion.div
            key={level}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelect(level)}
            >
              <CardHeader>
                <CardTitle className="text-2xl text-center">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">{description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 