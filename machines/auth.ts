import { init } from 'mosip-inji-face-sdk';
import { ContextFrom, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import getAllProperties from '../shared/commonprops/commonProps';
import { AppServices } from '../shared/GlobalContext';
import { StoreEvents, StoreResponseEvent } from './store';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    passcode: '',
    biometrics: '',
    canUseBiometrics: false,
    injiAppProperties: null,
  },
  {
    events: {
      SETUP_PASSCODE: (passcode: string) => ({ passcode }),
      SETUP_BIOMETRICS: (biometrics: string) => ({ biometrics }),
      LOGOUT: () => ({}),
      LOGIN: () => ({}),
      STORE_RESPONSE: (response?: unknown) => ({ response }),
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
          { cond: 'hasPasscodeSet', target: 'unauthorized' },
          { cond: 'hasBiometricSet', target: 'unauthorized' },
          { target: 'settingUp' },
        ],
      },
      settingUp: {
        on: {
          SETUP_PASSCODE: {
            target: 'authorized',
            actions: ['setPasscode', 'storeContext'],
          },
          SETUP_BIOMETRICS: {
            // Note! dont authorized yet we need to setup passcode too as discuss
            // target: 'authorized',
            actions: ['setBiometrics', 'storeContext'],
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
            actions: ['setInjiAppProperties', 'storeContext'],
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

      setInjiAppProperties: model.assign({
        injiAppProperties: (_, event) => event.data as object,
      }),
    },

    services: {
      downloadFaceSdkModel: (context) => async () => {
        var injiProp = null;
        try {
          if (context.injiAppProperties == null) {
            injiProp = await getAllProperties();
          } else {
            injiProp = context.injiAppProperties;
          }
          const resp: string =
            injiProp != null ? injiProp.faceSdkModelUrl : null;
          if (resp != null) {
            init(resp, false);
          }
        } catch (error) {
          console.log(error);
        }
        return injiProp;
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
