"use client";

import { Board, Player, AIDifficulty } from './types';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function checkWinner(board: Board): { winner: Player | null; winningLine: number[] | null } {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: combination };
    }
  }
  return { winner: null, winningLine: null };
}

export function isBoardFull(board: Board): boolean {
  return board.every(cell => cell !== null);
}

function getEmptyCells(board: Board): number[] {
  return board.reduce((acc: number[], cell, index) => {
    if (cell === null) acc.push(index);
    return acc;
  }, []);
}

function evaluateBoard(board: Board, player: Player): number {
  const { winner } = checkWinner(board);
  if (winner === player) return 10;
  if (winner === (player === 'X' ? 'O' : 'X')) return -10;
  return 0;
}

function minimax(board: Board, depth: number, isMaximizing: boolean, player: Player): number {
  const { winner } = checkWinner(board);
  if (winner) return evaluateBoard(board, player);
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = player;
        const score = minimax(newBoard, depth + 1, false, player);
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    const opponent = player === 'X' ? 'O' : 'X';
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = opponent;
        const score = minimax(newBoard, depth + 1, true, player);
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function getStrategicMove(board: Board, aiPlayer: Player): number {
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  const emptyCells = getEmptyCells(board);

  // Check for winning move
  for (const index of emptyCells) {
    const newBoard = [...board];
    newBoard[index] = aiPlayer;
    if (checkWinner(newBoard).winner === aiPlayer) {
      return index;
    }
  }

  // Check for blocking move
  for (const index of emptyCells) {
    const newBoard = [...board];
    newBoard[index] = opponent;
    if (checkWinner(newBoard).winner === opponent) {
      return index;
    }
  }

  // Check for fork opportunities (creating multiple winning possibilities)
  const forkMoves = emptyCells.filter(index => {
    const newBoard = [...board];
    newBoard[index] = aiPlayer;
    let winningPossibilities = 0;
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        (newBoard[a] === aiPlayer && newBoard[b] === null && newBoard[c] === null) ||
        (newBoard[a] === null && newBoard[b] === aiPlayer && newBoard[c] === null) ||
        (newBoard[a] === null && newBoard[b] === null && newBoard[c] === aiPlayer)
      ) {
        winningPossibilities++;
      }
    }
    return winningPossibilities >= 2;
  });

  if (forkMoves.length > 0) {
    return forkMoves[Math.floor(Math.random() * forkMoves.length)];
  }

  // Check for blocking opponent's fork
  const blockingForkMoves = emptyCells.filter(index => {
    const newBoard = [...board];
    newBoard[index] = opponent;
    let winningPossibilities = 0;
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        (newBoard[a] === opponent && newBoard[b] === null && newBoard[c] === null) ||
        (newBoard[a] === null && newBoard[b] === opponent && newBoard[c] === null) ||
        (newBoard[a] === null && newBoard[b] === null && newBoard[c] === opponent)
      ) {
        winningPossibilities++;
      }
    }
    return winningPossibilities >= 2;
  });

  if (blockingForkMoves.length > 0) {
    return blockingForkMoves[Math.floor(Math.random() * blockingForkMoves.length)];
  }

  // Take center if available
  if (board[4] === null) {
    return 4;
  }

  // Take a corner if available
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Take an edge if available
  const edges = [1, 3, 5, 7];
  const availableEdges = edges.filter(i => board[i] === null);
  if (availableEdges.length > 0) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
  }

  // If no strategic move is found, make a random move
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

export function getAIMove(board: Board, difficulty: AIDifficulty, aiPlayer: Player): number {
  if (difficulty === 'pvp') {
    return -1;
  }

  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) {
    return -1;
  }

  // For easy difficulty, make a random move with some basic strategy
  if (difficulty === 'easy') {
    // 70% chance of random move, 30% chance of strategic move
    if (Math.random() < 0.7) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    return getStrategicMove(board, aiPlayer);
  }

  // For medium difficulty, use strategic moves with some randomness
  if (difficulty === 'medium') {
    // 40% chance of random move, 60% chance of strategic move
    if (Math.random() < 0.4) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    return getStrategicMove(board, aiPlayer);
  }

  // For hard difficulty, use minimax with some randomness for the first move
  if (emptyCells.length === 9) {
    // For the first move, use a mix of minimax and strategic moves
    const strategicMove = getStrategicMove(board, aiPlayer);
    const minimaxMove = (() => {
      let bestScore = -Infinity;
      let bestMove = emptyCells[0];

      for (const index of emptyCells) {
        const newBoard = [...board];
        newBoard[index] = aiPlayer;
        const score = minimax(newBoard, 0, false, aiPlayer);
        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
      return bestMove;
    })();

    // 30% chance of strategic move, 70% chance of minimax move
    return Math.random() < 0.3 ? strategicMove : minimaxMove;
  }

  // For subsequent moves in hard difficulty, use minimax
  let bestScore = -Infinity;
  let bestMove = emptyCells[0];

  for (const index of emptyCells) {
    const newBoard = [...board];
    newBoard[index] = aiPlayer;
    const score = minimax(newBoard, 0, false, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
} 