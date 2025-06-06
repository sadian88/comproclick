
import { Button } from "@/components/ui/button";
import ThreeDShape from "@/components/ui/ThreeDShape";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onStartDesigning: () => void;
}

export default function HeroSection({ onStartDesigning }: HeroSectionProps) {
  return (
    <section className="py-16 md:py-24 text-center relative overflow-hidden min-h-[calc(80vh-var(--header-height,100px))] flex flex-col justify-center items-center">
      {/* Subtle decorative shapes */}
      <div className="absolute -top-20 -left-20 opacity-40 dark:opacity-30">
        <ThreeDShape type="sphere" size={150} className="animate-float" color="hsl(var(--color-azul-cielo-suave))" />
      </div>
      <div className="absolute -bottom-20 -right-10 opacity-50 dark:opacity-40">
        <ThreeDShape type="polyhedron" size={180} className="animate-float animation-delay-500" color="hsl(var(--color-lila-pastel))" />
      </div>
       <div className="absolute top-1/4 left-1/4 opacity-30 dark:opacity-20 transform -translate-x-1/2 -translate-y-1/2">
        <ThreeDShape type="crystal" size={100} className="animate-float animation-delay-1000" color="hsl(var(--color-rosa-claro))" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 opacity-20 dark:opacity-15 transform translate-x-1/2 translate-y-1/2">
        <ThreeDShape type="sphere" size={80} className="animate-float animation-delay-1500" color="hsl(var(--color-turquesa-claro))" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-morado-electrico dark:to-accent">
          Impulsa tu negocio con soluciones inteligentes
        </h1>
        <p className="text-xl md:text-2xl text-foreground/90 dark:text-foreground/80 mb-10 max-w-3xl mx-auto">
          Creamos webs, apps y tiendas online. <strong>Define y refina tu idea con nuestra IA</strong> para llevar tu proyecto al siguiente nivel.
        </p>
        <Button
          size="lg"
          onClick={onStartDesigning}
          className="font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          variant="default"
        >
          Diseña con nosotros
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto text-sm text-foreground/80 dark:text-foreground/70">
          {[
            "Sitios web",
            "Apps móviles",
            "Diseño personalizado",
            "Automatización n8n",
            "Tiendas online",
            "Webs para pedidos",
          ].map((service) => (
            <div key={service} className="p-4 bg-[hsl(var(--color-blanco-puro))/0.15] dark:bg-[hsl(var(--card))/0.15] backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              {service}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
