'use client';

import { useRouter } from 'next/navigation';
import DifficultySelector from './DifficultySelector';

export default function TicTacToe() {
    const router = useRouter();

    const handleDifficultySelect = (difficulty: string) => {
        router.push(`/tic-tac-toe/${difficulty}`);
    };

    return <DifficultySelector onSelect={handleDifficultySelect} />;
} 