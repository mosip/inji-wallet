import { ContextFrom, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../shared/GlobalContext';
import { SETTINGS_STORE_KEY } from '../shared/constants';
import { VCLabel } from '../types/vc';
import { StoreEvents } from './store';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    name: '',
    vcLabel: {
      singular: 'ID',
      plural: 'IDs',
    } as VCLabel,
    isBiometricUnlockEnabled: false,
  },
  {
    events: {
      UPDATE_NAME: (name: string) => ({ name }),
      UPDATE_VC_LABEL: (label: string) => ({ label }),
      TOGGLE_BIOMETRIC_UNLOCK: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({ response }),
    },
  }
);

export const SettingsEvents = model.events;

export const settingsMachine = model.createMachine(
  {
    tsTypes: {} as import('./settings.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'settings',
    initial: 'init',
    states: {
      init: {
        entry: ['requestStoredContext'],
        on: {
          STORE_RESPONSE: [
            { cond: 'hasData', target: 'idle', actions: ['setContext'] },
            { target: 'storingDefaults' },
          ],
        },
      },
      storingDefaults: {
        entry: ['storeContext'],
        on: {
          STORE_RESPONSE: 'idle',
        },
      },
      idle: {
        on: {
          // TOGGLE_BIOMETRIC_UNLOCK: {
          //   actions: ['toggleBiometricUnlock', sendUpdate()],
          // },
          UPDATE_NAME: {
            actions: ['updateName', 'storeContext'],
          },
          UPDATE_VC_LABEL: {
            actions: ['updateVcLabel', 'storeContext'],
          },
        },
      },
    },
  },
  {
    actions: {
      requestStoredContext: send(StoreEvents.GET(SETTINGS_STORE_KEY), {
        to: (context) => context.serviceRefs.store,
      }),

      storeContext: send(
        (context) => {
          const { serviceRefs, ...data } = context;
          return StoreEvents.SET(SETTINGS_STORE_KEY, data);
        },
        { to: (context) => context.serviceRefs.store }
      ),

      setContext: model.assign((context, event) => {
        const newContext = event.response as ContextFrom<typeof model>;
        return {
          ...context,
          ...newContext,
        };
      }),

      updateName: model.assign({
        name: (_, event) => event.name,
      }),

      updateVcLabel: model.assign({
        vcLabel: (_, event) => ({
          singular: event.label,
          plural: event.label + 's',
        }),
      }),
    },

    services: {},

    guards: {
      hasData: (_, event) => event.response != null,
    },
  }
);

export function createSettingsMachine(serviceRefs: AppServices) {
  return settingsMachine.withContext({
    ...settingsMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof settingsMachine>;

export function selectName(state: State) {
  return state.context.name;
}

export function selectVcLabel(state: State) {
  return state.context.vcLabel;
}

export function selectBiometricUnlockEnabled(state: State) {
  return state.context.isBiometricUnlockEnabled;
}
