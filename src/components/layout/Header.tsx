import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-6 bg-transparent">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <Link href="/" className="text-3xl md:text-4xl font-headline font-bold text-primary hover:text-accent transition-colors duration-300 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-dorado-metalico" />
          IA Digital Designs
        </Link>
      </div>
    </header>
  );
}
