import { View, Text } from 'react-native';
import { CheckIcon } from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';

interface FormStepperProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS = ['Category', 'Details', 'Location', 'Attachments', 'Review'];

export function FormStepper({ currentStep, totalSteps = 4 }: FormStepperProps) {
  const currentLabel = STEP_LABELS[currentStep - 1] || '';

  return (
    <View className="mb-4 w-full">
      <Text className="text-xs font-inter-semibold text-primary mb-3">
        Step {currentStep} of {totalSteps} · {currentLabel}
      </Text>


      <View className="flex-row items-center mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isLast = stepNumber === totalSteps;

          return (
            <View key={stepNumber} className="flex-row items-center flex-1">

              <View
                className={`w-8 h-8 rounded-full items-center justify-center border-2
                  ${isActive ? 'border-primary bg-surface' :
                    isCompleted ? 'border-primary bg-primary' : 'border-border bg-surface'}`}
              >
                {isCompleted ? (
                  <CheckIcon size={18} color={colors.white} strokeWidth={3} />
                ) : (
                  <Text
                    className={`text-sm font-inter-bold
                      ${isActive ? 'text-primary' : 'text-muted'}`}
                  >
                    {stepNumber}
                  </Text>
                )}
              </View>

              {!isLast && (
                <View
                  className={`flex-1 h-0.5 mx-1 ${isCompleted ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </View>
          );
        })}
      </View>

    </View>
  );
}
