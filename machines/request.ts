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
    },
  }
);

export const RequestEvents = model.events;

export const requestMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwEcCucAuBiAygMIBKAoqQHID6AQgDICqxA2gAwC6ioADgPawBLbAN4A7LiAAeiAOwA2ABwA6AKwBmAJwBGDazmaF6rQBoQAT0QBaDTIAsSgExrNttXLk61rgL7fTqTBwCEnJqADEAeUIGfDZOJBA+QWExCWkEFVYZJW0ZNQVbTIc5eRLTCwRrO0cvVgU61gcHVizff3QsWDx8AHUASQAVQgAJKgAFYgiBqIi6OIkkoRFxBPS1VjUlGVZbLJUtNwPbBTlyqxUFBxqvJsMHBQV8tpAAzuwlAGMACzAPgGsBKIoDQADZYbC8XjYL74MDIABuAg+YE+P3+gKguHoDFI0ymo0oAEF6KQACLzBKLFIrUDpfRyJSNWwaTLHdaKBRnSr5Bn7DROBxaeQaOS2GQqZ6vHCo34AoGg8GQ6GwhFIlHfWUYrGMXERfFUUl9fDEuhkik8fhLVKrRD1FRKWxyHZaHQPBzaU7mKzMq5yDT+rIu5lOhQySUdaUa9HysFgCFQmFwxHIpRSrpa7G6-VEknkjgLS3UtKIF37Gq2LQOQpuNQycVcyzHbKKOvHFQqOT7BRacOBLoy6PA2Px5VJtWpiPpoHanF4gajQ3G3PmxKF5bFhBaVz2x5b1hCpxqLSeiqWfSsGp6Zr+mQijS9t4DuVDxUJlXJlFgUQAQwARiDIFwFcqXXG1N0aDQlC3dsVA0dkmwbKstCUfQeRZdwClsBwJT8F5J3ef9X2hUkvwEQCAHEpgiKh8FxAY+gocjYnzSk12tWkSw8bI4Nve4xR2GQTC9So2RQ-kty0epHQ8VgcPaPt3g+ADv2QDFCDEURfmpXBJC6b9sBRb8ADMDOQAAKQhTUJYgDVIOhCQATQASlwNNFOU1SgXU0RNI+algLYmkpEQGxlC8QwNAUXQotsRDGX3DxQyyDD8jkvCFKUAB3b8liBMJeGQbzfO0wgIgoChSEIAYzRYi1klAjjwMaB1OzsZwDjUFQKy5NQnCg3rUqDR0H2lbLcqgfLCo0rTllwRdSvKyqBgC+r2OCzdevsYoutYOD9y0WCVC5d0GV61qVCrH05CcEb+24VBuBUjEBl4UhJG+b8gTAPpRCM3hcDIQhSD6AA1UhbJBvogaoBjIhWq0gvSEV7RZW9xUedx3RkLkVG2LYQzcC7-WZe9cLcpQwHer5PqgDESI-H6-twUgAA0RkJRjwdJMrSHhoswMizZimKOtMlgzrseEl1mu7eRq2u3bbFu95KY+oE6bABnft4JRATGZBeCgVBYFgHS9IMpRjNMiyyoqqq+jKqh6IAWVICIGAGFzydV6n1aBem1UZnW9YNo24FgPmGvWrR92UZovEKYoxSEioHmUR1BRZLJZJFORlYpqmaY1rW-qUYQAFswF4DA8EIDmgbmWrV1WxHECde1UMrMWWmcE8Qs6h0Ls7ZO9E60n5MfMbhDygqQY+OajQWu3lqbkC1vSA5-RQjsdmwkmTk5KX7ntBxW2Ty4Dv0fOp4xSa59wEHCCoQHgbBvN4jqhGN39dPJJOeQvCSTyFyA8yhdxFEyLJQwSsyb4SyjlaeE1Z4fF1qIfWhtjam10tgfShkTJwjMvgYY1kGLkSdn0V27tPauTgTfGeyA56oPQWHE2kd14lg2BeWWcE3CXH2J1EBtgxSqG2BcXGzRxHXwQbfZBZcBCV2rrXeudk2GtwQE6C8OxrrS06gUP0IDMjIXqLWKK-Jdg+nzh8T6yIQQgi1Ng3Blt8HmTrhQBu5DKEey9nAqxogbF2KBKojc7oLwXVcI6GwyVepHWEs4IWcFjytjrGnfOqBERgEylqQkhAgZjBXh-ZuX8wI3ByH6Tq7YnTE3UMdWS9gZDQJOFWO0490qPjSWRTJ05sm5IGFQDmpIqBg2IH0MIDkglgSdEYnQ4p1DulLBoGpdZ8bNGZFkYoBxUmaw6VqMgAApJa4zGox27FBMUuQ4KKGkos7I8gVm6BkOs4omz0mdMxK4huhz1raDAfc3GzICj3AcNc5ZOx7mPLzrAjK7SMkYiUPCOEAgjJmAxH0CAX5hDYDMLgMI2TwYg0JHQPo78Cwtw3GcrYXU8jtk6syLCx1CgXl0EKf54o6g3UhW0rZMKgRwoRUilFaLRAYqxTi6GDF8WEuJaxUlYFBIXlvLJbCJQWSPEPhUKsmQcj7jsJFVllw1DPO2Ty+Fql+VAlReioQWL3kqNXoFDcMd9BQTCb3LwFTjqHi1bsaK2iDppXJtC15qD4TfjsRAC1QqrUL3wM7I0zEClrzUa2B0UU7DihsOKSSx1LlQXqIoTshh2wtIDVyoNJrEXIqBCDbguAIBiBRICeEvA-gohLS82F5azVQGrQgRtvArH+Q4J8je6gLy7CaMce4WQxSS3VddSCjxBKbScNsMMHLpSBo7Xyyt3aa1wgNsgJQ3AQT6T+sgcuE4oWlq3aandPa+0DuWHEYdJYjCOCaLBF09T8hqsQIebIZyvAslPtBQ13KoCWw+MibgiDL1vAxMQX4YABDwogHPU2j9n6kHwGMMqtEX0IHFL6XGEVbyJVxsdSKkEZ11HFG4At-q4Gbp5d+KDYAYOwrcghpDKHIDoYfk-MgOG8O8y0Am+1YEXSn2ddLSs+0bCxWEu6KKDo6y0fUO4MRYGg2seg7BrjQI3oCCnN2+e+BphkCw8Jig+G7UysanmweYp6N2H0BoRTFQBoXkrFnfkBQdBim07C3T7HYOV2QLTc1fjeDlwxPfczERLNCdwzZ3mdmikOb0E50RLhaO-oQJ1A4UEWRbh1Q8o8QWWNsY4zy+67GvwQG48iXjaGzMWfBslkTBGXR+m3lFC6OdMgLNiU4bz7oht8QC2uieG7r1Vb07CroBU4ttcSx17DKXbPifs9HY8kEC38lgvyfIVYer8OK-sMUzJys9nXf2ZjEGQswcAouWN+B40koy+tAomx5APJaIoalmgerdmUBsdGtH5DqEY1e9tPLUAACstIvaNG9j70qvsbzRv1C4lYDjdmwiA4DShLgnB0H6e4ot86NdgB8aafkUcxrjd19sVwWTRPbh2U+XIsLcT9I0FocF3N1F8LhUQvA0XwASG5T7-NGpViuC6iJq79CE+EpYF0Mdywx2aCcFoWF86AlY8IeFsuo7pDyJBcUaNwkVgumoBsDxIIDWmbtbso9LFomfAqOMSpEyqmRGb9hGRRRKHyEI2s07RSwQbA85Q6aTvul7oJT3moYxEX9x+J8GIg9qI8FccPrhV2OkKMN08bmKUXIeB2Jlt2Zv9ijN74cfv3zjgM1AXP39Cgk4-Yqh5RQgXq4rwnjkNfBep8HD7kcmfxxfj-ABCAnfJMC62Dofa0EhS9QbLsZCehuylc7CEuvrTpSEV9wmEiogyKL4x3L6OjpNhOmOH6a6hhbwO-V+2TRMcdcxywoKabE-BvDyNSenO-RNb+eoEnXaC4XaXQXaeQBsA6ZCYeI8B4cUUUaSKRcaSaIqGaNaCAgWdYRke5XQLqIRSSQfCofkLYRVXGcKGA9QfOOrR6TyKAF6N6NWGAIOJfRqFkewY8WTSlAoGJCof-LVU+PIOweg-YfOH2Iuf2LZZEHg2-c3W0XqLVC6OwQwHQbCWdWQY8FCUUAaXGbYE7OQwuP2KAAOZQ7WJhUOTBXg77KAsg0+NsXQijYSO4Iw23PXfzBQCwrg4uQOOwiuKuGuJw9IKKOONkS7JwXGMvfuewROa6epUMW8dzbAxBO+D4SI9Q7IJwQwfnDw5wEBbCSCGCJVLce4ZlLImRBhFBEODBcOPIhAavGoIoplQ7UoqWTQe0So1sYobROo+hRhMIxRVoqKBkY8bsRQYoI8XaKg19FoaA-II8EoI4CFevRSaxMAWxHPVQ4PNwSCH-B5JsA+ZkEBSSU6f9HeVwJ5O7d4B7Vo90ewO8cpHeKpD-CoHQSSLYaBUUEULCdsGBbYicOHCDAQCAACVog4dsB0Y4UKGOaKb4v9AUL1IMSg2sNwSrCDTtHdCNYVVo3GLhIXdQR0eoepDzNE3abeXYB4DOMULYoAp4ubSE0QENMNQkq1VojA05a8bQwSHrY6WCMBQoLqE6B4Y8GHTlCE3lW9OLbgWEoeLYOsU+RoGCWWelepVQQBPQHYZwJgx48Eo1R7arRBXknYbeepWCMjSSTw9VW5MPBWSKQUHYRoXEyDBbeHfCJrZDVDdDXkpZNqOsW8f-OsRIhAY+ZCNwZoB5Q7eIz0p7fTX0wzSQYzRBOeXkwwMPK8MUdsUMZTHqOoZ3I8IBUvWCUElkk08DL00LWFcLSLKAH6OnWLKtXIw4pNHMwFSkn+MRfQgrXqRlNlGvQSJoBwJM802FFghrP0lrLMzsh1aomTGY5OWoUQxAdYFTdqcsw6TI40h7OsmrCDJbNghcz+O-DeSSZCeWIUXaEoGsHqIcrVPhP0McpoScvTSAbM+0WSVIrCAClkDcgrBWHIVwWsQUbCJVCcg8tkicJHBnG-C8tQzcU+ePOsF0OJJlOwGpXrNZKKNC7YU+T0n8REKAfSZ6XgYYGLMASYuoaA66a6C4bCC+HqbQRXIvKsepWOOwanYzOnHyZHJCwpS8ksB-LYd0PiAHLqVE9Ra6VQcbOTN1FkUmXwIAA */
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
        SCREEN_FOCUS: {
          target: '.checkingBluetoothService',
        },
        SWITCH_PROTOCOL: {
          target: '.checkingBluetoothService',
          actions: 'switchProtocol',
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
              entry: ['sendVcReceived', 'logReceived'],
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
