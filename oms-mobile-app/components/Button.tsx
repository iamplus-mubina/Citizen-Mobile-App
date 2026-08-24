import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ title, variant = 'primary', className = '', ...props }: ButtonProps) {
  let bgClass = 'bg-primary'; // Uses var(--color-primary)
  let textClass = 'text-white';

  if (variant === 'secondary') {
    bgClass = 'bg-secondary';
    textClass = 'text-secondary-text';
  } else if (variant === 'outline') {
    bgClass = 'bg-transparent border-2 border-primary';
    textClass = 'text-primary';
  }

  return (
    <TouchableOpacity 
      className={`py-4 px-6 rounded-xl items-center justify-center ${bgClass} ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={`text-lg font-inter-bold ${textClass}`}>{title}</Text>
    </TouchableOpacity>
  );
}
