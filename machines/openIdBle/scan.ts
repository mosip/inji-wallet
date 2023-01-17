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
} from '../../shared/openIdBLE/smartshare';
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
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYEMB2BiAygYQCUBRIgOQH0AhAGQFUCBtABgF1FQAHAe1gEsAXXlwzsQAD0QBWAMySAdAHYAHDICcKgCwaAjKskAmADQgAnomkbVc1ZaV3t+6dL0KNAXzfHUmXIRIUAMQB5PFocZjYkEG4+QWFRCQQAWn1VK10mJSZ9fW1ZPO0FYzMEJ205QqVpBVUANm0lVRqZDy90DDkUAAswFABrXgwoSgAbAFcwfi4ufi6cMAAnADdeFDBOnv7BqCwaWiIAFSCgg4AJcjIAQRoiABEI0RiBIREoxKStDTlajVrpPPq2kKtUkxSkMmszV0kiYDSa2laIG8HW6vQGQ1GEymMzmixWaw2aO2uzoh2OZ3ItwAkjhrtQ7g8ok84q9QIl9ExaopJA5fpJVExZEZTFJlN9XFUObDGgoEZ4ke1CVsMeNJtNZvNlqt1gswABHCawQRDEn7I4nc5XG73ViPHjPeJvRBJbRMeQNepKX5u71KYUlKrlVSFSTKDTSWo2Wr6RHIpXo4aq7EavHauS6g1wY07PZki2Uml0hm2pn2lkJKTZOSSP52GoKWoKSR2MEIVxcjT6WpKJvt-T12OK1HKxNY9W4rUEsAYNAAIxGkCwjM4ZZeFeS2g08kknYUsgbEa7DVbdXKOWkSj+nMskdUg8wcnnY5xt2nvEXAHETkFyDhDgcqVID9whLFdYjXJ0EGDBRFB+AwHDSbJqhPBs5ByBROTqVJVH0Gt7xRBc0AWbY8GEDBehZLA8CCUhSCIPAAJoykiBwA4CCCABNYtIjAh1WXERBNyUb5ryvZQDG7IoRQQDkISaLt6xhbslHwzpCOIoZSIwciUEosQjTQfh1jQAAzIyFgACluFi2M48gAIAWSIIJaAOABKLA4xQdSSLIiiXmXaJV0dNlnUvb4NAwrIND9RtZVbWT5Ei-sHH+QpN1UkzBggXztP84RfEuUhAuZCDQuSCEmAbISfllCNCgS2RhObMMXE3EFMuy3KdMo-AioYbQeKC8CQoEmT9C+JgqtdaoQQwrclEa5tqx7L02r5TqMByzS-N0l5CuK-QhtK0bEgjJhIQbVJ+3DDDNwSmtpGsWxpEFBQOT3VSOF1DgiO2A4uC0nqsGIPAiCpAA1IhmIhqkwfIQDghK4L+LOpKNCqzJ+VdH4cIS7sg2jJgbGcOwVFUlBduzKiaLohjuLtEbUcE+o5DrMN6l3HJFuk-5+zZmwBU5ZtBQpqntjkQYAAUFi4KBdVgWAsH0-hDOMszFgs6jaPoxiKEc5zXI8rzxaGSWMBluWFdgZGmfXbQeTkSxpFknRqskUFpNSRpFBvBpiaqHCxbyvazcEABbMAuDGfgqKKsHqFtvj1x7co-RioEuy3D3tASxC0L9rJ1GcLtVLAMRukwKBtlffEwCpDATK4LBqXwWndaT8tIL3DsYR7Pc6nUBxWwsH5viyGo3T0RpJDLiuuirmuwDrhum6wIgAA08FOIqP2h24aKITuyrGr1faUQomsaf5oxHv4uVvN2tAlOU2gfcvK6GJeV8b5uVbVuQplzJa3bgxKkTEDYuXcp5RUH8F5fyGLXbUq8uDH1OlIcoTAMZAgsDWXCF5ZAjyUtYf4e4tBdhyDuOen9q6IOXsg3+cgI5RxjnHUgCc0HM1KHUCoE9QyRlqCCNId9cLPW0FeHsXZgzSFUrqFYYAADuEtYBgAXKHKAEMUBYFoFLW4lwDjQ2IJcHANFOHrhSAKOQxNOyXl3O9GQtRWy7guqQq84iVAWFkfQxRyjVH+SGJoluNJtZ0wOGYyCHxOxWM7D8HQeCcK515kCGCgoZA1hBKGV6s95Rxjke+JRZsVFqOzIEv89IGLkAhngcJ5UUioSFAHFqjZoJOPEfoRQeg8iwkjA7O8OTFR5J8YUvx6jAlQwIFSAIHFyBFVuDMvAYMpYHHIMQAAivsViNSxopBdk7Jsr1Iw9h6SoJxW52lOGbDhHCa0+lvw6IMgpUA5BFP8RorRlwFlECWSsog6ybJbLOq6X2OEYowk7DFLBTjlDtMjIKDJQtqhePkY855IySlaLwPHIgidQLDWTpBTc1h+xOFhMTTmHtVBONSE9Hc9QahCIvjGfpD4Hm+OKdsQJRwPwfnpOQMIRACDkG1n+UgYTcUnS4Ukf4VhQy2Pek2Hcm4pIlAxpYJ2uEmywlerkPQSL8kS3aGsEYIxiT-yMoAjWllMXsOxfZKkTkoHGwGd4lFhrVEmqGACwSQIrAuwvl6Ga1yeYqqqh2d6jQEJ1CwXqoZTyVFbQ5Vo1uISO7ipRvbX47SPY1C7NkBQ+aLBOPqPIfsU0sGCM5DI5l9yXW+ITQErRVT5mLIMTaY66aCWiNcFG9qzhXD9lbAYJwaFozNnSrC7Jdz0y1uGfWt5WAm3EAAFK6wZqWO23dHDVlwr8SMqQMZ42kjyURs1Mj1TSLchULKZ1xunNtN55tLbyzgErM16tgE4B3hMoCdqHVGxgde5Fdb72aMfbLZ9isvVQUmnyfQl5816AvI4o9mM5D1R7N6XQNgY0ovjSBlATDeCR2jrHa1HC00bvKq4EtwYEJ+qmh7QdeaKhAjsK9d6OCcMSzQCgNYHAjIQCCTgByNIQLtso2NTcvrBGuFhOoLIyEj2RS+FkBozYezsYUFxs2uoABWFFFytxEzgMTjN8XlU3IKasuhIqbh0BPYN5hwxPVUP8D2jSqjaaeUsRYvATImG2FSCA05BD8BMFgAIHzoYQ0uNQKkbazNdwsxGJ21QZrvUHluJxWQuRwdrIUAUNQvNyB88RfzgXgsYFC+FyL8NAIxbiwl9d5mxowUaDFeTBgbA1h7FC-mVR-iClkAYbIxXSt+YC0MILIWBDhbI9iqDrphL1BBBeAUQpqiexVTFL4QjcKhlwtBYrKBdSGQ5RwLAEBhDrEGEsLgfR1i5JvZ0U7JSOAIFu1wdALIIhQY9jSmw9KsEOA9v6RAkVWZKuqD2OFk6r01qA2bE7YAzsBIu4sWWCw5AcBGIZJuCxw7POdYjp5yPUcaPe5977AVWB-Z3E7HQfNNwOH7qcuD1ZahuglLKfZcOnsk-NksNAJqIDTaq7NoTxnTPNaS9si88g-QZY1VVF20gnEwnKPmjCeWBS-CrVO1lZtbvC94KLyr1WQaHAINM8Zky4b6PAcVCjLX3iugupzmwkiHZemyFt8Hgjct8NWjyPniocqoCpoZmkUuoM9zQxjZslhwx+lcwlPcF0VDNImoKAroeHzG5F5L0Tf2T1NldHycRcFGpNDQ-muDPJnAOLzyiTYCZqBfbO8ITUdd4zbBwKrfgYwlbUBCA7piVp6RNd4rL94WhNdTX7DWTcLtVutmXzBcMeQ4Nucs-r+Hvehjt+p131MBJhwJn74ZIfWAR+Yr1gWWk1ooN1Pae9C8DnBvKGQyULpXIVDiQy0ikRWrQPygCP07wwG7zTAzENGzABiIBnHnDABv1H3vwnzXWnxPneHzQqDzQmgxg42qGVUEnyGsBhHUDghhGcFfn33P22HAJZCgIJBgKzH+i4AQLnAXBQLv0dwfyLCnzxRn0QClGiQzl90DgjEcwQBBxgh3FJmlQh07Aplb3oI70YNP3WDoKGClkWHDl4EVn2lvzHwoHQIEIlXthrGrGwQmgDwjBqDXwwgfg5GDCmhy05FqGUKJEPzUJeCYM0JUO0N0P0L4AKiMPv1bn4Kg1SBghyAFD3VcGXw0DX2xgqBzmxhcH7E8JHAYN8I0LkHD04MXDCN4LWQ2TFXExd2ENhDZgvCmmjGiiET92kJDBHSFgkgsCqiyLbx8JP0nHWEq3fEE0uClilnmQAihiiNyEhB5EkW7Bin+CkKVXaWLkjAh3qGFi6NUOP0gLyIGKKNQJKN+TKKgxBC5Cah6xikcCqiSOknEQMCdjyBiSIKcE80RAwC4GC3gCiGRESywOdB3Hdz1wBCBGBCaN0AfmUGqFPBlEQ1UkGB40EB81+PQQQBhBSSwUyH3UvDUCaMsHd37XEQQ2BBoK8gCNHDVBxD8ORMlUsBhSBPqmSRBCpVkN6VelVwvBsM2JVGfBTD6NAOpPMUKC+EHgsC0AGybCkJDysVZMFEcA5Ob1AMxApN5J7xYKNG2AFIiTuKsQsAvlJWuncVbAwhgkEUKxsCmg5MvVJK8PJOTAnB72nEKIgE1NqUJNwLrDpWbBDykODHkBdjxIwz1PUFUifGVK6FfAwEGJdLGhwhLSQzdC9GqCqikOozZjyxdkjVwg8JAO8hRw0igCBnyn4nMIJUilSz5C3HDF+BBzXwwwqEigLU7GyBJMVCyjnULL2lGhLOSySk0AMAO3IMigSnETTiQlhRyBkz3zjG+jAF+nzIBg7P4GjPZGElelcMzwzIjD+AeiwUUEzzY2cEilDGDh6g1Jlz+OSHZzgwUzqlwiQikPrxLULgDhLhPNeTAythfWXMEisFlHBLy27SujzksQmmhJfKDhzNNieWYRI2-IQHDHkDmhdllB+D+AmmAoulAs9HAqZSnTgUXjoR-ibjgqegxJwS3FHQIV+BHj5lSxDGyBwkcG7GoXgVoSgCQTWBQQ-Igy+MwJRN5EUDc1hGUAdjUBHi0C5Fc3ouuiYpUhAPwoQXYvoU4sYRgpjhItkDQmBy0DdDdx5CISqjorIRiUoXcBAMNygDgo+GHUV2ulDBV0cBHjJiJVDA121WhGKxeVGRQCsodnaXDA1VyDUCaBuJVQvDTgvEsAbAQ3+GO0wCNQ9UsvPP4q1Sdjggvm9B0F0GZOEgbK13DFNPJnMuezw0TV8s5CsV9I1xsDyCaCcVcwV09HbDk2w2KoF1KobW4utisuWmJlErk0ZzqpQwwjQyaswzSDMoNxKrvUTUI2I3UuSq4S3LZgIID3k1syYxGvQ2aqw0mv3wssAV41nIEzgqBBU3UEFATPsHpUHRdgz2NObE21yCbGKz0wM2dMWvthsLINWMyHzXEUhSPRB1r05yqHqAvWKxnBWCgHJwBlOC4EjlOsJQPQbFulWK0CaOzSekjDHSwjSFLjav1TNnG3Kym3N1mzgovisRBD8ssAOxqFCvB3+weI9z3Dg192O1e3Ozgvc3j03FDBcCvEZvgv5C+AoRkE1T+twv2uewL1NzF2qyssGwqA6LdEbH2xW3VzsGpp0A5C3CwXzVUnD0phDhOs+u7gvDZldByFuhyDyCkJviei3EQ11ulD2rjDlo+r4q4RkBUywSqGqgyXui9l+CsFUxLkkRVy5LAJ6J2L6Kso60UAXybE5hXxkDX05HaWxJyExP1PdqHDJJyN6J7y0KgEv0H14sEIvMiXKC6VyGfgDhxjXwdhcRBBzr9DzujqLrjtVP1FgLYI4KQN8v5CsUrRxqqBnnDGbphFGoMA5A7utvzofFLu7r8NAJ0IJ2CJPm7O2QBGlOcznwnNZ1uIbKsW5h6UwhbOXsLtjrXoKKQK9qrpRMinSFhUkNhCUh3GbtcCdnk1SW9x+C7tvt2LfEgB5pwhHU1T9SFnzWSJrzn37Nunf2yQ8CAA */
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
          after: {
            DESTROY_TIMEOUT: {
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
              always: {
                target: '#scan.clearingConnection',
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
