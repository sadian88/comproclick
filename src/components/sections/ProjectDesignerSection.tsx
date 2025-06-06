import { useState } from "react";
import type { ProjectData } from "@/lib/types";
import Step1Type from "@/components/project-designer/Step1Type";
import Step2Category from "@/components/project-designer/Step2Category";
import Step3Timeline from "@/components/project-designer/Step3Timeline";

interface ProjectDesignerSectionProps {
  projectData: ProjectData;
  updateProjectData: (field: keyof ProjectData, value: string) => void;
  onDesignerComplete: () => void;
  onBackToHero: () => void;
}

type DesignerStep = 1 | 2 | 3;

export default function ProjectDesignerSection({
  projectData,
  updateProjectData,
  onDesignerComplete,
  onBackToHero
}: ProjectDesignerSectionProps) {
  const [currentDesignerStep, setCurrentDesignerStep] = useState<DesignerStep>(1);

  const handleNext = () => {
    if (currentDesignerStep < 3) {
      setCurrentDesignerStep((prev) => (prev + 1) as DesignerStep);
    } else {
      onDesignerComplete();
    }
  };

  const handlePrev = () => {
    if (currentDesignerStep > 1) {
      setCurrentDesignerStep((prev) => (prev - 1) as DesignerStep);
    } else {
        onBackToHero(); // Go back to hero from step 1
    }
  };

  return (
    <div className="py-12 md:py-16">
      {currentDesignerStep === 1 && (
        <Step1Type data={projectData} onChange={updateProjectData} onNext={handleNext} onPrev={handlePrev} />
      )}
      {currentDesignerStep === 2 && (
        <Step2Category data={projectData} onChange={updateProjectData} onNext={handleNext} onPrev={handlePrev} />
      )}
      {currentDesignerStep === 3 && (
        <Step3Timeline data={projectData} onChange={updateProjectData} onNext={handleNext} onPrev={handlePrev} />
      )}
    </div>
  );
}
