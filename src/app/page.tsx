// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProjectDesignerSection from "@/components/sections/ProjectDesignerSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import SummarySection from "@/components/sections/SummarySection";
import type { ProjectData, StepKey } from "@/lib/types";
import { initialProjectData } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import ThreeDShape from "@/components/ui/ThreeDShape";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<StepKey>("hero");
  const [projectData, setProjectData] = useLocalStorage<ProjectData>(
    "comproClickProject",
    initialProjectData
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Check if any relevant field has data (excluding initial empty strings)
      const hasData = Object.values(projectData).some(val => val && String(val).trim() !== '');
      if (currentStep !== 'summary' && hasData) { // Don't warn if on summary page or no data
        event.preventDefault();
        event.returnValue = "Tienes información sin enviar. ¿Estás seguro de que quieres salir?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [projectData, currentStep]);


  const updateProjectData = (field: keyof ProjectData, value: string) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  };

  const clearProjectData = () => {
    setProjectData(initialProjectData); // Resets to initial empty state
    setCurrentStep("hero"); // Go back to hero after clearing
  };
  
  const navigateTo = (step: StepKey) => {
    window.scrollTo(0, 0); // Scroll to top on step change
    setCurrentStep(step);
  };


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body relative overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="fixed -top-40 -left-40 opacity-30 dark:opacity-20 -z-10 animate-pulse">
        <ThreeDShape type="sphere" size={400} color="hsl(var(--color-azul-cielo-suave))" />
      </div>
      <div className="fixed -bottom-60 -right-60 opacity-20 dark:opacity-10 -z-10 animate-pulse animation-delay-1000">
        <ThreeDShape type="polyhedron" size={500} color="hsl(var(--color-lila-pastel))" />
      </div>
       <div className="fixed top-1/2 left-1/4 opacity-20 dark:opacity-10 -z-10 animate-pulse animation-delay-500 transform -translate-y-1/2">
        <ThreeDShape type="crystal" size={300} color="hsl(var(--color-rosa-claro))" />
      </div>


      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center relative z-10">
        {currentStep === "hero" && (
          <HeroSection onStartDesigning={() => navigateTo("type")} />
        )}
        {currentStep === "type" && (
          <ProjectDesignerSection 
            projectData={projectData} 
            updateProjectData={updateProjectData}
            onDesignerComplete={() => navigateTo("contact")}
            onBackToHero={() => navigateTo("hero")}
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
