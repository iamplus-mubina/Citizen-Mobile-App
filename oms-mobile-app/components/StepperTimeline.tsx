import React from 'react';
import { View, Text } from 'react-native';

export type StepperTimelineStatus = 'completed' | 'current' | 'future';

export interface StepperTimelineStep {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status: StepperTimelineStatus;
}

interface StepperTimelineProps {
  steps: StepperTimelineStep[];
}

export function StepperTimeline({ steps }: StepperTimelineProps) {
  return (
    <View className="flex-1 w-full pt-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <View key={step.id} className="flex-row">
            <View className="items-center w-8 mr-4 relative">
              {!isLast && (
                <View 
                  className={`absolute top-4 bottom-[-16px] w-[2px] z-0 ${
                    step.status === 'completed' ? 'bg-primary' : 'bg-border'
                  }`} 
                />
              )}
              
              <View className="z-10 mt-1 h-6 w-6 items-center justify-center bg-background">
                {step.status === 'completed' && (
                  <View className="h-4 w-4 rounded-full border-2 border-primary items-center justify-center">
                    <View className="h-2 w-2 rounded-full bg-primary" />
                  </View>
                )}
                {step.status === 'current' && (
                  <View className="h-5 w-5 rounded-full border-2 border-primary items-center justify-center">
                    <View className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </View>
                )}
                {step.status === 'future' && (
                  <View className="h-4 w-4 rounded-full border-2 border-border" />
                )}
              </View>
            </View>

            <View className="flex-1 pb-8">
              {step.date && (
                <Text className="text-xs font-inter-medium text-muted mb-1">{step.date}</Text>
              )}
              <Text 
                className={`text-base font-inter-bold mb-1 ${
                  step.status === 'future' ? 'text-muted' : 'text-dark'
                }`}
              >
                {step.title}
              </Text>
              {step.description && (
                <Text className="text-sm font-inter text-muted leading-5">{step.description}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
