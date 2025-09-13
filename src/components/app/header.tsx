import { ThemeToggle } from '@/components/app/theme-toggle';
import { Bot } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-5xl">
        <div className="mr-4 flex items-center">
          <Bot className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-lg">Palavrobô Companion</span>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
