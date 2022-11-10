import SmartshareReactNative from '@idpass/smartshare-react-native';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
const { IdpassSmartshare, GoogleNearbyMessages } = SmartshareReactNative;

import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { DeviceInfo } from '../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC, VerifiablePresentation } from '../types/vc';
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
import { checkLocation, requestLocation } from '../shared/location';
import { CameraCapturedPicture } from 'expo-camera';
import { log } from 'xstate/lib/actions';

const findingConnectionId = '#scan.findingConnection';
const checkingLocationServiceId = '#checkingLocationService';

type SharingProtocol = 'OFFLINE' | 'ONLINE';

const SendVcResponseType = 'send-vc:response';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    selectedVc: {} as VC,
    createdVp: null as VC,
    reason: '',
    loggers: [] as EmitterSubscription[],
    vcName: '',
    verificationImage: {} as CameraCapturedPicture,
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
      LOCATION_REQUEST: () => ({}),
      UPDATE_VC_NAME: (vcName: string) => ({ vcName }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      APP_ACTIVE: () => ({}),
      VERIFY_AND_SELECT_VC: (vc: VC) => ({ vc }),
      FACE_VALID: () => ({}),
      FACE_INVALID: () => ({}),
      RETRY_VERIFICATION: () => ({}),
      VP_CREATED: (vp: VerifiablePresentation) => ({ vp }),
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
      services: {} as {
        createVp: {
          data: VC;
        };
      },
    },
    id: 'scan',
    initial: 'inactive',
    invoke: {
      src: 'monitorConnection',
    },
    on: {
      SCREEN_BLUR: 'inactive',
      SCREEN_FOCUS: 'checkingLocationService',
    },
    states: {
      inactive: {
        entry: ['removeLoggers'],
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
        initial: 'inProgress',
        states: {
          inProgress: {},
          timeout: {
            on: {
              CANCEL: {
                actions: 'disconnect',
                target: checkingLocationServiceId,
              },
            },
          },
        },
        after: {
          CONNECTION_TIMEOUT: {
            target: '.timeout',
          },
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
        initial: 'inProgress',
        states: {
          inProgress: {},
          timeout: {
            on: {
              CANCEL: {
                actions: 'disconnect',
                target: checkingLocationServiceId,
              },
            },
          },
        },
        after: {
          CONNECTION_TIMEOUT: {
            target: '.timeout',
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
              DISCONNECT: findingConnectionId,
              CANCEL: 'cancelling',
            },
          },
          selectingVc: {
            on: {
              DISCONNECT: findingConnectionId,
              SELECT_VC: {
                target: 'sendingVc',
                actions: ['setSelectedVc'],
              },
              VERIFY_AND_SELECT_VC: {
                target: 'verifyingIdentity',
                actions: ['setSelectedVc'],
              },
              CANCEL: 'idle',
            },
          },
          cancelling: {
            invoke: {
              src: 'sendDisconnect',
            },
            after: {
              3000: findingConnectionId,
            },
          },
          sendingVc: {
            invoke: {
              src: 'sendVc',
            },
            on: {
              DISCONNECT: findingConnectionId,
              VC_ACCEPTED: 'accepted',
              VC_REJECTED: 'rejected',
            },
            initial: 'inProgress',
            states: {
              inProgress: {},
              timeout: {
                on: {
                  CANCEL: {
                    actions: 'disconnect',
                    target: checkingLocationServiceId,
                  },
                },
              },
            },
            after: {
              CONNECTION_TIMEOUT: {
                target: '.timeout',
              },
            },
          },
          accepted: {
            entry: ['logShared'],
            on: {
              DISMISS: 'navigatingToHome',
            },
          },
          rejected: {},
          navigatingToHome: {},
          verifyingIdentity: {
            on: {
              FACE_VALID: {
                target: 'creatingVp',
              },
              FACE_INVALID: {
                target: 'invalidIdentity',
              },
              CANCEL: 'selectingVc',
            },
          },
          creatingVp: {
            invoke: {
              src: 'createVp',
              onDone: {
                actions: 'setCreatedVp',
                target: 'sendingVc',
              },
              onError: {
                actions: log('Could not create Verifiable Presentation'),
                target: 'selectingVc',
              },
            },
          },
          invalidIdentity: {
            on: {
              DISMISS: 'selectingVc',
              RETRY_VERIFICATION: 'verifyingIdentity',
            },
          },
        },
        exit: ['disconnect', 'clearReason', 'clearCreatedVp'],
      },
      disconnected: {
        id: 'disconnected',
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
        senderInfo: (_context, event) => event.info,
      }),

      requestToEnableLocation: () => requestLocation(),

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
        receiverInfo: (_context, event) => event.receiverInfo,
      }),

      setReason: model.assign({
        reason: (_context, event) => event.reason,
      }),

      clearReason: assign({ reason: '' }),

      setSelectedVc: assign({
        selectedVc: (context, event) => {
          const reason = [];
          if (context.reason.trim() !== '') {
            reason.push({ message: context.reason, timestamp: Date.now() });
          }
          return { ...event.vc, reason };
        },
      }),

      setCreatedVp: assign({
        createdVp: (_context, event) => event.data,
      }),

      clearCreatedVp: assign({
        createdVp: () => null,
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

      openSettings: () => Linking.openSettings(),
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
            return callback(model.events.LOCATION_ENABLED());
          }

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
        checkLocation(
          () => callback(model.events.LOCATION_ENABLED()),
          () => callback(model.events.LOCATION_DISABLED())
        );
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
        const vp = context.createdVp;
        const vc = {
          ...(vp != null ? vp : context.selectedVc),
          tag: '',
        };

        const statusCallback = (status: SendVcStatus) => {
          if (typeof status === 'number') return;
          callback({
            type: status === 'ACCEPTED' ? 'VC_ACCEPTED' : 'VC_REJECTED',
          });
        };

        if (context.sharingProtocol === 'OFFLINE') {
          const event: SendVcEvent = {
            type: 'send-vc',
            data: { isChunked: false, vc },
          };
          offlineSend(event, () => {
            subscription = offlineSubscribe(SendVcResponseType, statusCallback);
          });
          return () => subscription?.remove();
        } else {
          sendVc(vc, statusCallback, () => callback({ type: 'DISCONNECT' }));
        }
      },

      sendDisconnect: (context) => () => {
        if (context.sharingProtocol === 'ONLINE') {
          onlineSend({
            type: 'disconnect',
            data: 'rejected',
          });
        }
      },

      createVp: (context) => async () => {
        // TODO
        // const verifiablePresentation = await createVerifiablePresentation(...);

        const verifiablePresentation: VerifiablePresentation = {
          '@context': [''],
          'proof': null,
          'type': 'VerifiablePresentation',
          'verifiableCredential': [context.selectedVc.verifiableCredential],
        };

        const vc: VC = {
          ...context.selectedVc,
          verifiableCredential: null,
          verifiablePresentation,
        };

        return Promise.resolve(vc);
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
      CONNECTION_TIMEOUT: () => {
        return (Platform.OS === 'ios' ? 15 : 5) * 1000;
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

export function selectSelectedVc(state: State) {
  return state.context.selectedVc;
}

export function selectIsScanning(state: State) {
  return state.matches('findingConnection');
}

export function selectIsConnecting(state: State) {
  return state.matches('connecting.inProgress');
}

export function selectIsConnectingTimeout(state: State) {
  return state.matches('connecting.timeout');
}

export function selectIsExchangingDeviceInfo(state: State) {
  return state.matches('exchangingDeviceInfo.inProgress');
}

export function selectIsExchangingDeviceInfoTimeout(state: State) {
  return state.matches('exchangingDeviceInfo.timeout');
}

export function selectIsReviewing(state: State) {
  return state.matches('reviewing');
}

export function selectIsSelectingVc(state: State) {
  return state.matches('reviewing.selectingVc');
}

export function selectIsSendingVc(state: State) {
  return state.matches('reviewing.sendingVc.inProgress');
}

export function selectIsSendingVcTimeout(state: State) {
  return state.matches('reviewing.sendingVc.timeout');
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

export function selectIsDone(state: State) {
  return state.matches('reviewing.navigatingToHome');
}

export function selectIsVerifyingIdentity(state: State) {
  return state.matches('reviewing.verifyingIdentity');
}

export function selectIsInvalidIdentity(state: State) {
  return state.matches('reviewing.invalidIdentity');
}

export function selectIsCancelling(state: State) {
  return state.matches('reviewing.cancelling');
}

async function sendVc(
  vc: VC,
  callback: (status: SendVcStatus) => void,
  disconnectCallback: () => void
) {
  const rawData = JSON.stringify(vc);
  const chunks = chunkString(rawData, GNM_MESSAGE_LIMIT);
  if (chunks.length > 1) {
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
      disconnectCallback,
      { keepAlive: true }
    );
    await onlineSend(event);
  } else {
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
