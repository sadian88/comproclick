
import type { ProjectData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { CheckCircle, MessageSquare, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummarySectionProps {
  projectData: ProjectData;
  onPrev: () => void;
  onClearData: () => void;
}

const WHATSAPP_NUMBER = "+573153042476"; // Ensure this is just numbers

const formatLabel = (key: string): string => {
  const labels: Record<string, string> = {
    projectType: "Tipo de proyecto",
    projectTypeOther: "Otro tipo de proyecto",
    projectCategory: "Categoría del proyecto",
    projectCategoryOther: "Otra categoría",
    timeline: "Plazo estimado",
    fullName: "Nombre completo",
    companyName: "Empresa",
    phone: "Teléfono",
    email: "Email",
    country: "País",
    idea: "Tu idea",
    refinedIdea: "Idea refinada (IA)",
  };
  return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const formatValue = (key: keyof ProjectData, value: string | undefined): string => {
  if (value === undefined || value === null || value.trim() === '') return "No especificado";
  
  if (key === 'projectType') {
    const map: Record<string, string> = { website: "Sitio web", mobile_app: "App móvil", other: "Otro (ver detalle)" };
    return map[value] || value;
  }
  if (key === 'projectCategory') {
    const map: Record<string, string> = { commerce: "Comercio", online_store: "Tienda online", digital_catalog: "Catálogo digital", restaurant: "Restaurante", custom_order: "Pedido personalizado", other: "Otro (ver detalle)" };
    return map[value] || value;
  }
  if (key === 'timeline') {
    const map: Record<string, string> = { short: "Corto plazo (1–2 semanas)", medium: "Mediano plazo (3–5 semanas)", long: "Largo plazo (6+ semanas)" };
    return map[value] || value;
  }
  return value;
}

// Defines the order and completeness of fields for both UI and WhatsApp
const allProjectDataKeys: (keyof ProjectData)[] = [
  'projectType',
  'projectTypeOther',
  'projectCategory',
  'projectCategoryOther',
  'timeline',
  'fullName',
  'companyName',
  'email',
  'phone',
  'country',
  'idea',
  // 'refinedIdea' is handled separately for display and WhatsApp due to its conditional nature
];

export default function SummarySection({ projectData, onPrev, onClearData }: SummarySectionProps) {
  
  const generateWhatsAppMessage = () => {
    let message = "Hola Compro.click 👋, estoy interesado en un proyecto:\n\n";
    
    allProjectDataKeys.forEach(key => {
        const value = projectData[key];

        // Conditional skips for 'other' fields if their parent is not 'other'
        if (key === 'projectTypeOther' && projectData.projectType !== 'other') return;
        if (key === 'projectCategoryOther' && projectData.projectCategory !== 'other') return;
        
        message += `*${formatLabel(key)}:* ${formatValue(key, value)}\n`;
    });
    
    // Handle refinedIdea separately and conditionally
    if (projectData.refinedIdea && projectData.refinedIdea.trim() !== '' && projectData.refinedIdea !== projectData.idea) {
        message += `*${formatLabel('refinedIdea')}:* ${projectData.refinedIdea}\n`; // refinedIdea is a string, use directly
    }

    message += "\n¡Espero su contacto para discutir más detalles!";
    return encodeURIComponent(message);
  };

  const handleSendToWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank");
  };

  const summaryItemBaseClass = "p-4 backdrop-blur-md rounded-lg shadow-lg border-0";
  const summaryItemTextClass = "text-foreground";
  const summaryItemLabelClass = "font-semibold text-primary";

  return (
    <GlassCard className="w-full max-w-3xl mx-auto my-12">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-primary">Resumen de tu Proyecto</h2>
        <p className="text-muted-foreground mt-2">Revisa los detalles de tu solicitud antes de enviarla.</p>
      </div>
      
      <div className="space-y-4 mb-8">
        {allProjectDataKeys.map((key) => {
          const value = projectData[key];

          // Conditional skips for 'other' fields in UI display
          if (key === 'projectTypeOther' && projectData.projectType !== 'other') return null;
          if (key === 'projectCategoryOther' && projectData.projectCategory !== 'other') return null;
          
          return (
            <div key={key} className={cn(summaryItemBaseClass, "bg-[hsl(var(--color-blanco-puro))]/10 dark:bg-[hsl(var(--card))]/10")}>
              <span className={summaryItemLabelClass}>{formatLabel(key)}:</span>
              <p className={cn(summaryItemTextClass, "whitespace-pre-wrap pl-2 pt-1")}>{formatValue(key, value as string)}</p>
            </div>
          );
        })}

        {/* Display refinedIdea separately and conditionally if it's meaningful */}
        {projectData.refinedIdea && projectData.refinedIdea.trim() !== '' && projectData.refinedIdea !== projectData.idea && (
          <div key="refinedIdea" className={cn(summaryItemBaseClass, "bg-accent/10 dark:bg-accent/15")}>
            <span className="font-semibold text-accent">{formatLabel('refinedIdea')}:</span>
            <p className={cn(summaryItemTextClass, "whitespace-pre-wrap pl-2 pt-1")}>{projectData.refinedIdea}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
        <Button variant="outline" onClick={onPrev} className="w-full sm:w-auto px-6 py-3">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Editar Información
        </Button>
        <Button onClick={handleSendToWhatsApp} className="w-full sm:w-auto px-6 py-3 text-lg font-semibold">
          <MessageSquare className="mr-2 h-5 w-5" />
          Enviar proyecto a WhatsApp
        </Button>
      </div>
       <div className="mt-8 text-center">
        <Button variant="link" onClick={onClearData} className="text-muted-foreground hover:text-primary">
          Comenzar un nuevo proyecto (borrar datos)
        </Button>
      </div>
    </GlassCard>
  );
}

