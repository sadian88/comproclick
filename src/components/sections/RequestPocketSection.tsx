
// src/components/sections/RequestPocketSection.tsx
import React, { useState, useEffect } from "react";
import type { PersonalData, ProjectPocketItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { MessageSquare, PlusCircle, Trash2, Edit3, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ContactFormSection, { FormData as ContactFormData } from "./ContactFormSection"; 
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import * as z from "zod"; 

interface RequestPocketSectionProps {
  personalData: PersonalData;
  updatePersonalData: (field: keyof PersonalData, value: string) => void;
  projectPocket: ProjectPocketItem[];
  onClearAllData: () => void;
  onAddNewProject: () => void;
  onRemoveProject: (projectId: string) => void;
}

const WHATSAPP_NUMBER = "+573153042476"; 

const formatPersonalLabel = (key: keyof PersonalData): string => {
  const labels: Record<keyof PersonalData, string> = {
    fullName: "Nombre completo",
    companyName: "Empresa",
    phone: "Teléfono",
    email: "Email",
    country: "País",
  };
  return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const formatProjectLabel = (key: keyof Omit<ProjectPocketItem, 'id' | 'refinedIdea'>): string => {
    const labels: Record<string, string> = {
        projectType: "Tipo de proyecto",
        projectTypeOther: "Otro tipo",
        projectCategory: "Categoría",
        projectCategoryOther: "Otra categoría",
        timeline: "Plazo",
        idea: "Idea de Proyecto",
    };
    return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const formatProjectValue = (key: keyof Omit<ProjectPocketItem, 'id'>, value: string | undefined): string => {
  if (value === undefined || value === null || String(value).trim() === '') return "No especificado";
  
  if (key === 'projectType') {
    const map: Record<string, string> = { website: "Sitio web", mobile_app: "App móvil", other: "Otro" };
    return map[value] || value;
  }
  if (key === 'projectCategory') {
    const map: Record<string, string> = { commerce: "Comercio", online_store: "Tienda online", digital_catalog: "Catálogo digital", restaurant: "Restaurante", custom_order: "Pedido personalizado", other: "Otro" };
    return map[value] || value;
  }
  if (key === 'timeline') {
    const map: Record<string, string> = { short: "Corto (1–2 sem)", medium: "Mediano (3–5 sem)", long: "Largo (6+ sem)" };
    return map[value] || value;
  }
  return value;
};

const personalDataDisplayOrder: (keyof PersonalData)[] = ['fullName', 'email', 'phone', 'companyName', 'country'];
const projectDataDisplayOrder: (keyof Omit<ProjectPocketItem, 'id' | 'refinedIdea'>)[] = [
  'projectType',
  'projectTypeOther',
  'projectCategory',
  'projectCategoryOther',
  'timeline',
  'idea',
];

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Nombre completo es requerido.").max(100, "Nombre demasiado largo."),
  companyName: z.string().max(100, "Nombre de empresa demasiado largo.").optional().or(z.literal('')),
  phone: z.string().max(30, "Número de teléfono demasiado largo.").optional().or(z.literal('')),
  email: z.string().email("Email inválido.").max(100, "Email demasiado largo."),
  country: z.string().max(50, "Nombre de país demasiado largo.").optional().or(z.literal('')),
});


export default function RequestPocketSection({
  personalData,
  updatePersonalData,
  projectPocket,
  onClearAllData,
  onAddNewProject,
  onRemoveProject,
}: RequestPocketSectionProps) {
  
  const [showContactForm, setShowContactForm] = useState(false);
  const { toast } = useToast();
  const [isSubmittingViaParent, setIsSubmittingViaParent] = useState(false);

  const formMethods = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: personalData,
  });

  useEffect(() => {
    formMethods.reset(personalData);
  }, [personalData, formMethods]);

  const areEssentialDetailsFilledInProp = !!(personalData.fullName && personalData.fullName.trim() !== '' && personalData.email && personalData.email.trim() !== '');

  useEffect(() => {
    // Show form if there are projects but essential personal details are missing.
    // Hide form if essential details are filled, regardless of projects (user can still choose to edit).
    if (projectPocket.length > 0 && !areEssentialDetailsFilledInProp) {
      setShowContactForm(true);
    } else if (areEssentialDetailsFilledInProp) {
      setShowContactForm(false); 
    }
    // If no projects, form shouldn't show anyway based on overall page structure.
  }, [personalData.fullName, personalData.email, projectPocket.length, areEssentialDetailsFilledInProp]);

  const generateWhatsAppMessage = (currentPersonalData: PersonalData) => {
    let message = "Hola Compro.click 👋, tengo las siguientes solicitudes de proyecto:\n\n";
    message += "--- MIS DATOS DE CONTACTO ---\n";
    personalDataDisplayOrder.forEach(key => {
      const value = currentPersonalData[key];
      if (value && String(value).trim() !== '') {
        message += `*${formatPersonalLabel(key)}:* ${value}\n`;
      } else {
        message += `*${formatPersonalLabel(key)}:* No especificado\n`;
      }
    });
    message += "\n";

    if (projectPocket.length > 0) {
      projectPocket.forEach((project, index) => {
        message += `--- PROYECTO ${index + 1} ---\n`;
        projectDataDisplayOrder.forEach(key => {
            const pKey = key as keyof ProjectPocketItem;
            const value = project[pKey];

            if (pKey === 'projectTypeOther' && project.projectType !== 'other') return;
            if (pKey === 'projectCategoryOther' && project.projectCategory !== 'other') return;
            
            message += `*${formatProjectLabel(key)}:* ${formatProjectValue(pKey, value as string)}\n`;
        });
        if (project.refinedIdea && project.refinedIdea !== project.idea) {
             message += `*Idea Refinada (IA):* ${project.refinedIdea}\n`;
        }
        message += "\n";
      });
    } else {
      message += "Aún no he definido proyectos.\n\n";
    }

    message += "¡Espero su contacto para discutir más detalles!";
    return encodeURIComponent(message);
  };

  const handleContactDataSavedAndSend = (submittedData: ContactFormData) => {
    setIsSubmittingViaParent(true); // Indicate parent is handling submission logic
    // Update personalData state via prop - this is now done by ContactFormSection's internal submit
    // The parent (page.tsx) will re-render with updated personalData from useLocalStorage

    const essentialsFilledFromSubmit = !!(submittedData.fullName && submittedData.fullName.trim() !== '' && submittedData.email && submittedData.email.trim() !== '');

    if (essentialsFilledFromSubmit && projectPocket.length > 0) {
      const freshPersonalDataForMessage: PersonalData = {
        fullName: submittedData.fullName,
        email: submittedData.email,
        phone: submittedData.phone || '',
        companyName: submittedData.companyName || '',
        country: submittedData.country || '',
      };
      const message = generateWhatsAppMessage(freshPersonalDataForMessage);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      window.open(url, "_blank");
      toast({
        title: "Información Enviada",
        description: "Tus datos y proyectos se han preparado para enviar por WhatsApp.",
      });
      // setShowContactForm(false); // Let useEffect handle this based on updated props
    } else {
      toast({
        title: "Faltan Datos Críticos",
        description: "Por favor, asegúrate de que tu nombre, email y al menos un proyecto estén completos antes de enviar.",
        variant: "destructive",
      });
      if (!essentialsFilledFromSubmit) {
        setShowContactForm(true); // Explicitly keep form open if critical data *still* missing
      }
    }
     setIsSubmittingViaParent(false); // Reset submission indicator
  };
  
  const summaryItemTextClass = "text-foreground";
  const summaryItemLabelClass = "font-semibold text-primary text-sm";

  if (projectPocket.length === 0 && !showContactForm) { // Only show empty state if form is also not meant to be shown
    return (
        <GlassCard className="w-full max-w-2xl mx-auto my-8 text-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary mx-auto mb-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <h2 className="text-2xl md:text-3xl font-headline font-semibold text-primary">Bolsillo de Solicitudes Vacío</h2>
            <p className="text-muted-foreground mt-2 mb-6">Aún no has añadido proyectos. ¡Empieza a diseñar!</p>
            <Button onClick={onAddNewProject} className="px-6 py-3">
                <PlusCircle className="mr-2 h-5 w-5" />
                Añadir Nuevo Proyecto
            </Button>
        </GlassCard>
    )
  }

  // Determine button text and if WhatsApp icon should be included
  const submitButtonText = areEssentialDetailsFilledInProp ? "Actualizar y Enviar a WhatsApp" : "Guardar y Enviar a WhatsApp";
  const includeWhatsAppIcon = submitButtonText.toLowerCase().includes("whatsapp");

  return (
    <GlassCard className="w-full max-w-4xl mx-auto my-8">
      <div className="text-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary mx-auto mb-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-primary">Bolsillo de Solicitudes</h2>
        <p className="text-muted-foreground mt-2">
          {areEssentialDetailsFilledInProp && projectPocket.length > 0 
            ? "Revisa tus proyectos y datos. ¡Listo para enviar!"
            : "Completa tus datos y revisa tus proyectos para enviar."}
        </p>
      </div>

      {/* Contact Form Area: Shown if showContactForm is true AND there are projects */}
      {showContactForm && projectPocket.length > 0 && (
        <div className="mb-10 p-0 md:p-6 rounded-lg bg-background/10 dark:bg-card/10">
          <ContactFormSection
            personalData={personalData} // Pass current personalData for form defaults
            updatePersonalData={updatePersonalData} // Pass updater function
            onFormSubmit={handleContactDataSavedAndSend} // Callback after form's internal submit
            formMethods={formMethods} // Pass react-hook-form methods
            title={areEssentialDetailsFilledInProp ? "Editar Datos de Contacto" : ""}
            description={areEssentialDetailsFilledInProp ? "Modifica tu información si es necesario." : ""}
          />
          {/* Buttons are now part of this section when form is shown */}
          <div className="flex flex-col sm:flex-row justify-end items-center pt-6 gap-4 mt-0 sm:mt-0 px-0 md:px-6">
             <Button variant="outline" onClick={onAddNewProject} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-5 w-5" />
                Añadir Otro Proyecto
            </Button>
            <Button 
                type="submit" 
                form="contact-form" // Target the form inside ContactFormSection
                disabled={formMethods.formState.isSubmitting || isSubmittingViaParent || projectPocket.length === 0} 
                className="w-full sm:w-auto px-6 py-3 text-lg"
            >
                {(formMethods.formState.isSubmitting || isSubmittingViaParent) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {includeWhatsAppIcon && !(formMethods.formState.isSubmitting || isSubmittingViaParent) && <MessageSquare className="mr-2 h-5 w-5" />}
                {submitButtonText}
            </Button>
          </div>
        </div>
      )}

      {/* Display Personal Data Summary (if form is not shown and essentials are filled) */}
      {!showContactForm && areEssentialDetailsFilledInProp && (
        <div className="mb-8 p-5 rounded-lg bg-[hsl(var(--color-blanco-puro))]/15 dark:bg-[hsl(var(--card))]/15 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-accent flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-500" /> Tus Datos de Contacto
            </h3>
            <Button variant="outline" size="sm" onClick={() => setShowContactForm(true)} className="gap-1.5 text-xs">
              <Edit3 className="w-3.5 h-3.5" /> Editar Datos
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {personalDataDisplayOrder.map((key) => {
              const value = personalData[key];
              return (
                <div key={key} className="p-3 bg-[hsl(var(--background))]/20 rounded-md text-sm">
                  <span className={cn(summaryItemLabelClass, "text-accent/90")}>{formatPersonalLabel(key)}:</span>
                  <p className={cn(summaryItemTextClass, "whitespace-pre-wrap pt-0.5")}>
                    {value && String(value).trim() !== '' ? value : "No especificado"}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Alert for Incomplete Contact Data (if form is not shown, but essentials are missing AND there are projects) */}
      {!showContactForm && !areEssentialDetailsFilledInProp && projectPocket.length > 0 && (
         <div className="mb-8 p-5 rounded-lg bg-destructive/10 dark:bg-destructive/20 shadow-lg border border-destructive/50">
            <div className="flex items-center text-destructive mb-3">
                <ShieldAlert className="w-6 h-6 mr-3"/>
                <h3 className="text-xl font-semibold">Datos de Contacto Incompletos</h3>
            </div>
            <p className="text-destructive/90 mb-4 text-sm">
                Por favor, completa tu nombre completo y email para poder enviar tus solicitudes.
            </p>
            <Button variant="default" onClick={() => setShowContactForm(true)} className="gap-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                <Edit3 className="w-4 h-4" /> Completar y Enviar Ahora
            </Button>
        </div>
      )}

      {/* Project Pocket Display */}
      <h3 className="text-xl font-semibold text-primary mb-4">Proyectos en tu Bolsillo ({projectPocket.length})</h3>
      {projectPocket.length === 0 ? ( // This condition might be redundant if the whole component doesn't render for 0 projects
        <p className="text-muted-foreground text-center py-4">Aún no has añadido proyectos a tu bolsillo.</p>
      ) : (
        <div className="space-y-6 mb-8">
          {projectPocket.map((project, index) => (
            <div key={project.id} className={cn("p-4 backdrop-blur-md rounded-lg shadow-md border-0", "bg-[hsl(var(--color-blanco-puro))]/5 dark:bg-[hsl(var(--card))]/5 relative pt-10")}>
              <h4 className="text-lg font-semibold text-primary mb-3 absolute top-3 left-4">Proyecto {index + 1}</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onRemoveProject(project.id)} 
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 h-8 w-8"
                aria-label="Eliminar proyecto"
              >
                <Trash2 className="h-4 w-4"/>
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {projectDataDisplayOrder.map((key) => {
                  const pKey = key as keyof ProjectPocketItem; 
                  const value = project[pKey];
                  if (pKey === 'projectTypeOther' && project.projectType !== 'other') return null;
                  if (pKey === 'projectCategoryOther' && project.projectCategory !== 'other') return null;
                  
                  return (
                    <div key={pKey} className="py-1">
                      <span className={summaryItemLabelClass}>{formatProjectLabel(key)}:</span>
                      <p className={cn(summaryItemTextClass, "whitespace-pre-wrap text-sm")}>{formatProjectValue(pKey, value as string)}</p>
                    </div>
                  );
                })}
                 {project.refinedIdea && project.refinedIdea.trim() !== '' && project.refinedIdea !== project.idea && (
                  <div className="py-1 md:col-span-2">
                    <span className={cn(summaryItemLabelClass, "text-accent")}>Idea Refinada (IA):</span>
                    <p className={cn(summaryItemTextClass, "whitespace-pre-wrap text-sm bg-accent/10 p-2 rounded-md mt-1")}>{project.refinedIdea}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons (when contact form is NOT shown, but there are projects) */}
      {!showContactForm && projectPocket.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4 border-t border-border/50 mt-8">
            <Button variant="outline" onClick={onAddNewProject} className="w-full sm:w-auto px-6 py-3">
                <PlusCircle className="mr-2 h-5 w-5" />
                Añadir Otro Proyecto
            </Button>
            {/* This button is for sending if data is already filled and form is hidden */}
            {areEssentialDetailsFilledInProp && (
                 <Button 
                    onClick={() => {
                        setIsSubmittingViaParent(true); // Indicate submission
                        // Use the personalData prop here as form is not active
                        const message = generateWhatsAppMessage(personalData); 
                        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
                        window.open(url, "_blank");
                        toast({title: "Información Enviada", description: "Preparado para enviar por WhatsApp."});
                        setIsSubmittingViaParent(false); // Reset
                    }} 
                    disabled={isSubmittingViaParent || projectPocket.length === 0} // Disable if submitting or no projects
                    className="w-full sm:w-auto px-6 py-3 text-lg">
                    {isSubmittingViaParent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Enviar a WhatsApp
                </Button>
            )}
        </div>
      )}

       {/* Clear All Data Button - always available if there are projects or contact form might be shown */}
       {(projectPocket.length > 0 || showContactForm) && (
         <div className="mt-8 text-center">
            <Button variant="link" onClick={onClearAllData} className="text-muted-foreground hover:text-destructive">
              Limpiar bolsillo y datos (empezar de nuevo)
            </Button>
          </div>
        )}
    </GlassCard>
  );
}

