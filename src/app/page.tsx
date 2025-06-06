// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProjectDesignerSection from "@/components/sections/ProjectDesignerSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import SummarySection from "@/components/sections/SummarySection";
import SuccessStoriesSection from "@/components/sections/SuccessStoriesSection";
import type { ProjectData, StepKey } from "@/lib/types";
import { initialProjectData } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<StepKey>("hero");
  const [projectData, setProjectData] = useLocalStorage<ProjectData>(
    "comproClickProject",
    initialProjectData
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const hasData = Object.values(projectData).some(val => val && String(val).trim() !== '');
      if (currentStep !== 'summary' && hasData) {
        event.preventDefault();
        event.returnValue = "Tienes información sin enviar. ¿Estás seguro de que quieres salir?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [projectData, currentStep]);

  // Removed useEffect for mousemove tracking as the dynamic gradient is removed

  const updateProjectData = (field: keyof ProjectData, value: string) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  };

  const clearProjectData = () => {
    setProjectData(initialProjectData); 
    setCurrentStep("hero"); 
  };
  
  const navigateTo = (step: StepKey) => {
    window.scrollTo(0, 0); 
    setCurrentStep(step);
  };

  const resetToHero = () => {
    setCurrentStep("hero");
    window.scrollTo(0, 0);
  };


  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground font-body relative overflow-x-hidden">
      {/* New soft blurred background shapes */}
      <div
        className="fixed -z-10 top-[-30%] right-[-30%] w-[70vw] h-[70vw] rounded-full bg-[hsl(var(--color-azul-cielo-suave)/0.15)] filter blur-3xl"
        aria-hidden="true"
      />
      <div
        className="fixed -z-10 bottom-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[hsl(var(--color-azul-cielo-suave)/0.1)] filter blur-3xl"
        aria-hidden="true"
      />
       <div
        className="fixed -z-10 top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[hsl(var(--color-lila-pastel)/0.1)] filter blur-3xl"
        aria-hidden="true"
      />


      <Header onLogoClick={resetToHero} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center relative z-10 w-full">
        {currentStep === "hero" && (
          <>
            <HeroSection onStartDesigning={() => navigateTo("type")} />
            <SuccessStoriesSection />
          </>
        )}
        {currentStep === "type" && (
          <ProjectDesignerSection 
            projectData={projectData} 
            updateProjectData={updateProjectData}
            onDesignerComplete={() => navigateTo("contact")}
            onBackToHero={resetToHero}
          />
        )}
        {currentStep === "contact" && (
          <ContactFormSection
            projectData={projectData}
            updateProjectData={updateProjectData}
            onFormSubmit={() => navigateTo("summary")}
            onPrev={() => navigateTo("type")}
          />
        )}
        {currentStep === "summary" && (
          <SummarySection 
            projectData={projectData} 
            onPrev={() => navigateTo("contact")}
            onClearData={clearProjectData}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
