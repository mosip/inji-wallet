import SmartShare, { ConnectionParams } from 'react-native-idpass-smartshare';
import LocationEnabler from 'react-native-location-enabler';
import { EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { EmitterSubscription } from 'react-native';
import { DeviceInfo } from '../components/DeviceInfoList';
import { Message } from '../shared/Message';
import { getDeviceNameSync } from 'react-native-device-info';
import { VID } from '../types/vid';
import { AppServices } from '../shared/GlobalContext';
import { ActivityLogEvents } from './activityLog';
import { VID_ITEM_STORE_KEY } from '../shared/constants';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    selectedVid: {} as VID,
    reason: '',
    loggers: [] as EmitterSubscription[],
    locationConfig: {
      priority: LocationEnabler.PRIORITIES.BALANCED_POWER_ACCURACY,
      alwaysShow: false,
      needBle: true,
    },
    vidName: '',
  },
  {
    events: {
      EXCHANGE_DONE: (receiverInfo: DeviceInfo) => ({ receiverInfo }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      SELECT_VID: (vid: VID) => ({ vid }),
      SCAN: (params: string) => ({ params }),
      ACCEPT_REQUEST: () => ({}),
      VID_ACCEPTED: () => ({}),
      VID_REJECTED: () => ({}),
      CANCEL: () => ({}),
      DISMISS: () => ({}),
      CONNECTED: () => ({}),
      DISCONNECT: () => ({}),
      SCREEN_BLUR: () => ({}),
      SCREEN_FOCUS: () => ({}),
      UPDATE_REASON: (reason: string) => ({ reason }),
      LOCATION_ENABLED: () => ({}),
      LOCATION_DISABLED: () => ({}),
      UPDATE_VID_NAME: (vidName: string) => ({ vidName }),
      STORE_RESPONSE: (response: any) => ({ response }),
    },
  }
);

export const ScanEvents = model.events;

type ExchangeDoneEvent = EventFrom<typeof model, 'EXCHANGE_DONE'>;
type ScanEvent = EventFrom<typeof model, 'SCAN'>;
type SelectVidEvent = EventFrom<typeof model, 'SELECT_VID'>;
type UpdateReasonEvent = EventFrom<typeof model, 'UPDATE_REASON'>;
type ReceiveDeviceInfoEvent = EventFrom<typeof model, 'RECEIVE_DEVICE_INFO'>;

