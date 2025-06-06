
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
// import { Button } from '@/components/ui/button';
// import { ArrowRight } from 'lucide-react';

const successStories = [
  {
    clientName: "Camisetia",
    description: "Desarrollamos una plataforma de e-commerce intuitiva y personalizable para la venta de ropa, permitiendo a los usuarios diseñar y comprar sus propias prendas.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "ecommerce clothing", // Hint for Unsplash, based on provided image
    projectUrl: "#" // Placeholder link, can be updated later
  },
  // You can add more success stories here in the future
  // {
  //   clientName: "Otro Cliente",
  //   description: "Descripción del proyecto para Otro Cliente.",
  //   imageUrl: "https://placehold.co/600x400.png",
  //   imageHint: "technology app",
  //   projectUrl: "#"
  // },
];

export default function SuccessStoriesSection() {
  if (successStories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-transparent w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-12 text-center text-primary">
          Casos de Éxito
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {successStories.map((story, index) => (
            <GlassCard key={index} className="flex flex-col overflow-hidden w-full max-w-md mx-auto"> {/* Added max-w-md and mx-auto for single item centering */}
              <div className="relative w-full h-48 md:h-56">
                <Image
                  src={story.imageUrl}
                  alt={`Caso de éxito de ${story.clientName}`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={story.imageHint}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-3 text-foreground">{story.clientName}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">{story.description}</p>
                {/* 
                // Uncomment if you want a "View Project" button 
                <Button 
                  variant="link" 
                  className="mt-auto text-accent self-start px-0 hover:text-primary transition-colors"
                  onClick={() => window.open(story.projectUrl, '_blank')} // Example action
                >
                  Ver proyecto <ArrowRight className="ml-2 h-4 w-4" />
                </Button> 
                */}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
