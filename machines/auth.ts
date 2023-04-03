import { init } from 'mosip-inji-face-sdk';
import { assign, ContextFrom, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import getAllConfigurations from '../shared/commonprops/commonProps';
import { AppServices } from '../shared/GlobalContext';
import { StoreEvents, StoreResponseEvent } from './store';
import { locale } from 'expo-localization';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
import { getLanguageCode } from '../i18n';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    passcode: '',
    biometrics: '',
    canUseBiometrics: false,
    selectLanguage: false,
  },
  {
    events: {
      SETUP_PASSCODE: (passcode: string) => ({ passcode }),
      SETUP_BIOMETRICS: (biometrics: string) => ({ biometrics }),
      LOGOUT: () => ({}),
      LOGIN: () => ({}),
      STORE_RESPONSE: (response?: unknown) => ({ response }),
      SELECT: () => ({}),
      NEXT: () => ({}),
    },
  }
);

export const AuthEvents = model.events;

type SetupBiometricsEvent = EventFrom<typeof model, 'SETUP_BIOMETRICS'>;

export const authMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./auth.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'auth',
    initial: 'init',
    states: {
      init: {
        entry: ['requestStoredContext'],
        on: {
          STORE_RESPONSE: [
            {
              cond: 'hasData',
              target: 'checkingAuth',
              actions: ['setContext'],
            },
            { target: 'savingDefaults' },
          ],
        },
      },
      savingDefaults: {
        entry: ['storeContext'],
        on: {
          STORE_RESPONSE: 'checkingAuth',
        },
      },
      checkingAuth: {
        always: [
          { cond: 'hasLanguageAvailable', target: 'setLanguage' },
          { cond: 'hasLanguageset', target: 'languagesetup' },
          { cond: 'hasPasscodeSet', target: 'unauthorized' },
          { cond: 'hasBiometricSet', target: 'unauthorized' },
          { target: 'settingUp' },
        ],
      },
      setLanguage: {
        invoke: {
          src: 'setLanguage',
          onDone: {
            actions: '',
            target: 'introSlider',
          },
        },
        on: {
          NEXT: {
            target: 'settingUp',
          },
        },
      },
      languagesetup: {
        on: {
          SELECT: {
            target: 'introSlider',
          },
        },
      },
      introSlider: {
        on: {
          NEXT: {
            target: 'settingUp',
          },
        },
      },
      settingUp: {
        on: {
          SETUP_PASSCODE: {
            target: 'authorized',
            actions: ['setPasscode', 'storeContext', 'setLanguage'],
          },
          SETUP_BIOMETRICS: {
            // Note! dont authorized yet we need to setup passcode too as discuss
            // target: 'authorized',
            actions: ['setBiometrics', 'storeContext', 'setLanguage'],
          },
        },
      },
      unauthorized: {
        on: {
          LOGIN: 'authorized',
        },
      },
      authorized: {
        invoke: {
          src: 'downloadFaceSdkModel',
          onDone: {
            actions: ['storeContext'],
          },
        },
        on: {
          LOGOUT: 'unauthorized',
          SETUP_BIOMETRICS: {
            actions: ['setBiometrics', 'storeContext'],
          },
        },
      },
    },
  },
  {
    actions: {
      requestStoredContext: send(StoreEvents.GET('auth'), {
        to: (context) => context.serviceRefs.store,
      }),

      storeContext: send(
        (context) => {
          const { serviceRefs, ...data } = context;
          return StoreEvents.SET('auth', data);
        },
        { to: (context) => context.serviceRefs.store }
      ),

      setContext: model.assign((_, event) => {
        const { serviceRefs, ...data } = event.response as ContextFrom<
          typeof model
        >;
        return data;
      }),

      setPasscode: model.assign({
        passcode: (_, event) => event.passcode,
      }),

      setBiometrics: model.assign({
        biometrics: (_, event: SetupBiometricsEvent) => event.biometrics,
      }),

      setLanguage: assign({
        selectLanguage: (context) => !context.selectLanguage,
      }),
    },

    services: {
      downloadFaceSdkModel: () => async () => {
        var injiProp = null;
        try {
          var injiProp = await getAllConfigurations();
          const resp: string =
            injiProp != null ? injiProp.faceSdkModelUrl : null;
          if (resp != null) {
            init(resp, false);
          }
        } catch (error) {
          console.log(error);
        }
      },
      setLanguage: async () => {
        const { i18n } = useTranslation();
        const language = getLanguageCode(locale);
        try {
          if (language !== i18n.language) {
            await i18n.changeLanguage(language).then(async () => {
              await AsyncStorage.setItem('language', i18n.language);
              const isRTL = i18next.dir(language) === 'rtl' ? true : false;
              if (isRTL !== I18nManager.isRTL) {
                try {
                  I18nManager.forceRTL(isRTL);
                  setTimeout(() => {
                    RNRestart.Restart();
                  }, 150);
                } catch (e) {
                  console.log('error', e);
                }
              }
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    },

    guards: {
      hasData: (_, event: StoreResponseEvent) => event.response != null,

      hasPasscodeSet: (context) => {
        return context.passcode !== '';
      },
      hasBiometricSet: (context) => {
        return context.biometrics !== '' && context.passcode !== '';
      },
      hasLanguageset: (context) => {
        return !context.selectLanguage;
      },
      hasLanguageAvailable: (context) => {
        const language = getLanguageCode(locale);
        const languages = Object.entries(SUPPORTED_LANGUAGES).map(
          ([value, label]) => ({ label, value })
        );
        let languageAvailable = false;
        languages.forEach((item) => {
          if (item.value == language) {
            languageAvailable = true;
          }
        });
        return !context.selectLanguage && languageAvailable;
      },
    },
  }
);

export function createAuthMachine(serviceRefs: AppServices) {
  return authMachine.withContext({
    ...authMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof authMachine>;

export function selectPasscode(state: State) {
  return state.context.passcode;
}

export function selectBiometrics(state: State) {
  return state.context.biometrics;
}

export function selectCanUseBiometrics(state: State) {
  return state.context.canUseBiometrics;
}

export function selectAuthorized(state: State) {
  return state.matches('authorized');
}

export function selectUnauthorized(state: State) {
  return state.matches('unauthorized');
}

export function selectSettingUp(state: State) {
  return state.matches('settingUp');
}

export function selectLanguagesetup(state: State) {
  return state.matches('languagesetup');
}
export function selectIntroSlider(state: State) {
  return state.matches('introSlider');
}
