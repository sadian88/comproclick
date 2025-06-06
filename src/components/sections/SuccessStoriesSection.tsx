
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
// import { Button } from '@/components/ui/button';
// import { ArrowRight } from 'lucide-react';

const successStories = [
  {
    clientName: "Camisetia",
    description: "", // No description as requested
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "ecommerce clothing",
    projectUrl: "#"
  },
  {
    clientName: "Innovatech Corp",
    description: "", // No description as requested
    imageUrl: "https://placehold.co/600x400.png", // Different hint for potential image replacement
    imageHint: "corporate website",
    projectUrl: "#"
  },
  {
    clientName: "GourmetGo App",
    description: "", // No description as requested
    imageUrl: "https://placehold.co/600x400.png", // Different hint
    imageHint: "food delivery app",
    projectUrl: "#"
  },
  {
    clientName: "DataViz Solutions",
    description: "", // No description as requested
    imageUrl: "https://placehold.co/600x400.png", // Different hint
    imageHint: "analytics dashboard",
    projectUrl: "#"
  }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
          {successStories.map((story, index) => (
            <GlassCard key={index} className="flex flex-col overflow-hidden w-full max-w-sm mx-auto"> {/* Adjusted max-w and grid for more items */}
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
                {story.description && ( // Conditionally render description only if it exists
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">{story.description}</p>
                )}
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
