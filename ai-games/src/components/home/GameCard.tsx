'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { GameOption } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const GameCard = ({ game }: { game: GameOption }) => {
  return (
    <Link href={game.path} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{game.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{game.description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

export default GameCard