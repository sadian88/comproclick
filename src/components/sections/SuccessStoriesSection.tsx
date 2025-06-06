
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const successStories = [
  {
    clientName: "Camisetia",
    description: "", 
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "ecommerce clothing",
    projectUrl: "#"
  },
  {
    clientName: "Innovatech Corp",
    description: "", 
    imageUrl: "https://placehold.co/600x400.png", 
    imageHint: "corporate website",
    projectUrl: "#"
  },
  {
    clientName: "GourmetGo App",
    description: "", 
    imageUrl: "https://placehold.co/600x400.png", 
    imageHint: "food delivery app",
    projectUrl: "#"
  },
  {
    clientName: "DataViz Solutions",
    description: "", 
    imageUrl: "https://placehold.co/600x400.png", 
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
        <Carousel
          opts={{
            align: "start",
            loop: successStories.length > 1, 
          }}
          className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {successStories.map((story, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full"> 
                  <GlassCard className="flex flex-col overflow-hidden h-full w-full">
                    <div className="relative w-full h-48 md:h-56">
                      <Image
                        src={story.imageUrl}
                        alt={`Caso de éxito de ${story.clientName}`}
                        fill
                        style={{ objectFit: "cover" }}
                        data-ai-hint={story.imageHint}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-3 text-foreground">{story.clientName}</h3>
                    </div>
                  </GlassCard>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
