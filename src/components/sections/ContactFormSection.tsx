
import type { ProjectData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { refineProjectIdea, RefineProjectIdeaInput } from "@/ai/flows/refine-project-idea";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useCallback, useEffect } from "react";
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

const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};


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

  const handleRefineIdea = useCallback(async (text: string) => {
    if (text.length < 10 || text === projectData.refinedIdea) { 
      // Don't refine very short texts or if the current text is already the refined one
      // (prevents loop if AI returns same refined text as current input)
      if(text !== projectData.refinedIdea) setRefinedIdeaDisplay('');
      return;
    }
    setIsRefining(true);
    try {
      const input: RefineProjectIdeaInput = { projectIdea: text };
      const result = await refineProjectIdea(input);
      // Only update if the refined idea is different from the current input
      if (result.refinedIdea && result.refinedIdea !== text) {
        setRefinedIdeaDisplay(result.refinedIdea);
        updateProjectData('refinedIdea', result.refinedIdea); 
      } else {
        setRefinedIdeaDisplay(''); // Clear if AI returns same or empty
        updateProjectData('refinedIdea', '');
      }
    } catch (error) {
      console.error("Error refining idea:", error);
      setRefinedIdeaDisplay("No se pudo refinar la idea en este momento.");
      updateProjectData('refinedIdea', '');
    } finally {
      setIsRefining(false);
    }
  }, [updateProjectData, projectData.refinedIdea]);

  const debouncedRefineIdea = useCallback(debounce(handleRefineIdea, 1000), [handleRefineIdea]);

  useEffect(() => {
    // Only trigger refinement if the idea has changed and is not empty.
    // And if it's not the same as the last AI suggestion that wasn't adopted.
    if (currentIdea && currentIdea !== projectData.refinedIdea) {
      debouncedRefineIdea(currentIdea);
    }
  }, [currentIdea, debouncedRefineIdea, projectData.refinedIdea]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    Object.keys(data).forEach(keyStr => {
      const key = keyStr as keyof FormData;
      updateProjectData(key as keyof ProjectData, data[key] as string);
    });
    // Ensure the refinedIdea in projectData is the one submitted if it was used
    if (projectData.idea === projectData.refinedIdea && projectData.refinedIdea) {
      // No action needed, idea is already up-to-date
    } else if (projectData.refinedIdea && !refinedIdeaDisplay) { 
      // If refinedIdea exists in projectData but not in display, it means it was adopted.
      // We keep projectData.idea as is. Clear refinedIdea from projectData as it's now part of main idea.
      updateProjectData('refinedIdea', '');
    }
    onFormSubmit();
  };
  
  const handleUseRefinedIdea = () => {
    setValue("idea", refinedIdeaDisplay);
    updateProjectData('idea', refinedIdeaDisplay); // Update main state's idea
    updateProjectData('refinedIdea', refinedIdeaDisplay); // Store it as the current refined idea as well, to prevent immediate re-fetch if useEffect runs.
    setRefinedIdeaDisplay(''); // Clear the suggestion box after applying
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
                  Describe tu idea (¡Nuestra IA te ayudará a pulirla!) <span className="text-destructive">*</span>
                </label>
                <Textarea id="idea" {...field} placeholder="Cuéntanos en detalle qué tienes en mente y observa la magia de la IA..." rows={6} className="text-md" />
                {errors.idea && <p className="text-sm text-destructive mt-1">{errors.idea.message}</p>}
              </div>
            )}
          />
           {isRefining && (
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" />
              Nuestra IA está pensando en cómo mejorar tu idea...
            </div>
          )}
          {refinedIdeaDisplay && !isRefining && (
            <div className="mt-4 p-4 border border-dashed border-accent rounded-lg bg-accent/10">
              <h4 className="text-sm font-semibold text-accent mb-2 flex items-center">
                <Wand2 className="w-4 h-4 mr-2"/> ¡Potencia tu idea con IA! Sugerencia:
              </h4>
              <p className="text-sm text-foreground whitespace-pre-wrap">{refinedIdeaDisplay}</p>
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="mt-2 text-accent" 
                onClick={handleUseRefinedIdea}
              >
                Usar esta idea mejorada
              </Button>
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

    