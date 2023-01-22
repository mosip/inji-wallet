/* eslint-disable sonarjs/no-duplicate-string */
import SmartshareReactNative from '@idpass/smartshare-react-native';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
const { IdpassSmartshare, GoogleNearbyMessages } = SmartshareReactNative;

import {
  ActorRefFrom,
  assign,
  DoneInvokeEvent,
  EventFrom,
  send,
  sendParent,
  spawn,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { DeviceInfo } from '../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC, VerifiablePresentation } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import { ActivityLogEvents, ActivityLogType } from './activityLog';
import {
  GNM_API_KEY,
  GNM_MESSAGE_LIMIT,
  MY_LOGIN_STORE_KEY,
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
import NetInfo from '@react-native-community/netinfo';
import { createQrLoginMachine, qrLoginMachine } from './QrLoginMachine';
import { StoreEvents } from './store';

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
    shareLogType: '' as ActivityLogType,
    QrLoginRef: {} as ActorRefFrom<typeof qrLoginMachine>,
    linkCode: '',
  },
  {
    events: {
      EXCHANGE_DONE: (receiverInfo: DeviceInfo) => ({ receiverInfo }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      SELECT_VC: (vc: VC) => ({ vc }),
      SCAN: (params: string) => ({ params }),
      ACCEPT_REQUEST: () => ({}),
      VERIFY_AND_ACCEPT_REQUEST: () => ({}),
      VC_ACCEPTED: () => ({}),
      VC_REJECTED: () => ({}),
      VC_SENT: () => ({}),
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
      FACE_VALID: () => ({}),
      FACE_INVALID: () => ({}),
      RETRY_VERIFICATION: () => ({}),
      VP_CREATED: (vp: VerifiablePresentation) => ({ vp }),
      TOGGLE_USER_CONSENT: () => ({}),
      ONLINE: () => ({}),
      OFFLINE: () => ({}),
    },
  }
);
const QR_LOGIN_REF_ID = 'QrLogin';

export const ScanEvents = model.events;

export const scanMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYEMB2BiAygYQCUBRIgOQH0AhAGQFUCBtABgF1FQAHAe1gEsAXXlwzsQAD0QBmSQDoAjAqYA2AJwAmABxMVAFgDsAViY6ANCACeUgwfkrrWg2oN79SyQF93Z1JlyESFABiAPJ4tDjMbEgg3HyCwqISCAC0TmoyKipKOmp6GvlacnZmlgiS1rb2TI7Orh5eID4YMigANmBoAE68GFB4whhgKPHYYrD8aPxgMmgAZlOdABR41EQAggTkACJE1GsAmgCUWE0t7V09fQNDI5GisQJCItFJcgZyGUpyGkpfakr-NIlRBvFRMDKZXJyST6Jj-eredDNWY9CCXfoYQbDJ5+NakO7RB4jRKIZLldKSNRyKEaMEqPR6NSmCwg2k2AwaIxMbk1JQGJSeRGYGQojBo3oYrEjXH4uRRTg8R4JF6k9QyWrvPSSAGGPTfYEIb52dWc7k8px8gUNU6i8VXTE3HH4PEMNTymKK4kqw1aDI6TkGSS0+lBg1Fb7qr61f3QnIqQWNJEyDidMAcC69AAqXElNywxDwRAAkgA1IjbIglouF8hF0ghAkKuJPEkIXKyZSGJnUpQaf3M0pqId6GQaINFLnkrIJ04oa7Y3pYPDBUikIh4TNELaNj3N5WgV56JQyJhdvtfHKMzQG-4GHTyKk6NxvLQIxPCucOhdQGQ9AAKnRcFAqawLAWBjBMUwzPMYBLMuq7rpmRYruQSEALJEMEtCZscs7zoIvS-hgAFASBsA7kSLbetSHxGPkkjGHIR5vO8N7vOCMLSL22hjuoM5Jp+UqXDIggALZgFwACu-BLnihbUBRnpUQeiDOOkGh6r2ALZNYrEsm27y0SoMI6GCchMEUxj8cKYBiCgAAWmBQJcWxgAAbrwKBgEWGCzFwWBbEW+ArmuG6KXuzwqQg1iyHo9KmT8cIMsYN6ZPeT5qMY1R2Gy1nNLZDlOS57med5vn+UQAAaeAABJ4gA4uWWwrkQ4VKpF4gghUDK6Go5T5MZcgAgaDG6DIDEaeoOj6DGeUyAVjm9MVHleT5fngeMkzTHMCzLCFiHIRQ6GYdhuFJgtRW9K5K1lX5bVelFFRfBoTj6N8vbqD8qVPjI-rZFS6gAq9c0XUtV0lat5Uibw4lSTJeBybs93KZ1CA6NyMiGOZegWVkfKZCNCgjkw5RBkwGn-Co0JzamHlgAA7sJsBgO034ligWC0H+WxrJu5DEGsOArsj+6o8kNHjSotJauoDJONqI18ho6oGFLTG-JyJk0yVDNMyzjq9OzAVBfBoWZiLHVJMk03pMY-zTW8ALqHIhNMSepP8nyzgMQY2t04zhHM6zBFQEbOC7Ih5AlngFutuLp4yJaeRKOTR5xUxI3WB8JNaurqiglaQrNLTvC64H+tsxzZYEEWgT7OQeJbA3eCFn+mb80QACKtBEDg5usPcSmi1bbiY3FaX+keVOciNfbgs4WhaDkfZS37pcBz+QcG6HHNrC3RBtx33e9-37qUcPiD6Cov3Tfy5l2-6Bo6Ex4LGU4gbaNykh6GvZebxXIcjYI1IPJWO1ExyJyHP9FOWQ5A6H5IrDQHw8hjiUHqVWSC1C-w3jILelcsCZmCPVeqqxyDhCIJseC4dSCn0HhFOObxwT0WkPoQwd44F6BGjob+ic0HGSPAxAGvtrRJhLn-FomAvKtFaJcDakFtowTgojagqEiwYSwjhE4oidY4KRFImRvQwFRXMk4dUZpVbmUkJ9DQXCijqm4Zlb+mQU46GwXrMUlwjaBWCghMKA9CRD0tiCDKKs4r-CSgyGET8owyFyGaJ8Kc3BuPLh4w2Vc8DN1bpubc-imztVbGoMa01TLQiyFYlwkholUjMa4Z2qhqjJP-qkneWBo4dwAFKIS3EY1GtIPhuDNN2Kx0IlBP1MiOfk-VtRFEyI03BYBmnsyIiRYCcAwIQS2tBXaOA6o11IPVVR6jTpaOFGInBzNFkoGWYBVZoEelJEBJjZ+fYiZxUDF9fSt9lYuOUFSXGug5kXLtEssSElpKyRAUjXJu58neiprIKW2RnmaB5AYMZbxxp3lPNURkCg3ynDOcJNAKAvIcCmBAY2OA0JBQiNC8+QSygRl+dUSm+Qc5Px+B2aaxg3BalPD-ERpydHCVTAAKxuJASl1KcC0rPoE1s1IwS-WyHkKxzzTw2P0iZWQ7zKQF2MNIOZblYK8FmOYS4RYIALMEPwcwWBAh73LCWNY1Aiw5LlfQ70Pt5CUmfkDLIug0WfKKPeRwnJVCFNPPGQVxdhWEWNd0M1FqrUYBtXah1NY6zOtde6uhsLjFHnVGCKk0JHCBs4cGoaJ4uxggDJlLBMaZCEvjSapNvRLXWoEHa4BoC6Xyu9LkEckgFCcjgSTRw38g2lCDIyDIFlpqUicFTLUcyUCpkmJ4jgWAIDCGmD0NyXAADW0wCVxp-GujogCOAIH3VwdAtxWD3MQFeWJZlybsPfmoJ+cDr5BjsL8RxfJV3rqvVgWCgFOjJlaJMPynRRK4O0f7YSF6N2G2vbe+9TxIhPoQIyWQIyARPmfpoBks8q1aFyACb+TFAzCKLk2s9RE3JoBkRADtqau1SppTh1IbtoRFC0NirUfVZ5KtxlSL4YIiNzP3Sx3gbGU1pvzEQTMBB67V1rtWXmh0cO9hPJyF6Ybn6q0ME-aooahy6ABKOow+KkxolQPhSV3jpWyrzQ9VGfIRz+mLUybhL1jI3jQeCEmKrMgkyYnYOasnWNcZlTh5+19zHwMZEePklT9LfAZL9OeONTLf2HQK+jDkhiHsuNQO9G7hA4FgjdFo9lSuXBwJBSSYFqChG0yhMgawaDdL7Z6qKvGRzqGxaZSzVmK2lHMjkItkSNIhv0HZj8DWUBld6BVzD1XaulXq413ozXJitawO1hGSEULeJ66sXNASBti39H6bh99l1HgsgaKmtsmT-CnlJ1xjaSurfK5VkYNXOh1dTAAR0knAEO2YiAYDQAAI3aMdjrZ2KDdd69dvJHnXg-TQb2DKLzvjkze84eQTErG9lVjCL4c1-tragBtqrGAQdg7AJD6HlxYfw6R2AFHp3DrbCCpdvrHr82oxyLIF6-ntDjPfgORAPx0h6hJsZVWYI9RLeaPTwHm2Wfba8rtgHvQ-ywVErwUCOITudfR6QEXWOYU4+CcefH55NDP2J5qqb2opfDr7IYLQiTC7vm1ythnTPgcG+mDrk3ZuLd8GEPzm3QucD24S9SDIgY7BMj5PoRwYZMohc-qoFOX9fvFbD7r5nrOdsOcR+0Cl1u0dHx7n3BLpivi6lUHqOKeQDR5HBNw9hnsGRwIbRXvbjOgdPBr4blNpcKVrD-H+ZuSEywJfgZjO8uo7Bqz0lNjV8gjDmU1IxbUdPK-ren1t0HteFkL6T834gx82-9fF0kNLJ4SPZAp24QLmXqgbA0F+o0EkEdItcjcGdSAwB+B6YuBOhD0sBghAhAhXU1wcNClr5Ch8h8dUtrx9JMoU5fo4F3gkEpYacICY8oBoDYD4DECVw0DWo38ncUhTFwwtJNRpBh0XYCDQRE5EsNIepi05ouBZhZgDE+cXNuNmCUYkh+RwRDBi1F5wkFcfRst+xyZVAshlAmJPAGgMAuArV4Bogmh3NZDSRTIQscgkVHZCkqQbxMpE47A74sgyCAxot4dsRjUzCL40Zxpv5tJOxNByhfgxkbAGIGIewnwxxn46dzhugJR8IUZ6UFU7xfp-gNIJorExx8CpsUtYlHB0s+Q4QNI5pbR0QkjRYUjqI+M+xVYhx0YzQ9QwwcZjxchaRh1HB-h8c5oUw0wMwoBsxcxhgfCGVkh8hE4mInxSZnoYoHCfo8hPcSCqR+Q6ckjehRi44ORYlGRiNoQnA4RQwCDJ1RxuEYQ7B0Y+xKD1ifx-wbkyJNjvR44djuwqRKQjA+oXo2JzJTiuItByC+I-sbjoZYZpJHiop0YgDGRs8hppimRvimEzjuIATx8Q95o7JFpnJwYbo1ouBwTUYRxnpXo9QfhaRNBRkCCsYMgfhEs+poiGQQYMTLooBrpSpcTrlSI1l8TXhClxptBsgGJuEpY1cbwcCcsBSeohxtQNBGTCowYWSIZbouAQSwV+BuSpArFMYXpNBAxYxITvpjxEUcgihARgZG1m0oB1TWC+QfUBNuQcZhMMtp0hwbAhoB9XAU4JNAUAFPEUArSq1AQXASYnxuR-gRpkp9NlBR0eoIjV1JEWYDFLSbt39EBdARxWijxaQXFqRFZ+QnlGQNVyZPty80SLT5lLkrSARE4c4qNqhEonTL5fV5Asoh9il4FvTLkOTbljDsdzDDQfiU4Ai+o6zBywjvksoARzIZkSzT0kMUlgUrlQU4YrTaN1RtQo0BN-ceDSgvlqz0ZJz-kZzEN14iUSU0xyUrTgii0WEJp8hIsKSdycZr4FBCl4ENJHAaM5kxUJUIB-TCkdVh0cUhomQ7xEEFCANTRBNPS5l4cPIoBUNBiuAaouBxJLyIET9Txewp5ikp1L5YEMgyZTxFVAYjVW1zV21FMu1LzTJMYXFshMg1I4pVC1V+kOR3cXoKN2zzTGMUMr0rS9QkttRkoUsBlmKpZ0gjB9ADjuR5s6NSzGMYt5N2M00rTxZn5fogxVBCt34vgHypB6RjwGIBk3ljAGQis0SHNBIfzKz0ZiCmJSSrxoQvdEBB10yKcElMpvgjzhRFLfzkyWDl4NKkFtA7w9UrEwwylmza1DjpAwRg9ZxL8p89dZ8wBVLbwMhMo8t1BMD9ADQNZ3YhpyhrBLQAQL9J8I8Z8o9ICmsWsezHc+yhtMVlBuEep6L9R9I2E1zCrqQ-MQqyrjckrq8qqIcodxgucuA4d69Ur-K+zsgx5KQLJsZuEdJ+8KhdTnwGj0YAU-tEqKqb86sqDTc4N49kj+1jFyYcs35w1OVcYwxqgEUzRtChSZ1+rw9r99db858Lcpq-LezfCcZ0hdBEoXBPogxVCepeEPyrFPK9RXqq9I9Prph59IBKy8zqR3hhTXwrFcL+zMgCji1nA7xaRuE4begaC4CEDVK8hE5x5jSXT0ZSMCDQsMgSCZKBlZlG1RDxCehpq-qGVnB544ogwQiGKxwbxlBB8SDvgBMKC9D3AgA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
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
      invoke: {
        src: 'monitorConnection',
      },
      id: 'scan',
      initial: 'inactive',
      on: {
        SCREEN_BLUR: {
          target: '.inactive',
        },
        SCREEN_FOCUS: {
          target: '.checkingLocationService',
        },
      },
      states: {
        inactive: {
          entry: 'removeLoggers',
        },

        clearingConnection: {
          entry: 'disconnect',
          after: {
            CLEAR_DELAY: {
              target: '#scan.findingConnection',
              actions: [],
              internal: false,
            },
          },
        },

        findingConnection: {
          entry: [
            'removeLoggers',
            'registerLoggers',
            'clearScannedQrParams',
            'setChildRef',
          ],
          on: {
            SCAN: [
              {
                target: 'preparingToConnect',
                cond: 'isQrOffline',
                actions: 'setConnectionParams',
              },
              {
                target: 'checkingNetwork',
                cond: 'isQrOnline',
                actions: 'setScannedQrParams',
              },
              {
                target: 'showQrLogin',
                cond: 'isQrLogin',
                actions: 'setLinkCode',
              },
              {
                target: 'invalid',
              },
            ],
          },
        },
        showQrLogin: {
          invoke: {
            id: 'QrLogin',
            src: qrLoginMachine,
            onDone: '.storing',
          },
          on: {
            DISMISS: 'findingConnection',
          },
          initial: 'idle',
          states: {
            idle: {},
            storing: {
              entry: ['storeLoginItem'],
              on: {
                STORE_RESPONSE: {
                  target: 'navigatingToHome',
                  actions: ['storingActivityLog'],
                },
              },
            },
            navigatingToHome: {},
          },
          entry: 'sendScanData',
        },
        preparingToConnect: {
          entry: 'requestSenderInfo',
          on: {
            RECEIVE_DEVICE_INFO: {
              target: 'connecting',
              actions: 'setSenderInfo',
            },
          },
        },

        connecting: {
          invoke: {
            src: 'discoverDevice',
          },
          initial: 'inProgress',
          states: {
            inProgress: {
              after: {
                CONNECTION_TIMEOUT: {
                  target: '#scan.connecting.timeout',
                  actions: [],
                  internal: false,
                },
              },
            },
            timeout: {
              on: {
                CANCEL: {
                  target: '#scan.reviewing.cancelling',
                },
              },
            },
          },
          on: {
            CONNECTED: {
              target: 'exchangingDeviceInfo',
            },
          },
        },

        exchangingDeviceInfo: {
          invoke: {
            src: 'exchangeDeviceInfo',
          },
          initial: 'inProgress',
          after: {
            CONNECTION_TIMEOUT: {
              target: '#scan.exchangingDeviceInfo.timeout',
              actions: [],
              internal: false,
            },
          },
          states: {
            inProgress: {},
            timeout: {
              on: {
                CANCEL: {
                  target: '#scan.reviewing.cancelling',
                },
              },
            },
          },
          on: {
            DISCONNECT: {
              target: 'disconnected',
            },
            EXCHANGE_DONE: {
              target: 'reviewing',
              actions: 'setReceiverInfo',
            },
          },
        },

        reviewing: {
          entry: ['resetShouldVerifyPresence'],
          exit: ['disconnect', 'clearReason', 'clearCreatedVp'],
          initial: 'selectingVc',
          states: {
            selectingVc: {
              invoke: {
                src: 'monitorCancellation',
              },
              on: {
                UPDATE_REASON: {
                  actions: 'setReason',
                },
                DISCONNECT: {
                  target: '#scan.disconnected',
                },
                SELECT_VC: {
                  actions: 'setSelectedVc',
                },
                VERIFY_AND_ACCEPT_REQUEST: {
                  target: 'verifyingIdentity',
                },
                ACCEPT_REQUEST: {
                  target: 'sendingVc',
                  actions: 'setShareLogTypeUnverified',
                },
                CANCEL: {
                  target: 'cancelling',
                },
                TOGGLE_USER_CONSENT: {
                  actions: 'toggleShouldVerifyPresence',
                },
              },
              exit: ['onlineUnsubscribe'],
            },
            cancelling: {
              invoke: {
                src: 'sendDisconnect',
              },
              after: {
                CANCEL_TIMEOUT: {
                  target: '#scan.findingConnection',
                  actions: ['disconnect'],
                  internal: false,
                },
              },
            },
            sendingVc: {
              invoke: {
                src: 'sendVc',
              },
              initial: 'inProgress',
              states: {
                inProgress: {
                  after: {
                    SHARING_TIMEOUT: {
                      target: '#scan.reviewing.sendingVc.timeout',
                      actions: [],
                      internal: false,
                    },
                  },
                },
                timeout: {
                  on: {
                    CANCEL: {
                      target: '#scan.reviewing.cancelling',
                    },
                  },
                },
                sent: {
                  description:
                    'VC data has been shared and the receiver should now be viewing it',
                },
              },
              on: {
                DISCONNECT: {
                  target: '#scan.findingConnection',
                },
                VC_SENT: {
                  target: '.sent',
                },
                VC_ACCEPTED: {
                  target: '#scan.reviewing.accepted',
                },
                VC_REJECTED: {
                  target: '#scan.reviewing.rejected',
                },
              },
            },
            accepted: {
              entry: 'logShared',
              on: {
                DISMISS: {
                  target: 'navigatingToHome',
                },
              },
            },
            rejected: {
              on: {
                DISMISS: {
                  target: '#scan.findingConnection',
                },
              },
            },
            navigatingToHome: {},
            verifyingIdentity: {
              on: {
                FACE_VALID: {
                  target: 'sendingVc',
                  actions: 'setShareLogTypeVerified',
                },
                FACE_INVALID: {
                  target: 'invalidIdentity',
                  actions: 'logFailedVerification',
                },
                CANCEL: {
                  target: 'selectingVc',
                },
              },
            },
            creatingVp: {
              invoke: {
                src: 'createVp',
                onDone: [
                  {
                    target: 'sendingVc',
                    actions: 'setCreatedVp',
                  },
                ],
                onError: [
                  {
                    target: 'selectingVc',
                    actions: log('Could not create Verifiable Presentation'),
                  },
                ],
              },
            },
            invalidIdentity: {
              on: {
                DISMISS: {
                  target: 'selectingVc',
                },
                RETRY_VERIFICATION: {
                  target: 'verifyingIdentity',
                },
              },
            },
          },
        },

        disconnected: {
          on: {
            DISMISS: {
              target: 'findingConnection',
            },
          },
        },

        invalid: {
          on: {
            DISMISS: {
              target: 'findingConnection',
            },
          },
        },

        checkingLocationService: {
          initial: 'checkingStatus',
          states: {
            checkingStatus: {
              invoke: {
                src: 'checkLocationStatus',
              },
              on: {
                LOCATION_ENABLED: {
                  target: 'checkingPermission',
                },
                LOCATION_DISABLED: {
                  target: 'requestingToEnable',
                },
              },
            },
            requestingToEnable: {
              entry: 'requestToEnableLocation',
              on: {
                LOCATION_ENABLED: {
                  target: 'checkingPermission',
                },
                LOCATION_DISABLED: {
                  target: 'disabled',
                },
              },
            },
            checkingPermission: {
              invoke: {
                src: 'checkLocationPermission',
              },
              on: {
                LOCATION_ENABLED: {
                  target: '#scan.clearingConnection',
                },
                LOCATION_DISABLED: {
                  target: 'denied',
                },
              },
            },
            disabled: {
              on: {
                LOCATION_REQUEST: {
                  target: 'requestingToEnable',
                },
              },
            },
            denied: {
              on: {
                APP_ACTIVE: {
                  target: 'checkingPermission',
                },
                LOCATION_REQUEST: {
                  actions: 'openSettings',
                },
              },
            },
          },
        },

        checkingNetwork: {
          invoke: {
            src: 'checkNetwork',
          },

          on: {
            OFFLINE: 'offline',
            ONLINE: 'preparingToConnect',
          },
        },

        offline: {
          on: {
            DISMISS: 'findingConnection',
          },
        },
      },
    },
    {
      actions: {
        setChildRef: assign({
          QrLoginRef: (context) =>
            spawn(createQrLoginMachine(context.serviceRefs), QR_LOGIN_REF_ID),
        }),

        sendScanData: (context) =>
          context.QrLoginRef.send({
            type: 'GET',
            value: context.linkCode,
          }),

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
            return {
              ...event.vc,
              reason,
              shouldVerifyPresence: context.selectedVc.shouldVerifyPresence,
            };
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
                    JSON.stringify(event).slice(0, 100)
                  );
                }),
                IdpassSmartshare.handleLogEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Sender.Log>',
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
            return [];
          },
        }),

        setShareLogTypeUnverified: model.assign({
          shareLogType: 'VC_SHARED',
        }),

        setShareLogTypeVerified: model.assign({
          shareLogType: 'PRESENCE_VERIFIED_AND_VC_SHARED',
        }),

        logShared: send(
          (context) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context.selectedVc),
              type: context.selectedVc.shouldVerifyPresence
                ? 'VC_SHARED_WITH_VERIFICATION_CONSENT'
                : context.shareLogType,
              timestamp: Date.now(),
              deviceName:
                context.receiverInfo.name || context.receiverInfo.deviceName,
              vcLabel: context.selectedVc.tag || context.selectedVc.id,
            }),
          { to: (context) => context.serviceRefs.activityLog }
        ),

        logFailedVerification: send(
          (context) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context.selectedVc),
              type: 'PRESENCE_VERIFICATION_FAILED',
              timestamp: Date.now(),
              deviceName:
                context.receiverInfo.name || context.receiverInfo.deviceName,
              vcLabel: context.selectedVc.tag || context.selectedVc.id,
            }),
          { to: (context) => context.serviceRefs.activityLog }
        ),

        openSettings: () => Linking.openSettings(),

        toggleShouldVerifyPresence: assign({
          selectedVc: (context) => ({
            ...context.selectedVc,
            shouldVerifyPresence: !context.selectedVc.shouldVerifyPresence,
          }),
        }),

        setLinkCode: assign({
          linkCode: (_context, event) =>
            event.params.substring(
              event.params.indexOf('linkCode=') + 9,
              event.params.indexOf('&')
            ),
        }),

        resetShouldVerifyPresence: assign({
          selectedVc: (context) => ({
            ...context.selectedVc,
            shouldVerifyPresence: false,
          }),
        }),

        onlineUnsubscribe: () => {
          GoogleNearbyMessages.unsubscribe();
        },

        storeLoginItem: send(
          (_context, event) => {
            return StoreEvents.PREPEND(
              MY_LOGIN_STORE_KEY,
              (event as DoneInvokeEvent<string>).data
            );
          },
          { to: (context) => context.serviceRefs.store }
        ),

        storingActivityLog: send(
          (_, event) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: '',
              type: 'QRLOGIN_SUCCESFULL',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: String(event.response.selectedVc.id),
            }),
          {
            to: (context) => context.serviceRefs.activityLog,
          }
        ),
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

        monitorCancellation: (context) => async (callback) => {
          if (context.sharingProtocol === 'ONLINE') {
            await onlineSubscribe('disconnect', null, () =>
              callback({ type: 'DISCONNECT' })
            );
          }
        },

        checkLocationStatus: () => (callback) => {
          checkLocation(
            () => callback(model.events.LOCATION_ENABLED()),
            () => callback(model.events.LOCATION_DISABLED())
          );
        },

        checkNetwork: () => async (callback) => {
          const state = await NetInfo.fetch();
          callback({ type: state.isInternetReachable ? 'ONLINE' : 'OFFLINE' });
        },

        discoverDevice: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            GoogleNearbyMessages.disconnect();
            IdpassSmartshare.createConnection('discoverer', () => {
              callback({ type: 'CONNECTED' });
            });
          } else {
            (async function () {
              GoogleNearbyMessages.addOnErrorListener((kind, message) =>
                console.log('\n\n[scan] GNM_ERROR\n\n', kind, message)
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
            console.log('[scan] statusCallback', status);
            if (typeof status === 'number') return;
            if (status === 'RECEIVED') {
              callback({ type: 'VC_SENT' });
            } else {
              callback({
                type: status === 'ACCEPTED' ? 'VC_ACCEPTED' : 'VC_REJECTED',
              });
            }
          };

          if (context.sharingProtocol === 'OFFLINE') {
            const event: SendVcEvent = {
              type: 'send-vc',
              data: { isChunked: false, vc },
            };
            offlineSend(event, () => {
              subscription = offlineSubscribe(
                SendVcResponseType,
                statusCallback
              );
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

        isQrLogin: (_context, event) => {
          let linkCode = '';
          try {
            linkCode = event.params.substring(
              event.params.indexOf('linkCode=') + 9,
              event.params.indexOf('&')
            );
            return linkCode !== null;
          } catch (e) {
            return false;
          }
        },
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
export function selectQrLoginRef(state: State) {
  return state.context.QrLoginRef;
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

export function selectIsSent(state: State) {
  return state.matches('reviewing.sendingVc.sent');
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

export function selectIsShowQrLogin(state: State) {
  return state.matches('showQrLogin');
}

export function selectIsQrLoginDone(state: State) {
  return state.matches('showQrLogin.navigatingToHome');
}

export function selectIsQrLoginStoring(state: State) {
  return state.matches('showQrLogin.storing');
}

export function selectIsOffline(state: State) {
  return state.matches('offline');
}

export function selectIsDisconnected(state: State) {
  return state.matches('disconnected');
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
          if (status === 'ACCEPTED' || status === 'REJECTED') {
            GoogleNearbyMessages.unsubscribe();
          }
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
