"use client";

import { ScorePanelProps } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ScorePanel({ playerScore, aiScore, draws }: ScorePanelProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-center text-blue-600">Player (X)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-center">{playerScore}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-center text-gray-600">Draws</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-center">{draws}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-center text-red-600">AI (O)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-center">{aiScore}</p>
        </CardContent>
      </Card>
    </div>
  );
} 