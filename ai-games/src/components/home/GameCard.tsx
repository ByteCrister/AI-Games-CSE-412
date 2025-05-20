'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { GameOption } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const GameCard = ({ game }: { game: GameOption }) => {
  const getGameImage = (id: string) => {
    switch (id) {
      case 'tic-tac-toe':
        return '/images/tic-tac-toe.png';
      case 'chess':
        return '/images/chess.png';
      case 'reversi':
        return '/images/reversi.png';
      default:
        return '/images/tic-tac-toe.png';
    }
  };

  return (
    <Link href={game.path} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 overflow-hidden group">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={getGameImage(game.id)}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold text-gray-800">{game.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-lg">{game.description}</p>
            <div className="mt-4 flex items-center text-blue-600 font-medium">
              Play Now
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
    </Link>
  );
}

export default GameCard;