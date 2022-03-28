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
    VCLabel: {
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
      STORE_RESPONSE: (response: any) => ({ response }),
    },
  }
);

export const SettingsEvents = model.events;

type Context = ContextFrom<typeof model>;

type UpdateNameEvent = EventFrom<typeof model, 'UPDATE_NAME'>;
type UpdateVCLabelEvent = EventFrom<typeof model, 'UPDATE_VC_LABEL'>;
type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;

export const settingsMachine = model.createMachine(
  {
    id: 'settings',
    context: model.initialContext,
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
            actions: ['updateVCLabel', 'storeContext'],
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

      setContext: model.assign((context, _event: any) => {
        const event: StoreResponseEvent = _event;
        return {
          ...context,
          ...event.response,
        };
      }),

      updateName: model.assign({
        name: (_, event: UpdateNameEvent) => event.name,
      }),

      updateVCLabel: model.assign({
        VCLabel: (_, event: UpdateVCLabelEvent) => ({
          singular: event.label,
          plural: event.label + 's',
        }),
      }),
    },

    services: {},

    guards: {
      hasData: (_, event: StoreResponseEvent) => event.response != null,
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

export function selectVCLabel(state: State) {
  return state.context.VCLabel;
}

export function selectBiometricUnlockEnabled(state: State) {
  return state.context.isBiometricUnlockEnabled;
}
