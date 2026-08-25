import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PhotoIcon, DocumentIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

export default function AttachmentsScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [documents, setDocuments] = useState<{ name: string }[]>([]);
  const setAttachments = useComplaintStore((s) => s.setAttachments);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleAddPhoto = () => {
    Alert.alert(
      'Upload Photo',
      'Photo upload will be connected in the next sprint.',
      [{ text: 'OK' }]
    );
  };

  const handleChooseFile = () => {
    Alert.alert(
      'Upload Document',
      'Document upload will be connected in the next sprint.',
      [{ text: 'OK' }]
    );
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
              <Text className="text-lg font-inter-bold text-text">Register Complaint</Text>
            </View>
            <View className="items-end mb-2">
              <Text className="text-sm font-inter-semibold text-text">4 of 4</Text>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-text font-inter-semibold mb-4">Upload Photos (Optional)</Text>

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

              {photos.length === 0 && (
                <View className="flex-row gap-3">
                  {[0, 1, 2].map((i) => (
                    <View key={i} className="w-24 h-24 rounded-xl border border-border bg-input-bg items-center justify-center">
                      <PhotoIcon size={28} color={colors.muted} />
                    </View>
                  ))}
                </View>
              )}
            </View>

            <Button
              title="+ Add More"
              variant="outline"
              onPress={handleAddPhoto}
            />
          </View>

          <View className="mb-8">
            <Text className="text-text font-inter-semibold mb-4">Upload Documents (Optional)</Text>

            {documents.length > 0 && (
              <View className="mb-4 space-y-3">
                {documents.map((doc, index) => (
                  <View key={index} className="flex-row items-center justify-between bg-input-bg border border-border rounded-xl px-4 py-3">
                    <View className="flex-row items-center flex-1 mr-2">
                      <DocumentIcon size={20} color={colors.primary} />
                      <Text className="ml-2 text-sm font-inter text-text flex-1" numberOfLines={1}>{doc.name}</Text>
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

      </View>
    </SafeAreaView>
  );
}
