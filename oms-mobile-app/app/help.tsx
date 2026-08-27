import { View, Text, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

const menuItems = [
  {
    id: 'faqs',
    label: 'FAQs',
    hasArrow: true,
    onPress: () => {},
  },
  {
    id: 'how-to-register',
    label: 'How to Register Complaint',
    hasArrow: true,
    onPress: () => {},
  },
  {
    id: 'how-to-track',
    label: 'How to Track Complaint',
    hasArrow: true,
    onPress: () => {},
  },
  {
    id: 'contact',
    label: 'Contact Office',
    hasArrow: false,
    onPress: () => Linking.openURL('tel:+911234567890'),
  },
  {
    id: 'terms',
    label: 'Terms & Conditions',
    hasArrow: true,
    onPress: () => {},
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    hasArrow: false,
    onPress: () => {},
  },
];

export default function HelpSupportScreen() {
  const containerClass = Platform.OS === 'web'
    ? 'flex-1 w-full max-w-md mx-auto bg-background'
    : 'flex-1 bg-background';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>
        <Header showBack />

        <View className="px-6 pb-4 pt-2">
          <Text className="text-lg font-inter-bold text-dark">Help & Support</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="bg-surface rounded-2xl border border-border overflow-hidden mb-8">
            {menuItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={item.onPress}
                  className="flex-row items-center justify-between px-4 py-4"
                >
                  <Text className="text-sm font-inter-medium text-dark">{item.label}</Text>
                  {item.hasArrow && (
                    <ChevronRightIcon size={18} color={colors.muted} />
                  )}
                </TouchableOpacity>
                {index < menuItems.length - 1 && (
                  <View className="h-px bg-border mx-4" />
                )}
              </View>
            ))}
          </View>

          <View className="items-center pb-8">
            <Text className="text-xs font-inter text-muted">Version 1.0.0</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
