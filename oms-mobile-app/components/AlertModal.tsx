import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { Button } from '@/components/Button';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'info';
  primaryButtonText?: string;
  onPrimaryPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
  showSecondaryButton?: boolean;
}

export function AlertModal({
  visible,
  onClose,
  title,
  message,
  type = 'error',
  primaryButtonText = 'OK',
  onPrimaryPress,
  secondaryButtonText = 'Cancel',
  onSecondaryPress,
  showSecondaryButton = false,
}: AlertModalProps) {
  
  const getIcon = () => {
    if (type === 'success') return <CheckCircleIcon size={32} color={colors.success} />;
    if (type === 'error') return <ExclamationTriangleIcon size={32} color={colors.error} />;
    return <ExclamationTriangleIcon size={32} color={colors.warning || colors.primary} />;
  };

  const getBgStyle = () => {
    if (type === 'success') return { backgroundColor: colors.success + '1A' }; // 10% opacity
    if (type === 'error') return { backgroundColor: colors.error + '1A' };
    return { backgroundColor: (colors.warning || colors.primary) + '1A' };
  };

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    } else {
      onClose();
    }
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
          <TouchableWithoutFeedback>
            <View className="bg-surface w-full max-w-sm rounded-2xl p-6 shadow-xl items-center">
              
              <View className="absolute right-4 top-4">
                <TouchableOpacity onPress={onClose} className="p-1 no-underline outline-none" activeOpacity={0.7}>
                  <XMarkIcon size={20} color={colors.muted} />
                </TouchableOpacity>
              </View>

              <View 
                className="w-16 h-16 rounded-full justify-center items-center mb-4"
                style={getBgStyle()}
              >
                {getIcon()}
              </View>

              <Text className="text-xl font-inter-bold text-dark text-center mb-2">
                {title}
              </Text>
              
              <Text className="text-base font-inter text-muted text-center mb-6">
                {message}
              </Text>

              {showSecondaryButton ? (
                <View className="w-full flex-row space-x-3 gap-3">
                  <View className="flex-1">
                    <Button 
                      title={secondaryButtonText} 
                      variant="outline" 
                      onPress={handleSecondaryPress} 
                    />
                  </View>
                  <View className="flex-1">
                    <Button 
                      title={primaryButtonText} 
                      variant="primary" 
                      onPress={handlePrimaryPress} 
                    />
                  </View>
                </View>
              ) : (
                <View className="w-full">
                  <Button title={primaryButtonText} onPress={handlePrimaryPress} />
                </View>
              )}
              
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
