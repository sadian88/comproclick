
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Sparkles, MessageCircle, Menu, X } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  onNavigateToDesigner: () => void;
}

const WHATSAPP_NUMBER = "573153042476"; 
const WHATSAPP_MESSAGE = "Hola Compro.click, estoy interesado en sus servicios.";
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const FACEBOOK_URL = "https://www.facebook.com/tu_pagina";
const INSTAGRAM_URL = "https://www.instagram.com/tu_perfil";

export default function Header({ onLogoClick, onNavigateToDesigner }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuLinkClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setIsMobileMenuOpen(false); // Cierra el menú móvil al hacer clic en un enlace
  };

  return (
    <header className="py-4 md:py-6 bg-transparent sticky top-0 z-50 backdrop-blur-md bg-background/80 dark:bg-background/85 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
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

          {/* Contenedor para Menú de Escritorio, Redes Sociales y Botón Hamburguesa */}
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
            {/* Menú de Escritorio */}
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
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> Contacto
              </a>
            </nav>

            {/* Redes Sociales (visibles en todos los tamaños) */}
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

            {/* Botón Hamburguesa (solo para móviles) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground/80 hover:text-primary focus:outline-none p-2 -mr-2" // Added padding for better tap target
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Panel del Menú Móvil Desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pb-4 border-t border-border/30">
            <nav className="flex flex-col space-y-2 pt-3">
              <Link
                href="/"
                onClick={() => handleMenuLinkClick(onLogoClick)}
                className="text-foreground/90 hover:text-primary transition-colors duration-200 font-medium py-2.5 px-3 rounded-md text-left hover:bg-primary/10"
              >
                Inicio
              </Link>
              <button
                onClick={() => handleMenuLinkClick(onNavigateToDesigner)}
                className="text-foreground/90 hover:text-primary transition-colors duration-200 font-medium py-2.5 px-3 rounded-md text-left hover:bg-primary/10 w-full"
              >
                Diseña con nosotros
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleMenuLinkClick()} // Solo cierra el menú
                className="text-foreground/90 hover:text-primary transition-colors duration-200 font-medium py-2.5 px-3 rounded-md text-left hover:bg-primary/10 flex items-center gap-1.5"
              >
                <MessageCircle className="w-5 h-5" /> Contacto
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
