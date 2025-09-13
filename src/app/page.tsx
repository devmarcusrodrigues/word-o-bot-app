import Header from '@/components/app/header';
import LessonFlow from '@/components/app/lesson-flow';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <LessonFlow />
      </main>
    </div>
  );
}
