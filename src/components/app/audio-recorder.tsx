"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onRecordingComplete: (audioDataUrl: string) => void;
  isAnalyzing: boolean;
}

type RecordingStatus = 'idle' | 'permission_pending' | 'recording' | 'denied';

export function AudioRecorder({ onRecordingComplete, isAnalyzing }: AudioRecorderProps) {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    setStatus('permission_pending');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media Devices API not available.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus('recording');
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          onRecordingComplete(reader.result as string);
        };
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setStatus('denied');
      toast({
        variant: 'destructive',
        title: 'Erro de Microfone',
        description: 'Não foi possível acessar o microfone. Verifique as permissões do seu navegador.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      setStatus('idle');
    }
  };

  const isDisabled = status === 'permission_pending' || status === 'denied' || isAnalyzing;
  const isRecording = status === 'recording';

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={isDisabled}
        size="lg"
        className={cn(
            "rounded-full w-24 h-24 text-white shadow-lg transition-all duration-300 transform hover:scale-105",
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90",
            isDisabled && "opacity-50 cursor-not-allowed"
        )}
        aria-label={isRecording ? 'Parar gravação' : 'Iniciar gravação'}
      >
        <div className="relative flex items-center justify-center w-full h-full">
            {isRecording && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
            {status === 'permission_pending' || isAnalyzing ? (
                <Loader2 className="h-10 w-10 animate-spin" />
            ) : isRecording ? (
                <Square className="h-10 w-10" />
            ) : (
                <Mic className="h-10 w-10" />
            )}
        </div>
      </Button>
      <p className="text-sm text-muted-foreground h-5">
        {isAnalyzing 
            ? 'Analisando sua pronúncia...' 
            : isRecording 
            ? 'Gravando...' 
            : status === 'denied'
            ? 'Acesso ao microfone negado.'
            : 'Toque para falar'}
      </p>
    </div>
  );
}