export const scanMachine = model.createMachine(
  {
    id: 'scan',
    context: model.initialContext,
    initial: 'inactive',
    on: {
      SCREEN_BLUR: 'inactive',
      SCREEN_FOCUS: 'checkingLocationService',
    },
    states: {
      inactive: {
        entry: ['removeLoggers'],
      },
      checkingLocationService: {
        invoke: {
          src: 'checkLocationService',
        },
        on: {
          LOCATION_ENABLED: '.enabled',
        },
        initial: 'checking',
        states: {
          checking: {
            on: {
              LOCATION_DISABLED: 'requesting',
            },
          },
          requesting: {
            entry: ['requestLocationService'],
            on: {
              LOCATION_DISABLED: '#locationDenied',
            },
          },
          enabled: {
            always: '#clearingConnection',
          },
        },
      },
      clearingConnection: {
        id: 'clearingConnection',
        entry: ['disconnect'],
        after: {
          250: 'findingConnection',
        },
      },
      findingConnection: {
        id: 'findingConnection',
        entry: ['removeLoggers', 'registerLoggers'],
        on: {
          SCAN: [
            {
              cond: 'isQrValid',
              target: 'preparingToConnect',
              actions: ['setConnectionParams'],
            },
            { target: 'invalid' },
          ],
        },
      },
      locationDenied: {
        id: 'locationDenied',
      },
      preparingToConnect: {
        entry: ['requestSenderInfo'],
        on: {
          RECEIVE_DEVICE_INFO: {
            target: 'connecting',
            actions: ['setSenderInfo'],
          },
        },
      },
      connecting: {
        meta: {
          message: 'Connecting...',
        },
        invoke: {
          src: 'discoverDevice',
        },
        on: {
          CONNECTED: 'exchangingDeviceInfo',
        },
      },
      exchangingDeviceInfo: {
        meta: {
          message: 'Exchanging device info...',
        },
        invoke: {
          src: 'exchangeDeviceInfo',
        },
        on: {
          DISCONNECT: '#scan.disconnected',
          EXCHANGE_DONE: {
            target: 'reviewing',
            actions: ['setReceiverInfo'],
          },
        },
      },
      reviewing: {
        on: {
          CANCEL: 'findingConnection',
          DISMISS: 'findingConnection',
          ACCEPT_REQUEST: '.selectingVid',
          UPDATE_REASON: {
            actions: ['setReason'],
          },
        },
        initial: 'idle',
        states: {
          idle: {
            on: {
              ACCEPT_REQUEST: 'selectingVid',
            },
          },
          selectingVid: {
            on: {
              SELECT_VID: {
                target: 'sendingVid',
                actions: ['setSelectedVid'],
              },
              CANCEL: 'idle',
            },
          },
          sendingVid: {
            invoke: {
              src: 'sendVid',
            },
            on: {
              DISCONNECT: '#scan.disconnected',
              VID_ACCEPTED: 'accepted',
              VID_REJECTED: 'rejected',
            },
          },
          accepted: {
            entry: ['logShared'],
            on: {
              DISMISS: 'navigatingToHome',
            },
          },
          rejected: {},
          cancelled: {},
          navigatingToHome: {},
        },
        exit: ['disconnect', 'clearReason'],
      },
      disconnected: {
        on: {
          DISMISS: 'findingConnection',
        },
      },
      invalid: {
        meta: {
          message: 'Invalid QR Code',
        },
        on: {
          DISMISS: 'findingConnection',
        },
      },
    },
  },
  {
    actions: {
      requestSenderInfo: sendParent('REQUEST_DEVICE_INFO'),

      setSenderInfo: model.assign({
        senderInfo: (_, event: ReceiveDeviceInfoEvent) => event.info,
      }),

      requestLocationService: (context) => {
        LocationEnabler.requestResolutionSettings(context.locationConfig);
      },

      disconnect: () => {
        try {
          SmartShare.destroyConnection();
        } catch (e) {
          //
        }
      },

      setConnectionParams: (_, event: ScanEvent) => {
        SmartShare.setConnectionParameters(event.params);
      },

      setReceiverInfo: model.assign({
        receiverInfo: (_, event: ExchangeDoneEvent) => event.receiverInfo,
      }),

      setReason: model.assign({
        reason: (_, event: UpdateReasonEvent) => event.reason,
      }),

      clearReason: model.assign({ reason: '' }),

      setSelectedVid: model.assign({
        selectedVid: (context, event: SelectVidEvent) => {
          return {
            ...event.vid,
            reason: context.reason,
          };
        },
      }),

      registerLoggers: model.assign({
        loggers: () => [
          SmartShare.handleNearbyEvents((event) => {
            console.log(
              getDeviceNameSync(),
              '<Sender.Event>',
              JSON.stringify(event)
            );
          }),
          SmartShare.handleLogEvents((event) => {
            console.log(
              getDeviceNameSync(),
              '<Sender.Log>',
              JSON.stringify(event)
            );
          }),
        ],
      }),

      removeLoggers: model.assign({
        loggers: ({ loggers }) => {
          loggers?.forEach((logger) => logger.remove());
          return [];
        },
      }),

      logShared: send(
        (context) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vidKey: VID_ITEM_STORE_KEY(
              context.selectedVid.uin,
              context.selectedVid.requestId
            ),
            action: 'shared',
            timestamp: Date.now(),
            deviceName:
              context.receiverInfo.name || context.receiverInfo.deviceName,
            vidLabel: context.selectedVid.tag || context.selectedVid.uin,
          }),
        { to: (context) => context.serviceRefs.activityLog }
      ),
    },

    services: {
      checkLocationService: (context) => (callback) => {
        const listener = LocationEnabler.addListener(({ locationEnabled }) => {
          if (locationEnabled) {
            callback(model.events.LOCATION_ENABLED());
          } else {
            callback(model.events.LOCATION_DISABLED());
          }
        });

        LocationEnabler.checkSettings(context.locationConfig);

        return () => listener.remove();
      },

      discoverDevice: () => (callback) => {
        SmartShare.createConnection('discoverer', () => {
          callback({ type: 'CONNECTED' });
        });
      },

      exchangeDeviceInfo: (context) => (callback) => {
        let subscription: EmitterSubscription;

        const message = new Message('exchange:sender-info', context.senderInfo);
        SmartShare.send(message.toString(), () => {
          subscription = SmartShare.handleNearbyEvents((event) => {
            if (event.type === 'onDisconnected') {
              callback({ type: 'DISCONNECT' });
            }

            if (event.type !== 'msg') return;
            const response = Message.fromString<DeviceInfo>(event.data);
            if (response.type === 'exchange:receiver-info') {
              callback({
                type: 'EXCHANGE_DONE',
                receiverInfo: response.data,
              });
            }
          });
        });

        return () => subscription?.remove();
      },

      sendVid: (context) => (callback) => {
        let subscription: EmitterSubscription;

        const vid = {
          ...context.selectedVid,
          tag: '',
        };

        const message = new Message<VID>('send:vid', vid);

        SmartShare.send(message.toString(), () => {
          subscription = SmartShare.handleNearbyEvents((event) => {
            if (event.type === 'onDisconnected') {
              callback({ type: 'DISCONNECT' });
            }

            if (event.type !== 'msg') return;

            const response = Message.fromString<SendVidStatus>(event.data);
            if (response.type === 'send:vid:response') {
              callback({
                type:
                  response.data.status === 'accepted'
                    ? 'VID_ACCEPTED'
                    : 'VID_REJECTED',
              });
            }
          });
        });

        return () => subscription?.remove();
      },
    },

    delays: {},

    guards: {
      isQrValid: (_, event: ScanEvent) => {
        const param: ConnectionParams = Object.create(null);
        try {
          Object.assign(param, JSON.parse(event.params));
          return 'cid' in param && 'pk' in param;
        } catch (e) {
          return false;
        }
      },
    },
  }
);

