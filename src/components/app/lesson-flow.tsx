"use client";

import { useState } from 'react';
import { lessons } from '@/lib/lessons';
import { ExerciseCard } from '@/components/app/exercise-card';
import { LessonSummary } from '@/components/app/lesson-summary';
import type { AnalyzePronunciationOutput } from '@/ai/flows/analyze-pronunciation-with-gemini';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type GameState = 'welcome' | 'in_progress' | 'summary';

const lesson = lessons[0]; // For this version, we'll just use the first lesson

export default function LessonFlow() {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [scores, setScores] = useState<AnalyzePronunciationOutput[]>([]);

  const handleStart = () => {
    setCurrentExerciseIndex(0);
    setScores([]);
    setGameState('in_progress');
  };

  const handleExerciseComplete = (result: AnalyzePronunciationOutput) => {
    const newScores = [...scores, result];
    setScores(newScores);

    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setGameState('summary');
    }
  };
  
  const progressPercentage = (currentExerciseIndex / lesson.exercises.length) * 100;


  if (gameState === 'welcome') {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Bem-vindo ao Palavrobô!</CardTitle>
          <CardDescription className="text-lg pt-2">
            Pronto para treinar sua pronúncia com a lição "{lesson.title}"?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStart} size="lg" className="w-full">
            <Play className="mr-2 h-5 w-5" />
            Começar Lição
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'summary') {
    return <LessonSummary scores={scores} onRestart={handleStart} />;
  }

  return (
    <div className="w-full max-w-md space-y-4">
        <div className="text-center">
            <h2 className="text-xl font-semibold">{lesson.title}</h2>
            <p className="text-muted-foreground">Exercício {currentExerciseIndex + 1} de {lesson.exercises.length}</p>
        </div>
        <Progress value={progressPercentage} className="w-full" />
        <ExerciseCard
            key={currentExerciseIndex}
            exercise={lesson.exercises[currentExerciseIndex]}
            onComplete={handleExerciseComplete}
        />
    </div>
  );
}
