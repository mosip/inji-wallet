import SmartShare from '@idpass/smartshare-react-native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { EmitterSubscription } from 'react-native';
import { EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { DeviceInfo } from '../components/DeviceInfoList';
import { Message } from '../shared/Message';
import { getDeviceNameSync } from 'react-native-device-info';
import { StoreEvents } from './store';
import { VC } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import {
  RECEIVED_VCS_STORE_KEY,
  VC_ITEM_STORE_KEY,
} from '../shared/constants';
import { ActivityLogEvents } from './activityLog';
import { VcEvents } from './vc';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    incomingVc: {} as VC,
    connectionParams: '',
    loggers: [] as EmitterSubscription[],
  },
  {
    events: {
      ACCEPT: () => ({}),
      REJECT: () => ({}),
      CANCEL: () => ({}),
      DISMISS: () => ({}),
      VC_RECEIVED: (vc: VC) => ({ vc }),
      RESPONSE_SENT: () => ({}),
      CONNECTED: () => ({}),
      DISCONNECT: () => ({}),
      EXCHANGE_DONE: (senderInfo: DeviceInfo) => ({ senderInfo }),
      SCREEN_FOCUS: () => ({}),
      SCREEN_BLUR: () => ({}),
      BLUETOOTH_ENABLED: () => ({}),
      BLUETOOTH_DISABLED: () => ({}),
      STORE_READY: () => ({}),
      STORE_RESPONSE: (response: any) => ({ response }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      RECEIVED_VCS_UPDATED: () => ({}),
      VC_RESPONSE: (response: any) => ({ response }),
    },
  }
);

export const RequestEvents = model.events;

