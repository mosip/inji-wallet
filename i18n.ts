import i18next from 'i18next';
import { locale } from 'expo-localization';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fil from './locales/fil.json';
import ara from './locales/ara.json';
import hin from './locales/hin.json';
import kan from './locales/kan.json';
import tam from './locales/tam.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = { en, fil, ara, hin, kan, tam };

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  fil: 'Filipino',
  ara: 'Arabic',
  hin: 'Hindi',
  kan: 'Kannada',
  tam: 'Tamil',
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: getLanguageCode(locale),
    fallbackLng: getLanguageCode,
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
  })
  .then(async () => {
    const language = await AsyncStorage.getItem('language');
    if (language !== i18next.language) {
      i18next.changeLanguage(language);
    }
  });

export default i18next;

function getLanguageCode(code: string) {
  const [language] = code.split('-');
  return language;
}