export function createScanMachine(serviceRefs: AppServices) {
  return scanMachine.withContext({
    ...scanMachine.context,
    serviceRefs,
  });
}

interface SendVidStatus {
  status: 'accepted' | 'rejected';
}

type State = StateFrom<typeof scanMachine>;

export function selectReceiverInfo(state: State) {
  return state.context.receiverInfo;
}

export function selectReason(state: State) {
  return state.context.reason;
}

export function selectVidName(state: State) {
  return state.context.vidName;
}

export function selectStatusMessage(state: State) {
  return (
    state.meta[`${state.machine.id}.${state.value}`]?.message ||
    state.meta[state.value.toString()]?.message ||
    ''
  );
}

export function selectScanning(state: State) {
  return state.matches('findingConnection');
}

export function selectReviewing(state: State) {
  return state.matches('reviewing');
}

export function selectSelectingVid(state: State) {
  return state.matches('reviewing.selectingVid');
}

export function selectSendingVid(state: State) {
  return state.matches('reviewing.sendingVid');
}

export function selectAccepted(state: State) {
  return state.matches('reviewing.accepted');
}

export function selectRejected(state: State) {
  return state.matches('reviewing.rejected');
}

export function selectInvalid(state: State) {
  return state.matches('invalid');
}

export function selectLocationDenied(state: State) {
  return state.matches('locationDenied');
}
