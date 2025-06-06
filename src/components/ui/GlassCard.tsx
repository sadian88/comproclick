import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

export default function GlassCard({ children, className, innerClassName }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[hsl(var(--color-blanco-puro))/0.15] shadow-xl overflow-hidden", // Softer border
        "bg-[hsl(var(--color-blanco-puro))/0.3] dark:bg-[hsl(var(--card))/0.3]", // More transparent white base for light, card color for dark
        "backdrop-blur-lg saturate-150", // Increased blur and saturation
        className
      )}
    >
      <div className={cn("p-6 md:p-8", innerClassName)}>
       {children}
      </div>
    </div>
  );
}
