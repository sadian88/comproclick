import type { ProjectData } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StepWrapper from "./StepWrapper";

interface Step3TimelineProps {
  data: ProjectData;
  onChange: (field: keyof ProjectData, value: string) => void;
  onNext: () => void;
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
    <StepWrapper title="Paso 3: ¿En cuánto tiempo lo necesitas?" onNext={onNext} onPrev={onPrev} nextButtonText="Ir al formulario" isNextDisabled={isNextDisabled}>
      <RadioGroup
        value={data.timeline}
        onValueChange={(value) => onChange("timeline", value)}
        className="space-y-4"
      >
        {projectTimelines.map((timeline) => (
          <div key={timeline.id} className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer has-[:checked]:bg-secondary has-[:checked]:border-primary">
            <RadioGroupItem value={timeline.id} id={`timeline-${timeline.id}`} />
            <Label htmlFor={`timeline-${timeline.id}`} className="text-lg cursor-pointer flex-grow">{timeline.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </StepWrapper>
  );
}
