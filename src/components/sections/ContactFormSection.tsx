
import React from "react";
import type { UseFormReturn } from "react-hook-form"; // Import UseFormReturn
import type { PersonalData } from "@/lib/types";
import { Input } from "@/components/ui/input";
// Button component is removed as it's handled by the parent
import GlassCard from "@/components/ui/GlassCard";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MessageSquare } from "lucide-react";

interface ContactFormSectionProps {
  personalData: PersonalData;
  updatePersonalData: (field: keyof PersonalData, value: string) => void;
  onFormSubmit: (data: FormData) => void; 
  formMethods: UseFormReturn<FormData>; // Pass all form methods
  title?: string;
  description?: string;
  // submitButtonText is removed as button is external
  // isSubmittingPrimaryAction is removed
}

// FormData type remains the same
const formSchema = z.object({
  fullName: z.string().min(2, "Nombre completo es requerido.").max(100, "Nombre demasiado largo."),
  companyName: z.string().max(100, "Nombre de empresa demasiado largo.").optional(),
  phone: z.string().max(30, "Número de teléfono demasiado largo.").optional(),
  email: z.string().email("Email inválido.").max(100, "Email demasiado largo."),
  country: z.string().max(50, "Nombre de país demasiado largo.").optional(),
});

export type FormData = z.infer<typeof formSchema>;

export default function ContactFormSection({ 
  personalData, 
  updatePersonalData, 
  onFormSubmit,
  formMethods, // Destructure formMethods
  title = "Tus Datos de Contacto",
  description = "Necesitamos esta información para contactarte sobre tus proyectos.",
}: ContactFormSectionProps) {
  // Use formMethods passed from parent
  const { control, handleSubmit, formState: { errors }, reset } = formMethods;

  React.useEffect(() => {
    reset(personalData);
  }, [personalData, reset]);

  const internalSubmitHandler: SubmitHandler<FormData> = (data) => {
    Object.keys(data).forEach(keyStr => {
      const key = keyStr as keyof FormData;
      if (personalData[key as keyof PersonalData] !== data[key]) {
         updatePersonalData(key as keyof PersonalData, data[key] as string);
      }
    });
    onFormSubmit(data); // Pass submitted data to parent
  };

  return (
    <GlassCard className="w-full max-w-3xl mx-auto my-0 shadow-none border-none bg-transparent backdrop-blur-none p-0">
      <h2 className="text-xl md:text-2xl font-headline font-semibold mb-6 text-center text-primary">{title}</h2>
      <p className="text-center text-muted-foreground mb-6 text-sm">{description}</p>
      {/* Form now uses handleSubmit from formMethods, triggered by parent button */}
      <form onSubmit={handleSubmit(internalSubmitHandler)} id="contact-form" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">Nombre completo <span className="text-destructive">*</span></label>
                <Input id="fullName" {...field} placeholder="Ej: Ada Lovelace" />
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
              </div>
            )}
          />
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-1">Nombre de empresa (Opcional)</label>
                <Input id="companyName" {...field} placeholder="Ej: Innovatech Solutions" />
                 {errors.companyName && <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>}
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Teléfono (Opcional)</label>
                <Input id="phone" type="tel" {...field} placeholder="Ej: +57 300 123 4567" />
                 {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
              </div>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email <span className="text-destructive">*</span></label>
                <Input id="email" type="email" {...field} placeholder="Ej: ada@example.com" />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
            )}
          />
        </div>

        <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-1">País (Opcional)</label>
                <Input id="country" {...field} placeholder="Ej: Colombia" />
                {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
              </div>
            )}
        />
        
        {/* Submit button is removed from here and will be rendered by RequestPocketSection */}
      </form>
    </GlassCard>
  );
}
