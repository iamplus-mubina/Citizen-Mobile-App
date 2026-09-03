import { View, Text, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import {
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

const menuItems = [
  {
    id: 'faqs',
    label: 'FAQs',
    icon: QuestionMarkCircleIcon,
    hasArrow: true,
    onPress: () => { },
  },
  {
    id: 'how-to-register',
    label: 'How to Register Complaint',
    icon: DocumentPlusIcon,
    hasArrow: true,
    onPress: () => { },
  },
  {
    id: 'how-to-track',
    label: 'How to Track Complaint',
    icon: MagnifyingGlassIcon,
    hasArrow: true,
    onPress: () => { },
  },
  {
    id: 'contact',
    label: 'Contact Office',
    icon: PhoneIcon,
    hasArrow: true,
    onPress: () => Linking.openURL('tel:+911234567890'),
  },
  {
    id: 'terms',
    label: 'Terms & Conditions',
    icon: DocumentTextIcon,
    hasArrow: true,
    onPress: () => { },
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    icon: ShieldCheckIcon,
    hasArrow: true,
    onPress: () => { },
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
        <Header showBack title="Help & Support" />

        <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={item.onPress}
                  className="bg-surface border border-border rounded-xl p-4 mb-3 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-primary-light items-center justify-center mr-4">
                      <Icon size={24} color={colors.primary} />
                    </View>
                    <Text className="text-base font-inter-bold text-dark flex-1 pr-2">{item.label}</Text>
                  </View>
                  {item.hasArrow && (
                    <ChevronRightIcon size={20} color={colors.muted} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="items-center pb-8 mt-4">
            <Text className="text-xs font-inter-semibold text-muted">Version 1.0.0</Text>
            <Text className="text-[10px] font-inter text-muted mt-1">OMS Citizen App</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
