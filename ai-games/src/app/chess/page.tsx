import ChessDifficulty from '@/components/chess/ChessDifficulty'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chess',
  description: 'The Chess Game System implements a complete chess game with AI opponents of varying difficulty levels within the AI Games Collection. This system handles chess-specific game logic, UI components, and AI decision-making using minimax with alpha-beta pruning algorithms.',
  openGraph: {
    title: 'AI Chess',
    description: 'The Chess Game System implements a complete chess game with AI opponents of varying difficulty levels within the AI Games Collection. This system handles chess-specific game logic, UI components, and AI decision-making using minimax with alpha-beta pruning algorithms.',
    url: '/chess',
    images: [{ url: '/images/chess.png', width: 1200, height: 630 }],
  },
};

const Page = () => {
  return (
    <ChessDifficulty />
  )
}

export default Page