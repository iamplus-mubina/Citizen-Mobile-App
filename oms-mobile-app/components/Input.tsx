import { TextInput, TextInputProps, View, Text } from 'react-native';
import { colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, className = '', ...props }: InputProps) {
  return (
    <View className={`w-full mb-4 ${className}`}>
      {label && <Text className="text-text font-inter-semibold mb-2">{label}</Text>}
      <View 
        className={`flex-row items-center w-full bg-input-bg border ${error ? 'border-error' : 'border-border'} rounded-xl px-4 py-3`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-text text-base font-inter p-0"
          placeholderTextColor={colors.muted}
          {...props}
        />
      </View>
      {error && <Text className="text-error text-sm font-inter mt-1">{error}</Text>}
    </View>
  );
}
