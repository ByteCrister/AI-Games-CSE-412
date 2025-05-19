'use client';

import { useRouter } from 'next/navigation';
import { DifficultySelector } from '@/components/reversi/DifficultySelector';
import { Difficulty } from '@/components/reversi/types';
import Image from 'next/image';

export default function ReversiDifficulty() {
    const router = useRouter();

    const handleDifficultySelect = (difficulty: Difficulty) => {
        router.push(`/reversi/${difficulty}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <Image
                            src="/images/reversi.png"
                            alt="Reversi"
                            width={48}
                            height={48}
                            className="rounded-lg shadow-md"
                        />
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Select Difficulty
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose your challenge level. Each difficulty offers a unique gaming experience.
                    </p>
                </div>

                <DifficultySelector
                    currentDifficulty="medium"
                    onDifficultyChange={handleDifficultySelect}
                />
            </div>
        </div>
    );
}