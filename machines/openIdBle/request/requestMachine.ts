import openIdBLE from 'react-native-openid4vp-ble';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { assign, EventFrom, send } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { DeviceInfo } from '../../../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { StoreEvents } from '../../store';
import { VC } from '../../../types/vc';
import { AppServices } from '../../../shared/GlobalContext';
import {
  RECEIVED_VCS_STORE_KEY,
  VC_ITEM_STORE_KEY,
} from '../../../shared/constants';
import { ActivityLogEvents, ActivityLogType } from '../../activityLog';
import { VcEvents } from '../../vc';
import { subscribe } from '../../../shared/openIdBLE/verifierEventHandler';
import { log } from 'xstate/lib/actions';
import { VerifierDataEvent } from 'react-native-openid4vp-ble/src/types/events';
// import { verifyPresentation } from '../shared/vcjs/verifyPresentation';

const { verifier, EventTypes, VerificationStatus } = openIdBLE;

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    incomingVc: {} as VC,
    storeError: null as Error,
    openId4VpUri: '',
    loggers: [] as EmitterSubscription[],
    receiveLogType: '' as ActivityLogType,
  },
  {
    events: {
      ACCEPT: () => ({}),
      ACCEPT_AND_VERIFY: () => ({}),
      GO_TO_RECEIVED_VC_TAB: () => ({}),
      REJECT: () => ({}),
      CANCEL: () => ({}),
      RESET: () => ({}),
      DISMISS: () => ({}),
      VC_RECEIVED: (vc: VC) => ({ vc }),
      ADV_STARTED: (openId4VpUri: string) => ({ openId4VpUri }),
      CONNECTED: () => ({}),
      DISCONNECT: () => ({}),
      BLE_ERROR: () => ({}),
      SCREEN_FOCUS: () => ({}),
      SCREEN_BLUR: () => ({}),
      BLUETOOTH_ENABLED: () => ({}),
      BLUETOOTH_DISABLED: () => ({}),
      STORE_READY: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      RECEIVED_VCS_UPDATED: () => ({}),
      VC_RESPONSE: (response: unknown) => ({ response }),
      GOTO_SETTINGS: () => ({}),
      FACE_VALID: () => ({}),
      FACE_INVALID: () => ({}),
      RETRY_VERIFICATION: () => ({}),
    },
  }
);
export const RequestEvents = model.events;

