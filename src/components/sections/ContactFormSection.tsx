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
  projectData: ProjectData; // Pass existing data to prefill if needed, though this form has its own state
  updateProjectData: (field: keyof ProjectData, value: string) => void; // To update the main projectData
  onFormSubmit: () => void; // Callback after successful submission to move to summary
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

// Debounce function
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
    if (text.length < 10) { // Don't refine very short texts
      setRefinedIdeaDisplay('');
      return;
    }
    setIsRefining(true);
    try {
      const input: RefineProjectIdeaInput = { projectIdea: text };
      const result = await refineProjectIdea(input);
      setRefinedIdeaDisplay(result.refinedIdea);
      updateProjectData('refinedIdea', result.refinedIdea); // Store AI refined idea in main state
    } catch (error) {
      console.error("Error refining idea:", error);
      setRefinedIdeaDisplay("No se pudo refinar la idea en este momento.");
    } finally {
      setIsRefining(false);
    }
  }, [updateProjectData]);

  const debouncedRefineIdea = useCallback(debounce(handleRefineIdea, 1000), [handleRefineIdea]);

  useEffect(() => {
    if (currentIdea) {
      debouncedRefineIdea(currentIdea);
    }
  }, [currentIdea, debouncedRefineIdea]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    Object.keys(data).forEach(keyStr => {
      const key = keyStr as keyof FormData;
      updateProjectData(key as keyof ProjectData, data[key] as string);
    });
    onFormSubmit();
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
                <label htmlFor="idea" className="block text-sm font-medium mb-1">Describe tu idea <span className="text-destructive">*</span></label>
                <Textarea id="idea" {...field} placeholder="Cuéntanos en detalle qué tienes en mente..." rows={6} className="text-md" />
                {errors.idea && <p className="text-sm text-destructive mt-1">{errors.idea.message}</p>}
              </div>
            )}
          />
           {isRefining && (
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" />
              Refinando tu idea con IA...
            </div>
          )}
          {refinedIdeaDisplay && !isRefining && (
            <div className="mt-4 p-4 border border-dashed border-accent rounded-lg bg-accent/10">
              <h4 className="text-sm font-semibold text-accent mb-2 flex items-center"><Wand2 className="w-4 h-4 mr-2"/> Sugerencia IA:</h4>
              <p className="text-sm text-foreground whitespace-pre-wrap">{refinedIdeaDisplay}</p>
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="mt-2 text-accent" 
                onClick={() => {
                  setValue("idea", refinedIdeaDisplay);
                  updateProjectData('idea', refinedIdeaDisplay); // Update main state
                }}
              >
                Usar esta idea
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
