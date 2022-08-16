import SmartshareReactNative from '@idpass/smartshare-react-native';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
const { IdpassSmartshare, GoogleNearbyMessages } = SmartshareReactNative;

// import LocationEnabler from 'react-native-location-enabler';
const LocationEnabler = {} as any;
import SystemSetting from 'react-native-system-setting';
import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { DeviceInfo } from '../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import { ActivityLogEvents } from './activityLog';
import {
  GNM_API_KEY,
  GNM_MESSAGE_LIMIT,
  VC_ITEM_STORE_KEY,
} from '../shared/constants';
import {
  onlineSubscribe,
  offlineSubscribe,
  offlineSend,
  onlineSend,
  ExchangeSenderInfoEvent,
  PairingEvent,
  SendVcEvent,
  SendVcStatus,
} from '../shared/smartshare';
import { check, PERMISSIONS, PermissionStatus } from 'react-native-permissions';

const checkingAirplaneMode = '#checkingAirplaneMode';
const checkingLocationService = '#checkingLocationService';
const findingConnection = '#scan.findingConnection';

type SharingProtocol = 'OFFLINE' | 'ONLINE';

const SendVcResponseType = 'send-vc:response';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    selectedVc: {} as VC,
    reason: '',
    loggers: [] as EmitterSubscription[],
    locationConfig: {
      // priority: LocationEnabler.PRIORITIES.BALANCED_POWER_ACCURACY,
      alwaysShow: false,
      needBle: true,
    },
    vcName: '',
    sharingProtocol: 'OFFLINE' as SharingProtocol,
    scannedQrParams: {} as ConnectionParams,
  },
  {
    events: {
      EXCHANGE_DONE: (receiverInfo: DeviceInfo) => ({ receiverInfo }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      SELECT_VC: (vc: VC) => ({ vc }),
      SCAN: (params: string) => ({ params }),
      ACCEPT_REQUEST: () => ({}),
      VC_ACCEPTED: () => ({}),
      VC_REJECTED: () => ({}),
      CANCEL: () => ({}),
      DISMISS: () => ({}),
      CONNECTED: () => ({}),
      DISCONNECT: () => ({}),
      SCREEN_BLUR: () => ({}),
      SCREEN_FOCUS: () => ({}),
      UPDATE_REASON: (reason: string) => ({ reason }),
      LOCATION_ENABLED: () => ({}),
      LOCATION_DISABLED: () => ({}),
      FLIGHT_ENABLED: () => ({}),
      FLIGHT_DISABLED: () => ({}),
      FLIGHT_REQUEST: () => ({}),
      LOCATION_REQUEST: () => ({}),
      UPDATE_VC_NAME: (vcName: string) => ({ vcName }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      APP_ACTIVE: () => ({}),
    },
  }
);

export const ScanEvents = model.events;

export const scanMachine = model.createMachine(
  {
    tsTypes: {} as import('./scan.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'scan',
    initial: 'inactive',
    invoke: {
      src: 'monitorConnection',
    },
    on: {
      SCREEN_BLUR: 'inactive',
      SCREEN_FOCUS: 'checkingAirplaneMode',
    },
    states: {
      inactive: {
        entry: ['removeLoggers'],
      },
      checkingAirplaneMode: {
        id: 'checkingAirplaneMode',
        on: {
          APP_ACTIVE: '.checkingStatus',
        },
        initial: 'checkingStatus',
        states: {
          checkingStatus: {
            invoke: {
              src: 'checkAirplaneMode',
            },
            on: {
              FLIGHT_DISABLED: checkingLocationService,
              FLIGHT_ENABLED: 'enabled',
            },
          },
          requestingToDisable: {
            entry: ['requestToDisableFlightMode'],
            on: {
              FLIGHT_DISABLED: checkingLocationService,
            },
          },
          enabled: {
            on: {
              FLIGHT_REQUEST: 'requestingToDisable',
              FLIGHT_DISABLED: checkingLocationService,
            },
          },
        },
      },
      checkingLocationService: {
        id: 'checkingLocationService',
        invoke: {
          src: 'checkLocationStatus',
        },
        initial: 'checkingStatus',
        states: {
          checkingStatus: {
            on: {
              LOCATION_ENABLED: 'checkingPermission',
              LOCATION_DISABLED: 'requestingToEnable',
              FLIGHT_ENABLED: checkingAirplaneMode,
            },
          },
          requestingToEnable: {
            entry: ['requestToEnableLocation'],
            on: {
              LOCATION_ENABLED: 'checkingPermission',
              LOCATION_DISABLED: 'disabled',
            },
          },
          checkingPermission: {
            invoke: {
              src: 'checkLocationPermission',
            },
            on: {
              LOCATION_ENABLED: '#clearingConnection',
              LOCATION_DISABLED: 'denied',
            },
          },
          denied: {
            on: {
              LOCATION_REQUEST: {
                actions: ['openSettings'],
              },
              APP_ACTIVE: 'checkingPermission',
            },
          },
          disabled: {
            on: {
              LOCATION_REQUEST: 'requestingToEnable',
            },
          },
        },
      },
      clearingConnection: {
        id: 'clearingConnection',
        entry: ['disconnect'],
        after: {
          CLEAR_DELAY: 'findingConnection',
        },
      },
      findingConnection: {
        id: 'findingConnection',
        entry: ['removeLoggers', 'registerLoggers', 'clearScannedQrParams'],
        on: {
          SCAN: [
            {
              cond: 'isQrOffline',
              target: 'preparingToConnect',
              actions: ['setConnectionParams'],
            },
            {
              cond: 'isQrOnline',
              target: 'preparingToConnect',
              actions: ['setScannedQrParams'],
            },
            { target: 'invalid' },
          ],
          FLIGHT_ENABLED: checkingAirplaneMode,
        },
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
        invoke: {
          src: 'discoverDevice',
        },
        on: {
          CONNECTED: 'exchangingDeviceInfo',
        },
      },
      exchangingDeviceInfo: {
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
          ACCEPT_REQUEST: '.selectingVc',
          UPDATE_REASON: {
            actions: ['setReason'],
          },
        },
        initial: 'idle',
        states: {
          idle: {
            on: {
              ACCEPT_REQUEST: 'selectingVc',
              DISCONNECT: findingConnection,
            },
          },
          selectingVc: {
            on: {
              DISCONNECT: findingConnection,
              SELECT_VC: {
                target: 'sendingVc',
                actions: ['setSelectedVc'],
              },
              CANCEL: 'idle',
            },
          },
          sendingVc: {
            invoke: {
              src: 'sendVc',
            },
            on: {
              DISCONNECT: findingConnection,
              VC_ACCEPTED: 'accepted',
              VC_REJECTED: 'rejected',
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
        senderInfo: (_, event) => event.info,
      }),

      requestToEnableLocation: (context) => {
        LocationEnabler?.requestResolutionSettings(context.locationConfig);
      },

      requestToDisableFlightMode: () => {
        SystemSetting.switchAirplane();
      },

      disconnect: (context) => {
        try {
          if (context.sharingProtocol === 'OFFLINE') {
            IdpassSmartshare.destroyConnection();
          } else {
            GoogleNearbyMessages.disconnect();
          }
        } catch (e) {
          //
        }
      },

      setConnectionParams: (_context, event) => {
        IdpassSmartshare.setConnectionParameters(event.params);
      },

      setScannedQrParams: model.assign({
        scannedQrParams: (_context, event) =>
          JSON.parse(event.params) as ConnectionParams,
        sharingProtocol: 'ONLINE',
      }),

      clearScannedQrParams: assign({
        scannedQrParams: {} as ConnectionParams,
      }),

      setReceiverInfo: model.assign({
        receiverInfo: (_, event) => event.receiverInfo,
      }),

      setReason: model.assign({
        reason: (_, event) => event.reason,
      }),

      clearReason: assign({ reason: '' }),

      setSelectedVc: model.assign({
        selectedVc: (context, event) => {
          const reason = [];
          if (context.reason.trim() !== '') {
            reason.push({ message: context.reason, timestamp: Date.now() });
          }
          return { ...event.vc, reason };
        },
      }),

      registerLoggers: assign({
        loggers: (context) => {
          if (context.sharingProtocol === 'OFFLINE' && __DEV__) {
            return [
              IdpassSmartshare.handleNearbyEvents((event) => {
                console.log(
                  getDeviceNameSync(),
                  '<Sender.Event>',
                  JSON.stringify(event)
                );
              }),
              IdpassSmartshare.handleLogEvents((event) => {
                console.log(
                  getDeviceNameSync(),
                  '<Sender.Log>',
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
          return [];
        },
      }),

      logShared: send(
        (context) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: VC_ITEM_STORE_KEY(context.selectedVc),
            action: 'shared',
            timestamp: Date.now(),
            deviceName:
              context.receiverInfo.name || context.receiverInfo.deviceName,
            vcLabel: context.selectedVc.tag || context.selectedVc.id,
          }),
        { to: (context) => context.serviceRefs.activityLog }
      ),

      openSettings: () => {
        Linking.openSettings();
      },
    },

    services: {
      checkLocationPermission: () => async (callback) => {
        try {
          // wait a bit for animation to finish when app becomes active
          await new Promise((resolve) => setTimeout(resolve, 250));

          let response: PermissionStatus;
          if (Platform.OS === 'android') {
            response = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          } else if (Platform.OS === 'ios') {
            callback(model.events.LOCATION_ENABLED());
            return;
            // response = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          }

          // const response = await PermissionsAndroid.request(
          //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          //   {
          //     title: 'Location access',
          //     message:
          //       'Location access is required for the scanning functionality.',
          //     buttonNegative: 'Cancel',
          //     buttonPositive: 'OK',
          //   }
          // );

          if (response === 'granted') {
            callback(model.events.LOCATION_ENABLED());
          } else {
            callback(model.events.LOCATION_DISABLED());
          }
        } catch (e) {
          console.error(e);
        }
      },

      monitorConnection: (context) => (callback) => {
        if (context.sharingProtocol === 'OFFLINE') {
          const subscription = IdpassSmartshare.handleNearbyEvents((event) => {
            if (event.type === 'onDisconnected') {
              callback({ type: 'DISCONNECT' });
            }
          });

          return () => subscription.remove();
        }
      },

      checkLocationStatus: () => (callback) => {
        // const listener = LocationEnabler.addListener(({ locationEnabled }) => {
        //   if (locationEnabled) {
        //     callback(model.events.LOCATION_ENABLED());
        //   } else {
        //     callback(model.events.LOCATION_DISABLED());
        //   }
        // });
        // LocationEnabler.checkSettings(context.locationConfig);
        // return () => listener.remove();
        callback(model.events.LOCATION_ENABLED());
      },

      checkAirplaneMode: () => (callback) => {
        SystemSetting.isAirplaneEnabled().then((enable) => {
          if (enable) {
            callback(model.events.FLIGHT_ENABLED());
          } else {
            callback(model.events.FLIGHT_DISABLED());
          }
        });
      },

      discoverDevice: (context) => (callback) => {
        if (context.sharingProtocol === 'OFFLINE') {
          IdpassSmartshare.createConnection('discoverer', () => {
            callback({ type: 'CONNECTED' });
          });
        } else {
          (async function () {
            GoogleNearbyMessages.addOnErrorListener((kind, message) =>
              console.log('\n\n[scan] GNM_ERROR\n\n', kind, message)
            );

            await GoogleNearbyMessages.connect({
              apiKey: GNM_API_KEY,
              discoveryMediums: ['ble'],
              discoveryModes: ['scan', 'broadcast'],
            });
            console.log('[scan] GNM connected!');

            await onlineSubscribe('pairing:response', async (response) => {
              await GoogleNearbyMessages.unpublish();
              if (response === 'ok') {
                callback({ type: 'CONNECTED' });
              }
            });

            const pairingEvent: PairingEvent = {
              type: 'pairing',
              data: context.scannedQrParams,
            };

            await onlineSend(pairingEvent);
          })();
        }
      },

      exchangeDeviceInfo: (context) => (callback) => {
        const event: ExchangeSenderInfoEvent = {
          type: 'exchange-sender-info',
          data: context.senderInfo,
        };

        if (context.sharingProtocol === 'OFFLINE') {
          let subscription: EmitterSubscription;
          offlineSend(event, () => {
            subscription = offlineSubscribe(
              'exchange-receiver-info',
              (receiverInfo) => {
                callback({ type: 'EXCHANGE_DONE', receiverInfo });
              }
            );
          });
          return () => subscription?.remove();
        } else {
          (async function () {
            await onlineSubscribe(
              'exchange-receiver-info',
              async (receiverInfo) => {
                await GoogleNearbyMessages.unpublish();
                callback({ type: 'EXCHANGE_DONE', receiverInfo });
              }
            );

            await onlineSend(event);
          })();
        }
      },

      sendVc: (context) => (callback) => {
        let subscription: EmitterSubscription;
        const vc = { ...context.selectedVc, tag: '' };
        const statusCallback = (status: SendVcStatus) => {
          if (typeof status === 'number') return;
          callback({
            type: status === 'ACCEPTED' ? 'VC_ACCEPTED' : 'VC_REJECTED',
          });
        };

        if (context.sharingProtocol === 'OFFLINE') {
          console.log('OFFLINE?!');
          const event: SendVcEvent = {
            type: 'send-vc',
            data: { isChunked: false, vc },
          };
          offlineSend(event, () => {
            subscription = offlineSubscribe(SendVcResponseType, statusCallback);
          });
          return () => subscription?.remove();
        } else {
          sendVc(vc, statusCallback);
        }
      },
    },

    guards: {
      isQrOffline: (_context, event) => {
        if (Platform.OS === 'ios') return false;

        const param: ConnectionParams = Object.create(null);
        try {
          Object.assign(param, JSON.parse(event.params));
          return 'cid' in param && 'pk' in param && param.pk !== '';
        } catch (e) {
          return false;
        }
      },

      isQrOnline: (_context, event) => {
        const param: ConnectionParams = Object.create(null);
        try {
          Object.assign(param, JSON.parse(event.params));
          return 'cid' in param && 'pk' in param && param.pk === '';
        } catch (e) {
          return false;
        }
      },
    },

    delays: {
      CLEAR_DELAY: 250,
    },
  }
);

export function createScanMachine(serviceRefs: AppServices) {
  return scanMachine.withContext({
    ...scanMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof scanMachine>;

export function selectReceiverInfo(state: State) {
  return state.context.receiverInfo;
}

export function selectReason(state: State) {
  return state.context.reason;
}

export function selectVcName(state: State) {
  return state.context.vcName;
}

export function selectIsScanning(state: State) {
  return state.matches('findingConnection');
}

export function selectIsConnecting(state: State) {
  return state.matches('connecting');
}

export function selectIsExchangingDeviceInfo(state: State) {
  return state.matches('exchangingDeviceInfo');
}

export function selectIsReviewing(state: State) {
  return state.matches('reviewing');
}

export function selectIsSelectingVc(state: State) {
  return state.matches('reviewing.selectingVc');
}

export function selectIsSendingVc(state: State) {
  return state.matches('reviewing.sendingVc');
}

export function selectIsAccepted(state: State) {
  return state.matches('reviewing.accepted');
}

export function selectIsRejected(state: State) {
  return state.matches('reviewing.rejected');
}

export function selectIsInvalid(state: State) {
  return state.matches('invalid');
}

export function selectIsLocationDenied(state: State) {
  return state.matches('checkingLocationService.denied');
}

export function selectIsLocationDisabled(state: State) {
  return state.matches('checkingLocationService.disabled');
}

export function selectIsAirplaneEnabled(state: State) {
  return state.matches('checkingAirplaneMode.enabled');
}

async function sendVc(vc: VC, callback: (status: SendVcStatus) => void) {
  const rawData = JSON.stringify(vc);
  const chunks = chunkString(rawData, GNM_MESSAGE_LIMIT);
  if (chunks.length > 1) {
    console.log('CHUNKED!', chunks.length);
    let chunk = 0;
    const vcChunk = {
      total: chunks.length,
      chunk,
      rawData: chunks[chunk],
    };
    const event: SendVcEvent = {
      type: 'send-vc',
      data: {
        isChunked: true,
        vcChunk,
      },
    };

    await onlineSubscribe(
      SendVcResponseType,
      async (status) => {
        if (typeof status === 'number' && chunk < event.data.vcChunk.total) {
          console.log(SendVcResponseType, chunk, chunks[chunk].length);
          chunk += 1;
          await GoogleNearbyMessages.unpublish();
          await onlineSend({
            type: 'send-vc',
            data: {
              isChunked: true,
              vcChunk: {
                total: chunks.length,
                chunk,
                rawData: chunks[chunk],
              },
            },
          });
        } else if (typeof status === 'string') {
          GoogleNearbyMessages.unsubscribe();
          callback(status);
        }
      },
      { keepAlive: true }
    );
    await onlineSend(event);
  } else {
    console.log('UNCHUNKED');
    const event: SendVcEvent = {
      type: 'send-vc',
      data: { isChunked: false, vc },
    };
    await onlineSubscribe(SendVcResponseType, callback);
    await onlineSend(event);
  }
}

function chunkString(str: string, length: number) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}
