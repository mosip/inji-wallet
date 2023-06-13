import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import { AppState, AppStateStatus, Platform } from 'react-native';
import {
  getDeviceId,
  getDeviceName,
  getDeviceNameSync,
} from 'react-native-device-info';
import { EventFrom, spawn, StateFrom, send, assign, AnyState } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { authMachine, createAuthMachine } from './auth';
import { createSettingsMachine, settingsMachine } from './settings';
import { StoreEvents, storeMachine } from './store';
import { createVcMachine, vcMachine } from './vc';
import { createActivityLogMachine, activityLogMachine } from './activityLog';
import {
  createRequestMachine,
  requestMachine,
} from './bleShare/request/requestMachine';
import { createScanMachine, scanMachine } from './bleShare/scan/scanMachine';
import { createRevokeMachine, revokeVidsMachine } from './revoke';

import { pure, respond } from 'xstate/lib/actions';
import { AppServices } from '../shared/GlobalContext';
import { request } from '../shared/request';
import {
  changeCrendetialRegistry,
  SETTINGS_STORE_KEY,
} from '../shared/constants';
import { MIMOTO_HOST } from 'react-native-dotenv';

const model = createModel(
  {
    info: {} as AppInfo,
    backendInfo: {} as BackendInfo,
    serviceRefs: {} as AppServices,
  },
  {
    events: {
      ACTIVE: () => ({}),
      INACTIVE: () => ({}),
      OFFLINE: () => ({}),
      ONLINE: (networkType: NetInfoStateType) => ({ networkType }),
      REQUEST_DEVICE_INFO: () => ({}),
      READY: (data?: unknown) => ({ data }),
      APP_INFO_RECEIVED: (info: AppInfo) => ({ info }),
      BACKEND_INFO_RECEIVED: (info: BackendInfo) => ({ info }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
    },
  }
);

export const appMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./app.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'app',
    initial: 'init',
    states: {
      init: {
        initial: 'store',
        states: {
          store: {
            entry: ['spawnStoreActor', 'logStoreEvents'],
            on: {
              READY: 'services',
            },
          },
          services: {
            entry: ['spawnServiceActors', 'logServiceEvents'],
            on: {
              READY: 'credentialRegistry',
            },
          },
          credentialRegistry: {
            entry: ['loadCredentialRegistryHostFromStorage'],
            on: {
              STORE_RESPONSE: {
                actions: ['loadCredentialRegistryInConstants'],
                target: 'info',
              },
            },
          },
          info: {
            invoke: {
              src: 'getAppInfo',
            },
            on: {
              APP_INFO_RECEIVED: {
                target: 'devinfo',
                actions: ['setAppInfo'],
              },
            },
          },
          devinfo: {
            invoke: {
              src: 'getBackendInfo',
            },
            on: {
              BACKEND_INFO_RECEIVED: {
                target: '#ready',
                actions: ['setBackendInfo'],
              },
            },
          },
        },
      },
      ready: {
        id: 'ready',
        type: 'parallel',
        on: {
          REQUEST_DEVICE_INFO: {
            actions: ['requestDeviceInfo'],
          },
        },
        states: {
          focus: {
            invoke: {
              src: 'checkFocusState',
            },
            on: {
              ACTIVE: '.active',
              INACTIVE: '.inactive',
            },
            initial: 'checking',
            states: {
              checking: {},
              active: {
                entry: ['forwardToServices'],
              },
              inactive: {
                entry: ['forwardToServices'],
              },
            },
          },
          network: {
            invoke: {
              src: 'checkNetworkState',
            },
            on: {
              ONLINE: '.online',
              OFFLINE: '.offline',
            },
            initial: 'checking',
            states: {
              checking: {},
              online: {
                entry: ['forwardToServices'],
              },
              offline: {
                entry: ['forwardToServices'],
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      forwardToServices: pure((context, event) =>
        Object.values(context.serviceRefs).map((serviceRef) =>
          send({ ...event, type: `APP_${event.type}` }, { to: serviceRef })
        )
      ),

      requestDeviceInfo: respond((context) => ({
        type: 'RECEIVE_DEVICE_INFO',
        info: {
          ...context.info,
          name: context.serviceRefs.settings.getSnapshot().context.name,
        },
      })),

      spawnStoreActor: assign({
        serviceRefs: (context) => ({
          ...context.serviceRefs,
          store: spawn(storeMachine, storeMachine.id),
        }),
      }),

      logStoreEvents: (context) => {
        if (__DEV__) {
          context.serviceRefs.store.subscribe(logState);
        }
      },

      spawnServiceActors: model.assign({
        serviceRefs: (context) => {
          const serviceRefs = {
            ...context.serviceRefs,
          };

          serviceRefs.auth = spawn(
            createAuthMachine(serviceRefs),
            authMachine.id
          );

          serviceRefs.vc = spawn(createVcMachine(serviceRefs), vcMachine.id);

          serviceRefs.settings = spawn(
            createSettingsMachine(serviceRefs),
            settingsMachine.id
          );

          serviceRefs.activityLog = spawn(
            createActivityLogMachine(serviceRefs),
            activityLogMachine.id
          );

          serviceRefs.scan = spawn(
            createScanMachine(serviceRefs),
            scanMachine.id
          );

          if (Platform.OS === 'android') {
            serviceRefs.request = spawn(
              createRequestMachine(serviceRefs),
              requestMachine.id
            );
          }

          serviceRefs.revoke = spawn(
            createRevokeMachine(serviceRefs),
            revokeVidsMachine.id
          );

          return serviceRefs;
        },
      }),

      logServiceEvents: (context) => {
        if (__DEV__) {
          context.serviceRefs.auth.subscribe(logState);
          context.serviceRefs.vc.subscribe(logState);
          context.serviceRefs.settings.subscribe(logState);
          context.serviceRefs.activityLog.subscribe(logState);
          context.serviceRefs.scan.subscribe(logState);

          if (Platform.OS === 'android') {
            context.serviceRefs.request.subscribe(logState);
          }

          context.serviceRefs.revoke.subscribe(logState);
        }
      },

      setAppInfo: model.assign({
        info: (_, event) => event.info,
      }),

      setBackendInfo: model.assign({
        backendInfo: (_, event) => event.info,
      }),

      loadCredentialRegistryHostFromStorage: send(
        StoreEvents.GET(SETTINGS_STORE_KEY),
        {
          to: (context) => context.serviceRefs.store,
        }
      ),

      loadCredentialRegistryInConstants: (_context, event) => {
        changeCrendetialRegistry(
          !event.response?.credentialRegistry
            ? MIMOTO_HOST
            : event.response?.credentialRegistry
        );
      },
    },

    services: {
      getAppInfo: () => async (callback) => {
        const appInfo = {
          deviceId: getDeviceId(),
          deviceName: await getDeviceName(),
        };
        callback(model.events.APP_INFO_RECEIVED(appInfo));
      },

      getBackendInfo: () => async (callback) => {
        let backendInfo = {
          application: {
            name: '',
            version: '',
          },
          build: {},
          config: {},
        };
        try {
          backendInfo = await request('GET', '/residentmobileapp/info');
          callback(model.events.BACKEND_INFO_RECEIVED(backendInfo));
        } catch {
          callback(model.events.BACKEND_INFO_RECEIVED(backendInfo));
        }
      },

      checkFocusState: () => (callback) => {
        const changeHandler = (newState: AppStateStatus) => {
          switch (newState) {
            case 'background':
            case 'inactive':
              callback({ type: 'INACTIVE' });
              break;
            case 'active':
              callback({ type: 'ACTIVE' });
              break;
          }
        };

        const blurHandler = () => callback({ type: 'INACTIVE' });
        const focusHandler = () => callback({ type: 'ACTIVE' });

        AppState.addEventListener('change', changeHandler);

        // android only
        if (Platform.OS === 'android') {
          AppState.addEventListener('blur', blurHandler);
          AppState.addEventListener('focus', focusHandler);
        }

        return () => {
          AppState.removeEventListener('change', changeHandler);

          if (Platform.OS === 'android') {
            AppState.removeEventListener('blur', blurHandler);
            AppState.removeEventListener('focus', focusHandler);
          }
        };
      },

      checkNetworkState: () => (callback) => {
        return NetInfo.addEventListener((state) => {
          if (state.isConnected) {
            callback({ type: 'ONLINE', networkType: state.type });
          } else {
            callback({ type: 'OFFLINE' });
          }
        });
      },
    },
  }
);

interface AppInfo {
  deviceId: string;
  deviceName: string;
}

interface BackendInfo {
  application: {
    name: string;
    version: string;
  };
  build: object;
  config: object;
}

type State = StateFrom<typeof appMachine>;

export function selectAppInfo(state: State) {
  return state.context.info;
}

export function selectBackendInfo(state: State) {
  return state.context.backendInfo;
}

export function selectIsReady(state: State) {
  return state.matches('ready');
}

export function selectIsOnline(state: State) {
  return state.matches('ready.network.online');
}

export function selectIsActive(state: State) {
  return state.matches('ready.focus.active');
}

export function selectIsFocused(state: State) {
  return state.matches('ready.focus');
}

export function logState(state: AnyState) {
  const data = JSON.stringify(
    state.event,
    (key, value) => {
      if (key === 'type') return undefined;
      if (typeof value === 'string' && value.length >= 100) {
        return value.slice(0, 100) + '...';
      }
      return value;
    },
    2
  );
  console.log(
    `[${getDeviceNameSync()}] ${state.machine.id}: ${
      state.event.type
    } -> ${state.toStrings().pop()}\n${
      data.length > 300 ? data.slice(0, 300) + '...' : data
    }
    `
  );
}
