import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className={`w-full mb-4 ${className}`}>
      {label && <Text className="text-gray-700 font-inter-semibold mb-2">{label}</Text>}
      <TextInput
        className={`w-full bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 text-black text-base`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
