"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

const gameModes = [
  {
    id: 'pvp',
    title: 'Player vs Player',
    description: 'Play against a friend on the same device',
  },
  {
    id: 'ai',
    title: 'Player vs AI',
    description: 'Challenge our chess AI at different difficulty levels',
  },
];

export default function ChessModeSelector() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Choose Game Mode</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {gameModes.map((mode) => (
          <Link key={mode.id} href={`/chess/${mode.id}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{mode.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{mode.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
} 