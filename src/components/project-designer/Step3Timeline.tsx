
import type { ProjectPocketItem } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StepWrapper from "./StepWrapper";

interface Step3TimelineProps {
  data: Omit<ProjectPocketItem, 'id'>;
  onChange: (field: keyof Omit<ProjectPocketItem, 'id'>, value: string) => void;
  onNext: () => void; // Will go to Project Idea step
  onPrev: () => void;
}

const projectTimelines = [
  { id: "short", label: "Corto plazo (1–2 semanas)" },
  { id: "medium", label: "Mediano plazo (3–5 semanas)" },
  { id: "long", label: "Largo plazo (6+ semanas)" },
];

export default function Step3Timeline({ data, onChange, onNext, onPrev }: Step3TimelineProps) {
  const isNextDisabled = !data.timeline;

  return (
    <StepWrapper title="Paso 3: ¿En cuánto tiempo lo necesitas?" onNext={onNext} onPrev={onPrev} nextButtonText="Siguiente: Describe tu Idea" isNextDisabled={isNextDisabled}>
      <RadioGroup
        value={data.timeline}
        onValueChange={(value) => onChange("timeline", value)}
        className="space-y-4"
      >
        {projectTimelines.map((timeline) => (
           <div 
            key={timeline.id} 
            className="flex items-center space-x-3 p-5 border border-transparent rounded-lg bg-background/30 hover:bg-primary/10 transition-all duration-200 cursor-pointer has-[:checked]:bg-primary/20 has-[:checked]:border-primary/50 has-[:checked]:shadow-lg"
          >
            <RadioGroupItem value={timeline.id} id={`timeline-${timeline.id}`} className="border-foreground/50"/>
            <Label htmlFor={`timeline-${timeline.id}`} className="text-lg font-medium cursor-pointer flex-grow text-foreground/90 has-[:checked]:text-primary">{timeline.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </StepWrapper>
  );
}
