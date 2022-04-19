import i18next from 'i18next';
import { locale } from 'expo-localization';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fil from './locales/fil.json';

const resources = { en, fil };

export const SUPPORTED_LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Filipino', value: 'fil' },
];

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: locale,
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES.map(({ value }) => value),
});

export default i18next;
