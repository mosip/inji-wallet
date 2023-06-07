import { ContextFrom, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../shared/GlobalContext';
import { HOST, SETTINGS_STORE_KEY } from '../shared/constants';
import { VCLabel } from '../types/vc';
import { StoreEvents } from './store';
import getAllConfigurations, {
  COMMON_PROPS_KEY,
} from '../shared/commonprops/commonProps';
import Storage from '../shared/storage';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    name: '',
    vcLabel: {
      singular: 'Card',
      plural: 'Cards',
    } as VCLabel,
    isBiometricUnlockEnabled: false,
    credentialRegistry: HOST,
    credentialRegistryResponse: '',
  },
  {
    events: {
      UPDATE_NAME: (name: string) => ({ name }),
      UPDATE_VC_LABEL: (label: string) => ({ label }),
      TOGGLE_BIOMETRIC_UNLOCK: (enable: boolean) => ({ enable }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      CHANGE_LANGUAGE: (language: string) => ({ language }),
      UPDATE_CREDENTIAL_REGISTRY: (credentialRegistry: string) => ({
        credentialRegistry,
      }),
      UPDATE_CREDENTIAL_REGISTRY_RESPONSE: (
        credentialRegistryResponse: string
      ) => ({
        credentialRegistryResponse: credentialRegistryResponse,
      }),
    },
  }
);

export const SettingsEvents = model.events;

export const settingsMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
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
          TOGGLE_BIOMETRIC_UNLOCK: {
            actions: ['toggleBiometricUnlock', 'storeContext'],
          },
          UPDATE_NAME: {
            actions: ['updateName', 'storeContext'],
          },
          UPDATE_VC_LABEL: {
            actions: ['updateVcLabel', 'storeContext'],
          },
          UPDATE_CREDENTIAL_REGISTRY: {
            actions: ['resetCredentialRegistry'],
            target: 'resetInjiProps',
          },
        },
      },
      resetInjiProps: {
        invoke: {
          src: 'resetInjiProps',
          onDone: {
            actions: [
              'updateCredentialRegistrySuccess',
              'updateCredentialRegistry',
            ],
            target: 'idle',
          },
          onError: {
            actions: ['updateCredentialRegistryResponse'],
            target: 'idle',
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
      updateCredentialRegistry: model.assign({
        credentialRegistry: (_context, event) => event.data.warningDomainName,
      }),

      updateCredentialRegistryResponse: model.assign({
        credentialRegistryResponse: () => 'error',
      }),

      updateCredentialRegistrySuccess: model.assign({
        credentialRegistryResponse: () => 'success',
      }),

      resetCredentialRegistry: model.assign({
        credentialRegistryResponse: () => {
          console.log('resetCredentialRegistry : called');
          return '';
        },
      }),

      toggleBiometricUnlock: model.assign({
        isBiometricUnlockEnabled: (_, event) => event.enable,
      }),
    },

    services: {
      resetInjiProps: async (context, event) => {
        try {
          await Storage.removeItem(COMMON_PROPS_KEY);
          return await getAllConfigurations(event.credentialRegistry);
        } catch (error) {
          console.log('Error from resetInjiProps ', error);
          throw error;
        }
      },
    },

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

export function selectCredentialRegistry(state: State) {
  return state.context.credentialRegistry;
}
export function selectCredentialRegistryResponse(state: State) {
  return state.context.credentialRegistryResponse;
}

export function selectBiometricUnlockEnabled(state: State) {
  return state.context.isBiometricUnlockEnabled;
}
