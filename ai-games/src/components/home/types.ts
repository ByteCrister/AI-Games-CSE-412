export interface GameOption {
  id: string;
  title: string;
  description: string;
  path: string;
  icon?: string;
}

export const GAME_OPTIONS: GameOption[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Classic game of X\'s and O\'s',
    path: '/tic-tac-toe',
  },
  {
    id: 'chess',
    title: 'Chess',
    description: 'Strategic board game of kings and queens',
    path: '/chess',
  },
  {
    id: 'reversi',
    title: 'Reversi',
    description: 'Also known as Othello - flip your opponent\'s pieces',
    path: '/reversi',
  },
]; 