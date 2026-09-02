import { TouchableOpacity, Text, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger-outline';
  leftIcon?: React.ReactNode;
}

export function Button({ title, variant = 'primary', leftIcon, className = '', ...props }: ButtonProps) {
  let bgClass = 'bg-primary';
  let textClass = 'text-on-primary'; // Using dark text for better contrast on yellow
  const hasRoundedClass = className.includes('rounded-');
  const roundedClass = hasRoundedClass ? '' : 'rounded-md';

  if (variant === 'secondary') {
    bgClass = 'bg-secondary';
    textClass = 'text-secondary-text';
  } else if (variant === 'outline') {
    bgClass = 'bg-transparent border border-border';
    textClass = 'text-dark';
  } else if (variant === 'danger-outline') {
    bgClass = 'bg-transparent border border-error/50';
    textClass = 'text-error';
  }

  return (
    <TouchableOpacity 
      className={`py-3 px-5 ${roundedClass} flex-row items-center justify-center ${bgClass} ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      {leftIcon && <View className="mr-2">{leftIcon}</View>}
      <Text className={`text-lg font-inter-bold ${textClass}`}>{title}</Text>
    </TouchableOpacity>
  );
}
