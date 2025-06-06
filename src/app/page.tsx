
// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProjectDesignerSection from "@/components/sections/ProjectDesignerSection";
import ContactFormSection from "@/components/sections/ContactFormSection"; // Will be for PersonalData
import RequestPocketSection from "@/components/sections/RequestPocketSection"; // Was SummarySection
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
      const hasPersonalData = Object.values(personalData).some(val => val && String(val).trim() !== '');
      
      if ( (currentStep === 'projectDesigner' && hasUnsavedProjectData) || 
           (currentStep === 'personalDetails' && hasPersonalData && projectPocket.length === 0) ) {
        event.preventDefault();
        event.returnValue = "Tienes información sin guardar/enviar. ¿Estás seguro de que quieres salir?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [personalData, currentProjectData, projectPocket, currentStep]);


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

  const arePersonalDetailsFilled = () => {
    return personalData.fullName && personalData.email; 
  };

  const handleStartDesigning = () => {
    if (arePersonalDetailsFilled()) {
      navigateTo("projectDesigner");
    } else {
      navigateTo("personalDetails");
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground font-body relative overflow-x-hidden">
      <div
        className="fixed -z-10 top-[-30%] right-[-30%] w-[70vw] h-[70vw] rounded-full bg-[hsl(var(--color-azul-cielo-suave)/0.15)] filter blur-3xl"
        aria-hidden="true"
      />
      <div
        className="fixed -z-10 bottom-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[hsl(var(--color-lila-pastel)/0.1)] filter blur-3xl"
        aria-hidden="true"
      />
       <div
        className="fixed -z-10 top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[hsl(var(--color-rosa-claro)/0.1)] filter blur-3xl"
        aria-hidden="true"
      />

      <Header onLogoClick={resetToHero} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center relative z-10 w-full">
        {currentStep === "hero" && (
          <>
            <HeroSection onStartDesigning={handleStartDesigning} />
            <SuccessStoriesSection />
          </>
        )}
        {currentStep === "personalDetails" && (
          <ContactFormSection
            personalData={personalData}
            updatePersonalData={updatePersonalData}
            onFormSubmit={() => navigateTo("projectDesigner")}
            onPrev={resetToHero}
          />
        )}
        {currentStep === "projectDesigner" && (
          <ProjectDesignerSection 
            projectData={currentProjectData} 
            updateProjectData={updateCurrentProjectData}
            onDesignerComplete={addCurrentProjectToPocket}
            onBackToDesignerHome={() => navigateTo(projectPocket.length > 0 ? "requestPocket" : "personalDetails" )}
          />
        )}
        {currentStep === "requestPocket" && (
          <RequestPocketSection 
            personalData={personalData}
            projectPocket={projectPocket}
            onClearAllData={clearAllData}
            onAddNewProject={() => navigateTo("projectDesigner")}
            onRemoveProject={removeProjectFromPocket}
            onEditPersonalData={() => navigateTo("personalDetails")}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
