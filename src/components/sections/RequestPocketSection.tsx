
// src/components/sections/RequestPocketSection.tsx
// This file is created to house the new "Bolsillo de Solicitudes" logic.
// The content is identical to the new SummarySection.tsx content provided above.

import type { PersonalData, ProjectPocketItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { MessageSquare, ArrowLeft, PlusCircle, Trash2, UserCircle, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestPocketSectionProps {
  personalData: PersonalData;
  projectPocket: ProjectPocketItem[];
  onClearAllData: () => void;
  onAddNewProject: () => void;
  onRemoveProject: (projectId: string) => void;
  // onEditProject: (projectId: string) => void; // Future enhancement
}

const WHATSAPP_NUMBER = "+573153042476"; // Ensure this is just numbers

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


export default function RequestPocketSection({
  personalData,
  projectPocket,
  onClearAllData,
  onAddNewProject,
  onRemoveProject,
}: RequestPocketSectionProps) {
  
  const generateWhatsAppMessage = () => {
    let message = "Hola Compro.click 👋, tengo las siguientes solicitudes de proyecto:\n\n";
    message += "--- MIS DATOS DE CONTACTO ---\n";
    personalDataDisplayOrder.forEach(key => {
      const value = personalData[key];
      if (value && String(value).trim() !== '') {
        message += `*${formatPersonalLabel(key)}:* ${value}\n`;
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

  const handleSendToWhatsApp = () => {
    if (!personalData.fullName || !personalData.email) {
      alert("Por favor, completa al menos tu nombre y email en tus datos de contacto antes de enviar.");
      // Ideally, navigate to personalDetails step or use a toast
      return;
    }
    if (projectPocket.length === 0) {
      alert("Por favor, añade al menos un proyecto a tu bolsillo antes de enviar.");
      // Ideally, navigate to projectDesigner step or use a toast
      return;
    }
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank");
  };

  const summaryItemBaseClass = "p-4 backdrop-blur-md rounded-lg shadow-md border-0";
  const summaryItemTextClass = "text-foreground";
  const summaryItemLabelClass = "font-semibold text-primary text-sm";

  return (
    <GlassCard className="w-full max-w-4xl mx-auto my-8">
      <div className="text-center mb-8">
        <ListChecks className="w-12 h-12 text-primary mx-auto mb-3" />
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-primary">Bolsillo de Solicitudes</h2>
        <p className="text-muted-foreground mt-2">Revisa tus datos y proyectos antes de enviar.</p>
      </div>

      {/* Personal Data Display */}
      <div className="mb-8 p-5 rounded-lg bg-[hsl(var(--color-blanco-puro))]/15 dark:bg-[hsl(var(--card))]/15 shadow-lg">
        <h3 className="text-xl font-semibold text-accent mb-4 flex items-center gap-2">
          <UserCircle className="w-6 h-6" /> Tus Datos de Contacto
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {personalDataDisplayOrder.map((key) => {
            const value = personalData[key];
            return (
              (value && String(value).trim() !== '') ? (
                <div key={key} className="p-3 bg-[hsl(var(--background))]/20 rounded-md text-sm">
                  <span className={cn(summaryItemLabelClass, "text-accent/90")}>{formatPersonalLabel(key)}:</span>
                  <p className={cn(summaryItemTextClass, "whitespace-pre-wrap pt-0.5")}>{value}</p>
                </div>
              ) : null 
            )
          })}
        </div>
         {(!personalData.fullName || !personalData.email) && (
            <p className="text-sm text-destructive mt-3">Por favor, completa tu nombre y email.</p>
        )}
      </div>

      {/* Project Pocket Display */}
      <h3 className="text-xl font-semibold text-primary mb-4">Proyectos en tu Bolsillo ({projectPocket.length})</h3>
      {projectPocket.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">Aún no has añadido proyectos a tu bolsillo.</p>
      ) : (
        <div className="space-y-6 mb-8">
          {projectPocket.map((project, index) => (
            <div key={project.id} className={cn(summaryItemBaseClass, "bg-[hsl(var(--color-blanco-puro))]/10 dark:bg-[hsl(var(--card))]/10 relative pt-10")}>
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
                  const pKey = key as keyof ProjectPocketItem; // Ensure correct key type
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
                    <span className="font-semibold text-accent text-sm">Idea Refinada (IA):</span>
                    <p className={cn(summaryItemTextClass, "whitespace-pre-wrap text-sm")}>{project.refinedIdea}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4 border-t border-border/50 mt-8">
        <Button variant="outline" onClick={onAddNewProject} className="w-full sm:w-auto px-6 py-3">
          <PlusCircle className="mr-2 h-5 w-5" />
          Añadir Otro Proyecto
        </Button>
        <Button 
            onClick={handleSendToWhatsApp} 
            className="w-full sm:w-auto px-6 py-3 text-lg font-semibold"
            disabled={projectPocket.length === 0 || !personalData.fullName || !personalData.email}
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Enviar Todo a WhatsApp
        </Button>
      </div>
       <div className="mt-8 text-center">
        <Button variant="link" onClick={onClearAllData} className="text-muted-foreground hover:text-destructive">
          Limpiar bolsillo y datos (empezar de nuevo)
        </Button>
      </div>
    </GlassCard>
  );
}
