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

const { IdpassSmartshare } = SmartshareReactNative;
const { GoogleNearbyMessages } = SmartshareReactNative;
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
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwEcCucAuBiAygMIBKAoqQHID6AQgDICqxA2gAwC6ioADgPawBLbAN4A7LiAAeiAOwA2ABwA6AKwBmAJwBGDazmaF6rQBoQAT0QBaDTIAsSgExrNttXLk61rgL7fTqTBwCEnJqADEAeUIGfDZOJBA+QWExCWkEFVYZJW0ZNQVbTIc5eRLTCwRrO0cvVgU61gcHVizff3QsWDx8AHUASQAVQgAJKgAFYgiBqIi6OIkkoRFxBPS1VjUlGVZbLJUtNwPbBTlyqxUFBxqvJsMHBQV8tpAAzuwlAGMACzAPgGsBKIoDQADZYbC8XjYL74MDIABuAg+YE+P3+gKguHoDFI0ymo0oAEF6KQACLzBKLFIrUDpfRyJSNWwaTLHdaKBRnSr5Bn7DROBxaeQaOS2GQqZ6vHCo34AoGg8GQ6GwhFIlHfWUYrGMXERfFUUl9fDEuhkik8fhLVKrRD1FRKWxyHZaHQPBzaU7mKzMq5yDT+rIu5lOhQySUdaUa9HysFgCFQmFwxHIpRSrpa7G6-VEknkjgLS3UtKIF37Gq2LQOQpuNQycVcyzHbKKOvHFQqOT7BRacOBLoy6PA2Px5VJtWpiPpoHanF4gajQ3G3PmxKF5bFhBaVz2x5b1hCpxqLSeiqWfSsGp6Zr+mQijS9t4DuVDxUJlXJlFgUQAQwARiDIFwFcqXXG1N0aDQlC3dsVA0dkmwbKstCUfQeRZdwClsBwJT8F5J3ef9X2hUkvwEQCAHEpgiKh8FxAY+gocjYnzSk12tWkSw8bI4Nve4xR2GQTC9So2RQ-kty0epHQ8VgcPaPt3g+ADv2QDFCDEURfmpXBCAiCgKFIQh6L0g1SHwAZJgATTNFiLWSUCOIQDRbHsODHQg45qwcRCL0MR4NkKFRtlgtwH2lAB3b8liBMJeGQdTRE0j5tN0-TDIGGz4jsq0aSkEsWiuR0gtcI9nBUCsuTUJwoKq-J9i3R0wv7SLoqgWL4o0rTllwRdUoMozgLY3L0gOKtHE7XY4P3LRYJULl3QZKrO3FKsfTkJwmvebhUG4FSMQGXhSEkb5vyBMA+lEAAzXhcDIQhSD6AA1UhTMevp7qoBjIkG+z2LypzOxyIKbAuNx1psLkgoveQ6jcFR3Wc-1NqUMBjq+U6oAxEiPwu67cFIAANEZCUYl7ST00gfpyjcNEecbijrTIQqCrkXUaJRu3kat1tYZzkdRk6gSxsAcau3glEBMZkF4KBUFgWBcEkLpv2wFFv0u1XkAACj69K+hM+iAFlSAiBgBgASlwNN3gF9GhaBbG1Vx8XJel2W4FgKmizArR92UZovEKYoxSEioHmUR1BRZLJZJFOR+bRjHhdF66lGEABbMBeAwPBCBJ+65ls1dfuGxAnXtVDKyZlpnBPRA4PtIOJsEvQ1Fg5GWuEGK4sej4eqNXWBqLkC-pGzRIM7J0sPK-0Tk5YTK0MRxWxDy4Zv0Duoq7tqe77x7CCoO6HuevMsuL6mwNnh1JJOeQvEkvJWZke4OaPIpMlkwxbE31r2t7iXRBSxlnLBWStsAqzVhrOEWt8DDEJMQBi5EqBGxNmbS21slCdwxH-D4ACgHu3ll7By-1fbrA5kKOCbhLj7DbqzFy2QoYXCCs0ZhP9t44LTgITO2dc751IIXM+I9S4ICdBeHY602ZtwKH6VmmRkL1FrAof0VYdj8mRh8U6yIQQgi1GAiBSh1aax1nwugyC+jG1NhbK2+FPiaLANojERDR6IHdBeeGrhHQ2CyPobClVnCODgseVsdZw7I1QIiMA4UtSEkIPdMYAwnHCJuDkP0bd2xOn9NWeasl7AyC-icKsdp7y4QweEsiUTpwxLiQMKgJNSRUGeggsIllEkbidPInQ4p1DulLBobJdYtg82ZFkYoBwwki3KVqMgAApdKrSfZ1GQluW8FCqHSX6dkeQzRhnPw8MUcZESKmYjzhQAu8zHLaGUEovYdhaZYUuBswZ2zdC7MrPHEpNiymRIxEoeEcIBCXTMBiPoEAvzCGwGYXAYQYkvUeoSOgfRT4FhLhuMUkFxRijSW3ZkWF5qFAvLoIUzJQyZEuGoA5kygS-P+YC4FoLRDgshdCj6DE4UIqRaxFFYEW5bF0PDDst5QbzwqFWTIOR9y3JJXUDaHyFITkOT8v5qlaVAhBWCoQkKTlnOHkNDcvt9BQXcbXLw6T5qHnFZNOoEiZpyTwnKr5RyAHwm-DoiAaqGUav7vgQ2RpmKCN1dy6oxwbBilgozSS81FD2EknoE4TD2zFPko+B1iqaVAqBI9bguAIBiBRICeEvA-golKRM75VKlUAvTVATNCB828A0dSOI5ySHqAvLsJoxx7hZDFDISN7pX6CSqlhWsrRZXJtLY6itKrq1ZrhNLZAShuAghVtdZA6cJz2onam5VVaa11obcsJtOquWORmkeRwTRYIujyfkYVLjnDZDRV4FkDhBKFApWWqABiPjIm4NvDdbwMTEF+GAAQfyIC9wVvvQ+Zkxh6Vos29IK0UJBUMDYEUkkWbCXdEoh0dY6jijBkwj9jrvw-rAH+n51sgMgbA5ASDuBoNkHwHBigCGtD+pPSQys2QZps0rNNEN81aaQR7QR9Q7hiNjulCmqlZHf3-uo0CI6AgpzVr7uZCIZAYMsfg5TY9F9HL1AZIUTF7g7D6GcpVJwF5KzR35AUHQYoSM-PkxR-9mdkCY1VaID4vB04Yl7gQaY2nmOsYQwZ72Rm9AOnKsFFwBG70IDbgcKCLJlnMmfkeFzcnyOUapdtCjX4IA0eRHRiDGmQsvTC3pxDJZjwTwuC+2OmQ+nCVqrZ90rW+JObDNJ-ssmv1ufy1+rocVAuVa09V2DtXIvEJGg1lDSjsLKPyFWSqNC0v7DFJlpwPZ+vvEG9+hTgFFw+vwH65Fhn-oFE2PIZ+LRFDtmcG1io+RJKMlrBcAj8h1C2pLQqqlqAABWWlTtGnO5dzl12Rq3l41IysBxuy+IXi+jm9wPB3nuIzZGJXYB+cSmDiAXrId1c3O2K4LIqodlkh2V9XIsLcT9I0FocFnJ1F8LhUQvBQXwASNbK7UX-pViuEazx2w74o9PGzZQeRdiPHhocWsyNARkeEH8wX83ZCaC2MDOwgcZpOAbA8SCtVOm827K3dRaJnwKjjEqRMqpkSa+cRkUUSh8guRHRZwor2rDP2yCtkdvMRSvocNbzUMYiKO4-E+DELvhF7I95hb3jpfcNks7ruCHIOyEv20myMNuMR25HDH8cSmoAJ5poUdH2FZJh6KN5YSZ4dfimzw8XPrOI+DhLw79844vx-gAhAKvCzmhbB0NNaCQoqoNl2MhWNQZfuuPz3ax8hF7cJhIqIMiI-odC5Go6TYU8Tih8MLeNQDZ2xiN9r7QUOwmhCnUcpVSQIEpJSF0Imm9QOa82+wGXmeQBsPjFDVwG+cUUUaSNhbBOKd-LqP6L-S+MhXmLIPlFyCsB5YSfkLYevIKLweoFkdQZGQrXaV-KAA6I6QWGAZ2UfC5cqKCDwW-OLAoOaYSLCSnRoOsWsQoPIfYBOKg5OJ2MWWgm7KqcVeGOwQwHQbCXtYSQSZQY8DxQUFwd0fgu2bzKAR2ZEZ2PBN2EBEQ9IB4AlevSQvkGQrkO4FCUUQOE4OoDAtQpOB2CZbQsWThbhHOAw20WmRwNkbbJwYGLkNyWLYoV9B4OsTJaA7uZAXuTwhAR4QPOqZnaQ9QS-BeUZRkCnOwYKZobsSIneaI3BV2YBD2WIjvGoQwJI-kFI1mTQe0GCV9OwYoCRPIjhDOLODw-fLXOIkUBg7sRQYoI8XmJvCoGaFoX-fII8EoI4d5AvfsDRXzexHRIEWItwSCW-Z+JsOeZkVmSSRaQ8CAnYJaHLSvTo13d0VyVJGCDJZydQVmEUQPfJD+FI8lA7eVSlL9AQCAACWIg4dsB0YNPJX2XQR4M1MQ3QCsCSMlPIGYtfGTLdctNNOldVCFWIqGDmNndQR0eoPJWwM1XmUAuoaRKseQY4p1F1T491RlWIiAqCLCQApsF0Y8eaWCK5QKLCEUB4Y8f7T5eEr9KdXdbgH4+GBkOsAPRoGCTmPFPJVQe+PQQ4tuF42Yw7Xk47dzePU44RbYewZaNDW8Dwc-eaO+DmHmQSfo1rb+V4o7YbRTfCUrUDcDSDakgZfXUU5yJocI+aKQj3E090bCfw0k60qjW05TSQVTbeGIjUjcPJe0dkYk9sUMHDSqOoU3I8B+X3WCC0pUt4z9VUkbJQTzDQi6PzALDND4akpee4LtW8WmJhWQt7KqYw6hP0QSJocPS0lUwMgrHaYrO08rCM7KA-erLCQ1F0KNQdXYVgt7ZMj3VM0MdMvmdswHIbPLf9MbMg-s8+QczcSSZCbmIUXmEoGsPxcfYE7CZsysJoAMlcyAcs+0WSdaRorCZkdsSqHmHIEqZ+KuM8tsrMo7EHInH40IrYOsF0ZwTQCVXE7DPQSCEZZbPJbYV9Ukn8REKAFWfaXgYYfzMAUouoX-dadaC4bCNeSqbQUXVwDYvJP2OwXHVTAnD-G8yMn2I-LYX0goR7cqVIiodwUXLrATE1FkYpXwIAA */
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