export const requestMachine = model.createMachine(
  {
    tsTypes: {} as import('./request.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'request',
    initial: 'inactive',
    on: {
      SCREEN_BLUR: 'inactive',
      SCREEN_FOCUS: 'checkingBluetoothService',
    },
    states: {
      inactive: {
        entry: ['removeLoggers'],
      },
      checkingBluetoothService: {
        initial: 'checking',
        states: {
          checking: {
            invoke: {
              src: 'checkBluetoothService',
            },
            on: {
              BLUETOOTH_ENABLED: 'enabled',
              BLUETOOTH_DISABLED: 'requesting',
            },
          },
          requesting: {
            invoke: {
              src: 'requestBluetooth',
            },
            on: {
              BLUETOOTH_ENABLED: 'enabled',
              BLUETOOTH_DISABLED: '#bluetoothDenied',
            },
          },
          enabled: {
            always: '#clearingConnection',
          },
        },
      },
      bluetoothDenied: {
        id: 'bluetoothDenied',
      },
      clearingConnection: {
        id: 'clearingConnection',
        entry: ['disconnect'],
        after: {
          CLEAR_DELAY: 'waitingForConnection',
        },
      },
      waitingForConnection: {
        id: 'waitingForConnection',
        entry: ['removeLoggers', 'registerLoggers', 'generateConnectionParams'],
        invoke: {
          src: 'advertiseDevice',
        },
        on: {
          CONNECTED: 'preparingToExchangeInfo',
          DISCONNECT: 'disconnected',
        },
      },
      preparingToExchangeInfo: {
        entry: ['requestReceiverInfo'],
        on: {
          RECEIVE_DEVICE_INFO: {
            target: 'exchangingDeviceInfo',
            actions: ['setReceiverInfo'],
          },
        },
      },
      exchangingDeviceInfo: {
        invoke: {
          src: 'exchangeDeviceInfo',
        },
        on: {
          EXCHANGE_DONE: {
            target: 'waitingForVc',
            actions: ['setSenderInfo'],
          },
        },
      },
      waitingForVc: {
        invoke: {
          src: 'receiveVc',
        },
        on: {
          DISCONNECT: 'disconnected',
          VC_RECEIVED: {
            target: 'reviewing',
            actions: ['setIncomingVc'],
          },
        },
      },
      reviewing: {
        on: {
          ACCEPT: '.accepting',
          REJECT: '.rejected',
          CANCEL: '.rejected',
        },
        initial: 'idle',
        states: {
          idle: {},
          accepting: {
            initial: 'requestingReceivedVcs',
            states: {
              requestingReceivedVcs: {
                entry: ['requestReceivedVcs'],
                on: {
                  VC_RESPONSE: [
                    {
                      cond: 'hasExistingVc',
                      target: '#accepted',
                    },
                    {
                      target: 'prependingReceivedVc',
                    },
                  ],
                },
              },
              prependingReceivedVc: {
                entry: ['prependReceivedVc'],
                on: {
                  STORE_RESPONSE: 'storingVc',
                },
              },
              storingVc: {
                entry: ['storeVc'],
                on: {
                  STORE_RESPONSE: {
                    target: '#accepted',
                    actions: ['sendVcReceived'],
                  },
                },
              },
            },
          },
          accepted: {
            entry: ['logReceived'],
            id: 'accepted',
            invoke: {
              src: {
                type: 'sendVcResponse',
                status: 'accepted',
              },
            },
            on: {
              DISMISS: 'navigatingToHome',
            },
          },
          rejected: {
            invoke: {
              src: {
                type: 'sendVcResponse',
                status: 'rejected',
              },
            },
            on: {
              DISMISS: '#waitingForConnection',
            },
          },
          navigatingToHome: {},
        },
        exit: ['disconnect'],
      },
      disconnected: {
        on: {
          DISMISS: 'waitingForConnection',
        },
      },
    },
  },
  {
    actions: {
      requestReceivedVcs: send(VcEvents.GET_RECEIVED_VCS(), {
        to: (context) => context.serviceRefs.vc,
      }),

      requestReceiverInfo: sendParent('REQUEST_DEVICE_INFO'),

      setReceiverInfo: model.assign({
        receiverInfo: (_, event) => event.info,
      }),

      disconnect: () => {
        try {
          SmartShare.destroyConnection();
        } catch (e) {
          //
        }
      },

      generateConnectionParams: model.assign({
        connectionParams: () => SmartShare.getConnectionParameters(),
      }),

      setSenderInfo: model.assign({
        senderInfo: (_, event) => event.senderInfo,
      }),

      setIncomingVc: model.assign({
        incomingVc: (_, event) => event.vc,
      }),

      registerLoggers: model.assign({
        loggers: () => {
          if (__DEV__) {
            return [
              SmartShare.handleNearbyEvents((event) => {
                console.log(
                  getDeviceNameSync(),
                  '<Receiver.Event>',
                  JSON.stringify(event)
                );
              }),
              SmartShare.handleLogEvents((event) => {
                console.log(
                  getDeviceNameSync(),
                  '<Receiver.Log>',
                  JSON.stringify(event)
                );
              }),
            ];
          } else {
            return [];
          }
        },
      }),

      removeLoggers: model.assign({
        loggers: ({ loggers }) => {
          loggers?.forEach((logger) => logger.remove());
          return null;
        },
      }),

      prependReceivedVc: send(
        (context) =>
          StoreEvents.PREPEND(
            RECEIVED_VCS_STORE_KEY,
            VC_ITEM_STORE_KEY(context.incomingVc)
          ),
        { to: (context) => context.serviceRefs.store }
      ),

      storeVc: send(
        (context) =>
          StoreEvents.SET(
            VC_ITEM_STORE_KEY(context.incomingVc),
            context.incomingVc
          ),
        { to: (context) => context.serviceRefs.store }
      ),

      logReceived: send(
        (context) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: VC_ITEM_STORE_KEY(context.incomingVc),
            action: 'received',
            timestamp: Date.now(),
            deviceName:
              context.senderInfo.name || context.senderInfo.deviceName,
            vcLabel: context.incomingVc.tag || context.incomingVc.id,
          }),
        { to: (context) => context.serviceRefs.activityLog }
      ),

      sendVcReceived: send(
        (context) => {
          return VcEvents.VC_RECEIVED(
            VC_ITEM_STORE_KEY(context.incomingVc)
          );
        },
        { to: (context) => context.serviceRefs.vc }
      ),
    },

    services: {
      checkBluetoothService: () => (callback) => {
        const subscription = BluetoothStateManager.onStateChange((state) => {
          if (state === 'PoweredOn') {
            callback(model.events.BLUETOOTH_ENABLED());
          } else {
            callback(model.events.BLUETOOTH_DISABLED());
          }
        }, true);

        return () => subscription.remove();
      },

      requestBluetooth: () => (callback) => {
        BluetoothStateManager.requestToEnable()
          .then(() => callback(model.events.BLUETOOTH_ENABLED()))
          .catch(() => callback(model.events.BLUETOOTH_DISABLED()));
      },

      advertiseDevice: () => (callback) => {
        SmartShare.createConnection('advertiser', () => {
          callback({ type: 'CONNECTED' });
        });
      },

      exchangeDeviceInfo: (context) => (callback) => {
        const subscription = SmartShare.handleNearbyEvents((event) => {
          if (event.type === 'onDisconnected') {
            callback({ type: 'DISCONNECT' });
          }

          if (event.type !== 'msg') return;

          const message = Message.fromString<DeviceInfo>(event.data);
          if (message.type === 'exchange:sender-info') {
            const response = new Message(
              'exchange:receiver-info',
              context.receiverInfo
            );
            SmartShare.send(response.toString(), () => {
              callback({ type: 'EXCHANGE_DONE', senderInfo: message.data });
            });
          }
        });

        return () => subscription.remove();
      },

      receiveVc: () => (callback) => {
        const subscription = SmartShare.handleNearbyEvents((event) => {
          if (event.type === 'onDisconnected') {
            callback({ type: 'DISCONNECT' });
          }

          if (event.type !== 'msg') return;

          const message = Message.fromString<VC>(event.data);
          if (message.type === 'send:vc') {
            callback({ type: 'VC_RECEIVED', vc: message.data });
          }
        });

        return () => subscription.remove();
      },

      sendVcResponse: (_context, _event, meta) => (callback) => {
        const response = new Message('send:vc:response', {
          status: meta.src.status,
        });

        SmartShare.send(response.toString(), () => {
          callback({ type: 'RESPONSE_SENT' });
        });
      },
    },

    guards: {
      hasExistingVc: (context, event) => {
        const receivedVcs: string[] = event.response;
        const vcKey = VC_ITEM_STORE_KEY(context.incomingVc);
        return receivedVcs.includes(vcKey);
      },
    },

    delays: {
      CLEAR_DELAY: 250,
    },
  }
);

export function createRequestMachine(serviceRefs: AppServices) {
  return requestMachine.withContext({
    ...requestMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof requestMachine>;

export function selectSenderInfo(state: State) {
  return state.context.senderInfo;
}

export function selectConnectionParams(state: State) {
  return state.context.connectionParams;
}

export function selectIncomingVc(state: State) {
  return state.context.incomingVc;
}

export function selectIsReviewing(state: State) {
  return state.matches('reviewing');
}

export function selectIsAccepted(state: State) {
  return state.matches('reviewing.accepted');
}

export function selectIsRejected(state: State) {
  return state.matches('reviewing.rejected');
}

export function selectIsDisconnected(state: State) {
  return state.matches('disconnected');
}

export function selectIsWaitingForConnection(state: State) {
  return state.matches('waitingForConnection');
}

export function selectIsBluetoothDenied(state: State) {
  return state.matches('bluetoothDenied');
}

export function selectIsExchangingDeviceInfo(state: State) {
  return state.matches('exchangingDeviceInfo');
}

export function selectIsWaitingForVc(state: State) {
  return state.matches('waitingForVc');
}
