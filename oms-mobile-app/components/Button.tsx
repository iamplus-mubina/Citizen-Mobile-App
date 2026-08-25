import { TouchableOpacity, Text, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  leftIcon?: React.ReactNode;
}

export function Button({ title, variant = 'primary', leftIcon, className = '', ...props }: ButtonProps) {
  let bgClass = 'bg-primary';
  let textClass = 'text-white';

  if (variant === 'secondary') {
    bgClass = 'bg-secondary';
    textClass = 'text-secondary-text';
  } else if (variant === 'outline') {
    bgClass = 'bg-transparent border-2 border-border';
    textClass = 'text-text';
  }

  return (
    <TouchableOpacity 
      className={`py-4 px-6 rounded-xl flex-row items-center justify-center ${bgClass} ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      {leftIcon && <View className="mr-2">{leftIcon}</View>}
      <Text className={`text-lg font-inter-bold ${textClass}`}>{title}</Text>
    </TouchableOpacity>
  );
}