export const requestMachine =
  /** @xstate-layout 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-TVAYfRqda4a23LS5QDcM-ZwTQQNWwT5dcwlNEbzYNfk1-IiHkKAVqYUYWYYUnMADajmI9XYESw0dKGynKisbZAZOHRCHEEqvTFa9-GRL-U4u6tJFwLYXpS0dYAtS7IbDEbUHYAoFHFEYNc6zGli7fXfHGgQQ-UeRgiG-GucLEBso6F+EhZGd3R6tKXRZoYKhmudLGlm-fNmyAHVJmoa2Skav3ImrEEmhyEocmjLbYQZa2Rqpw-iDGNAjAr6W65W+6i4rYAsQyFoaEk0c2VQAsH3YqZiZiOgiWRg6osAVglTX06wYdXko2UQ60PECQ3wXwIAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./requestMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
        services: {} as {
          verifyVp: {
            data: VC;
          };
        },
      },
      invoke: {
        src: 'monitorConnection',
      },
      id: 'request',
      initial: 'inactive',
      on: {
        SCREEN_BLUR: {
          target: '.inactive',
        },
        SCREEN_FOCUS: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          target: '.checkingBluetoothService',
        },
        BLE_ERROR: {
          target: '.handlingBleError',
        },
        RESET: {
          target: '.checkingBluetoothService',
        },
      },
      states: {
        inactive: {
          entry: 'removeLoggers',
        },
        checkingBluetoothService: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothService',
              },
              on: {
                BLUETOOTH_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_DISABLED: {
                  target: 'requesting',
                },
              },
            },
            requesting: {
              invoke: {
                src: 'requestBluetooth',
              },
              on: {
                BLUETOOTH_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_DISABLED: {
                  target: '#request.bluetoothDenied',
                },
              },
            },
            enabled: {
              always: {
                // eslint-disable-next-line sonarjs/no-duplicate-string
                target: '#request.clearingConnection',
              },
            },
          },
        },
        bluetoothDenied: {
          on: {
            GOTO_SETTINGS: {
              actions: 'openSettings',
            },
          },
        },
        clearingConnection: {
          invoke: {
            src: 'disconnect',
          },
          on: {
            DISCONNECT: {
              target: '#request.waitingForConnection',
              actions: [],
              internal: false,
            },
          },
          after: {
            DESTROY_TIMEOUT: {
              target: '#request.waitingForConnection',
              actions: [],
              internal: false,
            },
          },
        },
        waitingForConnection: {
          entry: ['removeLoggers', 'registerLoggers'],
          invoke: {
            src: 'advertiseDevice',
          },
          on: {
            ADV_STARTED: {
              actions: 'setOpenID4VpUri',
            },
            CONNECTED: {
              target: 'waitingForVc',
              actions: ['setSenderInfo', 'setReceiverInfo'],
            },

            DISCONNECT: {
              target: 'disconnected',
            },
          },
        },
        waitingForVc: {
          invoke: {
            src: 'receiveVc',
          },
          initial: 'inProgress',
          states: {
            inProgress: {
              after: {
                SHARING_TIMEOUT: {
                  target: '#request.waitingForVc.timeout',
                  actions: [],
                  internal: false,
                },
              },
            },
            timeout: {
              on: {
                CANCEL: {
                  target: '#request.cancelling',
                },
              },
            },
          },
          on: {
            DISCONNECT: {
              target: 'disconnected',
            },
            VC_RECEIVED: {
              target: 'reviewing.accepting',
              actions: 'setIncomingVc',
            },
          },
        },
        cancelling: {
          always: {
            target: '#request.clearingConnection',
          },
        },
        reviewing: {
          initial: 'idle',
          states: {
            idle: {},
            verifyingIdentity: {
              exit: 'clearShouldVerifyPresence',
              on: {
                FACE_VALID: {
                  target: 'accepting',
                  actions: 'setReceiveLogTypeVerified',
                },
                FACE_INVALID: {
                  target: 'invalidIdentity',
                  actions: 'setReceiveLogTypeUnverified',
                },
                CANCEL: {
                  target: 'idle',
                },
              },
            },
            invalidIdentity: {
              on: {
                DISMISS: {
                  target: 'accepting',
                },
                RETRY_VERIFICATION: {
                  target: 'verifyingIdentity',
                },
              },
            },
            verifyingVp: {
              invoke: {
                src: 'verifyVp',
                onDone: [
                  {
                    target: 'accepting',
                  },
                ],
                onError: [
                  {
                    target: 'idle',
                    actions: log('Failed to verify Verifiable Presentation'),
                  },
                ],
              },
            },
            accepting: {
              initial: 'requestingReceivedVcs',
              states: {
                requestingReceivedVcs: {
                  entry: 'requestReceivedVcs',
                  on: {
                    VC_RESPONSE: [
                      {
                        target: 'requestingExistingVc',
                        cond: 'hasExistingVc',
                      },
                      {
                        target: 'prependingReceivedVc',
                      },
                    ],
                  },
                },
                requestingExistingVc: {
                  entry: 'requestExistingVc',
                  on: {
                    STORE_RESPONSE: {
                      target: 'mergingIncomingVc',
                    },
                  },
                },
                mergingIncomingVc: {
                  entry: 'mergeIncomingVc',
                  on: {
                    STORE_RESPONSE: {
                      target: '#request.reviewing.accepted',
                    },
                  },
                },
                prependingReceivedVc: {
                  entry: 'prependReceivedVc',
                  on: {
                    STORE_RESPONSE: {
                      target: 'storingVc',
                    },
                  },
                },
                storingVc: {
                  entry: 'storeVc',
                  on: {
                    STORE_RESPONSE: {
                      target: '#request.reviewing.accepted',
                    },
                  },
                },
              },
              on: {
                STORE_ERROR: {
                  actions: 'setStoringError',
                  target: '#request.reviewing.savingFailed',
                },
              },
            },
            accepted: {
              entry: [
                'sendVcReceived',
                'setReceiveLogTypeRegular',
                'logReceived',
              ],
              invoke: {
                src: 'sendVcResponse',
                data: {
                  status: VerificationStatus.ACCEPTED,
                },
              },
              on: {
                DISMISS: {
                  target: 'navigatingToHome',
                },
                GO_TO_RECEIVED_VC_TAB: {
                  target: 'navigatingToHome',
                },
              },
            },
            rejected: {
              entry: ['setReceiveLogTypeDiscarded', 'logReceived'],
              invoke: {
                src: 'sendVcResponse',
                data: {
                  status: VerificationStatus.REJECTED,
                },
              },
              on: {
                DISMISS: {
                  target: '#request.clearingConnection',
                },
              },
            },
            navigatingToHome: {
              invoke: {
                src: 'disconnect',
              },
            },
            savingFailed: {
              initial: 'idle',
              entry: ['setReceiveLogTypeDiscarded', 'logReceived'],
              invoke: {
                src: 'sendVcResponse',
                data: {
                  status: VerificationStatus.REJECTED,
                },
              },
              states: {
                idle: {},
                viewingVc: {},
              },
              on: {
                DISMISS: {
                  target: '.viewingVc',
                },
                GO_TO_RECEIVED_VC_TAB: {
                  target: 'navigatingToHome',
                },
              },
            },
          },
          on: {
            ACCEPT: {
              target: '.accepting',
              actions: 'setReceiveLogTypeRegular',
            },
            ACCEPT_AND_VERIFY: {
              target: '.verifyingIdentity',
            },
            REJECT: {
              target: '.rejected',
            },
            CANCEL: {
              target: '.rejected',
            },
          },
        },
        disconnected: {
          on: {
            DISMISS: {
              target: 'waitingForConnection',
            },
          },
        },
        handlingBleError: {
          on: {
            DISMISS: {
              target: '#request.clearingConnection',
            },
          },
        },
      },
    },
    {
      actions: {
        openSettings: () => {
          Platform.OS === 'android'
            ? BluetoothStateManager.openSettings().catch()
            : Linking.openURL('App-Prefs:Bluetooth');
        },

        requestReceivedVcs: send(VcEvents.GET_RECEIVED_VCS(), {
          to: (context) => context.serviceRefs.vc,
        }),

        setIncomingVc: assign({
          incomingVc: (_context, event) => {
            const vp = event.vc.verifiablePresentation;
            return vp != null
              ? {
                  ...event.vc,
                  verifiableCredential: vp.verifiableCredential[0],
                }
              : event.vc;
          },
        }),

        setOpenID4VpUri: assign({
          openId4VpUri: (_context, event) => {
            return event.openId4VpUri;
          },
        }),

        setSenderInfo: assign({
          senderInfo: () => {
            return { name: 'Wallet', deviceName: 'Wallet', deviceId: '' };
          },
        }),

        setReceiverInfo: assign({
          receiverInfo: () => {
            return { name: 'Verifier', deviceName: 'Verifier', deviceId: '' };
          },
        }),

        setStoringError: assign({
          storeError: (_context, event) => event.error,
        }),

        registerLoggers: assign({
          loggers: () => {
            if (__DEV__) {
              return [
                verifier.handleDataEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Receiver.Event>',
                    JSON.stringify(event).slice(0, 100)
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

        setReceiveLogTypeRegular: model.assign({
          receiveLogType: 'VC_RECEIVED',
        }),

        setReceiveLogTypeVerified: model.assign({
          receiveLogType: 'VC_RECEIVED_WITH_PRESENCE_VERIFIED',
        }),

        setReceiveLogTypeUnverified: model.assign({
          receiveLogType: 'VC_RECEIVED_BUT_PRESENCE_VERIFICATION_FAILED',
        }),

        setReceiveLogTypeDiscarded: model.assign({
          receiveLogType: 'VC_RECEIVED_NOT_SAVED',
        }),

        logReceived: send(
          (context) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context.incomingVc),
              type: context.receiveLogType,
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

        clearShouldVerifyPresence: assign({
          incomingVc: (context) => ({
            ...context.incomingVc,
            shouldVerifyPresence: false,
          }),
        }),
      },

      services: {
        disconnect: () => () => {
          try {
            verifier.disconnect();
          } catch (e) {
            // pass
          }
        },

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
          const openId4VpUri = verifier.startAdvertisement('OVPMOSIP');
          callback({ type: 'ADV_STARTED', openId4VpUri });

          const statusCallback = (event: VerifierDataEvent) => {
            if (event.type === EventTypes.onSecureChannelEstablished) {
              callback({ type: 'CONNECTED' });
            }
          };
          const subscription = subscribe(statusCallback);
          return () => subscription?.remove();
        },

        monitorConnection: () => (callback) => {
          const subscription = verifier.handleDataEvents((event) => {
            if (event.type === EventTypes.onDisconnected) {
              callback({ type: 'DISCONNECT' });
            }

            if (event.type === EventTypes.onError) {
              callback({ type: 'BLE_ERROR' });
              console.log('BLE Exception: ' + event.message);
            }
          });

          return () => subscription.remove();
        },

        receiveVc: () => (callback) => {
          const statusCallback = (event: VerifierDataEvent) => {
            if (event.type === EventTypes.onDataReceived) {
              callback({ type: 'VC_RECEIVED', vc: JSON.parse(event.data) });
            }
          };
          const subscription = subscribe(statusCallback);

          return () => subscription.remove();
        },

        sendVcResponse: (context, _event, meta) => async () => {
          verifier.sendVerificationStatus(meta.data.status);
        },

        verifyVp: (context) => async () => {
          const vp = context.incomingVc.verifiablePresentation;

          // TODO
          // const challenge = ?
          // await verifyPresentation(vp, challenge);

          const vc: VC = {
            ...context.incomingVc,
            verifiablePresentation: null,
            verifiableCredential: vp.verifiableCredential[0],
          };

          return Promise.resolve(vc);
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
        DESTROY_TIMEOUT: 500,
        SHARING_TIMEOUT: 15 * 1000,
      },
    }
  );

export function createRequestMachine(serviceRefs: AppServices) {
  return requestMachine.withContext({
    ...requestMachine.context,
    serviceRefs,
  });
}
