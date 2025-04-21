import React, { createContext, useContext, useState } from 'react';
import { I18nManager } from 'react-native';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    welcome: "Welcome to our store",
    price: "Price",
    switchLanguage: "Switch to Arabic",
    loading: "Loading...",
    error: "Error loading products"
  },
  ar: {
    welcome: "مرحبًا بكم في متجرنا",
    price: "السعر",
    switchLanguage: "التغيير إلى الإنجليزية",
    loading: "جاري التحميل...",
    error: "خطأ في تحميل المنتجات"
  }
};

const i18n = new I18n(translations);
i18n.locale = 'en';
i18n.enableFallback = true;

type LanguageContextType = {
  isRTL: boolean;
  toggleLanguage: () => void;
  translate: (key: string) => string;
  translateText: (text: string) => Promise<string>;
};

const LanguageContext = createContext<LanguageContextType>({
  isRTL: false,
  toggleLanguage: () => {},
  translate: (key) => key,
  translateText: async (text) => text,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRTL, setIsRTL] = useState(false);

  const toggleLanguage = () => {
    const newIsRTL = !isRTL;
    setIsRTL(newIsRTL);
    i18n.locale = newIsRTL ? 'ar' : 'en';
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(newIsRTL);
  };

  const translate = (key: string) => i18n.t(key);

  // Mock translation function - replace with real API call
  const translateText = async (text: string) => {
    if (!isRTL) return text;
    
    // Mock Arabic translations
    const mockTranslations: Record<string, string> = {
      "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops": "حقيبة ظهر من Fjallraven، تناسب 15 كمبيوتر محمول",
      "Mens Casual Premium Slim Fit T-Shirts": "قمصان رجالية عادية متميزة ضيقة",
    };
    
    return mockTranslations[text] || text;
  };

  return (
    <LanguageContext.Provider value={{ isRTL, toggleLanguage, translate, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);