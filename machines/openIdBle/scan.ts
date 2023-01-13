/* eslint-disable sonarjs/no-duplicate-string */
import SmartshareReactNative from '@idpass/smartshare-react-native';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import OpenIdBle from 'react-native-openid4vp-ble';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { DeviceInfo } from '../../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC, VerifiablePresentation } from '../../types/vc';
import { AppServices } from '../../shared/GlobalContext';
import { ActivityLogEvents, ActivityLogType } from '../activityLog';
import {
  GNM_API_KEY,
  GNM_MESSAGE_LIMIT,
  VC_ITEM_STORE_KEY,
} from '../../shared/constants';
import {
  onlineSubscribe,
  offlineSubscribe,
  offlineSend,
  onlineSend,
  ExchangeSenderInfoEvent,
  PairingEvent,
  SendVcEvent,
  SendVcStatus,
} from '../../shared/smartshare';
import { check, PERMISSIONS, PermissionStatus } from 'react-native-permissions';
import { checkLocation, requestLocation } from '../../shared/location';
import { CameraCapturedPicture } from 'expo-camera';
import { log } from 'xstate/lib/actions';

const { GoogleNearbyMessages, IdpassSmartshare } = SmartshareReactNative;
const { Openid4vpBle } = OpenIdBle;

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
      CANCEL: () => ({}),
      DISMISS: () => ({}),
      CONNECTED: () => ({}),
      DISCONNECT: () => ({}),
      CONNECTION_DESTROYED: () => ({}),
      SCREEN_BLUR: () => ({}),
      SCREEN_FOCUS: () => ({}),
      BLUETOOTH_ENABLED: () => ({}),
      BLUETOOTH_DISABLED: () => ({}),
      GOTO_SETTINGS: () => ({}),
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
    },
  }
);

export const ScanEvents = model.events;

