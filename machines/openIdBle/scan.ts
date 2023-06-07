/* eslint-disable sonarjs/no-duplicate-string */
import SmartshareReactNative from '@idpass/smartshare-react-native';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import OpenIdBle from 'react-native-openid4vp-ble';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
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
import { DeviceInfo } from '../../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC, VerifiablePresentation } from '../../types/vc';
import { AppServices } from '../../shared/GlobalContext';
import { ActivityLogEvents, ActivityLogType } from '../activityLog';
import {
  GNM_API_KEY,
  GNM_MESSAGE_LIMIT,
  MY_LOGIN_STORE_KEY,
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
import {
  check,
  checkMultiple,
  PermissionStatus,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import { checkLocation, requestLocation } from '../../shared/location';
import { CameraCapturedPicture } from 'expo-camera';
import { log } from 'xstate/lib/actions';
import { BLEError, isBLEEnabled } from '../../lib/smartshare';
import { createQrLoginMachine, qrLoginMachine } from '../QrLoginMachine';
import { StoreEvents } from '../store';

const { GoogleNearbyMessages } = SmartshareReactNative;
const { Openid4vpBle } = OpenIdBle;

type SharingProtocol = 'OFFLINE' | 'ONLINE';

const SendVcResponseType = 'send-vc:response';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    selectedVc: {} as VC,
    bleError: {} as BLEError,
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
      BLE_ERROR: (bleError: BLEError) => ({ bleError }),
      CONNECTION_DESTROYED: () => ({}),
      SCREEN_BLUR: () => ({}),
      SCREEN_FOCUS: () => ({}),
      BLUETOOTH_ALLOWED: () => ({}),
      BLUETOOTH_DENIED: () => ({}),
      BLUETOOTH_ENABLED: () => ({}),
      BLUETOOTH_DISABLED: () => ({}),
      NEARBY_ENABLED: () => ({}),
      NEARBY_DISABLED: () => ({}),
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
const QR_LOGIN_REF_ID = 'QrLogin';

export const ScanEvents = model.events;

export const scanMachine =
  /** @xstate-layout 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-rPvPhdq-svg-J-u8gaOEuQBEngIfvEOjNlJlGkF0M8Hsvhvaq4vSACAmvKggYEkgVAIvqgRiJ-lEgQNqK4ISPuqSGEi1pMARNokQHovWlns2CXmVqkJJLcJLnsmWGmhoBkDzKAvenQc-sgW-ivp-pinwQIbUiIXytbpevmBIVzONP1BoHssIokr3E6DEI+h1F7n6DPvQS-hoWgevp+p3gYSrA2MNE8FNLcONELHoI6HHIyKoByDvBYE6G4v3M4WoYwSge-qvuvkRI8o8gaOQN4MUOQMtu8qQL-u5tbkkPspIqWNWCkP1FHHshAsJD8FHNlGISMpKPEQwdsJgFVA+A+MOF3jLoYELF8GkokGji9M0WCK0a4fBiwevvzgGoLoUZGptjyCWOEcAVAmAaEf1ECtBhYPepkI4UMBMeoVMR-uvjgTqgUaIUbPyL3DoAbKWICD0naoJPspYC8OkE6KoW0a-icSkVgOcdoUQPwetq1EsTIlaBYiUcfGAeAeZtcPspzFHOfhYIqnEU-t8beAhqwXgIIQAFLzEglMzZj9IQmWKCTQlDFVi9A95dxRxeirgpComjL9iIGTFYkoBA4g5QB3Zuwh5Vph4vaR44Am7sFfKfbfYJ5-ZOHolsnTGck3bclg6iEpAAa3RMhCx5QCjgHd7XAxCdK9Dsj8xfGymnHN68C4746E6eFECk7eHEnuikk6DkmcyUlbinJDaWAGwD6lhxrGkXZoAoBVQcBVoRTOauZ4EAjSpGAyBdA5JCxD5ulwkTqInVg7jHx+mMERgABWhaz4YZOAbmixHmABqxlG6xFOrc1JjItJtRDJ9IGZmgZUMwvA5aCgGI2o5Sgg-ACgWArgmKhQESlE2oEMRZhh7SfhHoTwWQNKIRbp8OBYHQXMPQ9oeYDZTZ-arZ7ZnZAgPZfZ3Weqg51Aw5ohBKo+vcSQQoQsJgjodww0xKvwZG2aTJLRMpF265LZbZBwHZt4XZPZ1ptpf+7UjRQqKQph0hFhW4vcaSUBeYx8kE5mXEDZKAEYQ8H+HA8mimQOKmamww4xr5jByF0IaBHACAym3iNQvgohBWQKAR05wRjkbp+gWgfmT6QkPQlgSFKFxFWAMwN2YwmgHAD4RcPOcwuF0prJF2hFqFq+JFZFxSGAlFdp84dhAsECXQPQSQ+SqQl+bE6UpgPmDwQRLqFyRxjBymaA3REA35GAv5X+OALmBZJ5MgZ5R4PwvGRgyaX4pK1Z2UUcjwzQquzJplWFFlvAVl253ZTWhEBAhIbBHBXWWCTlP455blNK15kF0J0qEu4E+Bx8HIBUqiqAAOeZuoDlhZG2HmOsGShl6U2UBs4cwq9ZFyteEA3RfkT4RAYwfFdlZVWeDwAWvcLkxs9RyMsRzJ5lllPV4ZSlTSaaE68a06SaqU2UUZLQ1YxBNkD+-QGAXA-i8A-ggwRRKsAAtAxVEKdZZHZFdddVdWNgVPsAGYIE2Ude1DWD0BYAbK4u6IaU5BIlHGkOfDGUyGNZKCWhMGqqsGiC9cpaHFGaoHlPCnZMjJfhvDjL0MkjcAzhcmDVMKwsiJDZsBtNDbFK4gBh1PDcrklMjW6RAkCr8EePTeZJtTQp2MGHjXikScHLpZBA6aKl0pqZYQLA8MevEOZqHHNhcueKzWyqpB4hiMTaZJ9UKrzXZPzQmVEB1FaJBqHAFQbAKGMRnB2IGGzVMkqP9IOA-ArdhhQi6JJACBAiCr3KEcNF0AKFIfYSdpLRCNLWqpoPLOFFbV+FOhsnlF0ACPcOYEBHyLplIRHGyFPl7ZnFLEtGqoHTmOkFaL3JslOjsiJE5GmiifKmtdAYFZfEnZ9CnezWpITGnc0LTVne6DnVYHna3Hpv9VZGYEjO6IUkTNckFFXUMP7ZAGnRoPSJZG7ZJCnGYGdVIF0PavKmYCiQ+hjonXNMnSVCPCPfGkStZCSjuOSlWH1JZMuU2H8C8NWAbXLe1RMkwkTaOT4TZJncSvHWSi3YNICmNEzRuP+DBKvZ4uvSTKUnfBbfLffe1KmpIhHaYOHYeLHAKIknbZJDkhJNNMye9AAzLEA0PRAGnUkMBPtl0IWCYB8QJAbNcGoNGQ9KIkLD3UohgEwrg75dKhYO0F9Q4hCgLBkEmh8fhpdLQ+RSUr9I7M7K7LgxWPmI8Kwx0Ow7rLetzDIPdPSPEvw-JbfebZTI-FPDPE+GnQCtfpkBNIdlxOrSoM5SJFQXZHuPGiowwvQ7fCwqbSZJzSYvHWdB6KAqcgJEYNaACHmNvGKjoDYz4kI4Veoro644YO41srOuAvmEupJNYuZqoAcQPAI3Y0A+UpUmnVYPcHpaBNZNsgCAjjyPKpA9Ivsr8E6Ck0ipXY4+qrMjg2A8pWNJZDEJrFNCbFSRvEZu5PBU1f3DU0pBqrgysblKKMfFjCJMU-kwWPsvsvfl6D0KXWCMqmMKqgPcM00wNpavyDEYkLZE6coJKgkleRpWKAvVHLmrVohgDhzb-LFE2HyFHCkEXUkJ9Uc63N6HE10NxCAmPik2ur8Q1n8s46ZOjtKvzPcBRn1E8PvE8OlBYA8RkOkNWOFnZpph+KC9huZBBgZknJzMZq3BWMNH01zIyWyGi5Fo5pdq1WALXYJKqf1A8F0OjZzJ5SU90JZGWLxNkjzBxdjbZlS9FiMFwHFlALXQbHamtTsm5W5DYmKKdDZFNJLhkL3JS-ZtS3eBVFANJZPKRFwLjrXaHaXrTncD87TiZq0ExdvJrZHCvf3FVmADVmK5PMC7Xdca4uOevF6c2BNiS2yP+kic85jskSPRLtoP0mKHoPsukDPTyDDrVQ4o4l9VRpLbcxdldgqTySPYkHtpG3BTG96EBKuIkhdNmtsikygOm4wS3paSPWrNzNOUzf88WwLKLoi40WWCk8nnXuzg3unkHrowcr5fnoJORq8FuBkKpfYS6a4ikH0Bcj22zmnmABnvKaDosNkwyHlBQgCJBkJGAlEFsnEwClzK8e6JfX7TXinn24HjzmaRaQTmnQ8K0G06kHZA8JkJYMXl1JdH5eXmyCDXhRJeK1s-imoJw5OYETOXGxU3aprYJPsS8BkJe8FUkZoSgFvakNKn8GxFU16JJJYZGQ4ZM8jBrL-WiSB+0RgJ0W1aBxVcUaTYkr8KHDu4CCY9EDs3reVkyB1C8Pa0FfhYvr8Wvjm6U0EXcRyEupHYmYCldZ5O0rcFZg2T8eyeu4qZu2B8dNcRJ4iQ8TzI6FjBvM3AvRU9ZAJy+VR6p3KbW0+1p+8F8+ERYrxL0FfjYk6N41JxYDlCQYWCp5iXKT8fwFh6qfDlmpqf1XOdWK0yJEuby9QiZUJwGUGSGbgzzHeT0M3ArlYB8xrQ8BBjIHIWIeNIE4l1R9mbmY0wx--rYdcJ3JekLO0jJxkr0PBzWfSTy8+cBy4Rdlq7wDqw-Hqwa3S-Z6rM8JZIYFIg6rpo6F3JZAiZK8iemWVz14we+ZuV+RFVENV8SVdYyLvSYJ0PHTeaZrGy+zoAmvlStwkdsFxSwRwCPXaDRUWHRUeLB-cNln5aeme0eKh0JxNWFdZb+Y9znv4S90EW9xCrTaPVG1kBAZe4VVW2dql6Nz8EkCNOfl5uYYe+8LsVGa8aBJpf9QVC1XR4hGAJ1XxbXXtxXvoJyL0FIlWM0HyHAcWDvFxBR+NRgGVKFVV6CR5p0vmH1AKPDUJIJAKMtXdA6UdnfivbYEAA */
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
          target: '.checkNearbyDevicesPermission',
        },
        BLE_ERROR: {
          target: '.handlingBleError',
          actions: 'setBleError',
        },
      },
      states: {
        inactive: {
          entry: 'removeLoggers',
        },

        checkNearbyDevicesPermission: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkNearByDevicesPermission',
              },
              on: {
                NEARBY_ENABLED: {
                  target: 'enabled',
                },
                NEARBY_DISABLED: {
                  target: 'requesting',
                },
              },
            },
            requesting: {
              invoke: {
                src: 'requestNearByDevicesPermission',
              },
              on: {
                NEARBY_ENABLED: {
                  target: '#scan.checkingBluetoothPermission',
                },
                NEARBY_DISABLED: {
                  target: '#scan.nearByDevicesPermissionDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkingBluetoothPermission',
              },
            },
          },
        },

        checkingBluetoothPermission: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothPermission',
              },
              on: {
                BLUETOOTH_ALLOWED: {
                  target: 'enabled',
                },
                BLUETOOTH_DENIED: {
                  target: '#scan.bluetoothPermissionDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkingBluetoothService',
              },
            },
          },
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

        bluetoothPermissionDenied: {
          on: {
            APP_ACTIVE: '#scan.checkingBluetoothPermission',
            GOTO_SETTINGS: {
              actions: 'openBluetoothSettings',
            },
          },
        },

        bluetoothDenied: {
          on: {
            APP_ACTIVE: '#scan.checkingBluetoothService',
          },
        },

        nearByDevicesPermissionDenied: {
          on: {
            APP_ACTIVE: '#scan.checkNearbyDevicesPermission',
            GOTO_SETTINGS: {
              actions: 'openAppPermission',
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
                target: 'preparingToConnect',
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
          exit: ['clearReason', 'clearCreatedVp'],
          initial: 'selectingVc',
          states: {
            selectingVc: {
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
                sent: {
                  description:
                    'VC data has been shared and the receiver should now be viewing it',
                },
              },
              on: {
                DISCONNECT: {
                  target: '#scan.disconnected',
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
              target: '#scan.clearingConnection',
            },
          },
        },
        handlingBleError: {
          on: {
            DISMISS: {
              target: '#scan.clearingConnection',
            },
          },
        },
        invalid: {
          on: {
            DISMISS: {
              target: '#scan.clearingConnection',
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
        setChildRef: assign({
          QrLoginRef: (context) =>
            spawn(createQrLoginMachine(context.serviceRefs), QR_LOGIN_REF_ID),
        }),

        sendScanData: (context) =>
          context.QrLoginRef.send({
            type: 'GET',
            value: context.linkCode,
          }),
        openBluetoothSettings: () => {
          Platform.OS === 'android'
            ? BluetoothStateManager.openSettings().catch()
            : Linking.openURL('App-Prefs:Bluetooth');
        },
        openAppPermission: () => {
          Linking.openSettings();
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
                Openid4vpBle.handleNearbyEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Sender.Event>',
                    JSON.stringify(event).slice(0, 100)
                  );
                }),
                Openid4vpBle.handleLogEvents((event) => {
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
        checkBluetoothPermission: () => async (callback) => {
          // wait a bit for animation to finish when app becomes active
          await new Promise((resolve) => setTimeout(resolve, 250));
          try {
            // Passing Granted for android since permission status is always granted even if its denied.
            let response: PermissionStatus = RESULTS.GRANTED;

            if (Platform.OS === 'ios') {
              response = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
            }

            if (response === RESULTS.GRANTED) {
              callback(model.events.BLUETOOTH_ALLOWED());
            } else {
              callback(model.events.BLUETOOTH_DENIED());
            }
          } catch (e) {
            console.error(e);
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

        checkLocationPermission: () => async (callback) => {
          try {
            if (
              (Platform.OS === 'android' && Platform.Version >= 31) ||
              Platform.OS === 'ios'
            ) {
              return callback(model.events.LOCATION_ENABLED());
            }
            // wait a bit for animation to finish when app becomes active
            await new Promise((resolve) => setTimeout(resolve, 250));

            let response: PermissionStatus;
            if (Platform.OS === 'android') {
              response = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
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

        checkNearByDevicesPermission: () => (callback) => {
          if (Platform.OS === 'android' && Platform.Version >= 31) {
            const result = checkMultiple([
              PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
              PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            ])
              .then((response) => {
                if (
                  response[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] ===
                    RESULTS.GRANTED &&
                  response[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] ===
                    RESULTS.GRANTED
                ) {
                  callback(model.events.NEARBY_ENABLED());
                } else {
                  callback(model.events.NEARBY_DISABLED());
                }
              })
              .catch((err) => {
                callback(model.events.NEARBY_DISABLED());
              });
          } else {
            callback(model.events.NEARBY_ENABLED());
          }
        },

        requestNearByDevicesPermission: () => (callback) => {
          requestMultiple([
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          ])
            .then((response) => {
              if (
                response[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] ===
                  RESULTS.GRANTED &&
                response[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] ===
                  RESULTS.GRANTED
              ) {
                callback(model.events.NEARBY_ENABLED());
              } else {
                callback(model.events.NEARBY_DISABLED());
              }
            })
            .catch((err) => {
              callback(model.events.NEARBY_DISABLED());
            });
        },

        monitorConnection: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            const subscription = Openid4vpBle.handleNearbyEvents((event) => {
              if (event.type === 'onDisconnected') {
                callback({ type: 'DISCONNECT' });
              }
              if (event.type === 'onError') {
                callback({
                  type: 'BLE_ERROR',
                  bleError: { message: event.message, code: event.code },
                });
                console.log(`BLE Exception:${event.code} ${event.message}`);
              }
            });

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
          // don't scan if QR is offline and Google Nearby is enabled
          if (Platform.OS === 'ios' && !isBLEEnabled) return false;

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

export function selectIsBluetoothPermissionDenied(state: State) {
  return state.matches('bluetoothPermissionDenied');
}

export function selectIsBluetoothDenied(state: State) {
  return state.matches('bluetoothDenied');
}

export function selectIsLocationDenied(state: State) {
  return state.matches('checkingLocationService.denied');
}
export function selectIsNearByDevicesPermissionDenied(state: State) {
  return state.matches('nearByDevicesPermissionDenied');
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

export function selectIsHandlingBleError(state: State) {
  return state.matches('handlingBleError');
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
