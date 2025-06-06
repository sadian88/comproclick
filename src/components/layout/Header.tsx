import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onLogoClick) {
      // If onLogoClick is provided, it handles state reset.
      // We might not need to prevent default if Link's href="/" also aligns.
      // Forcing state reset is primary.
      onLogoClick();
    }
    // Link will still navigate to href="/"
  };

  return (
    <header className="py-6 bg-transparent">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="text-3xl md:text-4xl font-headline font-bold text-primary hover:text-accent transition-colors duration-300 flex items-center gap-2"
          aria-label="Volver a la página de inicio de Compro.click"
        >
          <Sparkles className="w-8 h-8 text-dorado-metalico" />
          Compro.click
        </Link>
      </div>
    </header>
  );
}
