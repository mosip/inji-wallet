import { ActorRefFrom, ContextFrom, EventFrom, send, StateFrom } from 'xstate';
import { log } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../shared/GlobalContext';
import { StoreEvents, storeMachine, StoreResponseEvent } from './store';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    passcode: '',
    biometrics: '',
    canUseBiometrics: false,
  },
  {
    events: {
      SETUP_PASSCODE: (passcode: string) => ({ passcode }),
      SETUP_BIOMETRICS: () => ({}),
      LOGOUT: () => ({}),
      LOGIN: () => ({}),
      STORE_RESPONSE: (response?: unknown) => ({ response }),
    },
  }
);

export const AuthEvents = model.events;

type Context = ContextFrom<typeof model>;

type SetupPasscodeEvent = EventFrom<typeof model, 'SETUP_PASSCODE'>;

export const authMachine = model.createMachine(
  {
    id: 'auth',
    context: model.initialContext,
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
          { target: 'settingUp' },
        ],
      },
      settingUp: {
        on: {
          SETUP_PASSCODE: {
            target: 'authorized',
            actions: ['setPasscode', 'storeContext'],
          },
          // TODO: biometrics login
          SETUP_BIOMETRICS: {
            target: 'authorized',
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
        on: {
          LOGOUT: 'unauthorized',
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
        (context: Context) => {
          const { serviceRefs, ...data } = context;
          return StoreEvents.SET('auth', data);
        },
        { to: (context) => context.serviceRefs.store }
      ),

      setContext: model.assign((_, event: StoreResponseEvent) => {
        const { serviceRefs, ...data } = event.response;
        return data;
      }),

      setPasscode: model.assign({
        passcode: (_, event: SetupPasscodeEvent) => event.passcode,
      }),

      setBiometrics: model.assign({
        biometrics: '', // TODO
      }),
    },

    guards: {
      hasData: (_, event: StoreResponseEvent) => event.response != null,

      hasPasscodeSet: (context) => context.passcode !== '',
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
