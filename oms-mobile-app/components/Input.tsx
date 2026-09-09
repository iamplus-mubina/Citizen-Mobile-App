import { useRef, useState } from 'react';
import { TextInput, TextInputProps, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, className = '', ...props }: InputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const borderClass = error
    ? 'border-error'
    : isFocused
    ? 'border-primary'
    : 'border-border';

  return (
    <View className={`w-full mb-4 ${className}`}>
      {label && <Text className="text-dark font-inter-semibold mb-2">{label}</Text>}
      <TouchableOpacity
        activeOpacity={props.editable === false ? 1 : 0.8}
        onPress={() => props.editable !== false && inputRef.current?.focus()}
        className={`flex-row w-full ${props.editable === false ? 'bg-gray-100/90 border-border/70' : 'bg-surface border ' + borderClass} rounded-md px-4 py-3 ${props.multiline ? 'items-start min-h-[120px]' : 'items-center'}`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          ref={inputRef}
          className={`flex-1 ${props.editable === false ? 'text-muted font-inter-medium' : 'text-dark'} text-base font-inter p-0`}
          placeholderTextColor={colors.muted}
          textAlignVertical={props.multiline ? 'top' : 'auto'}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          style={{ outlineWidth: 0 } as any}
          {...props}
        />
      </TouchableOpacity>
      {error && <Text className="text-error text-sm font-inter mt-1">{error}</Text>}
    </View>
  );
}
