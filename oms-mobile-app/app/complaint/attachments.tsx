import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Platform, Alert, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeftIcon, PhotoIcon, DocumentIcon, XMarkIcon, ArrowUpTrayIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { UploadModal } from '@/components/UploadModal';
import * as DocumentPicker from 'expo-document-picker';
import { citizenService } from '@/services/citizenService';

export default function AttachmentsScreen() {
  const router = useRouter();
  const cachedPhotos = useComplaintStore((s) => s.cachedPhotos);
  const cachedDocuments = useComplaintStore((s) => s.cachedDocuments);
  const setComplaintForm = useComplaintStore((s) => s.setComplaintForm);

  // Initialize from store so attachments persist on back navigation
  const [photos, setPhotos] = useState<{ uri: string; serverPath?: string }[]>(cachedPhotos);
  const [documents, setDocuments] = useState<{ name: string; serverPath?: string }[]>(cachedDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/complaint/location');
      }
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleAddPhoto = () => {
    setModalVisible(true);
  };

  const handleImagePicked = async (uri: string) => {
    setIsUploading(true);
    try {
      const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const res = await citizenService.uploadFile(uri, filename, type);
      const serverPath = res?.path || res?.data?.path || '';
      const newPhoto = { uri, serverPath };
      const updated = [...photos, newPhoto];
      setPhotos(updated);
      // Save to store immediately so it persists on back
      setComplaintForm({ cachedPhotos: updated });
      console.log('Photo uploaded successfully:', serverPath);
    } catch (err) {
      console.log('Photo upload handler error:', err);
      const newPhoto = { uri };
      const updated = [...photos, newPhoto];
      setPhotos(updated);
      setComplaintForm({ cachedPhotos: updated });
    } finally {
      setIsUploading(false);
    }
  };

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];
        setIsUploading(true);
        try {
          const res = await citizenService.uploadFile(file.uri, file.name, file.mimeType || 'application/pdf');
          const serverPath = res?.path || res?.data?.path || '';
          const newDoc = { name: file.name, serverPath };
          const updated = [...documents, newDoc];
          setDocuments(updated);
          // Save to store immediately so it persists on back
          setComplaintForm({ cachedDocuments: updated });
          console.log('Document uploaded successfully:', serverPath);
        } catch (err) {
          console.log('Document upload handler error:', err);
          const newDoc = { name: file.name };
          const updated = [...documents, newDoc];
          setDocuments(updated);
          setComplaintForm({ cachedDocuments: updated });
        } finally {
          setIsUploading(false);
        }
      }
    } catch (e) {
      console.log('Error picking document:', e);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    setComplaintForm({ cachedPhotos: updated });
  };

  const handleRemoveDocument = (index: number) => {
    const updated = documents.filter((_, i) => i !== index);
    setDocuments(updated);
    setComplaintForm({ cachedDocuments: updated });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>
        <Header 
          showBack 
          title="Raise a complaint" 
          onBack={() => router.replace('/home')}
        />

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <View className="mt-2" />
            <FormStepper currentStep={4} totalSteps={5} />
          </View>

          <View className="mb-8">
            <TouchableOpacity onPress={handleAddPhoto} activeOpacity={0.7} className="self-start">
              <Text className="text-dark font-inter-semibold mb-2">Upload Photos (Optional)</Text>
            </TouchableOpacity>

            {photos.length === 0 ? (
              <TouchableOpacity
                onPress={handleAddPhoto}
                activeOpacity={0.7}
                className="w-full border-2 border-dashed border-primary rounded-xl py-10 items-center justify-center mb-4 bg-primary/5"
              >
                <View className="w-12 h-12 rounded-full bg-primary/10 justify-center items-center mb-3">
                  <ArrowUpTrayIcon size={24} color={colors.primary} />
                </View>
                <Text className="text-sm font-inter-semibold text-dark">Upload Photo</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View className="flex-row flex-wrap gap-3 mb-4">
                  {photos.map((item, index) => (
                    <View key={index} className="w-24 h-24 rounded-md overflow-hidden border border-border relative">
                      <Image source={{ uri: item.uri }} className="w-full h-full" resizeMode="cover" />
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
            <Text className="text-dark font-inter-semibold mb-2">Upload Documents (Optional)</Text>

            {documents.length > 0 && (
              <View className="mb-4 space-y-3">
                {documents.map((doc, index) => (
                  <View key={index} className="flex-row items-center justify-between bg-surface border border-border rounded-md px-4 py-3">
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

          <View
            className="mb-8 p-4 rounded-xl bg-secondary/10"
          >
            <Text className="font-inter-bold text-dark text-[15px] mb-1">Evidence is optional</Text>
            <Text className="font-inter text-muted text-sm leading-5">
              You can continue without an attachment. Files remain private behind signed-in access.
            </Text>
          </View>
          <View className="mb-8 mt-4">
          </View>
        </ScrollView>

        {/* Bottom action bar — Back + Next */}
        <View className="px-6 py-4 border-t border-border bg-background flex-row gap-x-3">
          <View className="flex-[0.8]">
            <Button
              title="Back"
              variant="outline"
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/complaint/location');
                }
              }}
            />
          </View>
          <View className="flex-[1.2]">
            <Button
              title={isUploading ? 'Uploading...' : 'Next'}
              disabled={isUploading}
              onPress={() => {
                setComplaintForm({
                  photoCount: photos.length,
                  documentCount: documents.length,
                  uploadedPhotoUrls: photos.map((p) => p.serverPath || p.uri).filter(Boolean),
                  uploadedDocumentUrls: documents.map((d) => d.serverPath || d.name).filter(Boolean),
                });
                router.push('/complaint/review');
              }}
            />
          </View>
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
