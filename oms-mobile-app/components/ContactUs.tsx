import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon,
} from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { useSystemConfigStore } from '@/store/useSystemConfigStore';

export function ContactUs() {
  const { config, fetchSystemConfig } = useSystemConfigStore();
  const [refreshing, setRefreshing] = useState(false);

  const phone = config?.CONTACT_PHONE || '+91 9876543210';
  const email = config?.CONTACT_EMAIL || 'contact@jaykumargore.in';
  const address = config?.CONTACT_ADDRESS || 'Central Public Relations Office, Man-Khatav, Satara, Maharashtra';
  const hours = config?.CONTACT_HOURS || 'Mon - Sat: 9:30 AM to 6:00 PM';
  const whatsapp = config?.CONTACT_WHATSAPP || '+91 9876543210';
  const website = config?.CONTACT_WEBSITE || 'https://jaykumargore.in';

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchSystemConfig(true);
    } finally {
      setRefreshing(false);
    }
  }, [fetchSystemConfig]);

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

  const handleMap = () => {
    if (!address) return;
    const query = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url!).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch((err) =>
        console.log('Error opening maps:', err)
      );
    });
  };

  return (
    <ScrollView
      className="flex-1 px-5 pt-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Heading */}
      <View className="mb-4">
        <Text className="text-xl font-inter-bold text-dark">
          Official Helpline and Support
        </Text>
      </View>

      {/* 2. Quick Action Buttons Grid */}
      <View className="flex-row justify-between mb-5">
        {/* Call Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleCall}
          className="flex-1 bg-surface border border-border rounded-xl p-3.5 items-center justify-center mr-2 shadow-sm"
        >
          <View className="w-11 h-11 rounded-full bg-primary-light items-center justify-center mb-2">
            <PhoneIcon size={22} color={colors.primary} />
          </View>
          <Text className="text-xs font-inter-bold text-dark">Call Us</Text>
          <Text className="text-[10px] font-inter text-muted mt-0.5">Direct Call</Text>
        </TouchableOpacity>

        {/* WhatsApp Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleWhatsApp}
          className="flex-1 bg-surface border border-border rounded-xl p-3.5 items-center justify-center mx-1 shadow-sm"
        >
          <View className="w-11 h-11 rounded-full bg-green-100 items-center justify-center mb-2">
            <ChatBubbleLeftRightIcon size={22} color="#16a34a" />
          </View>
          <Text className="text-xs font-inter-bold text-dark">WhatsApp</Text>
          <Text className="text-[10px] font-inter text-muted mt-0.5">Chat Support</Text>
        </TouchableOpacity>

        {/* Email Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleEmail}
          className="flex-1 bg-surface border border-border rounded-xl p-3.5 items-center justify-center ml-2 shadow-sm"
        >
          <View className="w-11 h-11 rounded-full bg-blue-100 items-center justify-center mb-2">
            <EnvelopeIcon size={22} color="#2563eb" />
          </View>
          <Text className="text-xs font-inter-bold text-dark">Email</Text>
          <Text className="text-[10px] font-inter text-muted mt-0.5">Email Support</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Detailed Contact Information List */}
      <View className="bg-surface border border-border rounded-2xl p-4 mb-5 shadow-sm space-y-4">
        <Text className="text-sm font-inter-bold text-dark mb-1">
          Office Contact Details
        </Text>

        {/* Helpline */}
        {phone ? (
          <View className="flex-row items-center justify-between py-2 border-b border-border/60">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-full bg-primary-light items-center justify-center mr-3">
                <PhoneIcon size={18} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-inter-medium text-muted">Helpline Number</Text>
                <Text className="text-sm font-inter-semibold text-dark">{phone}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleCall}
              className="bg-primary px-3 py-1.5 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-xs font-inter-bold text-dark">Call</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* WhatsApp */}
        {whatsapp ? (
          <View className="flex-row items-center justify-between py-2 border-b border-border/60">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-full bg-green-100 items-center justify-center mr-3">
                <ChatBubbleLeftRightIcon size={18} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-inter-medium text-muted">WhatsApp Support</Text>
                <Text className="text-sm font-inter-semibold text-dark">{whatsapp}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleWhatsApp}
              className="bg-green-600 px-3 py-1.5 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-xs font-inter-bold text-white">Chat</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Email */}
        {email ? (
          <View className="flex-row items-center justify-between py-2 border-b border-border/60">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center mr-3">
                <EnvelopeIcon size={18} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-inter-medium text-muted">Email Address</Text>
                <Text className="text-sm font-inter-semibold text-dark" numberOfLines={1}>
                  {email}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleEmail}
              className="bg-blue-600 px-3 py-1.5 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-xs font-inter-bold text-white">Send</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Office Address */}
        {address ? (
          <View className="flex-row items-start justify-between py-2 border-b border-border/60">
            <View className="flex-row items-start flex-1 pr-3">
              <View className="w-9 h-9 rounded-full bg-red-100 items-center justify-center mr-3 mt-0.5">
                <MapPinIcon size={18} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-inter-medium text-muted">Office Address</Text>
                <Text className="text-sm font-inter-semibold text-dark leading-snug mt-0.5">
                  {address}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleMap}
              className="bg-gray-100 border border-border px-3 py-1.5 rounded-lg self-start mt-1"
              activeOpacity={0.8}
            >
              <Text className="text-xs font-inter-bold text-dark">Map</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Working Hours */}
        {hours ? (
          <View className="flex-row items-center py-2 border-b border-border/60">
            <View className="w-9 h-9 rounded-full bg-amber-100 items-center justify-center mr-3">
              <ClockIcon size={18} color="#d97706" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-inter-medium text-muted">Working Hours</Text>
              <Text className="text-sm font-inter-semibold text-dark">{hours}</Text>
            </View>
          </View>
        ) : null}

        {/* Website */}
        {website ? (
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-full bg-purple-100 items-center justify-center mr-3">
                <GlobeAltIcon size={18} color="#7c3aed" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-inter-medium text-muted">Official Website</Text>
                <Text className="text-sm font-inter-semibold text-dark" numberOfLines={1}>
                  {website}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleWebsite}
              className="bg-purple-600 px-3 py-1.5 rounded-lg flex-row items-center"
              activeOpacity={0.8}
            >
              <Text className="text-xs font-inter-bold text-white mr-1">Visit</Text>
              <ArrowTopRightOnSquareIcon size={12} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
