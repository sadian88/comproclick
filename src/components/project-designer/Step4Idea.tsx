
// src/components/project-designer/Step4Idea.tsx
import type { ProjectPocketItem } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import StepWrapper from "./StepWrapper";
import { Loader2, Wand2 } from "lucide-react";

interface Step4IdeaProps {
  data: Omit<ProjectPocketItem, 'id'>;
  onChange: (field: keyof Omit<ProjectPocketItem, 'id'>, value: string) => void;
  onNext: () => void; // This will be onDesignerComplete from ProjectDesignerSection
  onPrev: () => void;
  isRefining: boolean;
  refinedSuggestion: string;
  onTriggerRefinement: () => void;
  onUseRefined: () => void;
}

export default function Step4Idea({ 
  data, 
  onChange, 
  onNext, 
  onPrev,
  isRefining,
  refinedSuggestion,
  onTriggerRefinement,
  onUseRefined
}: Step4IdeaProps) {
  const isNextDisabled = !data.idea || data.idea.trim().length < 10 || isRefining;

  return (
    <StepWrapper 
      title="Paso 4: Describe tu Idea de Proyecto" 
      onNext={onNext} 
      onPrev={onPrev} 
      nextButtonText="Añadir Proyecto al Bolsillo" 
      isNextDisabled={isNextDisabled}
    >
      <div>
        <label htmlFor="projectIdea" className="block text-sm font-medium mb-1">
          Tu idea <span className="text-destructive">*</span>
        </label>
        <Textarea 
          id="projectIdea" 
          value={data.idea || ""}
          onChange={(e) => onChange("idea", e.target.value)}
          placeholder="Describe detalladamente qué necesitas o qué problema quieres resolver..." 
          rows={8} 
          className="text-md"
        />
        {data.idea && data.idea.trim().length > 0 && data.idea.trim().length < 10 && (
            <p className="text-sm text-destructive mt-1">Describe tu idea con al menos 10 caracteres.</p>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onTriggerRefinement}
          disabled={isRefining || !data.idea || data.idea.length < 10}
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

      {isRefining && !refinedSuggestion && (
        <div className="mt-3 flex items-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" />
          Nuestra IA está pensando en cómo mejorar tu idea...
        </div>
      )}
      {refinedSuggestion && (
        <div className="mt-4 p-4 border border-dashed border-accent rounded-lg bg-accent/10">
          <h4 className="text-sm font-semibold text-accent mb-2 flex items-center">
            <Wand2 className="w-4 h-4 mr-2"/> Sugerencia de la IA:
          </h4>
          <p className="text-sm text-foreground whitespace-pre-wrap">{refinedSuggestion}</p>
          {refinedSuggestion !== "¡Tu idea ya es genial! La IA no encontró mejoras significativas." && (
             <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="mt-2 text-accent px-0"
                onClick={onUseRefined}
              >
              Usar esta idea mejorada
            </Button>
          )}
        </div>
      )}
    </StepWrapper>
  );
}
