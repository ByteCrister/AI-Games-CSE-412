import TicTacToe from '@/components/tic-tac-toe/TicTacToe'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tic-Tac-Toe',
  description: 'Tic-Tac-Toe game implementation within the AI Games Collection, including its component architecture, game logic, AI implementation using the Minimax algorithm, and integration with the Next.js routing system. The Tic-Tac-Toe system represents the simplest of the three games in the collection, serving as an excellent example of the foundational patterns used throughout the codebase.',
  openGraph: {
    title: 'AI Tic-Tac-Toe',
    description: 'Tic-Tac-Toe game implementation within the AI Games Collection, including its component architecture, game logic, AI implementation using the Minimax algorithm, and integration with the Next.js routing system. The Tic-Tac-Toe system represents the simplest of the three games in the collection, serving as an excellent example of the foundational patterns used throughout the codebase.',
    url: '/tic-tac-toe',
    images: [{ url: '/images/tic-tac-toe.png', width: 1200, height: 630 }],
  },
};

const Page = () => {
  return (
    <TicTacToe />
  )
}

export default Page