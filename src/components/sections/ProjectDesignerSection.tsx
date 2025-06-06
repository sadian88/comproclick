
import { useState, useCallback } from "react";
import type { ProjectPocketItem } from "@/lib/types";
import Step1Type from "@/components/project-designer/Step1Type";
import Step2Category from "@/components/project-designer/Step2Category";
import Step3Timeline from "@/components/project-designer/Step3Timeline";
import Step4Idea from "@/components/project-designer/Step4Idea"; // New Step for Project Idea
import { refineProjectIdea, RefineProjectIdeaInput } from "@/ai/flows/refine-project-idea";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


interface ProjectDesignerSectionProps {
  projectData: Omit<ProjectPocketItem, 'id'>; // Data for the project currently being designed
  updateProjectData: (field: keyof Omit<ProjectPocketItem, 'id'>, value: string) => void;
  onDesignerComplete: () => void; // Called when the full project (including idea) is defined
  onBackToDesignerHome: () => void; // Goes back from step 1 (type)
}

type DesignerStep = 1 | 2 | 3 | 4; // Added step 4 for Idea

export default function ProjectDesignerSection({
  projectData,
  updateProjectData,
  onDesignerComplete,
  onBackToDesignerHome
}: ProjectDesignerSectionProps) {
  const [currentDesignerStep, setCurrentDesignerStep] = useState<DesignerStep>(1);
  const [isRefiningIdea, setIsRefiningIdea] = useState(false);
  const [refinedIdeaSuggestion, setRefinedIdeaSuggestion] = useState('');
  const { toast } = useToast();

  const handleNext = () => {
    if (currentDesignerStep < 4) { // Changed from 3 to 4
      setCurrentDesignerStep((prev) => (prev + 1) as DesignerStep);
    } else {
      // This is after Step 4 (Idea), so the project is complete.
      onDesignerComplete();
    }
  };

  const handlePrev = () => {
    if (currentDesignerStep > 1) {
      setCurrentDesignerStep((prev) => (prev - 1) as DesignerStep);
       setRefinedIdeaSuggestion(''); // Clear suggestion when going back
    } else {
        onBackToDesignerHome(); // Go back from step 1
    }
  };

  const handleTriggerIdeaRefinement = useCallback(async () => {
    if (!projectData.idea || projectData.idea.length < 10) {
      toast({ title: "Idea muy corta", description: "Describe un poco más tu idea para que la IA pueda ayudarte.", variant: "destructive" });
      return;
    }
    setIsRefiningIdea(true);
    setRefinedIdeaSuggestion('');
    updateProjectData('refinedIdea', ''); // Clear previous refined idea in main state

    try {
      const input: RefineProjectIdeaInput = { projectIdea: projectData.idea };
      const result = await refineProjectIdea(input);
      if (result.refinedIdea && result.refinedIdea !== projectData.idea) {
        setRefinedIdeaSuggestion(result.refinedIdea);
        // Do not update projectData.refinedIdea here yet, only on "Use this idea"
      } else if (result.refinedIdea === projectData.idea) {
        setRefinedIdeaSuggestion("¡Tu idea ya es genial! La IA no encontró mejoras significativas.");
      } else {
        setRefinedIdeaSuggestion('');
        toast({ title: "Error de IA", description: "No se pudo obtener una sugerencia en este momento.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error refining idea:", error);
      setRefinedIdeaSuggestion('');
      toast({ title: "Error de IA", description: "Ocurrió un error al refinar la idea.", variant: "destructive" });
    } finally {
      setIsRefiningIdea(false);
    }
  }, [projectData.idea, updateProjectData, toast]);

  const handleUseRefinedIdea = () => {
    if (refinedIdeaSuggestion && refinedIdeaSuggestion !== "¡Tu idea ya es genial! La IA no encontró mejoras significativas.") {
      updateProjectData('idea', refinedIdeaSuggestion); // Update main idea
      updateProjectData('refinedIdea', refinedIdeaSuggestion); // Store that this refined idea was adopted
      setRefinedIdeaSuggestion(''); // Clear the suggestion display
       toast({ title: "Idea Actualizada", description: "Has adoptado la sugerencia de la IA." });
    }
  };


  return (
    <div className="py-12 md:py-16 w-full max-w-2xl mx-auto">
      {currentDesignerStep === 1 && (
        <Step1Type data={projectData} onChange={updateProjectData} onNext={handleNext} onPrev={handlePrev} />
      )}
      {currentDesignerStep === 2 && (
        <Step2Category data={projectData} onChange={updateProjectData} onNext={handleNext} onPrev={handlePrev} />
      )}
      {currentDesignerStep === 3 && (
        <Step3Timeline data={projectData} onChange={updateProjectData} onNext={handleNext} onPrev={handlePrev} />
      )}
      {currentDesignerStep === 4 && (
        <Step4Idea 
          data={projectData} 
          onChange={updateProjectData} 
          onNext={handleNext}  // This is now onDesignerComplete
          onPrev={handlePrev}
          isRefining={isRefiningIdea}
          refinedSuggestion={refinedIdeaSuggestion}
          onTriggerRefinement={handleTriggerIdeaRefinement}
          onUseRefined={handleUseRefinedIdea}
        />
      )}
    </div>
  );
}
