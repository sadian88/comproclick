
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
    navigateTo("hero");
  };

  const handleStartDesigning = () => {
    navigateTo("projectDesigner");
  };


  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground font-body relative overflow-x-hidden">
      <div
        className="fixed -z-10 top-[-30%] right-[-30%] w-[70vw] h-[70vw] rounded-full bg-[hsl(var(--color-azul-cielo-suave)/0.4)] filter blur-3xl opacity-90"
        style={{animation: 'pulse-bg 10s infinite alternate ease-in-out'}}
        aria-hidden="true"
      />
      <div
        className="fixed -z-10 bottom-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[hsl(var(--color-lila-pastel)/0.35)] filter blur-3xl opacity-80"
        style={{animation: 'pulse-bg 12s infinite alternate-reverse ease-in-out'}}
        aria-hidden="true"
      />
       <div
        className="fixed -z-10 top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[hsl(var(--color-rosa-claro)/0.3)] filter blur-3xl opacity-85"
        style={{animation: 'pulse-bg 11s infinite alternate ease-in-out'}}
        aria-hidden="true"
      />
       <style jsx global>{`
        @keyframes pulse-bg {
          0% { transform: scale(0.95); opacity: 0.75; }
          100% { transform: scale(1.05); opacity: 0.95; }
        }
      `}</style>

      <Header onLogoClick={resetToHero} onNavigateToDesigner={handleStartDesigning} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center relative z-10 w-full">
        {currentStep === "hero" && (
          <>
            <HeroSection onStartDesigning={handleStartDesigning} />
            <SuccessStoriesSection />
          </>
        )}
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
            updatePersonalData={updatePersonalData} 
            projectPocket={projectPocket}
            onClearAllData={clearAllData}
            onAddNewProject={() => navigateTo("projectDesigner")}
            onRemoveProject={removeProjectFromPocket}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

