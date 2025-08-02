import ReversiDifficulty from "@/components/reversi/ReversiDifficulty"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Reversi',
  description: `The Reversi Game System implements a complete Reversi (also known as Othello) game with AI opponents of varying difficulty levels. This system provides a React-based game interface with sophisticated state management, move validation, AI integration, and accessibility features. The system follows the same architectural patterns as other games in the collection but includes Reversi-specific game logic such as piece flipping mechanics and strategic AI evaluation.`,
  openGraph: {
    title: 'AI Reversi',
    description: 'The Reversi Game System implements a complete Reversi (also known as Othello) game with AI opponents of varying difficulty levels. This system provides a React-based game interface with sophisticated state management, move validation, AI integration, and accessibility features. The system follows the same architectural patterns as other games in the collection but includes Reversi-specific game logic such as piece flipping mechanics and strategic AI evaluation.',
    url: '/reversi',
    images: [{ url: '/images/reversi.png', width: 1200, height: 630 }],
  },
};

const page = () => {
  return (
    <ReversiDifficulty />
  )
}

export default page