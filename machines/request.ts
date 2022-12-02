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
import { log } from 'xstate/lib/actions';
// import { verifyPresentation } from '../shared/vcjs/verifyPresentation';

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
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwEcCucAuBiAygMIBKAoqQHID6AQgDICqxA2gAwC6ioADgPawBLbAN4A7LiAAeiAOwA2ABwA6AKwBmAJwBGDazmaF6rQBoQAT0QBaDTIAsSgExrNttXLk61rgL7fTqTBwCEnJqADEAeUIGfDZOJBA+QWExCWkEFVYZJW0ZNQVbTIc5eRLTCwRrO0cvVgU61gcHVizff3QsWDx8AHUASQAVQgAJKgAFYgiBqIi6OIkkoRFxBPS1VjUlGVZbLJUtNwPbBTlyqxUFBxqvJsMHBQV8tpAAzuwlAGMACzAPgGsBKIoDQADZYbC8XjYL74MDIABuAg+YE+P3+gKguHoDFI0ymo0oAEF6KQACLzBKLFIrUDpfRyJSNWwaTLHdaKBRnSr5Bn7DROBxaeQaOS2GQqZ6vHCo34AoGg8GQ6GwhFIlHfWUYrGMXERfFUUl9fDEuhkik8fhLVKrRD1FRKWxyHZaHQPBzaU7mKzMq5yDT+rIu5lOhQySUdaUa9HysFgCFQmFwxHIpRSrpa7G6-VEknkjgLS3UtKIF37Gq2LQOQpuNQycVcyzHbKKOvHFQqOT7BRacOBLoy6PA2Px5VJtWpiPpoHanF4gajQ3G3PmxKF5bFhBaVz2x5b1hCpxqLSeiqWfSsGp6Zr+mQijS9t4DuVDxUJlXJlFgUQAQwARiDIFwFcqXXG1N0aDQlC3dsVA0dkmwbKstCUfQeRZdwClsBwJT8F5J3ef9X2hUkvwEQCAHEpgiKh8FxAY+gocjYnzSk12tWkSw8bI4Nve4xR2GQTC9So2RQ-kty0epHQ8VgcPaPt3g+ADv2QDFCDEURfmpXBJC6b9sBRb8ADMDOQAAKQhTUJYgDVIOhCQATQASlwNNFOU1SgXU0RNI+algLYmkpEQGxlC8QwNAUXQotsRDGX3DxQyyDD8jkvCFKUAB3b8liBMJeGQbzfO0wgIgoChSEIAYzRYi1klAjjwMaB1OzsZwDjUFQKy5NQnCg3rUqDR0H2lbLcqgfLCo0rTllwRdSvKyqBgC+r2OCzdevsYoutYOD9y0WCVC5d0GV61qVCrH05CcEb+24VBuBUjEBl4UhJG+b8gTAPpRCM3hcDIQhSD6AA1UhbJBvogaoBjIhWq0gvSEV7RZW9xUedx3RkLkVG2LYQzcC7-WZe9cLcpQwHer5PqgDESI-H6-twUgAA0RkJRjwdJMrSHhoswMizZimKOtMlgzrseEl1mu7eRq2u3bbFu95KY+oE6bABnft4JRATGZBeCgVBYFgHS9IMpRjNMiyyoqqq+jKqh6IAWVICIGAGFzydV6n1aBem1UZnW9YNo24FgPmGvWrR92UZovEKYoxSEioHmUR1BRZLJZJFORlYpqmaY1rW-qUYQAFswF4DA8EIDmgbmWrV1WxHECde1UMrMWWmcE8Qs6h0Ls7ZO9E60n5MfMbhDygqQY+OajQWu3lqbkC1vSA5-RQjsdmwkmTk5KX7ntBxW2Ty4Dv0fOp4xSa59wEHCCoQHgbBvN4jqhGN39dPJJOeQvCSTyFyA8yhdxFEyLJQwSsyb4SyjlaeE1Z4fF1qIfWhtjam10tgfShkTJwjMvgYY1kGLkSdn0V27tPauTgTfGeyA56oPQWHE2kd14lg2BeWWcE3CXH2J1EBtgxSqG2BcXGzRxHXwQbfZBZcBCV2rrXeudk2GtwQE6C8OxrrS06gUP0IDMjIXqLWKK-Jdg+nzh8T6yIQQgi1Ng3Blt8HmTrhQBu5DKEey9nAqxogbF2KBKojc7oLwXVcI6GwyVepHWEs4IWcFjytjrGnfOqBERgEylqQkhAgZjBXh-ZuX8wJCOUETfIMh6iSWDMdLI2R5DNGZFkYoBxUmazIpk6c2TckDCoBzUkVAwbED6GEByQSwJOiMTocU6h3Slg0DUus+MGm6BkM0tQrT0kdMxGQAAUktMZjUY7digmKXIcFFDSQWXUhWjTVkeGKBs9pWpXENwOetbQYCVm42ZAUe4DgrlLJ2Cs5pDzYEZTSU8oESh4RwgEEZMwGI+gQC-MIbAZhcBhGyeDEGhI6B9HfgWFuG52wXnFHkXaOgWgxxTogYoWQlAnCgYUXYglhpgsfBCjJGJoWwvhYi5FohUXosxdDBiOK8UEtYkS8Zxy6jFH-nWWpMSKhOHUC1V02EnS7HWey6UnKtk8tUnyoESKUVCHRS8lRq9AobhjvoKCYTe5eHbH3BATRnA5B2LtOo2iDppXJvq7lgJ4TfjsRAU1grzUL3wM7I0zEClrzUTHVwqghTuD9DHW8Ipjq4x3I6UMJxOx8MeVyqFwbQ0CHDQKoVANcTEAcgM0gQywhQ0JPRMqbz0iPHsA8DqejjwlFdVWVZjI9xVhKNAnVE89VtNLVAQ1cKEVAhBtwXAEAxAomDbwP4KIA2zoNTCo1S6oAroQFuqx-kOCdpLOoC8uwmjHHuFkMUksVXXUgo8QSm0nDbDDLq-sgaoWHsXRiFduA4QG2QEobgIJ9J-WQOXCc4L93cuA8ak93Az2iHhLwC9yw4jXs3EYRwTRYIugqfkQ+KrnDZFOV4Fkp9oIloNd+D4yJuCIKQ28DExBfhgAEDCiAc9TaP2fqQfAYwyq0UI+KX0uMIq3kSrjY6kVIIvrqOKNwRb-VwMA-O1j7HONuR43xgTkBhMPyfmQCTUneZaATTasCLpT4OulpWfaNhYrCXdFFB0irQzqHcGI5j3KDNgA49y4zQI3oCCnCe+e+BphkDEzZig0nrXSsavUBkzK8juDsPoDQXmKgDQvJWLO-ICg6DFCFqFYWItQsrsgWmJq-G8HLqBhLSXwbWck2l3mGWilZb0IPfi6gisaao4gTqBwoIsi3HYGwTgez-veHpy2bHwucfuuFr8EATPIjM0JrrERku9ds4Rl0fpt5RQujnTI8zYlODK+6B7fFqt-unQBlDdXNsNfnV0AqnWCDdZS319LDnMvR2PJBIt-JYL8nyFWHq-C5v7DFMyVZR5av6b+wZCA0bY34HjYSob60CibHkKsloih2zOEeyV7sygNjow0-IdQOnkObMi2AAAVlpQCi4ick6lWTjeaN+oXErAcbs2EQEMYZfcDwd57ii3zvt2AHxpp+UF0aYXl32xXBZNE9uHZT5ciwtxP0jQWhwQmwoXwuFRC8GRfABIblSf80alWK4jqIm-v0HL4SlgXQxy2LUDkoYDqtFW6g1jwgYWe6jukPIkEyWeYTgdJwDYHiQQGlM3a3ZR6WLRM+BUcYlSJlVMiJP7CMiiiUPkIRtZn2ilgg2VZkFsI8JKZR2SJfNQxiIlXj8T4MS17UfcxvmEW8FcKAzqwhWtjiw5B2XQLoB+DnLyOEf44otQAn9-QoivsKyVPqfpoDYl-inOQ8NftvN9l+HJX9844vx-gAhAQ-TmbdbEpaHwoIUXqBsXYZCPQbsBbTsEJFbL7AiZ-BMEiUQMiL-UXL3aOR0TYLVE4EUY+W8NQBsElUdfcRoZNJoIUSxDyNSbXNAxNb+eoBlXaC4XaXQXaeQBsA6ZCYeI8B4cUUUaSKRcaSaIqGaNaWggWdYRkFZXQLqIRSSf5YSfkLYM-XGcKRg9QfOHbR6TyKAF6N6NWGAIOb-RqFkewY8NzLqCpQoC3JoT1U+PIOwFQ-YfOH2Iuf2NpZEQw1A5PW0XqT1C6OwQwHQbCV9WQY8KCUUZoH9XOWsZwwuP2KAAODw7WJhUOTBIw8neg6Q0+NsII5TYSO4FCUUBORlKrB3WPFw+IxI76ZIiuKuGudIrtSKRwNkdHVVW8LkOCewROa6CpUMLNGBWA+BQQ5BBonw7IJwQwa3XI5wEBbvRkdsI4IrGQqddKSeaRehRhEODBcOUYhAO-GoSY9feHGYqWTQe0GCOwrCTGGA1Y0adYpBBhFBWoxRXYqKBkY8bsRQYoI8XaeQioaPLhDYXcEoI4POWPXxfxcfLwuvNwSCalVZJsA+ZkEBSSU6Q8XgnYM6HHXY3YUJd0cpSpAobNKWOCX3VZcUThC4Y4MowY9bStACXYg4dsB0Y4UKGOaKfA7zAUT1CsCSS4WsNwHHBddDCNIVXY7RPzJwebdqLsY6bk3QbVZKXg0MIU8tMNUU81V4hvE4XGSsWWU+LqHNaoPRI4kolYvdbnIDXlY9FdRkoeLYOsU+RoGCWWY6MUUpQBPQTEzqc03TH7XHQzKEz+NAlPHYbeCpWCRTSSPIlVeQIxbRfQIRQ8ceW477S0gMrbHnBSA7fjQTYTXYusOpVwQsorJoOsBfN1QIxvBWTvbCVVIU+rIzfCDEGLOLOeAswwRvK8MUdsUMHzHqOoPPI8IBefWCAY1Mtbf0jbQMxrOEFrKAH6LXDrZdD4Dsk+S4eoLNQwQwEIhAZwZoT1PhP0QSJoBwBsvHblTQvbHMo7ds6EpNLcK4Dgj45OWoZVabQcxvYc0MUcorc8mcgHCEbQu84M7wzcSSZCeWIUXaEoGsHqXqC8aKTVGwSsJof8rbSANc+YnorCXClkd8vchWHIVwWsQUOss3IU1AfnHXFA0CuvSsCpB0wSDqTQfcOwGpa7JpKKU+JKU+IUn8REKAfSZ6XgYYdrMAV4uoBg66a6C4bCC+HqbQX3Ys4dQkuwdXWLLXHyAXWiwpEMksDArYd0PiGnLqTkioTGVQV7dzZ1FkUmXwIAA */
  model.createMachine(
    {
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
              on: {
                FACE_VALID: {
                  target: 'accepting',
                  actions: 'clearShouldVerifyPresence',
                },
                FACE_INVALID: {
                  target: 'invalidIdentity',
                },
                CANCEL: {
                  target: 'idle',
                },
              },
            },
            invalidIdentity: {
              on: {
                DISMISS: {
                  target: 'idle',
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
            },
            accepted: {
              entry: ['sendVcReceived', 'logReceived'],
              invoke: {
                src: 'sendVcResponse',
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
