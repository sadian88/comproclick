import type { ProjectData } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StepWrapper from "./StepWrapper";

interface Step2CategoryProps {
  data: ProjectData;
  onChange: (field: keyof ProjectData, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const projectCategories = [
  { id: "commerce", label: "Comercio" },
  { id: "online_store", label: "Tienda online" },
  { id: "digital_catalog", label: "Catálogo digital" },
  { id: "restaurant", label: "Restaurante" },
  { id: "custom_order", label: "Pedido personalizado" },
  { id: "other", label: "Otro" },
];

export default function Step2Category({ data, onChange, onNext, onPrev }: Step2CategoryProps) {
  const isNextDisabled = !data.projectCategory || (data.projectCategory === "other" && !data.projectCategoryOther);
  
  return (
    <StepWrapper title="Paso 2: ¿Qué tipo de proyecto es?" onNext={onNext} onPrev={onPrev} isNextDisabled={isNextDisabled}>
      <RadioGroup
        value={data.projectCategory}
        onValueChange={(value) => onChange("projectCategory", value)}
        className="space-y-4"
      >
        {projectCategories.map((category) => (
          <div 
            key={category.id} 
            className="flex items-center space-x-3 p-5 border border-transparent rounded-lg bg-background/30 hover:bg-primary/10 transition-all duration-200 cursor-pointer has-[:checked]:bg-primary/20 has-[:checked]:border-primary/50 has-[:checked]:shadow-lg"
          >
            <RadioGroupItem value={category.id} id={`category-${category.id}`} className="border-foreground/50"/>
            <Label htmlFor={`category-${category.id}`} className="text-lg font-medium cursor-pointer flex-grow text-foreground/90 has-[:checked]:text-primary">{category.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {data.projectCategory === "other" && (
        <Input
          type="text"
          placeholder="Especifica la categoría del proyecto"
          value={data.projectCategoryOther || ""}
          onChange={(e) => onChange("projectCategoryOther", e.target.value)}
          className="mt-6" // Increased margin-top
        />
      )}
    </StepWrapper>
  );
}
