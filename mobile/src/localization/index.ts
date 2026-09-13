export type SupportedLocale = 'en' | 'hi';

export interface TranslationDictionary {
  common: {
    appTitle: string;
    online: string;
    offline: string;
    syncing: string;
    syncError: string;
    upToDate: string;
    pendingSync: string;
    loading: string;
    save: string;
    submit: string;
    cancel: string;
    retry: string;
    delete: string;
    download: string;
    downloaded: string;
    back: string;
    next: string;
    previous: string;
  };
  navigation: {
    dashboard: string;
    curriculum: string;
    classPacks: string;
    smartboard: string;
    assignments: string;
    assessments: string;
    storage: string;
    syncStatus: string;
    notifications: string;
    settings: string;
  };
  teacher: {
    remoteControl: string;
    pairSmartboard: string;
    pairingCode: string;
    enterCodePrompt: string;
    lockScreen: string;
    unlockScreen: string;
    nextSlide: string;
    prevSlide: string;
    startLiveQuiz: string;
    classPacksTitle: string;
    downloadOfflinePack: string;
    totalClasses: string;
  };
  student: {
    myLearning: string;
    pendingAssignments: string;
    offlineAssessments: string;
    timeRemaining: string;
    questionNumber: string;
    finishAttempt: string;
    attemptSubmittedOffline: string;
    sealedNotice: string;
  };
  storage: {
    storageUsage: string;
    freeSpace: string;
    classPacksSize: string;
    clearCache: string;
    cacheCleared: string;
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    common: {
      appTitle: 'TeacherSathi',
      online: 'Online',
      offline: 'Offline Mode',
      syncing: 'Syncing Changes...',
      syncError: 'Sync Failed',
      upToDate: 'All changes synced',
      pendingSync: 'Changes pending sync',
      loading: 'Loading...',
      save: 'Save',
      submit: 'Submit',
      cancel: 'Cancel',
      retry: 'Retry',
      delete: 'Delete',
      download: 'Download for Offline',
      downloaded: 'Downloaded',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
    },
    navigation: {
      dashboard: 'Dashboard',
      curriculum: 'Curriculum',
      classPacks: 'Class Packs',
      smartboard: 'Smartboard',
      assignments: 'Assignments',
      assessments: 'Assessments',
      storage: 'Storage',
      syncStatus: 'Sync Status',
      notifications: 'Notifications',
      settings: 'Settings',
    },
    teacher: {
      remoteControl: 'Smartboard Remote Co-Pilot',
      pairSmartboard: 'Pair Smartboard',
      pairingCode: 'Pairing Code',
      enterCodePrompt: 'Enter 6-character classroom code or scan QR',
      lockScreen: 'Lock Smartboard',
      unlockScreen: 'Unlock Smartboard',
      nextSlide: 'Next Slide',
      prevSlide: 'Previous Slide',
      startLiveQuiz: 'Start Live Quiz',
      classPacksTitle: 'Offline NCERT Class Packs',
      downloadOfflinePack: 'Download Class Pack',
      totalClasses: 'Total Active Classes',
    },
    student: {
      myLearning: 'My Learning',
      pendingAssignments: 'Pending Assignments',
      offlineAssessments: 'Offline Assessments',
      timeRemaining: 'Time Remaining',
      questionNumber: 'Question',
      finishAttempt: 'Submit Assessment',
      attemptSubmittedOffline: 'Attempt recorded offline. Will sync when connected.',
      sealedNotice: 'Attempt sealed and locked for grading.',
    },
    storage: {
      storageUsage: 'Local Storage Usage',
      freeSpace: 'Available Space',
      classPacksSize: 'Offline Class Packs',
      clearCache: 'Purge Old Cache',
      cacheCleared: 'Cache successfully cleared.',
    },
  },
  hi: {
    common: {
      appTitle: 'टीचर साथी',
      online: 'ऑनलाइन',
      offline: 'ऑफ़लाइन मोड',
      syncing: 'बदलाव सिंक हो रहे हैं...',
      syncError: 'सिंक विफल रहा',
      upToDate: 'सभी बदलाव सिंक हैं',
      pendingSync: 'लंबित सिंक',
      loading: 'लोड हो रहा है...',
      save: 'सहेजें',
      submit: 'जमा करें',
      cancel: 'रद्द करें',
      retry: 'पुनः प्रयास करें',
      delete: 'हटाएं',
      download: 'ऑफ़लाइन डाउनलोड करें',
      downloaded: 'डाउनलोड किया गया',
      back: 'वापस',
      next: 'आगे',
      previous: 'पीछे',
    },
    navigation: {
      dashboard: 'डैशबोर्ड',
      curriculum: 'पाठ्यक्रम',
      classPacks: 'क्लास पैक्स',
      smartboard: 'स्मार्टबोर्ड',
      assignments: 'असाइनमेंट',
      assessments: 'मूल्यांकन',
      storage: 'स्टोरेज',
      syncStatus: 'सिंक स्थिति',
      notifications: 'सूचनाएं',
      settings: 'सेटिंग्स',
    },
    teacher: {
      remoteControl: 'स्मार्टबोर्ड रिमोट को-पायलट',
      pairSmartboard: 'स्मार्टबोर्ड जोड़ें',
      pairingCode: 'पेयरिंग कोड',
      enterCodePrompt: '६-अंकों का कोड दर्ज करें या क्यूआर स्कैन करें',
      lockScreen: 'स्क्रीन लॉक करें',
      unlockScreen: 'स्क्रीन अनलॉक करें',
      nextSlide: 'अगली स्लाइड',
      prevSlide: 'पिछली स्लाइड',
      startLiveQuiz: 'लाइव क्विज शुरू करें',
      classPacksTitle: 'ऑफ़लाइन एनसीईआरटी क्लास पैक्स',
      downloadOfflinePack: 'क्लास पैक डाउनलोड करें',
      totalClasses: 'सक्रिय कक्षाएं',
    },
    student: {
      myLearning: 'मेरी पढ़ाई',
      pendingAssignments: 'लंबित असाइनमेंट',
      offlineAssessments: 'ऑफ़लाइन मूल्यांकन',
      timeRemaining: 'शेष समय',
      questionNumber: 'प्रश्न',
      finishAttempt: 'मूल्यांकन जमा करें',
      attemptSubmittedOffline: 'उत्तर ऑफ़लाइन दर्ज हुए। ऑनलाइन आने पर सिंक होंगे।',
      sealedNotice: 'मूल्यांकन जमा होकर लॉक हो गया है।',
    },
    storage: {
      storageUsage: 'लोकल स्टोरेज उपयोग',
      freeSpace: 'उपलब्ध स्टोरेज',
      classPacksSize: 'ऑफ़लाइन क्लास पैक्स',
      clearCache: 'पुराना कैशे साफ़ करें',
      cacheCleared: 'कैशे सफलतापूर्वक साफ़ कर दिया गया।',
    },
  },
};

export class LocalizationManager {
  private currentLocale: SupportedLocale = 'en';

  setLocale(locale: SupportedLocale): void {
    this.currentLocale = locale;
  }

  getLocale(): SupportedLocale {
    return this.currentLocale;
  }

  t(): TranslationDictionary {
    return translations[this.currentLocale] || translations.en;
  }
}

export const localization = new LocalizationManager();
