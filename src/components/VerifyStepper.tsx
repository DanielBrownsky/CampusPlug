import type { FC } from "react";

type Step = {
  label: string;
  icon: string;
};

type Props = {
  currentStep: number; 
};

const steps: Step[] = [
  { label: "Basic Info", icon: "🧑" },
  { label: "Upload ID", icon: "🪪" },
  { label: "Submit", icon: "📤" },
  { label: "Await Review", icon: "⏳" },
];

const VerifyStepper: FC<Props> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isCompleted = currentStep > index + 1;
        const isActive = currentStep === index + 1;

        return (
          <div key={index} className="flex items-center gap-2">
            
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full text-lg
              ${isCompleted ? "bg-green-500 text-white" : isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
            >
              {isCompleted ? "✔️" : step.icon}
            </div>

            
            <div className="text-xs text-center min-w-[80px]">
              <p className={`${isActive ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                {step.label}
              </p>
            </div>

            
            {index < steps.length - 1 && (
              <div className="w-5 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VerifyStepper;
