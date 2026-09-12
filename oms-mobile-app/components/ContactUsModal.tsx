import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAltIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { useSystemConfigStore } from '@/store/useSystemConfigStore';

interface ContactUsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ContactUsModal({ visible, onClose }: ContactUsModalProps) {
  const { config } = useSystemConfigStore();

  const phone = config?.CONTACT_PHONE || '+91 9876543210';
  const email = config?.CONTACT_EMAIL || 'contact@jaykumargore.in';
  const address = config?.CONTACT_ADDRESS || 'मध्यवर्ती जनसंपर्क कार्यालय, माण-खटाव, सातारा, महाराष्ट्र';
  const hours = config?.CONTACT_HOURS || 'सोम - शनि: सकाळी ९:३० ते संध्याकाळी ६:००';
  const whatsapp = config?.CONTACT_WHATSAPP || '+91 9876543210';
  const website = config?.CONTACT_WEBSITE || 'https://jaykumargore.in';
  const title = config?.BRANDING_TITLE || 'Office Management System';

  const handleCall = () => {
    const cleanNumber = phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch((err) =>
      console.log('Error opening dialer:', err)
    );
  };

  const handleWhatsApp = () => {
    const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
    Linking.openURL(`https://wa.me/${cleanNumber}`).catch((err) =>
      console.log('Error opening WhatsApp:', err)
    );
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}`).catch((err) =>
      console.log('Error opening email client:', err)
    );
  };

  const handleWebsite = () => {
    if (!website) return;
    const url = website.startsWith('http') ? website : `https://${website}`;
    Linking.openURL(url).catch((err) =>
      console.log('Error opening website:', err)
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/60 justify-end">
          <TouchableWithoutFeedback>
            <View 
              style={{ width: '100%' }}
              className="bg-surface w-full rounded-t-3xl pt-5 pb-8 px-6 border-t border-border max-h-[85%]"
            >
              
              {/* Handlebar */}
              <View className="w-12 h-1 rounded-full bg-border self-center mb-4" />

              {/* Header */}
              <View className="flex-row items-center justify-between pb-4 border-b border-border mb-4">
                <View className="flex-1 pr-2">
                  <Text className="text-lg font-inter-bold text-dark">Contact Us</Text>
                  <Text className="text-xs font-inter text-muted" numberOfLines={1}>
                    {title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <XMarkIcon size={18} color={colors.dark} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} className="space-y-3">
                
                {/* 1. Phone / Helpline */}
                {phone ? (
                  <View className="flex-row items-center bg-gray-50 border border-border rounded-xl p-3.5 mb-2.5">
                    <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-3">
                      <PhoneIcon size={20} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-inter-medium text-muted">Helpline Number</Text>
                      <Text className="text-sm font-inter-semibold text-dark">{phone}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleCall}
                      activeOpacity={0.8}
                      className="bg-primary px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-xs font-inter-bold text-dark">Call</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* 2. WhatsApp Helpline */}
                {whatsapp ? (
                  <View className="flex-row items-center bg-gray-50 border border-border rounded-xl p-3.5 mb-2.5">
                    <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                      <ChatBubbleLeftRightIcon size={20} color="#16a34a" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-inter-medium text-muted">WhatsApp Support</Text>
                      <Text className="text-sm font-inter-semibold text-dark">{whatsapp}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleWhatsApp}
                      activeOpacity={0.8}
                      className="bg-green-600 px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-xs font-inter-bold text-white">Chat</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* 3. Email */}
                {email ? (
                  <View className="flex-row items-center bg-gray-50 border border-border rounded-xl p-3.5 mb-2.5">
                    <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-3">
                      <EnvelopeIcon size={20} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-inter-medium text-muted">Official Email</Text>
                      <Text className="text-sm font-inter-semibold text-dark" numberOfLines={1}>{email}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleEmail}
                      activeOpacity={0.8}
                      className="bg-primary px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-xs font-inter-bold text-dark">Email</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* 4. Office Address */}
                {address ? (
                  <View className="flex-row items-start bg-gray-50 border border-border rounded-xl p-3.5 mb-2.5">
                    <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-3 mt-0.5">
                      <MapPinIcon size={20} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-inter-medium text-muted mb-0.5">Office Address</Text>
                      <Text className="text-sm font-inter text-dark leading-5">{address}</Text>
                    </View>
                  </View>
                ) : null}

                {/* 5. Working Hours */}
                {hours ? (
                  <View className="flex-row items-center bg-gray-50 border border-border rounded-xl p-3.5 mb-2.5">
                    <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-3">
                      <ClockIcon size={20} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-inter-medium text-muted">Office Working Hours</Text>
                      <Text className="text-sm font-inter text-dark">{hours}</Text>
                    </View>
                  </View>
                ) : null}

                {/* 6. Website */}
                {website ? (
                  <View className="flex-row items-center bg-gray-50 border border-border rounded-xl p-3.5 mb-4">
                    <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-3">
                      <GlobeAltIcon size={20} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-inter-medium text-muted">Website</Text>
                      <Text className="text-sm font-inter-semibold text-dark" numberOfLines={1}>{website}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleWebsite}
                      activeOpacity={0.8}
                      className="bg-primary px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-xs font-inter-bold text-dark">Visit</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

              </ScrollView>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
