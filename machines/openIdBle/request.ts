import SmartshareReactNative from '@idpass/smartshare-react-native';
import OpenIdBle from 'react-native-openid4vp-ble';
import uuid from 'react-native-uuid';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { DeviceInfo } from '../../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { StoreEvents } from '../store';
import { VC } from '../../types/vc';
import { AppServices } from '../../shared/GlobalContext';
import {
  GNM_API_KEY,
  RECEIVED_VCS_STORE_KEY,
  VC_ITEM_STORE_KEY,
} from '../../shared/constants';
import { ActivityLogEvents, ActivityLogType } from '../activityLog';
import { VcEvents } from '../vc';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import {
  ExchangeReceiverInfoEvent,
  onlineSubscribe,
  offlineSubscribe,
  PairingResponseEvent,
  onlineSend,
  offlineSend,
  SendVcResponseEvent,
} from '../../shared/smartshare';
import { log } from 'xstate/lib/actions';
// import { verifyPresentation } from '../shared/vcjs/verifyPresentation';

const { GoogleNearbyMessages, IdpassSmartshare } = SmartshareReactNative;
const { Openid4vpBle } = OpenIdBle;
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
      CONNECTION_DESTROYED: () => ({}),
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
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwEcCucAuBiAygMIBKAoqQHID6AQgDICqxA2gAwC6ioADgPawBLbAN4A7LiAAeiAOwA2ABwA6AKwBmAJwBGDazmaF6rQBoQAT0QBaDTIAsSgExrNttXLk61rgL7fTqTBwCEnJqADEAeUIGfDZOJBA+QWExCWkEFVYZJW0ZNQVbTIc5eRLTCwRrO0cvVgU61gcHVizff3QsWDx8AHUASQAVQgAJKgAFYgiBqIi6OIkkoRFxBPS1VjUlGVZbLJUtNwPbBTlyqxUFBxqvJsMHBQV8tpAAzuwlAGMACzAPgGsBKIoDQADZYbC8XjYL74MDIABuAg+YE+P3+gKguHoDFI0ymo0oAEF6KQACLzBKLFIrUDpfRyJSNWwaTLHdaKBRnSr5Bn7DROBxaeQaOS2GQqZ6vHCo34AoGg8GQ6GwhFIlHfWUYrGMXERfFUUl9fDEuhkik8fhLVKrRD1FRKWxyHZaHQPBzaU7mKzMq5yDT+rIu5lOhQySUdaUa9HysFgCFQmFwxHIpRSrpa7G6-VEknkjgLS3UtKIF37Gq2LQOQpuNQycVcyzHbKKOvHFQqOT7BRacOBLoy6PA2Px5VJtWpiPpoHanF4gajQ3G3PmxKF5bFhBaVz2x5b1hCpxqLSeiqWfSsGp6Zr+mQijS9t4DuVDxUJlXJlFgUQAQwARiDIFwFcqXXG1N0aDQlC3dsVA0dkmwbKstCUfQeRZdwClsBwJT8F5J3ef9X2hUkvwEQCAHEpgiKh8FxAY+gocjYnzSk12tWkSw8bI4Nve4xR2GQTC9So2RQ-kty0epHQ8VgcPaPt3g+ADv2QDFCDEURfmpXBCAiCgKFIQh6L0g1SHwAZJgATTNFiLWSUCOIQDRbHsODHQg45qwcRCL0MR4NkKFRtlgtwH0jZTVKBdTRE0j5tMkLpv2wFFvwAM2S5AAApSTMiyIksqh6IAWVICIGAGABKXA00UiK1I0rTlmAtiaSkRA-SuC5xSw2SVBchQNAbHQlDUC52U7P0dDgsL+wAd2-JYgTCXhkGi2LtN0-TDIGGz4jsq1WvSLQWiuR0gtcI9nD6oSKjUJwoLu-J9i3R0ZveebFqgZbVoauLllwRdNoMozmvs9i2s3O77GKPrWDg-ctFglQuXdBk7s7cUqx9OQnDepRuFQbgVIxAZeFISRvm-IEwD6URUt4XAyEIUg+gANVIUzWb6ZmqAYyJQYOjcRXtFlb3FR53HdGQuSCi95DqNwVHdZz-TxsAKa+KmoAxEiP1p+ncFIAANEZCUYjnST00gBaLMCNEeRwcZKcVZLgoKuRdRolG7eRqxxuHbDVjWtZ1sA9bp3glEBMZkF4KBUFgWBcAS7AkpS9K4UyoHtr6EzitK8qqpqpR1cpoFQ-D+mo9EGO44T2AbYciHjskxwAsKYoxRu20HgdHGdEyYKRTkIOy+1oFdbVfXI+EABbMBeAwPBCDN5m5ls1cwcO9rZJQ5xK0yTINjcLk3YdJXOy7vRRvvXDi4+4QlpW1mPgBo1s5BjeQPBo7NEgiadjYWZPbRQHt7j2gcK2LulxEb6Dxg-DE30X64FZoQKgTMWbszzHtTegs7b2wdJJE48gvCSTyB7GQ9xvZHiKEfC4fV4ELUfl9Z+Hxq613jnAJOKc05KDShlTK+BhiEmIAxcihU+glTKpVaq+ElAIKfsgF+7DY6cMTo3H+JYNi+SFHBNwlx9ijQ9i5bIst6GUNkpQxhn0kFsLngvJeOlV6kHXjg7+28EBOgvDsfux1RoFD9B7TIyF6i1gGvyXYPo8YfCpsiEEIItQ8OSnwjOWUV4UDXhIqRhdZEKU+LEsA8SMQaI8e6C8StXCOhsFkfQ2EuTOE2O6I8zsxQyAeAoPGqBERgFmlqQkhBmZjAGCUjcNwch+lGu2J0-pqwo1kvYNpfUThVjtLfeSj4ulkV6dOfpgyBhUDNqSKg7NRFhEsiMsCToQk6HFOod0pZBrCWaHWLY-tmRZGKAcTpYctlajIAAKW2hcxyx1uxQTFLkOCihpJzJefIZo7zKEeGKN87p2zMTpLXsCiG2hlADT2HYe2WFLiwuyPCnYugkWVhHnfORmyekYiUPCOEAhUpmAxH0CAX5hDYDMLgMI-SOas0JHQPo2CCxbw3BCrYfU8jtlGsyLCKNCgXl0EKZkoZMiXDUKi35QImUsrZRyrlogeV8oFTzBiwrRXitYpKsCgk5a6CVh2W8Y1ORPJVTkfchLNV1FxrSvJ9L0UGtUkaoEnLuVCD5Zilx2KjrXyghU5w+hAonkQE0Zw3rdi6GWaWOSeEg0-IZfqwE8JvwJIgJG010a374CKkaZibiWoblbA6AadhxQ2HFJJFG0KoL1EUJ2Qw7Y1mFo2cWkNzKw3sqBKzbguAIBiBRGW3gfwUTF2DYy6drLZ1QHnQgVdMTqRxHjSWdQF5dhNGOPcLIrS+3umoYJKGThthhkDROtF27DV7vnbgOEsdkD4xBElemyBZ4TiLV+-VO7w37u4Ie0Q8JeDHqahwM9m4jCOCaLBF0bT8geoqIebIEKvAskgdBXVJaoB8I+MibgzDINvAxMQX4YABDMogC-JOqD0FmTGHpWiGHMYoSCoYGwIpJLuyefbSCrS6jijcMOgtm7J2Mu-HRsADHGU1RY2xjjkBuMoLQWQfAAmKBCa0M2+1ILKzZERp7SsCMbC2BRrJh0dYFPqHcPQqjIaNP0cY7poE5MBBTn3a-cyEQyB8bM4J62X8W1gUHefMUSm7D6GcvUpwF5KwsjhnxHQYo-Pqc09p-V89kDjygLTD4vBZ4YmQVFmLpnzNCcSzZiGKXCj8XUM5BThHECjQOFBFkW5CWUKPCV-VAWtOMYJlpr8EA9PIgM1xyL0wWv8fixhl0fpRMDSVq7TIjzbo5agu6E7hXnLvvWdKLdM2yuMa6CtRrG3osc1aztjreDbP7eHfyWC-J8hVnqYY0b+wxTMkmz2D9921OPcC4BRcDb8BNolb9rrrhXkWL0CO5wp2hvdmUBscWCn5DqBU3ShHNHUAACstLI6NKj9HdrMdHTFg9C4lYDjdjqcJAeVxLgnB0B1UM4o8bLdgHVmKjOIB1pZ7t9sVwWR3Q7L1HG0thJYW4n6RoLQ4L9Y6c8UQvAuXwASDVDHttHJVk6lWLwfo321ORsJSwntlB5BzS9NysO7v9kBBp4QzLrdN3SHkSC4oxaVIrErNQDYHiQUejcuG3Zr7RLRM+BUcYlSJlVMiUPmiMiihGphWsd7RSwQbJQ7I2E4IwMeJkOBcP+xRiz8OXP75xxt4xIXjxyLS8uXLxlwohPKiZZlVCh4HY1V+-HZGTPGJs8jjzx+JjOBe9s5tziwo3scOyUgdhRo3k3cT67fowweu4YZ81DGIiq-xxfj-ABCAfeNzHWaFsHQCNoJCjug2XYZCPHIMCnMpOfYuQiHPBMEiUQMiV-LfMPEsR0TYJ0Y4P0HGQwW8ePN3dsbxFuRoY6LCQUW7efVvOqKKX6bfdxIWeob2OGC4OGXQOGeQIaMsS+I8B4cUUUaSaxZhb6NaRqcGagu2dYRkSlZ1FyCsElYSfkLYA-IKLweoFkdQPGBbImSKKAUmcmMeGmCON-O2PqKCDwFuWVAoV3CoIg71SBPIOwBQ-YUeTWcuCeH5ZEaefQxyR4FXA-OwQwHQbCLXCoQSZQY8CsCnF0TQfcBwkOZwyuSOaOVReudwrrWg51SBNsPw6TCoO4FCUULwNAuoKQqIpwqASeVwiOJQexRebAJI9IAaZQFZYbLCUaW8U+Lwc+YoSBTg28ZyXgxBVhGo20WsGoS-NVQHZwMBDwRkZXAadYR4bVXoxRZReIuuLhAYhAafYYmffcMY7AioA4FkVQZXVsYofuBYlhJROxAQeeKotYgaBkY8bsRQYoI8ArIJFoOg-IZpZ9V6FvRSApIpIENYtwSCFuShJsE4AoMfF0E4EaYjdXVwFFX4icaDKANY90VyCZGCaZZydQD2EUWvS-IwC+DCabGjAQCAACNYg4dsB0Y4GwNPXNXYjNAUbNIMSSV9UKJEh7GjWDPdatM1NY2Wb2Q3dQR0eoNpVzJ5a8UTXYB4R0KseQUk6uctStfk6NNYrg8Fa8HwwSPbFGWCPFQKLCEUB4Y8KnKDPVHkn9RrbgKki+LYOsSBRoGCH2ZVNpVQUhPQHYK6HVLkmnWjQLTffabfcPHYUTRZCTDwTAlGEhb2KMrAkoUI30-3d4bkgMubHTfCFbdjTjbjDUuFVwOsW8IgusMfcBZCNwZ5d0bCJwc0z9S09M8rWnLMkLSQMLZhF+DUwwEaK8MUdsUMd0QbBAWYpPI8MhUfWCQOP0lExsxjSrarWrerN7LsiBYXLIf0PyTIobO6VVf1GfQSJoBwJU2bJs-GQmJbbMtbTshAovIMK4BzB4ruWocwobOoUc6E2wlkHo6chsk857CEDQ684MxAzcSSZCP2IUOGEoGsepHc71AxJ3SsJoY8p7SAFcqYzXLCLC5Q+pf2HIC6ShA+bCHGJU+nOXKkzoh03UhpNVOwOZfbD5AaTo7YSBJUn8REKAJKEmXgYYerMAW4uoOgp2bCAxGBepbQTqQshU+occyXMLGXdaNCm8jxLcfQLYasgoFodgrkSWVQS7JzLwJGW+XwIAA */
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
          invoke: {
            src: 'disconnect',
          },
          on: {
            CONNECTION_DESTROYED: {
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
                  target: '#request.clearingConnection',
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

        generateConnectionParams: assign({
          connectionParams: (context) => {
            if (context.sharingProtocol === 'OFFLINE') {
              return Openid4vpBle.getConnectionParameters();
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

        disconnect: (context) => (callback) => {
          try {
            if (context.sharingProtocol === 'OFFLINE') {
              Openid4vpBle.destroyConnection(() => {
                callback({ type: 'CONNECTION_DESTROYED' });
              });
            } else {
              GoogleNearbyMessages.disconnect();
            }
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

        advertiseDevice: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            Openid4vpBle.createConnection('advertiser', () => {
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
        CANCEL_TIMEOUT: 3000,
        DESTROY_TIMEOUT: 500,
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
