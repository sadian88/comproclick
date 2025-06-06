
import type { PersonalData } from "@/lib/types";
import { Input } from "@/components/ui/input";
// Textarea and AI refinement related imports are removed
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react"; // Wand2 removed

interface ContactFormSectionProps {
  personalData: PersonalData;
  updatePersonalData: (field: keyof PersonalData, value: string) => void;
  onFormSubmit: () => void;
  onPrev?: () => void; // Make onPrev optional or handle its visibility
}

// Schema now only for personal data
const formSchema = z.object({
  fullName: z.string().min(2, "Nombre completo es requerido."),
  companyName: z.string().optional(),
  phone: z.string().optional(), // Consider making phone validation stricter if needed
  email: z.string().email("Email inválido."),
  country: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactFormSection({ personalData, updatePersonalData, onFormSubmit, onPrev }: ContactFormSectionProps) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: personalData.fullName || "",
      companyName: personalData.companyName || "",
      phone: personalData.phone || "",
      email: personalData.email || "",
      country: personalData.country || "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    Object.keys(data).forEach(keyStr => {
      const key = keyStr as keyof FormData;
      updatePersonalData(key as keyof PersonalData, data[key] as string);
    });
    onFormSubmit();
  };

  return (
    <GlassCard className="w-full max-w-3xl mx-auto my-12 shadow-xl">
      <h2 className="text-2xl md:text-3xl font-headline font-semibold mb-8 text-center text-primary">Tus Datos de Contacto</h2>
      <p className="text-center text-muted-foreground mb-6">Necesitamos esta información para contactarte sobre tus proyectos.</p>
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
        
        {/* Idea Textarea and AI Refinement Button are REMOVED from this component */}

        <div className="flex justify-between items-center pt-4">
          {onPrev ? (
            <Button variant="outline" onClick={onPrev} disabled={isSubmitting} className="px-6 py-3">
              Volver al Inicio
            </Button>
          ) : <div />} {/* Placeholder if no onPrev */}
          <Button type="submit" disabled={isSubmitting} className="px-6 py-3">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar y Diseñar Proyecto
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
