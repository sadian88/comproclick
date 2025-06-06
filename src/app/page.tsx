
// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProjectDesignerSection from "@/components/sections/ProjectDesignerSection";
// ContactFormSection will be used within RequestPocketSection
import RequestPocketSection from "@/components/sections/RequestPocketSection";
import SuccessStoriesSection from "@/components/sections/SuccessStoriesSection";
import type { PersonalData, ProjectPocketItem, StepKey } from "@/lib/types";
import { initialPersonalData, initialProjectPocketItem } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<StepKey>("hero");

  const [personalData, setPersonalData] = useLocalStorage<PersonalData>(
    "comproClickUserContact",
    initialPersonalData
  );
  const [projectPocket, setProjectPocket] = useLocalStorage<ProjectPocketItem[]>(
    "comproClickProjectPocket",
    []
  );
  const [currentProjectData, setCurrentProjectData] = useState<Omit<ProjectPocketItem, 'id'>>(
    initialProjectPocketItem
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const hasUnsavedProjectData = Object.values(currentProjectData).some(val => val && String(val).trim() !== '');
      
      if (currentStep === 'projectDesigner' && hasUnsavedProjectData) {
        event.preventDefault();
        event.returnValue = "Tienes datos de proyecto sin añadir al bolsillo. ¿Estás seguro de que quieres salir?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentProjectData, currentStep]);


  const updatePersonalData = (field: keyof PersonalData, value: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
  };

  const updateCurrentProjectData = (field: keyof Omit<ProjectPocketItem, 'id'>, value: string) => {
    setCurrentProjectData((prev) => ({ ...prev, [field]: value }));
  };

  const addCurrentProjectToPocket = () => {
    const newProject: ProjectPocketItem = {
      ...currentProjectData,
      id: new Date().toISOString() + Math.random().toString(36).substring(2, 9),
    };
    setProjectPocket((prevPocket) => [...prevPocket, newProject]);
    setCurrentProjectData(initialProjectPocketItem); 
    navigateTo("requestPocket");
  };
  
  const clearAllData = () => {
    setPersonalData(initialPersonalData);
    setProjectPocket([]);
    setCurrentProjectData(initialProjectPocketItem);
    setCurrentStep("hero");
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem("comproClickUserContact");
      window.localStorage.removeItem("comproClickProjectPocket");
    }
  };

  const removeProjectFromPocket = (projectId: string) => {
    setProjectPocket(prevPocket => prevPocket.filter(p => p.id !== projectId));
  }
  
  const navigateTo = (step: StepKey) => {
    window.scrollTo(0, 0); 
    setCurrentStep(step);
  };

  const resetToHero = () => {
    setCurrentStep("hero");
    window.scrollTo(0, 0);
  };

  const handleStartDesigning = () => {
    navigateTo("projectDesigner"); // Directly to project designer
  };


  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground font-body relative overflow-x-hidden">
      <div
        className="fixed -z-10 top-[-30%] right-[-30%] w-[70vw] h-[70vw] rounded-full bg-[hsl(var(--color-azul-cielo-suave)/0.25)] filter blur-3xl opacity-70"
        style={{animation: 'pulse-bg 10s infinite alternate ease-in-out'}}
        aria-hidden="true"
      />
      <div
        className="fixed -z-10 bottom-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[hsl(var(--color-lila-pastel)/0.2)] filter blur-3xl opacity-60"
        style={{animation: 'pulse-bg 12s infinite alternate-reverse ease-in-out'}}
        aria-hidden="true"
      />
       <div
        className="fixed -z-10 top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[hsl(var(--color-rosa-claro)/0.15)] filter blur-3xl opacity-65"
        style={{animation: 'pulse-bg 11s infinite alternate ease-in-out'}}
        aria-hidden="true"
      />
       <style jsx global>{`
        @keyframes pulse-bg {
          0% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(1.05); opacity: 0.7; }
        }
      `}</style>

      <Header onLogoClick={resetToHero} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center relative z-10 w-full">
        {currentStep === "hero" && (
          <>
            <HeroSection onStartDesigning={handleStartDesigning} />
            <SuccessStoriesSection />
          </>
        )}
        {/* PersonalDetails step removed from direct navigation */}
        {currentStep === "projectDesigner" && (
          <ProjectDesignerSection 
            projectData={currentProjectData} 
            updateProjectData={updateCurrentProjectData}
            onDesignerComplete={addCurrentProjectToPocket}
            onBackToDesignerHome={() => navigateTo(projectPocket.length > 0 ? "requestPocket" : "hero" )}
          />
        )}
        {currentStep === "requestPocket" && (
          <RequestPocketSection 
            personalData={personalData}
            updatePersonalData={updatePersonalData} // Pass updater
            projectPocket={projectPocket}
            onClearAllData={clearAllData}
            onAddNewProject={() => navigateTo("projectDesigner")}
            onRemoveProject={removeProjectFromPocket}
            // onEditPersonalData is handled internally now
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
