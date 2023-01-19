import SmartshareReactNative from '@idpass/smartshare-react-native';
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
import { ActivityLogEvents, ActivityLogType } from './activityLog';
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
import { log } from 'xstate/lib/actions';
import NetInfo from '@react-native-community/netinfo';
// import { verifyPresentation } from '../shared/vcjs/verifyPresentation';

const { GoogleNearbyMessages, IdpassSmartshare } = SmartshareReactNative;

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
    receiveLogType: '' as ActivityLogType,
  },
  {
    events: {
      ACCEPT: () => ({}),
      ACCEPT_AND_VERIFY: () => ({}),
      REJECT: () => ({}),
      CANCEL: () => ({}),
      DISMISS: () => ({}),
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
      FACE_VALID: () => ({}),
      FACE_INVALID: () => ({}),
      RETRY_VERIFICATION: () => ({}),
      ONLINE: () => ({}),
      OFFLINE: () => ({}),
      APP_ACTIVE: () => ({}),
    },
  }
);

export const RequestEvents = model.events;

export const requestMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwEcCucAuBiAygMIBKAoqQHID6AQgDICqxA2gAwC6ioADgPawBLbAN4A7LiAAeiAIwAmAMysAdKxkKA7AFY1ADgAsurQDYNAGhABPRAFoAnBrnK7RuVpm6NuuQY0BfPwtUTBwCEnJqADEAeUIGfDZOJBA+QWExCWkELS19ZW9jOTlC1mNjGTsZC2sEeztjZw19OXrvVl1jBTkAoPQsWDwiMkoqGLiEmSSefiERcWSs3SXlYv0NGQ1y9sMFats7OTycw-1WNbdchR6QYP7BgHUASQAVQgAJKgAFYmjn2Oi6IkJKlZhkFrItAplBoXDlmo4ZMZdKw5HtajI1E5mg5jJVkVoitdbqF8E9Xh9vr9-oDJsCZul5qAsoi8qxWDklnIZOctHY0TZeVCZIjNFpvF5ITIiX0cMoAMYACzAcoA1gJRFAaAAbLDYXi8bAK-BgZAANwEcrA8qVqvVUFw9AYpD+vw+lAAgvRSAARIHJEEMzKIToNFH6Ow6HalJb8hQdZTuA5dDa44xrLTSkIDa3KtUa7W6-WG41mi1WxW5u0OxjO6Kuqjex74T10H1+6ZpOZBhD45T6YxnYUubyVYz88NOXF2Oysdbc+rtfyBG4y7MV235nVgPUGo0m82W5TEgZVx21+ser2+jh0ztgpmyGTuFYKfTyfSQzoabTjzzKJHfoYOTGO4uhSsux7YDmG6aluO7FvuZZHquwgatWTous8HyNs2V7tik9JduCCDcgoWj5Ao3JqI4CiUWOVi2J0KiKKUcisNOMK4pmdzQXmsGFruJYHlaYCiAAhgARlqkC4PhAZEQ+JEonYyjcjkgqlIY5gMbUhwyP+tEdBGZQGM0GYQShyhSQJhreqJAgyQA4lSVD4M6zyPBQjkJDe-qEfeUiyOUGjOJoBy+Gc6y-lCuJcm+yL9ls5m9FmUFytJYnIHahBiKIyoMrgkgDGJ2BWmJABmpXIAAFIQrbusQDakHQ7oAJoAJS4JB8oZVlGo5aIeVygycn+YygUIA4ujKK+RguDOuh2Po-JOGyiIeBos4mXGyUrqlygAO5ibMGqRLwyADUNBWENEFAUKQhDPG2vkdqC43MmyWIgU0tHqGRb5ol0QpA0Ywr6P23GykdJ1QGdF25flcy4DhN13Q9zyjXe72yF0eTFLk7FKMKvJaGiLQNF030EuDByFFcFn7dwqDcJldrPLwpCSIqYkamAjyiOVvC4GQhCkI8ABqpBNeLjyi1QnkxJjb3dvU5ERjC2i6AoZQtNpNRaJt0IDlrIEtEt06Q9mYBcwqPNQHadnCfzgu4KQAAa7zul5UverdpBK4GxEuFCxTFN+OiCgbaLCii+Qph+2tsUtltQdb3Mag7YBOwLvDKOqnzILwUCoLAsCFcVpXKBVVW1bd92PY8t1UB5ACypDRAwzydd1ae2xnGqO2Wzu5-nhfF3AsABwpE0Yh4KysK+H6rFFOlLNN-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-h+CnjBHfvBI-sJLQYkiYHkHGJXsMv2B+OwTHqQisIKEiE+JUASAIbfnBA-kJEhDfnaGIa-PIDNKZJoCBmmLyPyJ0CpAutrEsCYImiTtfh7naEIdoYhIeMllAAYUHB+Brl-ASBfiiOPqAZggagAkiEYI7uxBoS4VoYJO4SJOJFJJAN4Zik7tCBUIFmpBsF0OOGoKoCoVtqbImvvNZPfruHZKIA5BAKkTPJVv+GcEZIUEYB4vyDkCkrPCiBiM0FyC1q3muL1NlEbrLlsirMiPkOxGKOxDOOxJsPgc+CApREsNoGmIlKEjYudJdIjAFKMUHEoKoGSjOLkODB4MEQcNCBGgbLNJMZCPvGdizH1FAOzJzOnDAMPLUVkBGHkOtLPIagYNXjUD0daqQkak0Fce4PvIfP3FAIPJaO8TLmgYgFrLshGk0KDOjiAesNNCyEse4KUJtNFjxFCX1jCbcnCTnHYmPGoh8UieMUcaQkBBUG4CAa4P+GmIvLXgYB4JCTbEfAPGSXzBSZEtfNgDST2DwocFrATooAbOwQAnkEvIUPHt+EcusadOEmKVBi+JEYmujrREQuUKoHCMbMUNrGKGqTAsgHApSaohPJqUYNqfYdwW4PqSIpguROpCCc0DrI4VYjQhsVaREgIJfCKZqb-oiJAQUJROxMERIm4gvFrFMuoBDIKrKO0p0voQiXQdrCpLPI4FpB0AYOwcKPGEDKKA3pTCDmKS0HkHssajgkcpCNHAcMxDIryHOssX0XeuTqKgIBANJGKeoDkH2IYFNBiAtMIhaooCiW+NyKcZoNrMLohs+oOl6mKQEkyu6YMsiF4NjggEUOxNgqcNPpcpsMLpen2n2auUWmKSsTiknGiXOIiGTO2fkB+LkOTEsIiISW1rFtmsRsNtwIOcAtCN+KQpIhyBsHGl4AmIIqUGcLRLcamQdn+aDlZpma9EXogJtHkN9FpvUDpiAaQp0PkFrgBFcqsMLsdl1t2p4WJtdlJjJrecSvoJoCqT0SqWTKDDNCUInm4DKVRWDklihHaKluli+nKLeQ6UoKeRyInkfggEoKFr9BtHIbyLIshVBIdlXEJd1iaCSfzIbkNhllJSQt4DudOEYC0WMmxNal4kMvIISJpchD2WhSds6vcRdldhJoxZJVmYkmDE4H5hGaAq+OyIDO0CpCpZ4GpcnM5dpdReDnqI8XAoOR4PpAnMFOxKYDWjZQmvavYesEULAftlpahTpZTjUf5d2BKEaUqc0A1RGACTjiUM4KxZoFyPxSYCVf0WVa5aLuLlVZhYifQTBd+HOLRJgjaicq9rCotKQp4CiF2WZuVeJOaFACVGzLwG8INmAJqe0BMYUIUGKG4BQoDJUE4JcPmV4HoE0HrmloboNINYOfUXxQYGzpcGiDrAmP9gFrWhGDus5XoWnt7r7mKdrPpPOAmUahXk0PyP8aoJRAcKoe0H9PPh3l3vtSQoZAcF4AiO0PDQOAapsLyk3gSPTAEEAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./request.typegen').Typegen0,
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

        SCREEN_FOCUS: [
          {
            target: '.checkingNetwork',
            cond: 'isModeOnline',
          },
          '.checkingBluetoothService',
        ],

        SWITCH_PROTOCOL: [
          {
            target: '.checkingNetwork',
            actions: 'switchProtocol',
            cond: 'isModeOnline',
            description: `Check internet connection for online protocol`,
          },
          {
            target: '.checkingBluetoothService',
            actions: 'switchProtocol',
          },
        ],
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
                target: '#request.clearingConnection',
              },
            },
          },

          on: {
            APP_ACTIVE: 'checkingNetwork',
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
          entry: 'disconnect',
          after: {
            CLEAR_DELAY: {
              target: '#request.waitingForConnection',
              actions: [],
              internal: false,
            },
          },
        },

        waitingForConnection: {
          entry: [
            'removeLoggers',
            'registerLoggers',
            'generateConnectionParams',
          ],
          invoke: {
            src: 'advertiseDevice',
          },
          on: {
            CONNECTED: {
              target: 'preparingToExchangeInfo',
            },
            DISCONNECT: {
              target: 'disconnected',
            },
          },
        },

        preparingToExchangeInfo: {
          entry: 'requestReceiverInfo',
          on: {
            RECEIVE_DEVICE_INFO: {
              target: 'exchangingDeviceInfo',
              actions: 'setReceiverInfo',
            },
          },
        },

        exchangingDeviceInfo: {
          invoke: {
            src: 'exchangeDeviceInfo',
          },
          initial: 'inProgress',
          states: {
            inProgress: {
              after: {
                CONNECTION_TIMEOUT: {
                  target: '#request.exchangingDeviceInfo.timeout',
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
            EXCHANGE_DONE: {
              target: 'waitingForVc',
              actions: 'setSenderInfo',
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
              target: 'reviewing',
              actions: 'setIncomingVc',
            },
          },
        },

        cancelling: {
          invoke: {
            src: 'sendDisconnect',
          },
          after: {
            CANCEL_TIMEOUT: {
              target: '#request.checkingBluetoothService',
              actions: ['disconnect'],
              internal: false,
            },
          },
        },

        reviewing: {
          invoke: {
            src: 'sendVcResponse',
            data: {
              status: 'RECEIVED',
            },
          },
          exit: 'disconnect',
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
            },
            accepted: {
              entry: ['updateReceivedVcs', 'logReceived'],
              invoke: {
                src: 'sendVcResponse',
                data: {
                  status: 'ACCEPTED',
                },
              },
              on: {
                DISMISS: {
                  target: 'navigatingToHome',
                },
              },
            },
            rejected: {
              entry: ['setReceiveLogTypeDiscarded', 'logReceived'],
              invoke: {
                src: 'sendVcResponse',
                data: {
                  status: 'REJECTED',
                },
              },
              on: {
                DISMISS: {
                  target: '#request.waitingForConnection',
                },
              },
            },
            navigatingToHome: {},
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
          entry: 'disconnect',
          on: {
            DISMISS: {
              target: 'waitingForConnection',
            },
          },
        },

        checkingNetwork: {
          invoke: {
            src: 'checkNetwork',
          },

          on: {
            ONLINE: 'checkingBluetoothService',
            OFFLINE: 'offline',
          },
        },

        offline: {
          on: {
            ONLINE: 'checkingBluetoothService',
            APP_ACTIVE: 'checkingNetwork',
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

        registerLoggers: assign({
          loggers: () => {
            if (__DEV__) {
              return [
                IdpassSmartshare.handleNearbyEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Receiver.Event>',
                    JSON.stringify(event).slice(0, 100)
                  );
                }),
                IdpassSmartshare.handleLogEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Receiver.Log>',
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

        updateReceivedVcs: send(
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
        sendDisconnect: (context) => () => {
          if (context.sharingProtocol === 'ONLINE') {
            onlineSend({
              type: 'disconnect',
              data: 'rejected',
            });
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

        checkNetwork: () => async (callback) => {
          const state = await NetInfo.fetch();
          console.log('test', state);
          callback({ type: state.isInternetReachable ? 'ONLINE' : 'OFFLINE' });
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

        monitorConnection: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            const subscription = IdpassSmartshare.handleNearbyEvents(
              (event) => {
                if (event.type === 'onDisconnected') {
                  callback({ type: 'DISCONNECT' });
                }
              }
            );

            return () => subscription.remove();
          }
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
                await GoogleNearbyMessages.unpublish();
                if (isChunked) {
                  rawData += vcChunk.rawData;
                  if (vcChunk.chunk === vcChunk.total - 1) {
                    const vc = JSON.parse(rawData) as VC;
                    GoogleNearbyMessages.unsubscribe();
                    callback({ type: 'VC_RECEIVED', vc });
                  } else {
                    await onlineSend({
                      type: 'send-vc:response',
                      data: vcChunk.chunk,
                    });
                  }
                } else {
                  callback({ type: 'VC_RECEIVED', vc });
                }
              },
              () => callback({ type: 'DISCONNECT' }),
              { keepAlive: true }
            );
          }
        },

        sendVcResponse: (context, _event, meta) => async () => {
          const event: SendVcResponseEvent = {
            type: 'send-vc:response',
            data: meta.data.status,
          };

          if (context.sharingProtocol === 'OFFLINE') {
            offlineSend(event, () => {
              // pass
            });
          } else {
            await GoogleNearbyMessages.unpublish();
            await onlineSend(event);
          }
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

        isModeOnline: (context, event) =>
          event.type === 'SCREEN_FOCUS'
            ? context.sharingProtocol === 'ONLINE'
            : event.value,
      },

      delays: {
        CLEAR_DELAY: 250,
        CANCEL_TIMEOUT: 3000,
        CONNECTION_TIMEOUT: (context) => {
          return (context.sharingProtocol === 'ONLINE' ? 15 : 5) * 1000;
        },
        SHARING_TIMEOUT: (context) => {
          return (context.sharingProtocol === 'ONLINE' ? 45 : 15) * 1000;
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

export function selectIncomingVc(state: State) {
  return state.context.incomingVc;
}

export function selectSharingProtocol(state: State) {
  return state.context.sharingProtocol;
}

export function selectIsIncomingVp(state: State) {
  return state.context.incomingVc?.verifiablePresentation != null;
}

export function selectIsCancelling(state: State) {
  return state.matches('cancelling');
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

export function selectIsVerifyingIdentity(state: State) {
  return state.matches('reviewing.verifyingIdentity');
}

export function selectIsVerifyingVp(state: State) {
  return state.matches('reviewing.verifyingVp');
}

export function selectIsInvalidIdentity(state: State) {
  return state.matches('reviewing.invalidIdentity');
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

export function selectIsCheckingBluetoothService(state: State) {
  return state.matches('checkingBluetoothService');
}

export function selectIsExchangingDeviceInfo(state: State) {
  return state.matches('exchangingDeviceInfo.inProgress');
}

export function selectIsExchangingDeviceInfoTimeout(state: State) {
  return state.matches('exchangingDeviceInfo.timeout');
}

export function selectIsWaitingForVc(state: State) {
  return state.matches('waitingForVc.inProgress');
}

export function selectIsWaitingForVcTimeout(state: State) {
  return state.matches('waitingForVc.timeout');
}

export function selectIsDone(state: State) {
  return state.matches('reviewing.navigatingToHome');
}

export function selectIsOffline(state: State) {
  return state.matches('offline');
}
