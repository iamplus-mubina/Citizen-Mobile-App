import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Platform, Alert } from 'react-native';
import { CameraIcon, PhotoIcon, XMarkIcon } from 'react-native-heroicons/outline';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/Colors';

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onImagePicked: (uri: string) => void;
}

export function UploadModal({ visible, onClose, onImagePicked }: UploadModalProps) {
  const requestPermission = async (type: 'camera' | 'library') => {
    if (Platform.OS === 'web') return true;

    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera permission to take photos of your complaint.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need gallery permission to choose photos of your complaint.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermission('camera');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        onImagePicked(result.assets[0].uri);
        onClose();
      }
    } catch (e) {
      console.log('Error taking photo:', e);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleChooseGallery = async () => {
    const hasPermission = await requestPermission('library');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        onImagePicked(result.assets[0].uri);
        onClose();
      }
    } catch (e) {
      console.log('Error picking image:', e);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
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
        <View className="flex-1 bg-black/60 justify-end items-center">
          <TouchableWithoutFeedback>
            <View className="bg-surface w-full max-w-md rounded-t-lg p-6 pb-8 border-t border-border">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-lg font-inter-bold text-dark">Upload Photo</Text>
                <TouchableOpacity onPress={onClose} className="p-1 no-underline outline-none" activeOpacity={0.7}>
                  <XMarkIcon size={20} color={colors.dark} />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-around py-4">
                <TouchableOpacity 
                  onPress={handleTakePhoto}
                  activeOpacity={0.7}
                  className="items-center justify-center bg-surface border border-border w-[42%] py-6 rounded-lg no-underline outline-none"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none', textDecorationLine: 'none', textDecoration: 'none' } as any : {}}
                >
                  <View className="w-12 h-12 rounded-full bg-primary/10 justify-center items-center mb-2">
                    <CameraIcon size={24} color={colors.primary} />
                  </View>
                  <Text 
                    className="text-sm font-inter-semibold text-dark no-underline"
                    style={Platform.OS === 'web' ? { textDecorationLine: 'none', textDecoration: 'none' } as any : {}}
                  >
                    Take Photo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleChooseGallery}
                  activeOpacity={0.7}
                  className="items-center justify-center bg-surface border border-border w-[42%] py-6 rounded-lg no-underline outline-none"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none', textDecorationLine: 'none', textDecoration: 'none' } as any : {}}
                >
                  <View className="w-12 h-12 rounded-full bg-primary/10 justify-center items-center mb-2">
                    <PhotoIcon size={24} color={colors.primary} />
                  </View>
                  <Text 
                    className="text-sm font-inter-semibold text-dark no-underline"
                    style={Platform.OS === 'web' ? { textDecorationLine: 'none', textDecoration: 'none' } as any : {}}
                  >
                    Choose Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
