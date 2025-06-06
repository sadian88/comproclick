
import type { ProjectData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { refineProjectIdea, RefineProjectIdeaInput } from "@/ai/flows/refine-project-idea";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useCallback } from "react";
import { Loader2, Wand2 } from "lucide-react";

interface ContactFormSectionProps {
  projectData: ProjectData;
  updateProjectData: (field: keyof ProjectData, value: string) => void;
  onFormSubmit: () => void;
  onPrev: () => void;
}

const formSchema = z.object({
  fullName: z.string().min(2, "Nombre completo es requerido."),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido."),
  country: z.string().optional(),
  idea: z.string().min(10, "Describe tu idea con al menos 10 caracteres."),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactFormSection({ projectData, updateProjectData, onFormSubmit, onPrev }: ContactFormSectionProps) {
  const [isRefining, setIsRefining] = useState(false);
  const [refinedIdeaDisplay, setRefinedIdeaDisplay] = useState('');
  
  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: projectData.fullName || "",
      companyName: projectData.companyName || "",
      phone: projectData.phone || "",
      email: projectData.email || "",
      country: projectData.country || "",
      idea: projectData.idea || "",
    },
  });

  const currentIdea = watch("idea");

  const handleTriggerRefinement = useCallback(async () => {
    if (currentIdea.length < 10) {
      // Optionally, show a toast or message that idea is too short
      return;
    }
    setIsRefining(true);
    setRefinedIdeaDisplay(''); // Clear previous suggestion
    updateProjectData('refinedIdea', ''); // Clear from main state too
    try {
      const input: RefineProjectIdeaInput = { projectIdea: currentIdea };
      const result = await refineProjectIdea(input);
      if (result.refinedIdea && result.refinedIdea !== currentIdea) {
        setRefinedIdeaDisplay(result.refinedIdea);
        updateProjectData('refinedIdea', result.refinedIdea); 
      } else if (result.refinedIdea === currentIdea) {
        setRefinedIdeaDisplay("¡Tu idea ya es genial! La IA no encontró mejoras significativas.");
         updateProjectData('refinedIdea', '');
      } else {
        setRefinedIdeaDisplay(''); 
        updateProjectData('refinedIdea', '');
      }
    } catch (error) {
      console.error("Error refining idea:", error);
      setRefinedIdeaDisplay("No se pudo refinar la idea en este momento.");
      updateProjectData('refinedIdea', '');
    } finally {
      setIsRefining(false);
    }
  }, [currentIdea, updateProjectData]);


  const onSubmit: SubmitHandler<FormData> = (data) => {
    Object.keys(data).forEach(keyStr => {
      const key = keyStr as keyof FormData;
      updateProjectData(key as keyof ProjectData, data[key] as string);
    });
    // If a refined idea was displayed and NOT adopted, we should clear it from projectData
    // If it WAS adopted, 'idea' field in form (and thus projectData.idea) is already updated.
    // If 'refinedIdea' in projectData is the same as the current idea, it means it was adopted.
    // If 'refinedIdea' is different from current idea, and refinedIdeaDisplay is empty, it means
    // a suggestion was shown, but user didn't click "Use this idea" and modified the textarea directly.
    // So, we trust projectData.idea as the source of truth.
    // The refinedIdea in projectData should only persist if it's the *active* suggestion not yet adopted.
    // If user submits, and refinedIdeaDisplay is empty, it means they didn't adopt the *last* suggestion.
     if (projectData.idea !== projectData.refinedIdea) {
        updateProjectData('refinedIdea', ''); // Clear if not adopted or different
     }
    onFormSubmit();
  };
  
  const handleUseRefinedIdea = () => {
    setValue("idea", refinedIdeaDisplay); // Update form field
    updateProjectData('idea', refinedIdeaDisplay); // Update main state's idea
    // Keep projectData.refinedIdea as is (it's now the same as projectData.idea)
    // or clear refinedIdeaDisplay and projectData.refinedIdea if we want the AI suggestion to disappear fully after adoption
    setRefinedIdeaDisplay(''); 
    // updateProjectData('refinedIdea', ''); // Option: clear it if you don't want it sent to summary if it matches main idea
  };

  return (
    <GlassCard className="w-full max-w-3xl mx-auto my-12 shadow-xl">
      <h2 className="text-2xl md:text-3xl font-headline font-semibold mb-8 text-center text-primary">Cuéntanos sobre tu proyecto</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">Nombre completo <span className="text-destructive">*</span></label>
                <Input id="fullName" {...field} placeholder="Ej: Ada Lovelace" />
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
              </div>
            )}
          />
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-1">Nombre de empresa (Opcional)</label>
                <Input id="companyName" {...field} placeholder="Ej: Innovatech Solutions" />
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Teléfono (Opcional)</label>
                <Input id="phone" type="tel" {...field} placeholder="Ej: +57 300 123 4567" />
              </div>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email <span className="text-destructive">*</span></label>
                <Input id="email" type="email" {...field} placeholder="Ej: ada@example.com" />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
            )}
          />
        </div>

        <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-1">País (Opcional)</label>
                <Input id="country" {...field} placeholder="Ej: Colombia" />
              </div>
            )}
          />
        
        <div>
          <Controller
            name="idea"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="idea" className="block text-sm font-medium mb-1">
                  Describe tu idea de proyecto <span className="text-destructive">*</span>
                </label>
                <Textarea id="idea" {...field} placeholder="Cuéntanos en detalle qué tienes en mente..." rows={6} className="text-md" />
                {errors.idea && <p className="text-sm text-destructive mt-1">{errors.idea.message}</p>}
              </div>
            )}
          />
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTriggerRefinement}
              disabled={isRefining || currentIdea.length < 10}
              className="gap-2 bg-accent/10 hover:bg-accent/20 border-accent/30 text-accent"
            >
              {isRefining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {isRefining ? "Refinando..." : "Refinar idea con IA"}
            </Button>
          </div>

           {isRefining && !refinedIdeaDisplay && ( // Show general refining message only if there's no specific refined idea yet
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" />
              Nuestra IA está pensando en cómo mejorar tu idea...
            </div>
          )}
          {refinedIdeaDisplay && ( // Show this block if there is a refined idea to display
            <div className="mt-4 p-4 border border-dashed border-accent rounded-lg bg-accent/10">
              <h4 className="text-sm font-semibold text-accent mb-2 flex items-center">
                <Wand2 className="w-4 h-4 mr-2"/> Sugerencia de la IA:
              </h4>
              <p className="text-sm text-foreground whitespace-pre-wrap">{refinedIdeaDisplay}</p>
              {refinedIdeaDisplay !== "¡Tu idea ya es genial! La IA no encontró mejoras significativas." && refinedIdeaDisplay !== "No se pudo refinar la idea en este momento." && (
                 <Button 
                    type="button" 
                    variant="link" 
                    size="sm" 
                    className="mt-2 text-accent px-0"
                    onClick={handleUseRefinedIdea}
                  >
                  Usar esta idea mejorada
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={onPrev} disabled={isSubmitting} className="px-6 py-3">
            Anterior
          </Button>
          <Button type="submit" disabled={isSubmitting || isRefining} className="px-6 py-3">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Ver Resumen del Proyecto
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}

    
