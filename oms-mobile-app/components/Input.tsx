import { useRef } from 'react';
import { TextInput, TextInputProps, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, className = '', ...props }: InputProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View className={`w-full mb-4 ${className}`}>
      {label && <Text className="text-dark font-inter-semibold mb-2">{label}</Text>}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        className={`flex-row w-full bg-surface border ${error ? 'border-error' : 'border-border'} rounded-md px-4 py-3 ${props.multiline ? 'items-start min-h-[120px]' : 'items-center'}`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          ref={inputRef}
          className="flex-1 text-dark text-base font-inter p-0"
          placeholderTextColor={colors.muted}
          textAlignVertical={props.multiline ? 'top' : 'auto'}
          {...props}
        />
      </TouchableOpacity>
      {error && <Text className="text-error text-sm font-inter mt-1">{error}</Text>}
    </View>
  );
}
