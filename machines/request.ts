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
  RECEIVED_VIDS_STORE_KEY,
  VID_ITEM_STORE_KEY,
} from '../shared/constants';
import { ActivityLogEvents } from './activityLog';
import { VidEvents } from './vid';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    incomingVid: {} as VC,
    connectionParams: '',
    loggers: [] as EmitterSubscription[],
  },
  {
    events: {
      ACCEPT: () => ({}),
      REJECT: () => ({}),
      CANCEL: () => ({}),
      DISMISS: () => ({}),
      VID_RECEIVED: (vid: VC) => ({ vid }),
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
      RECEIVED_VIDS_UPDATED: () => ({}),
      VID_RESPONSE: (response: any) => ({ response }),
    },
  }
);

export const RequestEvents = model.events;

type ExchangeDoneEvent = EventFrom<typeof model, 'EXCHANGE_DONE'>;
type VidReceivedEvent = EventFrom<typeof model, 'VID_RECEIVED'>;
type ReceiveDeviceInfoEvent = EventFrom<typeof model, 'RECEIVE_DEVICE_INFO'>;
type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;
type VidResponseEvent = EventFrom<typeof model, 'VID_RESPONSE'>;

export const requestMachine = model.createMachine(
  {
    id: 'request',
    context: model.initialContext,
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
          250: 'waitingForConnection',
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
            target: 'waitingForVid',
            actions: ['setSenderInfo'],
          },
        },
      },
      waitingForVid: {
        invoke: {
          src: 'receiveVid',
        },
        on: {
          DISCONNECT: 'disconnected',
          VID_RECEIVED: {
            target: 'reviewing',
            actions: ['setIncomingVid'],
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
            initial: 'requestingReceivedVids',
            states: {
              requestingReceivedVids: {
                entry: ['requestReceivedVids'],
                on: {
                  VID_RESPONSE: [
                    {
                      cond: 'hasExistingVid',
                      target: '#accepted',
                    },
                    {
                      target: 'prependingReceivedVid',
                    },
                  ],
                },
              },
              prependingReceivedVid: {
                entry: ['prependReceivedVid'],
                on: {
                  STORE_RESPONSE: 'storingVid',
                },
              },
              storingVid: {
                entry: ['storeVid'],
                on: {
                  STORE_RESPONSE: {
                    target: '#accepted',
                    actions: ['sendVidReceived'],
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
                type: 'sendVidResponse',
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
                type: 'sendVidResponse',
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
      requestReceivedVids: send(VidEvents.GET_RECEIVED_VIDS(), {
        to: (context) => context.serviceRefs.vid,
      }),

      requestReceiverInfo: sendParent('REQUEST_DEVICE_INFO'),

      setReceiverInfo: model.assign({
        receiverInfo: (_, event: ReceiveDeviceInfoEvent) => event.info,
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
        senderInfo: (_, event: ExchangeDoneEvent) => event.senderInfo,
      }),

      setIncomingVid: model.assign({
        incomingVid: (_, event: VidReceivedEvent) => event.vid,
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

      prependReceivedVid: send(
        (context) =>
          StoreEvents.PREPEND(
            RECEIVED_VIDS_STORE_KEY,
            VID_ITEM_STORE_KEY(context.incomingVid)
          ),
        { to: (context) => context.serviceRefs.store }
      ),

      storeVid: send(
        (context) =>
          StoreEvents.SET(
            VID_ITEM_STORE_KEY(context.incomingVid),
            context.incomingVid
          ),
        { to: (context) => context.serviceRefs.store }
      ),

      logReceived: send(
        (context) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vidKey: VID_ITEM_STORE_KEY(context.incomingVid),
            action: 'received',
            timestamp: Date.now(),
            deviceName:
              context.senderInfo.name || context.senderInfo.deviceName,
            vidLabel: context.incomingVid.tag || context.incomingVid.id,
          }),
        { to: (context) => context.serviceRefs.activityLog }
      ),

      sendVidReceived: send(
        (context) => {
          return VidEvents.VID_RECEIVED(
            VID_ITEM_STORE_KEY(context.incomingVid)
          );
        },
        { to: (context) => context.serviceRefs.vid }
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

      receiveVid: () => (callback) => {
        const subscription = SmartShare.handleNearbyEvents((event) => {
          if (event.type === 'onDisconnected') {
            callback({ type: 'DISCONNECT' });
          }

          if (event.type !== 'msg') return;

          const message = Message.fromString<VC>(event.data);
          if (message.type === 'send:vid') {
            callback({ type: 'VID_RECEIVED', vid: message.data });
          }
        });

        return () => subscription.remove();
      },

      // tslint:disable-next-line
      sendVidResponse: (context, event, meta) => (callback) => {
        const response = new Message('send:vid:response', {
          status: meta.src.status,
        });

        SmartShare.send(response.toString(), () => {
          callback({ type: 'RESPONSE_SENT' });
        });
      },
    },

    guards: {
      hasExistingVid: (context, event: VidResponseEvent) => {
        const receivedVids: string[] = event.response;
        const vidKey = VID_ITEM_STORE_KEY(context.incomingVid);
        return receivedVids.includes(vidKey);
      },
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

export function selectIncomingVid(state: State) {
  return state.context.incomingVid;
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

export function selectIsWaitingForVid(state: State) {
  return state.matches('waitingForVid');
}
