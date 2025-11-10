import { AnimatePresence, motion } from "framer-motion";
import { type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CreateAssessmentStepperProps = {
  currentStep: number;
  onChangeStep: (step: 1 | 2 | 3) => void;
  isValidated: boolean;
  createErrors: number;
  configureErrors: number;
  publishErrors: number;
};

export default function Stepper({
  currentStep,
  onChangeStep,
  isValidated,
  createErrors,
  configureErrors,
  publishErrors,
}: CreateAssessmentStepperProps): ReactElement {
  const steps = [
    {
      number: 1,
      label: "Create",
      errors: createErrors,
      key: "create",
    },
    {
      number: 2,
      label: "Configure",
      errors: configureErrors,
      key: "configure",
    },
    {
      number: 3,
      label: "Publish",
      errors: publishErrors,
      key: "publish",
    },
  ];

  return (
    <section className="flex rounded-t-md items-center w-full border border-b-0 border-border overflow-hidden">
      {steps.map((stepInfo, index) => (
        <Button
          key={stepInfo.key}
          variant="ghost"
          className={cn(
            "flex justify-center px-2 sm:px-4 py-4 sm:py-6 gap-1 sm:gap-2 items-center w-full min-w-0 flex-1",
            "hover:bg-muted/50 transition-colors duration-200 rounded-none",
            index < steps.length - 1 && "border-r border-border",
            getOpacity(currentStep, stepInfo.number),
          )}
          style={{
            borderBottom:
              currentStep === stepInfo.number
                ? "2px solid hsl(var(--primary))"
                : "0px solid transparent",
          }}
          onClick={() => onChangeStep(stepInfo.number as 1 | 2 | 3)}
        >
          <div className="flex items-center gap-2 sm:gap-3 w-full justify-center sm:justify-start max-w-[120px]">
            <div className="flex-shrink-0">
              <div
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 rounded-full"
                style={{
                  backgroundColor: getCircleColor(currentStep, stepInfo.number),
                }}
              >
                <p className="text-white text-xs sm:text-sm xl:text-base font-bold">
                  {stepInfo.number}
                </p>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0 sm:min-w-[200px]">
              <p className="text-xs sm:text-xs xl:text-sm font-semibold text-left truncate">
                {stepInfo.label}
              </p>
            </div>

            <AnimatePresence>
              {isValidated && stepInfo.errors > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  }}
                  className="flex-shrink-0"
                >
                  <Badge
                    variant="destructive"
                    className="h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs"
                  >
                    {stepInfo.errors}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Button>
      ))}
    </section>
  );
}

const getCircleColor = (currentStep: number, step: number): string => {
  if (currentStep < step) {
    return "hsl(var(--muted-foreground))";
  } else if (currentStep > step) {
    return "hsl(var(--primary))";
  } else {
    return "hsl(var(--primary))";
  }
};

const getOpacity = (currentStep: number, step: number): string => {
  if (currentStep >= step) {
    return "opacity-100";
  } else {
    return "opacity-50";
  }
};