export const scanMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYEMB2BiAygYQCUBRIgOQH0AhAGQFUCBtABgF1FQAHAe1gEsAXXlwzsQAD0QBmSQDoAjAqYA2AJwAmABxMVAFgDsAViY6ANCACeUgwfkrrWg2oN79SyQF93Z1JlyESFABiAPJ4tDjMbEgg3HyCwqISCAC0TmoyKipKOmp6GvlacnZmlgiS1rb2TI7Orh5eID4YMigAFmAoANa8GFCUADYArmD8XFz8rThgAE4AbrwoYC3tXT1QWDS0RAAqwcHbABLkZACCNEQAIpGisQJCItFJqXIyWhpqqnIGSmrqCpIlRDJHQaTzedDNNodbq9AbDUbjSYzeaLZbQtYbOg7PaHcgXACSODO1Eu12it3iD1ATzULzeHxUXx+fzkAIsiB+MgMYMaELRq1hQxGYwmUzmCyW0zAAEdhrBBL1MVtdvsjqdzldWDceHcEo8gc4ZLSdAYikzfrS5ICEHInDymvyYX0hQjRciJTIpbK4Ar1ptsaq8YTiaSteSdZTEga9Ea5Cazd8LQprXINDHuQ0HVCBc74SKkeLUWAMGgAEb9SBYMmcCP3KMpVPpPRx02MxN-a16FQx1QGE2mnSSJSOe188t5xEXYu8SsAcX2wXIOB223xpFnETDNbidf1DaUGhkPyYek+7dp1qMenSg60J9tmQ+o8wLQraGmazwwgwHUpWDwwSkKQRB4KugF4kQODbAQwQAJqhlE266lS4iILaOivNkuTWHkjgHnoKYGN2Mg6Doca-IYyhpqCmZ8gAZj0ECft+v73H4JykNWMS1nq1JAkoTBHseGhKHGzZDnIBHsja+Q2F8GhyMezY6NkKjPs0DEYExvRfhgP4oH++AcQwciIdxO68ahNoGLIJ4uIpHzOMYBgaCmuiCUOGhDreB6SEwNHgi+mnaVAun6YZeDGWoZkUrufEIGoaiCToJ7VF2qiSIpSjWkleiCdew5qEOBUiepMgcFKHDvms2xcGFv5YMQeBEPiABqRAQa1+LNeQa4hFxsWWUkrIqFy4nNqJeQpayOVFTYtKZFRKgFBmgWQixBkYgBQEgdsCHahZKHDaeMgno4GgqeR16aDlw4YbacZuPJTD1GtLQbb6Mg9AACtMXBQFKsCwFgYjymg-BLGgdEQ9MAAU23AaB+LgauACyRDBLQ2wAJRYFmH1rF9GC-f9gOwANPFHWhtJcv5XnGJJonWFa0lOHIHmDp52heeoZUoATvQyIIAC2YBcIM-D-hxzXUBTh31s46RpopIkfP2po5aaLxEZIpEqEw7NFMYZVgGIbSYFAaxTiiYD4hgdFcFgBL4IBiPbHLyEKzZMhdi4y0CbkeWmKzmQYSpSUpURLl2CbZutBbVtgDbdsO1gRAABp4AcHGzh1FyAUQHuRnuXw2HoXY5OU+QqJlPzWn5ugyH5abqKRLgKbH5u9Inyf247oP8ODkPQzM8Ou7tyMUGjGNY7jDqm13lu9NbEop1wRdxVZFSie8fbNiJGjqCJOW6EoJEiTkRQfIlfad-H3fL0nq990LvCi+LkuRaQMsb0NiApflU0qUihKGHJkeuCgYwvRsm8AqjJXq8hfFKeYYAADuhNYBgArJtXorUUBYFoN9C4Jw9rkGICcHAgFf5UwbDTSQy1uz0MDk4Ic9dhyHmsMtRmB4bKkTKsgmc6DBaYOwb6PBTtCQI12tQ+swIcinRyNkMi54WalEypJU65RyigJwn5VaiDmgCLQRgrBrFcH4OXCSUC5BWp4BkXuZI7MezfDyAJNMSguySXrszTRehMqnjPFkfhT9jHCNMTgqA4j2oEHxIEWC5AOIXASXgZq31thkKIAARS2FBex8VkhuB9l2UOIJTyMg0AYeuF1BLODeMYTQOhlrBJQUIqAMgRFmMifgk4KSiBpIydkyC7stzmU9nufQo1SImlEkwepIJrRkTyhkSQTgbLaFmZIPQzTBEmNEWscRX8f4jMGjQ1Msgfhqw+NoUS0y2EKR9vkYqXwuFqG2aEtpHSIniN2LOWcJJyDhCIAQcg21lykGGTFSmsiviCUedIfQhg+xiXroOHsHia6nj8gtfRDojGtJaJgRY-R+gYgHkPGQUMYbw2lkQag5Bp6YxxnjPkeLCYQiJSS3oeSrLsycLTWZRF2ZMPyCiooXJBxJU2ZkASOg3n4swVpfZ+DnZSNAty4a4cuTOHUAHcufjg6lEuvNPKsyVICTcHKkxirzFYFsck1Je1NSQvlnuX4Yc9YjTcN2QcCyfja2MGU2kqhqiWrCdarptq8AZIAFK7X2uGF18VD4vDcLMpgagyL0NZNlaSet0xuBchJTIalaJIJCfK4sIU8FExJgDOAwMyUQwpSPOGOBs4xPXPS-E6NGVzxZeWq1VaUA1r+nWoG6rEDXx9mRC6kCuwwJzYak0h4ZXKFpAbUOoaPmVqVa-d+Espbf1pROhA8CMgXxnZoAVlTc3KKbn2VKit-hbopSgRYHAIYQAkTgVGhJNzOrGfFTKh413VAZPkF6UlDUiVsqRYwbg-F2RfVKAAVr+Ssztf04H-QdQDPLfjJWyHkehM6TyuWkrrQcXJJBeVpERGV0gX2zBmLwOi5g1j4ggMWQQ-BzBYECD0jqrUTjUHxE63DxcgPVHkCssiFysi6BvYaooGFzrfHUPrLsTGWNsY41xjAPG+MCZ6muYTonxMJrw8dM+RF03-EcIpqD-8FBnzOgRipjh03aY-Lp3onHuMCD44c49xyoWuvLk3BQFS4zQKKoYKp14MgG1IispwjI-EvpQFKcG+yOBYAgMIJYPRZhcE6EsXFA7BZZbADl3BHAEDFa4OgSkkQT3XSNPrdmFSyKrLUAsuMo0aN2FAZK4cmXstiLyzMP60xyr9HBg7aYwt2n9paWyibuWGsYBK81+4rXQuJqsteWQ2afgqR62mJzZQFJny0LkH4mzJI2RxatnZgtitoBJRAfzBnAvfqwzhyzkmrLPBjKyIod48p+KKlU-Wp0r6KSNudl9H2vs-cM41HYBB4nRNid1Ehk8T0HlOhU3eDTnnxdzdUVTiVT6aFNEYBBDomKoA+hhwkAOieGhBPrRKKX3g11uksl6RHFr+JjqW5oqPeBfsw3+k9ORRqiVyCNRWNdyOlCSopH28C6h2CHC9l82YnTUCazl4QYobaOjWDgQe-BBjA2oKEAn4F1Qkgs0hYHNINHqFSo02np8rvs3kURcuNHmy6H0Ezvkxu1im92xb90qJY+9Ft+DB3WAneRTAhQZ2IYPejK90CEEGQUvs20JJU8BtrSMnSOmxRZT9Z8Ml9b3o8fzcYEtx6L0cpfS1SICWcsYBM-O5z8cUg+eT2PSPKeC6PxZ2pn8jXw0kD6E8JrpdPmKwTdm8pF31EPefQ1S4APssFYR-Z8nkGIkGoFdFVeBmmj2hGnXmsAaxAqsfZCprkRTTrIt-oht6773D75LAp5QDfQzDCy8BAxsRZ4u4UBu7xqe6bwapnweIHjhwL5vAphDiyBeSpj6AuTKDKBKAAE5jt575J5gHb5rCQFLYwF8DCAX4IHX6T4HZWbObpD652AZp3SGB9bSS2izKnTrKqACQbKyot7gGUEgHUEyAs5n6VjwFj7ECDK5IcFF4IA5A2CTTOCqDNi+wa6IB5DJTlDKKgLlzkTkE74J6d7yH6YzhfonDfTfTJKrjtQK4mg+x7zapEQKQaxCFkbyBGDsymhBzZo2Fx7AGJ6FhLCOHKGj5X5qE5IQoSaoEmGgKnSaCniLJ4GC5BHbx+IuQeI3Ymj1ANAYBcBcbwDRBNDpF-wpCNKCT1JKLmgdjSSpDC5pr+TVB4QBFlQ9BoCbTMYNE0IYTSCnhXIeKaDaKLr-zeF+R+S2jZC+RkRRGCgThuhxFjGyKkR16KKkTtEXidGsg2CNLFo-ASE-AbG5jCiIigGt5QC7EOIkYKJqwWFJiXjKBHh2D9hxgG5JSG6Qi0GbH3HbFW6H7yhrAvH5JvGtFHEqLWgHiHhFB9jMyDiFS3FwjgkFhW7FhKEQCwkg7wmHGfEdGlAiRK5-EYmAllTji4lTgYBOHElPD7HvFtFInSRAI2Dq6zLNi-A6p8xvgfg6QEyWQnL1hfBhwfBpjNz0K0bGE2gmgxhpDDgG7ppphlTBTMR6SsQSlhbxSQLyAXRER849HNgph5Rny5CHyZSOAfAYFlQVRgBVSilQC1T1QGSslAi6znqHx+I1ylFuDv4JTrLyBFSST05+JfCvLSECzPFA4ZEpAuRGjXg9ashODpo0Y5SbI2AXTSDfBLGpgWrxl6kRIjqkz1o+kNiCS5AZoPQrJGBFTvCazsyvCcwHjcxMJ8wJl7piwSw1mRwz6-COCKQqSyZtmwqdlaDLQ9kt4Lz3xLxQAryLBrw1k9iNh7wlmHyaDzEJSGAvD+w6GZB5R+RSFvSLkJyPy9wOyVljq1EoGNEPhNzXKDjGAKk-45T5BnwgjZCbJdiJSeR3zXkrlPxrkvwiwDn8A1nSCjR5CJQVKZSUbVAnwqTnpYRXwXK3wt6sq9A1mpDDgyYQ78kngrJshqJszyDoomi-C1zAmeiVbbp7LmI1na7XwuAvQqSzIfD1zlwtFaA8KV41wvSZaEpYKcqJlPk0K6AxjWmz5ZAMyCFqLDhnwuDXhkb+QZoZovoKpDo1mcgCSbIPbVAiQvQLKybyDGDVAvTKB5ABQGKMVrZhpDr3lkxsXtlGVTF6JmUUULGpmrp+obq6C6U7rmL9kfw1nPbUYCSeLLQXSWm3oBXWVBVFAhW4VMWvrvqfo1mzFcg1y6zNz5CSRZALJ5SjQKBuouQCFPbIZgBoYGSQBsV0XUZhETQZp9h3L5QjYVK9EkFxlvR4VtIljzBQC1YelcAHBcCiy5VeRWVXj4SqBTJKb-xZBHlP73iClPgZXOVtLMY+bsZ+b6aGa5WNI+wyqqR2DXgVz1y6ApouQNLvB3YmjjY1aTYblioi78UqmpqhkKnpBGD6BZmzLKwMVDVEyzCfYy7o6BYEVxgvA+Q1xRnWCiT7n0InR+SprzoBrlxlQs78zlk5VJmNHZDJSQIHzXSshKmBxyWSS6wjYGwXSDHbZQ1EnE00LlB15BxXGKTMybI5TT7rL9ibK5TR5G6glQCyGxE2wEWOQZC5TGDqCCn6DInE4vQqxXplKGC3FS32FxFPFp726PmF7Jmg73rKCorpSNKpidgVA2SKSZR84pQS5vQyExF62Qkyi97H6n5D4GUYRh5a5OKYkmi202D21PRO3P463u2PHgH0HQGwEGmHbDT+Tnw1z04HippFApjVCyD6yzKKWDjq5bLSES262PGKFD5s3SX1h5TcF-knj+5eQXSdhdhCRjlMIGzNgx12GV3ThNXs31iqURmtiHxaBwUrU2hpVGi2ZOCGA86DieCeBAA */
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
                  target: '#scan.bluetoothDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkingLocationService',
              },
            },
          },
        },
        bluetoothDenied: {
          on: {
            GOTO_SETTINGS: {
              actions: 'openBluetoothSettings',
            },
          },
        },
        clearingConnection: {
          invoke: {
            src: 'disconnect',
          },
          on: {
            CONNECTION_DESTROYED: {
              target: '#scan.findingConnection',
              actions: [],
              internal: false,
            },
          },
        },
        findingConnection: {
          entry: ['removeLoggers', 'registerLoggers', 'clearScannedQrParams'],
          on: {
            SCAN: [
              {
                target: 'preparingToConnect',
                cond: 'isQrOffline',
                actions: 'setConnectionParams',
              },
              {
                target: 'preparingToConnect',
                cond: 'isQrOnline',
                actions: 'setScannedQrParams',
              },
              {
                target: 'invalid',
              },
            ],
          },
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
          exit: ['clearReason', 'clearCreatedVp'],
          initial: 'selectingVc',
          states: {
            selectingVc: {
              on: {
                UPDATE_REASON: {
                  actions: 'setReason',
                },
                DISCONNECT: {
                  target: '#scan.findingConnection',
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
              },
              on: {
                DISCONNECT: {
                  target: '#scan.findingConnection',
                },
                VC_ACCEPTED: {
                  target: 'accepted',
                },
                VC_REJECTED: {
                  target: 'rejected',
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
                  target: '#scan.clearingConnection',
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
      },
    },
    {
      actions: {
        openBluetoothSettings: () => {
          Platform.OS === 'android'
            ? BluetoothStateManager.openSettings().catch()
            : Linking.openURL('App-Prefs:Bluetooth');
        },

        requestSenderInfo: sendParent('REQUEST_DEVICE_INFO'),

        setSenderInfo: model.assign({
          senderInfo: (_context, event) => event.info,
        }),

        requestToEnableLocation: () => requestLocation(),

        setConnectionParams: (_context, event) => {
          Openid4vpBle.setConnectionParameters(event.params);
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
      },

      services: {
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

        checkLocationStatus: () => (callback) => {
          checkLocation(
            () => callback(model.events.LOCATION_ENABLED()),
            () => callback(model.events.LOCATION_DISABLED())
          );
        },

        discoverDevice: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            Openid4vpBle.createConnection('discoverer', () => {
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

        createVp: (context) => async () => {
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

export function selectIsBluetoothDenied(state: State) {
  return state.matches('bluetoothDenied');
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
