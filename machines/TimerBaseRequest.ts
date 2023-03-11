/* eslint-disable sonarjs/no-duplicate-string */
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
    pairId: '',
  },
  {
    events: {
      ACCEPT: () => ({}),
      ACCEPT_AND_VERIFY: () => ({}),
      REJECT: () => ({}),
      CANCEL: () => ({}),
      DISMISS: () => ({}),
      VC_RECEIVED: (vc: VC) => ({ vc }),
      CONNECTED: (pairId?: string) => ({ pairId: pairId || '' }),
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

export const TimerBaseRequestEvents = model.events;

export const TimerBaseRequestMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwEcCucAuBiAygMIBKAoqQHID6AQgDICqxA2gAwC6ioADgPawBLbAN4A7LiAAeiAIwAmAMysAdKxkKA7AFY1ADgAsurQDYNAGhABPRAFoAnBrnK7RuVpm6NuuQY0BfPwtUTBwCEnJqADEAeUIGfDZOJBA+QWExCWkELS19ZW9jOTlC1mNjGTsZC2sEeztjZw19OXrvVl1jBTkAoPQsWDwiMkoqGLiEmSSefiERcWSs3SXlYv0NGQ1y9sMFats7OTycw-1WNbdchR6QYP7BgHUASQAVQgAJKgAFYmjn2Oi6IkJKlZhkFrItAplBoXDlmo4ZMZdKw5HtajI1E5mg5jJVkVoitdbqF8E9Xh9vr9-oDJsCZul5qAsoi8qxWDklnIZOctHY0TZeVCZIjNFpvF5ITIiX0cMoAMYACzAcoA1gJRFAaAAbLDYXi8bAK-BgZAANwEcrAuAAgp9PlRrYRno8AGqkIHJEEMzKIBT1VQdEwwppNFzmKy2XENQ5LRGmLTB7qBG4ygbypWq9WanVgPUGo0m82W9PKtUa3D0BikP6-D6Ua30UgAEQ90zScx9CE6DRR+jsOh2pSW-IUHWU7gOXQ2UbWWmlITTitLWe1uv1huNZotYBLmfLler0VrVCbj3wDbozdbKXpHfBCHxyn0xjOwpc3kqxn5facuLsdlYdZuXqdp-GTYlFwzMtszXfNNyLHcIOEfdGEPY960bFsODpdswSZWQZHcFYFH0eR9EhToNG0b9PGUJEqMMHJjHcXQpXA1NsF3aDV1zdcCy3YskKzCtUJrZ4PlPc9MOvL073whBuQULR8gUbk1EcBRVK-CNak6FRFFKORWH-GFcXnO4uJXHM8w3Qtt2UMBRAAQwAIy1SBcBk288KkWQUTsZRuRyQVSkMcMahsQ4ZDozSOn7MoDGaOd2IXTi3Ngw0m0cgQPIAcSpKh8GrZ0KFyhJsM9bzGV8hTyg0ZxNAOXwznWGioVxLlSORZ8tmS3pUvldynOQLNCDEURlQZXBJAGJzsB3JyADN5uQAAKQhL2tYgT1IOhrQATQASlwJDBrAYbRvGya5i83DqqyBxdGUEijBcADdDsfR+ScNlEQ8DRAIS0c+pTAaAHcnNmDVIl4ZAxtECa5SmwhogoChSCdK8KrbUF7r8lEn2YppNPUJTSLRLohUpoxhX0Z9zNlCGoagGG4aupG5lwSSUbRjHnlu3HO3UQ4VmY047CUYVeS0NEWgaLoiYJOmDkKK4Uos7hUG4C6NWeXhSEkRUnI1MBHlERbeFwMhCFIV1SB2l1HhtqhHgoGIBe9e96mU-tgzFBQyhacLEATFRNnaAOCX-Ps7AZtMwENhVjagLMsoQs2LdwUgAA13mtUr7abVH3Wxm87s7FwoWKYoqJ0QUEzRYUCdYzZyIDozPrjziE6NjVU7AdPzd4ZR1U+ZBeCgVBYFgabZvm5QlpW9bUfRp1HlRqhnQAWVIaIGGeY7Tp7pO+41NPtwz4fR-Hye4FgD25JqjEPBWVgSPI1ZWp0pYnufLl+0Auyeoxgu4OUTsnfug8LbKGEAAWzALwDAeBCD5xtoCUuskfJZBfMpToqk3DsjZJpbSNQJbKQ-mLdYpQlKx3VozSGyEWawxdHKLmZ4ear35hgqqQs-QBWYi+JKMcOi6Ebj4ZScgGJrA8FyEwat+oWSZow1mLDcAukIFQa2ts3RYSmGXQWXsXBPg8B0TYJF-q7B0hsHwKlCIoh0OyIw+hQFKKzCouUI9RBjwnlPGeM1sBzQWstE0q18BvC2q7XKm9Hg7z3gfE6HFlCuOhswjx18fF3wflgvySh8gbAlgHbw7glKNzpvVUOYoExGSqS4hhbjUkwIEPAxByDUG7SyXjLsbJVB-ybkpAwuJG46GisiTQH0DinB-KAuUxtLRai1MJfxgSF7BLWigigaDomxP3ofRJMzRBzIWRqDpnYWgqCViRXEAMzFuApppFYEtEQMSoj-UBqBzRgDBsJR0NtPhcL0ZgzpJEnD1DIUxYyn1ISy3ZHkCUhhCiGCAW8geOUvnlh+aQP5DoKBNioG6YgjxIj7ROfeF8IyKjaEhC0KWfIdJGSotCEofZALFHUMij5aKoBW1IAAKT5iS+SGJWKBTWJUGEhSerQoZZsIyzLHDlGKOy1Fwl1loIFTVPE+QALaFDAYHwqI6WAXqjKs42rWWKroWmd5yqNTKFNCaAQi1LBZkeBARywhsCWFwJER09sXTWjoI8XROEDHyVFdCXIGglKQlyJ9A1NRDg6GcOpPsngdDeHkaDCy1rPlZjtQ6p1Lq3WiA9V6n1ztXb+sDcGyq5d7xUOhABAkQZ+y6FHLLciKgAIbFTdodoiglW5ttfakahaNSuvdUIL1qr2ncLrYK6hgULkBxIkxWWigoQAXFu0QoUsQanRzZyzxponILIgBOktU62H4C3mecqAKeH1qaE+D6IZeS1w8LLJEeQPBDmYkYHItCFGykPXm9UJ6z0XtLdy54xB9p4tIASyITtrTOlRuqxYRgGqnCuUpNQn1Zb9OcDkLwn0NgA2cZazioHh0FudRqF03BcAQDEDucDvAVSIUSTRqA+bR30agIxhA7GZkMkSBhiEuTThFEMD4QCaxg4IGrgFNt6wujNE0IBQdR6R2OoE4x3AJpx7IGUNwLUc0LbIFgcoA9KKh28d02OwT3BhOiFNLwUTN0OASYUpKFYRReTCi8KOURdLNL1VFSRfskigrabzU5OUlpuCMJsxxLMxBlRgAEPaiALCZ7qM0aQfAnxUZFR89oX8CZXqmQ8A3Olb0nxUVAhRf9+7uN2aPQlpLKWhIagy5abLkA8tqI0WQYrpX3S0lraGp+8h6qESbvINQFKvr1Y+o1gGaaA6tbi7arrYBkt5t61AA2AgBhZlUfgP4ZBCvjYoGVudM3FilCfJG7bTROgEZ0pTFQ8gAFNVIp9MCwGrUdfi4lg7KX4HIBTuOg5vBYEXdYVd6IN2xslfuyXB986arIgaORNY7I-SnE8KFmoSl1CBX7NyUMGk2Ig+o2DvbEPDu2s1gdxyEB0uZcG7l5H137bo4mz54UuI6Jimi0AnQtLycGUCi0aXPhAdrF27x-brPeMDFhkjggAvbsY4e9jp7BExf-oOLySc3hVvk+KVT9waw+x09VwvFn80IDXtvfge9IbPbyQMFCTYjg2RIhyJpGXvpWJPTftoZEnhNgxud6gAAVpNDyklPfe+m77p+wZAr9PkOoVityrHRfyD4cooKfC11AVz2Acp2Zu493ekXxxiNdBMOyEwki0TwmcLiFEbIJafXaNMqCWYKC5jBrDFUuBUaBvRj5sWqgZVIlZWR-kXgGheF8I4LdFRR-Lg1BP7AU-kAz+iJESI8+sc+8ftgpNBhWiQjOPodv-IOhhwTII-sq6B1UeULwItItEclaHPq7DflnnfogDCE9JUn6PKi0KOPGrYJvtCEsApmcoDqAoAcAeqFaLaPaI6M6G6IvkpOOG4M+OoPkmsGTvsCLMcHTC1BcK-gEMmKILwG6vAMkEhLftkgpOyI2gBvCFyEiCiPyLTA0AcA4NoLVmLG1gNOqAlsIParwZ0kttFIcPYqYEKm4OHrUJ4NFPhs0HNoGORAfnuDBLxHBHZJaKoZ2CYHkKOHTJph9uRHoTYI4PVLoe3hyMUJmqdEuBYTxDZPxAhJZBqHYaSvIM9IlC4c+G4fyJ9hGhLEiEYP3sKOYdxNZHxPBPZMdpEfJJCmXgQgSI4DoEUIkX6MkYUmkQBMZJkVZBlKEfZI5K5O5BAAUU-APtCBUMtkFBsF0N+GoKoEiLTPHmcvTlmrKOlFYZlNlJAJ0cyM+O1GcHFIUEYOKvyDkCoGoLsVyGcEUBsNMkNCNBqPDIjNnoChXMiPkMZGKBCoPpsOIURGLKpEsNoMYHTGULUszKzOcddD5FcV7LksZIBE2nTF1MgQgAcNCOyG4FGoiv2JCKAuztrKcVAHrAbL3DAJfIsYgP2D+uUM-JGgYDLDpM0CCiiFRJoORFGu4KAsfBAmfCipaLiZAXwW2pSaUYxBUPCWiOsE9CyKREHqUGKLoAyeAqfFAOfKyUPJ4t4rfNPHiQ+DcU2pIjyebopq4HRJ8e-B-gYB4BKdiZAhfHKXAggkgsqR9E9DGBThpgmHoRLHkBQpIu8TCJ3P-skkwsgCwlaZoMRLUfhm4JpGIuUKoKHo7mUK-l4D8cog0ukoqVwTjNnphhIsDOkebiGVYn6MpMFJIk0MULurGfUj6R4uaS0laf6IiKxKvp0BiAcEMt0qMm2k8uoPTP-vsoclmMqQHAFM-I4GFCIn2I3B4PLBuh8WcArKrsqS0HkKCtGh3tHFClYh9HkOIoYOoKUG-H2M7gIBAO5MqeoDkE+IYI9PWRHOul0MmqRNyDIpoAHM7o5gJlBlOsqaHFqjmZcsiF4NbogEUMZOLiTgMocJsLuW5qenuS+Z6sqR8SKh3E0AYaLrLLyE9KSbkHLLGMxI+XRhdtwIeQSFvlRJIvYhyBsB2l4OOOYlua-kpP4e1hyuDt1t2eyZ0hRuLhKA4PULVoppIp0PkAinLG-KYEmAzqlgxczkxbasdv1lljlnljBdKtGVRHGvmXoeItFO3CyubooPIdmkzmrq7kdmlhqKdudgxnKDBVhkoAipSp4C0LQQgEoOtiTP9G4byJRqJTxi7pJbxtDrDlAGbPXojuZZZRIt4N+f+EYBsXckZMmkUlcvIISP-l5erilqiZztzgNnJRZSxULNyE4AttWdIiROyBTO0AFC5Z4G5R6Z5fpd5ZDnmlruib6blfeMKMKm3HVMZKYCujFV2v2iYA4IlSJVMaDuJQZd1gsa1fJBKOGYUAWc0H2DkBTCUM4DRQiG4G4IUInmACnkjFNcmVAQpK6dCFRMKJpH6CmtCmLiyh9K6QDJIs7s5OaFAHNFmHrG8AjmAFae0LcYUIUGKG4N4FUN9pUE4JcAOV4HoE0DXmdvXgjKnh0dNU-MsdCC0ErsHpcGiIHOQdTkZKuv2EBqNZxIEdBMfqfiqD2WGcBG-J4JpC1L+foeRKoKpAcIRO9KTNgUASAT9WmaOAcF4AiO0O-i+BGuHEtb-mrAEEAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./timerBaseRequest.typegen').Typegen0,
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
      id: 'timerBaseRequest',
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
                  target: '#timerBaseRequest.bluetoothDenied',
                },
              },
            },

            enabled: {
              always: {
                target: '#timerBaseRequest.clearingConnection',
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
              target: '#timerBaseRequest.waitingForConnection',
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
              actions: ['setPairId'],
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
                  target: '#timerBaseRequest.exchangingDeviceInfo.timeout',
                  actions: [],
                  internal: false,
                },
              },
            },
            timeout: {
              on: {
                CANCEL: {
                  target: '#timerBaseRequest.cancelling',
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
                  target: '#timerBaseRequest.waitingForVc.timeout',
                  actions: [],
                  internal: false,
                },
              },
            },
            timeout: {
              on: {
                CANCEL: {
                  target: '#timerBaseRequest.cancelling',
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
              target: '#timerBaseRequest.checkingBluetoothService',
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
                      target: '#timerBaseRequest.reviewing.accepted',
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
                      target: '#timerBaseRequest.reviewing.accepted',
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
                onDone: '#timerBaseRequest.clearingConnection',
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
                  target: '#timerBaseRequest.waitingForConnection',
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
        setPairId: assign({
          pairId: (_context, event) => event.pairId,
        }),

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
            onlineSend(
              {
                type: 'disconnect',
                data: 'rejected',
              },
              context.pairId
            );
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
          callback({
            type: state.isInternetReachable ? 'ONLINE' : 'OFFLINE',
          });
        },

        requestBluetooth: () => (callback) => {
          BluetoothStateManager.requestToEnable()
            .then(() => callback(model.events.BLUETOOTH_ENABLED()))
            .catch(() => callback(model.events.BLUETOOTH_DISABLED()));
        },

        advertiseDevice: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            GoogleNearbyMessages.disconnect();
            IdpassSmartshare.createConnection('advertiser', () => {
              callback({ type: 'CONNECTED', pairId: '' });
            });
          } else {
            (async function () {
              GoogleNearbyMessages.addOnErrorListener((kind, message) =>
                console.log('\n\n[request] GNM_ERROR\n\n', kind, message)
              );

              try {
                IdpassSmartshare.destroyConnection();
              } catch (e) {
                /*pass*/
              }
              await GoogleNearbyMessages.connect(
                Platform.select({
                  ios: {
                    apiKey: GNM_API_KEY,
                  },
                  default: {},
                })
              );
              console.log('[request] GNM connected!');

              const generatedParams = JSON.parse(
                context.connectionParams
              ) as ConnectionParams;

              await onlineSubscribe(
                'pairing',
                async (scannedQrParams) => {
                  try {
                    if (scannedQrParams.cid === generatedParams.cid) {
                      const event: PairingResponseEvent = {
                        type: 'pairing:response',
                        data: scannedQrParams.cid,
                      };
                      await onlineSend(event, scannedQrParams.cid);
                      callback({
                        type: 'CONNECTED',
                        pairId: scannedQrParams.cid,
                      });
                    }
                  } catch (e) {
                    console.error('Could not parse message.', e);
                  }
                },
                null,
                { pairId: generatedParams.cid }
              );
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
            onlineSubscribe(
              'exchange-sender-info',
              async (senderInfo) => {
                await GoogleNearbyMessages.unpublish();
                await onlineSend(event, context.pairId);
                callback({ type: 'EXCHANGE_DONE', senderInfo });
              },
              null,
              { pairId: context.pairId }
            );
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
                const VcReceivedEvent: SendVcResponseEvent = {
                  type: 'send-vc:response',
                  data: 'RECEIVED',
                };
                if (isChunked) {
                  rawData += vcChunk.rawData;
                  if (vcChunk.chunk === vcChunk.total - 1) {
                    const vc = JSON.parse(rawData) as VC;
                    GoogleNearbyMessages.unsubscribe();
                    await onlineSend(VcReceivedEvent, context.pairId);
                    callback({ type: 'VC_RECEIVED', vc });
                  } else {
                    await onlineSend(
                      {
                        type: 'send-vc:response',
                        data: vcChunk.chunk,
                      },
                      context.pairId
                    );
                  }
                } else {
                  await onlineSend(VcReceivedEvent, context.pairId);
                  callback({ type: 'VC_RECEIVED', vc });
                }
              },
              () => callback({ type: 'DISCONNECT' }),
              { keepAlive: true, pairId: context.pairId }
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
            await onlineSend(event, context.pairId);
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
        CANCEL_TIMEOUT: 5000,
        CONNECTION_TIMEOUT: (context) => {
          return (context.sharingProtocol === 'ONLINE' ? 15 : 5) * 1000;
        },
        SHARING_TIMEOUT: (context) => {
          return (context.sharingProtocol === 'ONLINE' ? 45 : 15) * 1000;
        },
      },
    }
  );

export function createTimerBaseRequestMachine(serviceRefs: AppServices) {
  return TimerBaseRequestMachine.withContext({
    ...TimerBaseRequestMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof TimerBaseRequestMachine>;

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
