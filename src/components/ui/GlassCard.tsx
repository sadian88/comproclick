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
        "rounded-xl border border-[hsl(var(--color-azul-glass-base))/0.18] shadow-2xl overflow-hidden",
        "bg-[hsl(var(--color-azul-glass-base))/0.4] backdrop-blur-md", // azul-glass with 40% opacity
        className
      )}
    >
      <div className={cn("p-6 md:p-8", innerClassName)}>
       {children}
      </div>
    </div>
  );
}
