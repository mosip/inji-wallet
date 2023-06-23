import i18next from 'i18next';
import { locale } from 'expo-localization';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fil from './locales/fil.json';
import ar from './locales/ara.json';
import hi from './locales/hin.json';
import kn from './locales/kan.json';
import ta from './locales/tam.json';
import Storage from './shared/storage';

import { iso6393To1 } from 'iso-639-3';
import { LocalizedField } from './types/vc';

import { APPLICATION_LANGUAGE } from 'react-native-dotenv';

const resources = { en, fil, ar, hi, kn, ta };

const languageCodeMap = {};

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  fil: 'Filipino',
  ar: 'عربى',
  hi: 'हिंदी',
  kn: 'ಕನ್ನಡ',
  ta: 'ತಮಿಳು',
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
    const language = await Storage.getItem('language');
    if (language !== i18next.language) {
      i18next.changeLanguage(language);
      populateLanguageCodeMap();
    }
    if (!Object.keys(SUPPORTED_LANGUAGES).includes(i18next.language)) {
      i18next.changeLanguage('en');
      populateLanguageCodeMap();
    }
  });

export default i18next;

export function getLanguageCode(code: string) {
  const [language] = code.split('-');
  return language;
}

export function getVCDetailsForCurrentLanguage(locales) {
  const currentLanguage = i18next.language;
  const vcDetailsForCurrentLanguage = locales.filter(
    (obj) => obj.language === languageCodeMap[currentLanguage]
  );
  return vcDetailsForCurrentLanguage[0]?.value
    ? vcDetailsForCurrentLanguage[0].value
    : locales[0]?.value;
}

// This method gets the value from iso-639-3 package, which contains key value pairs of three letter language codes[key] and two letter langugae code[value]. These values are according to iso standards.
// The response received from the server is three letter language code and the value in the inji code base is two letter language code. Hence the conversion is done.
function getThreeLetterLanguageCode(twoLetterLanguageCode) {
  return Object.keys(iso6393To1).find(
    (key) => iso6393To1[key] === twoLetterLanguageCode
  );
}

function populateLanguageCodeMap() {
  const supportedLanguages = Object.keys(SUPPORTED_LANGUAGES);
  supportedLanguages.forEach((languageCode) => {
    let threeLetterLanguageCode = languageCode;

    if (isTwoLetterLanguageCode(languageCode)) {
      threeLetterLanguageCode = getThreeLetterLanguageCode(languageCode);
    }
    languageCodeMap[languageCode] = threeLetterLanguageCode;
  });
}

export function getLocalizedField(rawField: string | LocalizedField[]) {
  if (typeof rawField === 'string') {
    return rawField;
  }
  try {
    const locales: LocalizedField[] = JSON.parse(JSON.stringify(rawField));
    if (locales.length == 1) return locales[0]?.value;
    return getVCDetailsForCurrentLanguage(locales);
  } catch (e) {
    return '';
  }
}

function isTwoLetterLanguageCode(languageCode) {
  return languageCode.length == 2;
}
