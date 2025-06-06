import type { ProjectData } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StepWrapper from "./StepWrapper";

interface Step1TypeProps {
  data: ProjectData;
  onChange: (field: keyof ProjectData, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const projectTypes = [
  { id: "website", label: "Sitio web" },
  { id: "mobile_app", label: "App móvil" },
  { id: "other", label: "Otro" },
];

export default function Step1Type({ data, onChange, onNext, onPrev }: Step1TypeProps) {
  const isNextDisabled = !data.projectType || (data.projectType === "other" && !data.projectTypeOther);

  return (
    <StepWrapper title="Paso 1: ¿Qué quieres crear?" onNext={onNext} onPrev={onPrev} isNextDisabled={isNextDisabled}>
      <RadioGroup
        value={data.projectType}
        onValueChange={(value) => onChange("projectType", value)}
        className="space-y-4"
      >
        {projectTypes.map((type) => (
          <div 
            key={type.id} 
            className="flex items-center space-x-3 p-5 border border-transparent rounded-lg bg-background/30 hover:bg-primary/10 transition-all duration-200 cursor-pointer has-[:checked]:bg-primary/20 has-[:checked]:border-primary/50 has-[:checked]:shadow-lg"
          >
            <RadioGroupItem value={type.id} id={`type-${type.id}`} className="border-foreground/50"/>
            <Label htmlFor={`type-${type.id}`} className="text-lg font-medium cursor-pointer flex-grow text-foreground/90 has-[:checked]:text-primary">{type.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {data.projectType === "other" && (
        <Input
          type="text"
          placeholder="Especifica el tipo de proyecto"
          value={data.projectTypeOther || ""}
          onChange={(e) => onChange("projectTypeOther", e.target.value)}
          className="mt-6" // Increased margin-top
        />
      )}
    </StepWrapper>
  );
}
