
import React from "react";
import type { PersonalData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MessageSquare } from "lucide-react"; // Added MessageSquare for button

interface ContactFormSectionProps {
  personalData: PersonalData;
  updatePersonalData: (field: keyof PersonalData, value: string) => void;
  onFormSubmit: () => void; 
  title?: string;
  description?: string;
  submitButtonText?: string;
  isSubmittingPrimaryAction?: boolean; // To show loader from parent
}

const formSchema = z.object({
  fullName: z.string().min(2, "Nombre completo es requerido.").max(100, "Nombre demasiado largo."),
  companyName: z.string().max(100, "Nombre de empresa demasiado largo.").optional(),
  phone: z.string().max(30, "Número de teléfono demasiado largo.").optional(),
  email: z.string().email("Email inválido.").max(100, "Email demasiado largo."),
  country: z.string().max(50, "Nombre de país demasiado largo.").optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactFormSection({ 
  personalData, 
  updatePersonalData, 
  onFormSubmit,
  title = "Tus Datos de Contacto",
  description = "Necesitamos esta información para contactarte sobre tus proyectos.",
  submitButtonText = "Guardar Datos de Contacto",
  isSubmittingPrimaryAction = false
}: ContactFormSectionProps) {
  const { control, handleSubmit, formState: { errors, isSubmitting: isFormSubmitting }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: personalData, // Initialize with current personalData
  });

  // Effect to reset form when personalData prop changes from parent
  // This ensures the form reflects data loaded from localStorage or external changes.
  React.useEffect(() => {
    reset(personalData);
  }, [personalData, reset]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Update parent state (which should trigger localStorage update via useLocalStorage hook)
    Object.keys(data).forEach(keyStr => {
      const key = keyStr as keyof FormData;
      // Ensure that we only update if the value is actually different,
      // or if the field is one of the mandatory ones being set.
      // This helps prevent unnecessary re-renders if data hasn't changed.
      if (personalData[key as keyof PersonalData] !== data[key]) {
         updatePersonalData(key as keyof PersonalData, data[key] as string);
      }
    });
    // Call the callback provided by the parent (RequestPocketSection)
    // This callback will handle the WhatsApp logic.
    onFormSubmit(); 
  };

  // Determine if the submit button should include WhatsApp icon
  const includeWhatsAppIcon = submitButtonText?.toLowerCase().includes("whatsapp");

  return (
    <GlassCard className="w-full max-w-3xl mx-auto my-0 shadow-none border-none bg-transparent backdrop-blur-none p-0">
      <h2 className="text-xl md:text-2xl font-headline font-semibold mb-6 text-center text-primary">{title}</h2>
      <p className="text-center text-muted-foreground mb-6 text-sm">{description}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        
        <div className="flex justify-end items-center pt-4">
          <Button type="submit" disabled={isFormSubmitting || isSubmittingPrimaryAction} className="px-6 py-3 text-lg">
            {(isFormSubmitting || isSubmittingPrimaryAction) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {includeWhatsAppIcon && !(isFormSubmitting || isSubmittingPrimaryAction) && <MessageSquare className="mr-2 h-5 w-5" />}
            {submitButtonText}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}

    