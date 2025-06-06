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
        "rounded-xl shadow-xl overflow-hidden", // Removed border classes
        "bg-[hsl(var(--color-blanco-puro))/0.2] dark:bg-[hsl(var(--card))/0.25]", // Slightly adjusted dark mode transparency
        "backdrop-blur-lg saturate-150",
        className
      )}
    >
      <div className={cn("p-6 md:p-8", innerClassName)}>
       {children}
      </div>
    </div>
  );
}
