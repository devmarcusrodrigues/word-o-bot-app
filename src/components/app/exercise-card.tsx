"use client";

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioRecorder } from '@/components/app/audio-recorder';
import { StarRating } from '@/components/app/star-rating';
import { analyzePronunciation, AnalyzePronunciationOutput } from '@/ai/flows/analyze-pronunciation-with-gemini';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';

interface ExerciseCardProps {
  exercise: {
    content: string;
  };
  onComplete: (result: AnalyzePronunciationOutput) => void;
}

export function ExerciseCard({ exercise, onComplete }: ExerciseCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePronunciationOutput | null>(null);
  const { toast } = useToast();

  const handleRecordingComplete = async (audioDataUrl: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzePronunciation({
        recordedAudioUri: audioDataUrl,
        targetPhrase: exercise.content,
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na Análise',
        description: 'Não foi possível analisar sua pronúncia. Tente novamente.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-md text-center animate-in fade-in-50 zoom-in-95">
      <CardHeader>
        <p className="text-muted-foreground text-lg">Pronuncie a frase:</p>
        <p className="text-3xl md:text-4xl font-bold font-headline h-24 flex items-center justify-center">
          "{exercise.content}"
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[220px]">
        {!analysisResult ? (
          <AudioRecorder onRecordingComplete={handleRecordingComplete} isAnalyzing={isAnalyzing} />
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95">
            <p className="text-muted-foreground">Sua pontuação:</p>
            <p className="text-7xl font-bold text-primary">{analysisResult.similarityPercentage}%</p>
            <StarRating rating={analysisResult.starRating} starClassName="h-12 w-12" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onComplete(analysisResult!)} 
          disabled={!analysisResult || isAnalyzing}
          className="w-full"
          size="lg"
        >
          Próximo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
