import SmartshareReactNative from '@idpass/smartshare-react-native';
const { IdpassSmartshare, GoogleNearbyMessages } = SmartshareReactNative;

import uuid from 'react-native-uuid';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { DeviceInfo } from '../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { StoreEvents } from './store';
import { VC } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import {
  GNM_API_KEY,
  RECEIVED_VCS_STORE_KEY,
  VC_ITEM_STORE_KEY,
} from '../shared/constants';
import { ActivityLogEvents } from './activityLog';
import { VcEvents } from './vc';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import {
  ExchangeReceiverInfoEvent,
  onlineSubscribe,
  offlineSubscribe,
  PairingResponseEvent,
  onlineSend,
  offlineSend,
  SendVcResponseEvent,
} from '../shared/smartshare';

type SharingProtocol = 'OFFLINE' | 'ONLINE';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    incomingVc: {} as VC,
    connectionParams: '',
    loggers: [] as EmitterSubscription[],
    sharingProtocol: (Platform.OS === 'ios'
      ? 'ONLINE'
      : 'OFFLINE') as SharingProtocol,
  },
  {
    events: {
      ACCEPT: () => ({}),
      REJECT: () => ({}),
      CANCEL: () => ({}),
      DISMISS: () => ({}),
      GOBACK: () => ({}),
      VC_RECEIVED: (vc: VC) => ({ vc }),
      CONNECTED: () => ({}),
      DISCONNECT: () => ({}),
      EXCHANGE_DONE: (senderInfo: DeviceInfo) => ({ senderInfo }),
      SCREEN_FOCUS: () => ({}),
      SCREEN_BLUR: () => ({}),
      BLUETOOTH_ENABLED: () => ({}),
      BLUETOOTH_DISABLED: () => ({}),
      STORE_READY: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      RECEIVED_VCS_UPDATED: () => ({}),
      VC_RESPONSE: (response: unknown) => ({ response }),
      SWITCH_PROTOCOL: (value: boolean) => ({ value }),
      GOTO_SETTINGS: () => ({}),
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
    invoke: {
      src: 'checkConnection',
    },
    on: {
      SCREEN_BLUR: 'inactive',
      SCREEN_FOCUS: 'checkingBluetoothService',
      SWITCH_PROTOCOL: {
        target: 'checkingBluetoothService',
        actions: 'switchProtocol',
      },
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
        on: {
          GOTO_SETTINGS: {
            actions: ['openSettings'],
          },
        },
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
                      target: 'requestingExistingVc',
                    },
                    {
                      target: 'prependingReceivedVc',
                    },
                  ],
                },
              },
              requestingExistingVc: {
                entry: ['requestExistingVc'],
                on: {
                  STORE_RESPONSE: 'mergingIncomingVc',
                },
              },
              mergingIncomingVc: {
                entry: ['mergeIncomingVc'],
                on: {
                  STORE_RESPONSE: '#accepted',
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
                  STORE_RESPONSE: '#accepted',
                },
              },
            },
          },
          accepted: {
            id: 'accepted',
            entry: ['sendVcReceived', 'logReceived'],
            invoke: {
              src: 'sendVcResponse',
              data: {
                status: 'ACCEPTED',
              },
            },
            on: {
              DISMISS: 'navigatingToHome',
              GOBACK: '#clearingConnection',
            },
          },
          rejected: {
            invoke: {
              src: 'sendVcResponse',
              data: {
                status: 'REJECTED',
              },
            },
            on: {
              DISMISS: '#waitingForConnection',
            },
          },
          navigatingToHome: {},
          navigatingToTimeBasedRequest: {},
        },
        exit: ['disconnect'],
      },
      disconnected: {
        entry: ['disconnect'],
        on: {
          DISMISS: 'waitingForConnection',
        },
      },
    },
  },
  {
    actions: {
      openSettings: () => {
        Linking.openURL('App-Prefs:Bluetooth');
      },

      switchProtocol: assign({
        sharingProtocol: (_context, event) =>
          event.value ? 'ONLINE' : 'OFFLINE',
      }),

      requestReceivedVcs: send(VcEvents.GET_RECEIVED_VCS(), {
        to: (context) => context.serviceRefs.vc,
      }),

      requestReceiverInfo: sendParent('REQUEST_DEVICE_INFO'),

      setReceiverInfo: model.assign({
        receiverInfo: (_context, event) => event.info,
      }),

      disconnect: (context) => {
        try {
          if (context.sharingProtocol === 'OFFLINE') {
            IdpassSmartshare.destroyConnection();
          } else {
            GoogleNearbyMessages.disconnect();
          }
        } catch (e) {
          // pass
        }
      },

      generateConnectionParams: assign({
        connectionParams: (context) => {
          if (context.sharingProtocol === 'OFFLINE') {
            return IdpassSmartshare.getConnectionParameters();
          } else {
            const cid = uuid.v4();
            console.log('ONLINE', cid);
            return JSON.stringify({
              pk: '',
              cid,
            });
          }
        },
      }),

      setSenderInfo: model.assign({
        senderInfo: (_context, event) => event.senderInfo,
      }),

      setIncomingVc: model.assign({
        incomingVc: (_context, event) => event.vc,
      }),

      registerLoggers: assign({
        loggers: () => {
          if (__DEV__) {
            return [
              IdpassSmartshare.handleNearbyEvents((event) => {
                console.log(
                  getDeviceNameSync(),
                  '<Receiver.Event>',
                  JSON.stringify(event)
                );
              }),
              IdpassSmartshare.handleLogEvents((event) => {
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

      removeLoggers: assign({
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

      requestExistingVc: send(
        (context) => StoreEvents.GET(VC_ITEM_STORE_KEY(context.incomingVc)),
        { to: (context) => context.serviceRefs.store }
      ),

      mergeIncomingVc: send(
        (context, event) => {
          const existing = event.response as VC;
          const updated: VC = {
            ...existing,
            reason: existing.reason.concat(context.incomingVc.reason),
          };
          return StoreEvents.SET(VC_ITEM_STORE_KEY(updated), updated);
        },
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
          return VcEvents.VC_RECEIVED(VC_ITEM_STORE_KEY(context.incomingVc));
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

      advertiseDevice: (context) => (callback) => {
        if (context.sharingProtocol === 'OFFLINE') {
          IdpassSmartshare.createConnection('advertiser', () => {
            callback({ type: 'CONNECTED' });
          });
        } else {
          (async function () {
            GoogleNearbyMessages.addOnErrorListener((kind, message) =>
              console.log('\n\n[request] GNM_ERROR\n\n', kind, message)
            );

            await GoogleNearbyMessages.connect({
              apiKey: GNM_API_KEY,
              discoveryMediums: ['ble'],
              discoveryModes: ['scan', 'broadcast'],
            });
            console.log('[request] GNM connected!');

            await onlineSubscribe('pairing', async (scannedQrParams) => {
              try {
                const generatedParams = JSON.parse(
                  context.connectionParams
                ) as ConnectionParams;
                if (scannedQrParams.cid === generatedParams.cid) {
                  const event: PairingResponseEvent = {
                    type: 'pairing:response',
                    data: 'ok',
                  };
                  await onlineSend(event);
                  callback({ type: 'CONNECTED' });
                }
              } catch (e) {
                console.error('Could not parse message.', e);
              }
            });
          })();
        }
      },

      checkConnection: () => (callback) => {
        const subscription = IdpassSmartshare.handleNearbyEvents((event) => {
          if (event.type === 'onDisconnected') {
            callback({ type: 'DISCONNECT' });
          }
        });

        return () => subscription.remove();
      },

      exchangeDeviceInfo: (context) => (callback) => {
        const event: ExchangeReceiverInfoEvent = {
          type: 'exchange-receiver-info',
          data: context.receiverInfo,
        };

        if (context.sharingProtocol === 'OFFLINE') {
          const subscription = offlineSubscribe(
            'exchange-sender-info',
            (senderInfo) => {
              offlineSend(event, () => {
                callback({ type: 'EXCHANGE_DONE', senderInfo });
              });
            }
          );

          return () => subscription.remove();
        } else {
          onlineSubscribe('exchange-sender-info', async (senderInfo) => {
            await GoogleNearbyMessages.unpublish();
            await onlineSend(event);
            callback({ type: 'EXCHANGE_DONE', senderInfo });
          });
        }
      },

      receiveVc: (context) => (callback) => {
        if (context.sharingProtocol === 'OFFLINE') {
          const subscription = offlineSubscribe('send-vc', ({ vc }) => {
            callback({ type: 'VC_RECEIVED', vc });
          });

          return () => subscription.remove();
        } else {
          let rawData = '';
          onlineSubscribe(
            'send-vc',
            async ({ isChunked, vc, vcChunk }) => {
              console.log(
                'RECEIVE CHUNK',
                isChunked,
                vcChunk.chunk,
                vcChunk.total
              );
              await GoogleNearbyMessages.unpublish();
              if (isChunked) {
                rawData += vcChunk.rawData;
                if (vcChunk.chunk === vcChunk.total - 1) {
                  const vc = JSON.parse(rawData) as VC;
                  GoogleNearbyMessages.unsubscribe();
                  callback({ type: 'VC_RECEIVED', vc });
                } else {
                  console.log('VC_RESPONSE_SEND', vcChunk.chunk);
                  await onlineSend({
                    type: 'send-vc:response',
                    data: vcChunk.chunk,
                  });
                }
              } else {
                callback({ type: 'VC_RECEIVED', vc });
              }
            },
            { keepAlive: true }
          );
        }
      },

      sendVcResponse: (context, _event, meta) => () => {
        const event: SendVcResponseEvent = {
          type: 'send-vc:response',
          data: meta.data.status,
        };

        if (context.sharingProtocol === 'OFFLINE') {
          offlineSend(event, () => {
            // pass
          });
        } else {
          onlineSend(event);
        }
      },
    },

    guards: {
      hasExistingVc: (context, event) => {
        const receivedVcs = event.response as string[];
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

export function selectSharingProtocol(state: State) {
  return state.context.sharingProtocol;
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

export function selectIsDone(state: State) {
  return state.matches('reviewing.navigatingToHome');
}
