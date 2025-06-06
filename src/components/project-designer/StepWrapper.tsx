import type { ReactNode } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';

interface StepWrapperProps {
  title: string;
  children: ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
  nextButtonText?: string;
  hideNextButton?: boolean;
  hidePrevButton?: boolean;
}

export default function StepWrapper({
  title,
  children,
  onNext,
  onPrev,
  isNextDisabled = false,
  nextButtonText = "Siguiente",
  hideNextButton = false,
  hidePrevButton = false,
}: StepWrapperProps) {
  return (
    <GlassCard className="w-full max-w-2xl mx-auto shadow-xl">
      <h2 className="text-2xl md:text-3xl font-headline font-semibold mb-8 text-center text-primary">{title}</h2>
      <div className="space-y-6 mb-8">
        {children}
      </div>
      <div className="flex justify-between items-center mt-10">
        {!hidePrevButton && onPrev ? (
          <Button variant="outline" onClick={onPrev} className="px-6 py-3">
            Anterior
          </Button>
        ) : <div />}
        {!hideNextButton && onNext && (
          <Button onClick={onNext} disabled={isNextDisabled} className="px-6 py-3">
            {nextButtonText}
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
