import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/app/star-rating';
import { Award, RotateCcw } from 'lucide-react';
import { AnalyzePronunciationOutput } from '@/ai/flows/analyze-pronunciation-with-gemini';

interface LessonSummaryProps {
  scores: AnalyzePronunciationOutput[];
  onRestart: () => void;
}

export function LessonSummary({ scores, onRestart }: LessonSummaryProps) {
  const totalExercises = scores.length;
  const avgPercentage = totalExercises > 0 ? Math.round(scores.reduce((acc, s) => acc + s.similarityPercentage, 0) / totalExercises) : 0;
  
  let finalStarRating = 1;
  if (avgPercentage >= 80) {
      finalStarRating = 3;
  } else if (avgPercentage >= 60) {
      finalStarRating = 2;
  }

  return (
    <Card className="w-full max-w-md text-center animate-in fade-in zoom-in-95">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <Award className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold mt-4">Lição Concluída!</CardTitle>
        <CardDescription>Parabéns, você completou todos os exercícios.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
            <p className="text-muted-foreground mb-2">Sua pontuação final</p>
            <p className="text-6xl font-bold text-primary">{avgPercentage}%</p>
            <StarRating rating={finalStarRating} className="mt-2" starClassName="h-10 w-10" />
        </div>
        <Button onClick={onRestart} size="lg" className="w-full">
          <RotateCcw className="mr-2 h-5 w-5" />
          Tentar Novamente
        </Button>
      </CardContent>
    </Card>
  );
}
