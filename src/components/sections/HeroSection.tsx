import { Button } from "@/components/ui/button";
import ThreeDShape from "@/components/ui/ThreeDShape";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onStartDesigning: () => void;
}

export default function HeroSection({ onStartDesigning }: HeroSectionProps) {
  return (
    <section className="py-16 md:py-24 text-center relative overflow-hidden min-h-[calc(80vh-var(--header-height,100px))] flex flex-col justify-center items-center">
      <div className="absolute -top-20 -left-20 opacity-50">
        <ThreeDShape type="sphere" size={150} className="animate-float" />
      </div>
      <div className="absolute -bottom-20 -right-10 opacity-60">
        <ThreeDShape type="polyhedron" size={180} className="animate-float animation-delay-500" />
      </div>
       <div className="absolute top-1/4 left-1/4 opacity-40 transform -translate-x-1/2 -translate-y-1/2">
        <ThreeDShape type="crystal" size={100} className="animate-float animation-delay-1000" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 opacity-30 transform translate-x-1/2 translate-y-1/2">
        <ThreeDShape type="sphere" size={80} className="animate-float animation-delay-1500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Impulsa tu negocio con soluciones inteligentes
        </h1>
        <p className="text-xl md:text-2xl text-foreground mb-10 max-w-3xl mx-auto">
          Creamos webs, apps y tiendas online impulsadas por IA para llevar tu proyecto al siguiente nivel.
        </p>
        <Button
          size="lg"
          onClick={onStartDesigning}
          className="font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105"
          variant="default"
        >
          Diseña con nosotros
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto text-sm text-muted-foreground">
          {[
            "Sitios web",
            "Apps móviles",
            "Diseño personalizado",
            "Automatización n8n",
            "Tiendas online",
            "Webs para pedidos",
          ].map((service) => (
            <div key={service} className="p-3 bg-white/30 backdrop-blur-sm rounded-lg shadow-md border border-white/20">
              {service}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
