
import React from "react";
import type { PersonalData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

interface ContactFormSectionProps {
  personalData: PersonalData;
  updatePersonalData: (field: keyof PersonalData, value: string) => void;
  onFormSubmit: () => void; // Renamed to onSave, parent (RequestPocketSection) will handle navigation/UI update
  // onPrev prop is removed
  title?: string;
  description?: string;
  submitButtonText?: string;
}

const formSchema = z.object({
  fullName: z.string().min(2, "Nombre completo es requerido."),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido."),
  country: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactFormSection({ 
  personalData, 
  updatePersonalData, 
  onFormSubmit,
  title = "Tus Datos de Contacto",
  description = "Necesitamos esta información para contactarte sobre tus proyectos.",
  submitButtonText = "Guardar Datos de Contacto"
}: ContactFormSectionProps) {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: personalData,
  });

  // Reset form when personalData prop changes (e.g. loaded from localStorage)
  React.useEffect(() => {
    reset(personalData);
  }, [personalData, reset]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    Object.keys(data).forEach(keyStr => {
      const key = keyStr as keyof FormData;
      updatePersonalData(key as keyof PersonalData, data[key] as string);
    });
    onFormSubmit(); // Signal to parent component that form was submitted
  };

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
              </div>
            )}
        />
        
        <div className="flex justify-end items-center pt-4">
          {/* onPrev button removed */}
          <Button type="submit" disabled={isSubmitting} className="px-6 py-3">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {submitButtonText}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
