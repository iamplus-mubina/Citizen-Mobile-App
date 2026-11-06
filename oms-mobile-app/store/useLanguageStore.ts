import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/services/api';

export type SupportedLanguage = 'en' | 'mr';

export const LANGUAGE_STORAGE_KEY = '@app_language';

export interface LanguageOption {
  id: SupportedLanguage;
  label: string;
  subLabel?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'en', label: 'English' },
  { id: 'mr', label: 'मराठी' },
];

export const translations = {
  en: {
    nav: {
      complaints: 'Complaints',
      updates: 'Updates',
      home: 'Home',
      contact: 'Contact Us',
      profile: 'Profile',
      notifications: 'Notifications',
    },
    header: {
      citizenPortal: 'Citizen Portal',
    },
    auth: {
      welcome: 'Welcome',
      enterMobile: 'Please enter your mobile number.',
      mobileNumber: 'Mobile Number',
      mobilePlaceholder: 'Enter your 10-digit number',
      sendOtp: 'Send OTP',
      sendingOtp: 'Sending OTP...',
      newUser: 'New user?',
      registerNow: 'Register Now',
      enterOtp: 'Enter OTP',
      codeSentTo: 'We have sent a 6-digit code to',
      resendOtp: 'Resend OTP',
      verifyOtp: 'Verify OTP',
      verifying: 'Verifying...',
      invalidOtp: 'Please enter a 6-digit OTP',
      skip: 'Skip',
      next: 'Next',
      getStarted: 'Get Started',
      slide1Title: 'Citizen E-Connect',
      slide1Sub: 'Direct grievance & civic assistance portal',
      slide2Title: 'Report Civic Grievances',
      slide2Sub: 'Register complaints for water, road, electricity & track live status',
      slide3Title: 'Services & Announcements',
      slide3Sub: 'Access government schemes, certificates and stay informed',
    },
    profile: {
      title: 'Profile',
      personalDetails: 'Personal Details',
      contactAndAddress: 'Contact and Address',
      mobileNumber: 'Registered Mobile Number',
      email: 'Email',
      address: 'Address',
      dob: 'Date of Birth',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      identityDocs: 'Identity Documents',
      voterId: 'Voter ID',
      preferences: 'Preferences',
      inAppNotifications: 'In-app notifications',
      notificationsDesc: 'Status and registration updates',
      language: 'Language',
      chooseLanguage: 'Language',
      english: 'English',
      marathi: 'मराठी',
      logout: 'Log out',
      deleteAccount: 'Delete Account',
      poweredBy: 'Powered by fussionloops solutions',
      deleteModalTitle: 'Delete Account',
      deleteModalDesc: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
      cancel: 'Cancel',
      delete: 'Delete',
      deleting: 'Deleting...',
      editProfile: 'Edit Profile',
    },
    home: {
      raiseComplaint: 'Raise a Complaint',
      popularServices: 'Popular Services',
      announcements: 'Announcements',
      myComplaints: 'My Complaints',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent activity',
      viewAll: 'View all',
      total: 'Total',
      pending: 'Pending',
      inProgress: 'In progress',
      solved: 'Solved',
      noComplaintsYet: 'No complaints yet',
      noComplaintsHint: 'Tap "Raise a Complaint" above to report a civic issue in your area.',
      pressBackAgain: 'Press back again to exit',
    },
    services: {
      citizen: 'Citizen Services',
      schemes: 'Schemes',
      certificates: 'Certificates',
      permissions: 'Permissions / NOC',
      other: 'Other',
    },
    complaints: {
      title: 'My Complaints',
      searchPlaceholder: 'Search by ID, Category, or Description...',
      all: 'All',
      pendingApproval: 'Pending Approval',
      unsolved: 'Unsolved',
      inProgress: 'In-Progress',
      solved: 'Solved',
      rejected: 'Rejected',
      noComplaintsFound: 'No complaints found',
      noComplaintsMatch: 'No complaints match the selected filter.',
      ticketId: 'Ticket ID',
      date: 'Date',
      status: 'Status',
      category: 'Category',
    },
    contact: {
      title: 'Contact Us',
      helplineTitle: 'Official Helpline and Support',
      callUs: 'Call Us',
      directCall: 'Direct Call',
      callDescription: 'Speak with our support executive',
      whatsapp: 'WhatsApp',
      chatSupport: 'Chat Support',
      whatsappDescription: 'Quick messaging support',
      emailUs: 'Email',
      emailSupport: 'Email Support',
      emailDescription: 'Send us your queries',
      visitWebsite: 'Visit Website',
      websiteDescription: 'Browse official updates & portal',
      officeContactDetails: 'Office Contact Details',
      helplineNumber: 'Helpline Number',
      whatsAppSupport: 'WhatsApp Support',
      emailAddress: 'Email Address',
      officeAddress: 'Office Address',
      workingHours: 'Working Hours',
      officialWebsite: 'Official Website',
      openMap: 'Open in Maps',
      call: 'Call',
      chat: 'Chat',
      send: 'Send',
      map: 'Map',
      visit: 'Visit',
    },
    notifications: {
      title: 'Notifications',
      all: 'All',
      unread: 'Unread',
      markAllRead: 'Read All',
      noNotifications: 'No notifications',
      noNotificationsDesc: 'You do not have any notifications at the moment.',
      noUnread: 'No unread notifications',
      noNotificationsYet: 'No notifications yet',
      allCaughtUp: 'All caught up! Any new updates or complaint status changes will show up here.',
      complaintUpdatesList: 'Complaint updates and announcements from the office will be listed here.',
    },
    updates: {
      title: 'Updates',
      noUpdates: 'No updates available',
      readMore: 'Read more',
    },
    common: {
      back: 'Back',
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      submit: 'Submit',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
  },
  mr: {
    nav: {
      complaints: 'तक्रारी',
      updates: 'अपडेट्स',
      home: 'मुख्यपृष्ठ',
      contact: 'संपर्क',
      profile: 'प्रोफाइल',
      notifications: 'सूचना',
    },
    header: {
      citizenPortal: 'नागरिक पोर्टल',
    },
    auth: {
      welcome: 'स्वागत आहे',
      enterMobile: 'कृपया तुमचा मोबाइल क्रमांक प्रविष्ट करा.',
      mobileNumber: 'मोबाइल क्रमांक',
      mobilePlaceholder: '१० अंकी मोबाइल क्रमांक प्रविष्ट करा',
      sendOtp: 'ओटीपी पाठवा',
      sendingOtp: 'ओटीपी पाठवत आहे...',
      newUser: 'नवीन वापरकर्ता?',
      registerNow: 'आता नोंदणी करा',
      enterOtp: 'ओटीपी प्रविष्ट करा',
      codeSentTo: 'आम्ही या क्रमांकावर ६-अंकी कोड पाठवला आहे:',
      resendOtp: 'ओटीपी पुन्हा पाठवा',
      verifyOtp: 'ओटीपी सत्यापित करा',
      verifying: 'सत्यापित करत आहे...',
      invalidOtp: 'कृपया ६ अंकी ओटीपी प्रविष्ट करा',
      skip: 'वगळा',
      next: 'पुढे',
      getStarted: 'सुरू करा',
      slide1Title: 'नागरिक ई-कनेक्ट',
      slide1Sub: 'थेट तक्रार निवारण आणि नागरी सहाय्य पोर्टल',
      slide2Title: 'तक्रार नोंदणी',
      slide2Sub: 'पाणी, रस्ते, वीज समस्या नोंदवा व थेट स्थिती तपासा',
      slide3Title: 'सेवा व सूचना',
      slide3Sub: 'शासकीय योजनांची माहिती मिळवा व कार्यालयाशी जोडलेले रहा',
    },
    profile: {
      title: 'प्रोफाइल',
      personalDetails: 'वैयक्तिक तपशील',
      contactAndAddress: 'संपर्क आणि पत्ता',
      mobileNumber: 'नोंदणीकृत मोबाइल क्रमांक',
      email: 'ईमेल',
      address: 'पत्ता',
      dob: 'जन्मतारीख',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'स्त्री',
      other: 'इतर',
      identityDocs: 'ओळखपत्र कागदपत्रे',
      voterId: 'मतदार ओळखपत्र',
      preferences: 'प्राधान्ये',
      inAppNotifications: 'अ‍ॅपमधील सूचना',
      notificationsDesc: 'स्थिती आणि नोंदणी अपडेट्स',
      language: 'भाषा',
      chooseLanguage: 'भाषा',
      english: 'English',
      marathi: 'मराठी',
      logout: 'लॉग आउट',
      deleteAccount: 'खाते हटवा',
      poweredBy: 'Powered by fussionloops solutions',
      deleteModalTitle: 'खाते हटवा',
      deleteModalDesc: 'तुम्हाला तुमचे खाते कायमचे हटवायचे आहे का? ही कृती पूर्ववत केली जाऊ शकत नाही.',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      deleting: 'हटवत आहे...',
      editProfile: 'प्रोफाइल संपादित करा',
    },
    home: {
      raiseComplaint: 'तक्रार नोंदवा',
      popularServices: 'लोकप्रिय सेवा',
      announcements: 'घोषणा',
      myComplaints: 'माझ्या तक्रारी',
      quickActions: 'त्वरित कृती',
      recentActivity: 'अलीकडील हालचाली',
      viewAll: 'सर्व पहा',
      total: 'एकूण',
      pending: 'प्रलंबित',
      inProgress: 'प्रगतीपथावर',
      solved: 'निवारण झाले',
      noComplaintsYet: 'अद्याप तक्रारी नाहीत',
      noComplaintsHint: 'तुमच्या भागातील समस्या नोंदवण्यासाठी वर "तक्रार नोंदवा" वर टॅप करा.',
      pressBackAgain: 'बाहेर पडण्यासाठी पुन्हा बॅक दाबा',
    },
    services: {
      citizen: 'नागरी सेवा',
      schemes: 'योजना',
      certificates: 'प्रमाणपत्रे',
      permissions: 'परवानग्या / एनओसी',
      other: 'इतर',
    },
    complaints: {
      title: 'माझ्या तक्रारी',
      searchPlaceholder: 'आयडी, वर्गवारी किंवा वर्णनानुसार शोधा...',
      all: 'सर्व',
      pendingApproval: 'मंजुरी प्रलंबित',
      unsolved: 'न सुटलेले',
      inProgress: 'प्रगतीपथावर',
      solved: 'निवारण झाले',
      rejected: 'नाकारले',
      noComplaintsFound: 'कोणतीही तक्रार आढळली नाही',
      noComplaintsMatch: 'निवडलेल्या फिल्टरशी जुळणारी कोणतीही तक्रार नाही.',
      ticketId: 'तक्रार क्रमांक',
      date: 'दिनांक',
      status: 'स्थिती',
      category: 'वर्गवारी',
    },
    contact: {
      title: 'संपर्क',
      helplineTitle: 'अधिकृत हेल्पलाइन आणि मदत',
      callUs: 'कॉल करा',
      directCall: 'थेट कॉल',
      callDescription: 'आमच्या सहाय्यक प्रतिनिधीशी बोला',
      whatsapp: 'व्हॉट्सअ‍ॅप',
      chatSupport: 'चॅट मदत',
      whatsappDescription: 'त्वरित संदेश पाठवा',
      emailUs: 'ईमेल',
      emailSupport: 'ईमेल मदत',
      emailDescription: 'तुमच्या शंका ईमेल करा',
      visitWebsite: 'वेबसाइटला भेट द्या',
      websiteDescription: 'अधिकृत अपडेट्स आणि माहिती पहा',
      officeContactDetails: 'कार्यालयीन संपर्क तपशील',
      helplineNumber: 'हेल्पलाइन क्रमांक',
      whatsAppSupport: 'व्हॉट्सअ‍ॅप मदत',
      emailAddress: 'ईमेल पत्ता',
      officeAddress: 'कार्यालयाचा पत्ता',
      workingHours: 'कार्यालयीन वेळ',
      officialWebsite: 'अधिकृत संकेतस्थळ',
      openMap: 'नकाशात पहा',
      call: 'कॉल',
      chat: 'चॅट',
      send: 'पाठवा',
      map: 'नकाशा',
      visit: 'भेट द्या',
    },
    notifications: {
      title: 'सूचना',
      all: 'सर्व',
      unread: 'न वाचलेले',
      markAllRead: 'सर्व वाचले',
      noNotifications: 'कोणत्याही सूचना नाहीत',
      noNotificationsDesc: 'सध्या तुमच्याकडे कोणतीही सूचना नाही.',
      noUnread: 'कोणतीही न वाचलेली सूचना नाही',
      noNotificationsYet: 'अद्याप कोणत्याही सूचना नाहीत',
      allCaughtUp: 'सर्व सूचना वाचल्या आहेत! नवीन अपडेट्स किंवा तक्रार स्थिती बदल येथे दिसतील.',
      complaintUpdatesList: 'तक्रार अपडेट्स आणि कार्यालयाकडून केलेल्या घोषणा येथे दिसतील.',
    },
    updates: {
      title: 'अपडेट्स',
      noUpdates: 'कोणतेही अपडेट उपलब्ध नाही',
      readMore: 'अधिक वाचा',
    },
    common: {
      back: 'मागे',
      cancel: 'रद्द करा',
      save: 'जतन करा',
      close: 'बंद करा',
      submit: 'सादर करा',
      loading: 'लोड होत आहे...',
      error: 'त्रुटी',
      success: 'यशस्वी',
    },
  },
};

type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${DeepKeyOf<T[K]> extends never ? '' : `.${DeepKeyOf<T[K]>}`}`;
    }[keyof T]
  : never;

export type TranslationKey = DeepKeyOf<typeof translations.en>;

interface LanguageState {
  language: SupportedLanguage;
  isInitialized: boolean;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  initLanguage: () => Promise<void>;
  t: (key: string, defaultText?: string) => string;
}

const getNestedTranslation = (obj: any, keyPath: string): string | undefined => {
  if (!obj || !keyPath) return undefined;
  const parts = keyPath.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  isInitialized: false,

  initLanguage: async () => {
    if (get().isInitialized) return;
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'mr' || stored === 'en') {
        set({ language: stored, isInitialized: true });
        api.defaults.headers['Accept-Language'] = stored;
        return;
      }
    } catch (e) {
      console.warn('Failed to load language from storage:', e);
    }
    set({ language: 'en', isInitialized: true });
    api.defaults.headers['Accept-Language'] = 'en';
  },

  setLanguage: async (lang: SupportedLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to persist language choice:', e);
    }
    api.defaults.headers['Accept-Language'] = lang;
    set({ language: lang });
  },

  t: (key: string, defaultText?: string): string => {
    const lang = get().language;
    const currentDict = translations[lang] || translations.en;
    const res = getNestedTranslation(currentDict, key);
    if (res !== undefined) return res;

    // Fallback to English
    const fallbackRes = getNestedTranslation(translations.en, key);
    if (fallbackRes !== undefined) return fallbackRes;

    return defaultText ?? key;
  },
}));

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = useLanguageStore((state) => state.t);

  return { language, setLanguage, t };
};
