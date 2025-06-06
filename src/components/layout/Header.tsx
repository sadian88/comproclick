import Link from 'next/link';
import { Facebook, Instagram, Sparkles, MessageCircle } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  onNavigateToDesigner: () => void;
}

const WHATSAPP_NUMBER = "573153042476"; // Número sin el "+" inicial
const WHATSAPP_MESSAGE = "Hola Compro.click, estoy interesado en sus servicios.";
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// TODO: Reemplaza estas URLs con tus perfiles reales
const FACEBOOK_URL = "https://www.facebook.com/tu_pagina";
const INSTAGRAM_URL = "https://www.instagram.com/tu_perfil";

export default function Header({ onLogoClick, onNavigateToDesigner }: HeaderProps) {
  const handleMenuLinkClick = (action?: () => void) => {
    if (action) {
      action();
    }
  };

  return (
    <header className="py-6 bg-transparent sticky top-0 z-50 backdrop-blur-md bg-background/70 dark:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo a la izquierda */}
        <Link 
          href="/" 
          onClick={() => handleMenuLinkClick(onLogoClick)}
          className="text-2xl md:text-3xl font-headline font-bold text-primary hover:text-accent transition-colors duration-300 flex items-center gap-2"
          aria-label="Volver a la página de inicio de Compro.click"
        >
          <Sparkles className="w-7 h-7 text-dorado-metalico" />
          Compro.click
        </Link>

        {/* Menú y Redes Sociales a la derecha */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              onClick={() => handleMenuLinkClick(onLogoClick)}
              className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
            >
              Inicio
            </Link>
            <button 
              onClick={() => handleMenuLinkClick(onNavigateToDesigner)}
              className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
            >
              Diseña con nosotros
            </button>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" /> Contacto
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <a 
              href={FACEBOOK_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook de Compro.click"
              className="text-foreground/70 hover:text-primary transition-colors duration-200"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href={INSTAGRAM_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram de Compro.click"
              className="text-foreground/70 hover:text-primary transition-colors duration-200"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          {/* TODO: Implementar menú hamburguesa para móviles */}
        </div>
      </div>
    </header>
  );
}
