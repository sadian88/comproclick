import type { ProjectData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { CheckCircle, MessageSquare, ArrowLeft } from "lucide-react";

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
  if (value === undefined || value === null || value === '') return "No especificado";
  
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

export default function SummarySection({ projectData, onPrev, onClearData }: SummarySectionProps) {
  
  const generateWhatsAppMessage = () => {
    let message = "Hola IA Digital Designs 👋, estoy interesado en un proyecto:\n\n";
    
    const displayOrder: (keyof ProjectData)[] = [
        'projectType', 'projectTypeOther', 'projectCategory', 'projectCategoryOther', 'timeline',
        'fullName', 'companyName', 'email', 'phone', 'country', 'idea'
    ];

    displayOrder.forEach(key => {
        const value = projectData[key];
        if (value && value.trim() !== '') {
            // Use the idea refined by AI if available and user hasn't cleared it or it's different from original
            const ideaToUse = key === 'idea' && projectData.refinedIdea && projectData.refinedIdea !== projectData.idea ? projectData.refinedIdea : value;
            message += `*${formatLabel(key)}:* ${formatValue(key, ideaToUse)}\n`;
        }
    });
    
    if (projectData.refinedIdea && projectData.idea !== projectData.refinedIdea) {
        // This is already handled if 'idea' becomes the refined idea.
        // If we want to show both, this would be the place.
        // For now, assume 'idea' field might get updated by refined version by user action.
    }

    message += "\n¡Espero su contacto para discutir más detalles!";
    return encodeURIComponent(message);
  };

  const handleSendToWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank");
    // Optionally clear data after sending
    // onClearData();
    // alert("Proyecto enviado. Nos pondremos en contacto pronto.");
  };

  return (
    <GlassCard className="w-full max-w-3xl mx-auto my-12 shadow-xl">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-primary">Resumen de tu Proyecto</h2>
        <p className="text-muted-foreground mt-2">Revisa los detalles de tu solicitud antes de enviarla.</p>
      </div>
      
      <div className="space-y-4 mb-8">
        {Object.entries(projectData).map(([key, value]) => {
          if (!value || value.trim() === '' || key === 'refinedIdea' && value === projectData.idea) return null; // Skip empty or redundant refined idea
          const displayValue = key === 'idea' && projectData.refinedIdea && projectData.refinedIdea !== projectData.idea ? projectData.refinedIdea : value;
          
          return (
            <div key={key} className="p-3 bg-background/50 rounded-md border border-border">
              <span className="font-semibold text-primary">{formatLabel(key)}:</span>
              <p className="text-foreground whitespace-pre-wrap pl-2">{formatValue(key as keyof ProjectData, displayValue as string)}</p>
            </div>
          );
        })}
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
    </GlassCard>
  );
}
