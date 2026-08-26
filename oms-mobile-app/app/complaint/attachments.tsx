import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeftIcon, PhotoIcon, DocumentIcon, XMarkIcon, ArrowUpTrayIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { UploadModal } from '@/components/UploadModal';
import * as DocumentPicker from 'expo-document-picker';

export default function AttachmentsScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [documents, setDocuments] = useState<{ name: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const setAttachments = useComplaintStore((s) => s.setAttachments);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleAddPhoto = () => {
    setModalVisible(true);
  };

  const handleImagePicked = (uri: string) => {
    setPhotos((prev) => [...prev, uri]);
  };

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];
        setDocuments((prev) => [...prev, { name: file.name }]);
      }
    } catch (e) {
      console.log('Error picking document:', e);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>
        <Header showBack />

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <View className="items-center mb-2">
              <Text className="text-lg font-inter-bold text-dark">Register Complaint</Text>
            </View>
            <View className="items-end mb-2">
              <Text className="text-sm font-inter-semibold text-dark">4 of 4</Text>
            </View>
          </View>

          <View className="mb-8">
            <TouchableOpacity onPress={handleAddPhoto} activeOpacity={0.7} className="self-start">
              <Text className="text-dark font-inter-semibold mb-4">Upload Photos (Optional)</Text>
            </TouchableOpacity>

            {photos.length === 0 ? (
              <TouchableOpacity
                onPress={handleAddPhoto}
                activeOpacity={0.7}
                className="w-full border-2 border-dashed border-border bg-input-bg rounded-2xl py-10 items-center justify-center mb-4"
              >
                <View className="w-12 h-12 rounded-full bg-primary/10 justify-center items-center mb-3">
                  <ArrowUpTrayIcon size={24} color={colors.primary} />
                </View>
                <Text className="text-sm font-inter-semibold text-dark">Upload Photo</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View className="flex-row flex-wrap gap-3 mb-4">
                  {photos.map((uri, index) => (
                    <View key={index} className="w-24 h-24 rounded-xl overflow-hidden border border-border relative">
                      <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                      <TouchableOpacity
                        onPress={() => handleRemovePhoto(index)}
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5"
                        activeOpacity={0.7}
                      >
                        <XMarkIcon size={14} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                <Button
                  title="+ Add More"
                  variant="outline"
                  onPress={handleAddPhoto}
                />
              </>
            )}
          </View>

          <View className="mb-8">
            <Text className="text-dark font-inter-semibold mb-4">Upload Documents (Optional)</Text>

            {documents.length > 0 && (
              <View className="mb-4 space-y-3">
                {documents.map((doc, index) => (
                  <View key={index} className="flex-row items-center justify-between bg-input-bg border border-border rounded-xl px-4 py-3">
                    <View className="flex-row items-center flex-1 mr-2">
                      <DocumentIcon size={20} color={colors.primary} />
                      <Text className="ml-2 text-sm font-inter text-dark flex-1" numberOfLines={1}>{doc.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveDocument(index)} activeOpacity={0.7}>
                      <XMarkIcon size={18} color={colors.muted} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <Button
              title="Choose File"
              variant="outline"
              onPress={handleChooseFile}
            />
          </View>
        </ScrollView>

        <View className="px-6 py-4 border-t border-border bg-background">
          <Button
            title="Next"
            onPress={() => {
              setAttachments(photos.length, documents.length);
              router.push('/complaint/review');
            }}
          />
        </View>

        <UploadModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onImagePicked={handleImagePicked}
        />
      </View>
    </SafeAreaView>
  );
}
