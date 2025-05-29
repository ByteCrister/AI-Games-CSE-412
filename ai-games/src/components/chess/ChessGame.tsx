"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { GameControls } from "@/components/chess/GameControls";
import { GameOverModal } from "@/components/chess/GameOverModal";
import { useChessGame } from "@/components/chess/useChessGame";
import { AIDifficulty, TurnOrder } from "./types";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ChessGame() {
  const params = useParams();
  const difficulty = params.difficulty as AIDifficulty;
  const [turnOrder, setTurnOrder] = useState<TurnOrder>("player");
  const [isBoardRotated, setIsBoardRotated] = useState(false);

  const {
    gameState,
    handleSquareClick,
    handleRestart,
    handleUndo,
    handleResign,
  } = useChessGame(difficulty, turnOrder);

  // Effect to handle turn order changes
  useEffect(() => {
    setIsBoardRotated(turnOrder === "ai");
    handleRestart();
  }, [turnOrder, handleRestart]);

  const handleTurnOrderChange = (newTurnOrder: TurnOrder) => {
    setTurnOrder(newTurnOrder);
  };

  // Determine the current player's color and game state
  const playerColor = turnOrder === "player" ? "white" : "black";
  const isGameOver = gameState.isCheckmate || gameState.isResigned;
  const winner = gameState.isCheckmate
    ? gameState.currentTurn === "white"
      ? "black"
      : "white"
    : gameState.isResigned
      ? playerColor === "white"
        ? "black"
        : "white"
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <Image
                src="/images/chess.png"
                alt="Chess"
                width={48}
                height={48}
                className="rounded-lg shadow-md"
              />
              <h1 className="text-3xl font-bold text-gray-900">
                Chess -{" "}
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600">Who goes first?</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleTurnOrderChange("player")}
                  className={`px-4 py-2 rounded-lg transition-all ${turnOrder === "player"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  disabled={isGameOver}
                >
                  You
                </Button>
                <Button
                  onClick={() => handleTurnOrderChange("ai")}
                  className={`px-4 py-2 rounded-lg transition-all ${turnOrder === "ai"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  disabled={isGameOver}
                >
                  AI
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-2 w-full max-w-[min(90vw,500px)]"
          >
            <ChessBoard
              gameState={gameState}
              onSquareClick={handleSquareClick}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-[min(90vw,500px)]"
          >
            <GameControls
              currentTurn={gameState.currentTurn}
              onRestart={handleRestart}
              onUndo={handleUndo}
              onResign={handleResign}
              isRotated={isBoardRotated}
              isCheck={gameState.isCheck}
            />
          </motion.div>
        </div>

        <GameOverModal
          isOpen={isGameOver}
          winner={winner}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}
