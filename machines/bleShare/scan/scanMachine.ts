/* eslint-disable sonarjs/no-duplicate-string */
import tuvali from 'react-native-tuvali';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {
  ActorRefFrom,
  assign,
  DoneInvokeEvent,
  EventFrom,
  send,
  spawn,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { DeviceInfo } from '../../../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC, VerifiablePresentation } from '../../../types/vc';
import { AppServices } from '../../../shared/GlobalContext';
import { ActivityLogEvents, ActivityLogType } from '../../activityLog';
import {
  MY_LOGIN_STORE_KEY,
  VC_ITEM_STORE_KEY,
} from '../../../shared/constants';
import { subscribe } from '../../../shared/openIdBLE/walletEventHandler';
import {
  check,
  checkMultiple,
  PermissionStatus,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import { checkLocation, requestLocation } from '../../../shared/location';
import { CameraCapturedPicture } from 'expo-camera';
import { log } from 'xstate/lib/actions';
import { createQrLoginMachine, qrLoginMachine } from '../../QrLoginMachine';
import { StoreEvents } from '../../store';
import { WalletDataEvent } from 'react-native-tuvali/lib/typescript/types/events';
import { BLEError } from '../types';
import Storage from '../../../shared/storage';

const { wallet, EventTypes, VerificationStatus } = tuvali;

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
    openId4VpUri: '',
    shareLogType: '' as ActivityLogType,
    QrLoginRef: {} as ActorRefFrom<typeof qrLoginMachine>,
    linkCode: '',
    readyForBluetoothStateCheck: false,
  },
  {
    events: {
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
      BLUETOOTH_PERMISSION_ENABLED: () => ({}),
      BLUETOOTH_PERMISSION_DENIED: () => ({}),
      BLUETOOTH_STATE_ENABLED: () => ({}),
      BLUETOOTH_STATE_DISABLED: () => ({}),
      NEARBY_ENABLED: () => ({}),
      NEARBY_DISABLED: () => ({}),
      GOTO_SETTINGS: () => ({}),
      START_PERMISSION_CHECK: () => ({}),
      UPDATE_REASON: (reason: string) => ({ reason }),
      LOCATION_ENABLED: () => ({}),
      LOCATION_DISABLED: () => ({}),
      LOCATION_REQUEST: () => ({}),
      UPDATE_VC_NAME: (vcName: string) => ({ vcName }),
      STORE_RESPONSE: (response: any) => ({ response }),
      APP_ACTIVE: () => ({}),
      FACE_VALID: () => ({}),
      FACE_INVALID: () => ({}),
      RETRY_VERIFICATION: () => ({}),
      VP_CREATED: (vp: VerifiablePresentation) => ({ vp }),
      TOGGLE_USER_CONSENT: () => ({}),
      RESET: () => ({}),
    },
  }
);
const QR_LOGIN_REF_ID = 'QrLogin';
export const ScanEvents = model.events;

export const scanMachine =
  /** @xstate-layout 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-0LisKKfM8pFikTiXElOcg0Q+jkC7rJUgtjtkDy-NMTQVESyZJ2KlRK2hXruNsBadwJYSxpWcA8tenQwQvBeNCV8BKrq0xtJRdQ9goEQUWIceKloiH00DtYdk819GwsUPCuZJi7zAwqZY-A1ie6fLSLcqslQZhOEIU4Tx0F7pjyguxVYJwOh8WVY8rhQNFmVLwDJMg+L+58viXXOQiwXA6HcbaUwIKIVZEWiHT6XgIWstVc6sJrrGlEGaX3Ek3qwqHG8fsaBTgNrqBZFSZYBySwZGguzW1Qp7WGIRXG9VFiYmtIAFI91TVmdNU1mjaFAhQiu7jGxOinlQgB2l5rzRsMsYwGhY0lKdXWlAr935QB3nvA+R9FBVRqrVHAqIMTVIUjfO+PV+q+gdcE+NFSF1byXZ-XViB+RVHqBAiuKxajSALQ0daeRVj2GAlSadTzz38MUMg1B6DMGkGwbg3lWswpHG3FBPY9FGzcjcAWussxGw6QFZ4f9aAUBgg4OVMSrt3Y4E9mmmDHbXQHP9frI2uxKGUhcEoSFyUjmVBDv+yMAArDyL4SMe1vekewRCkbaHZOoCCrhQGfVAtoysrQdYzMVael+QJAS8EquYaEWoIB3kEPwcwWBQjLJ6HhLEWoMxeso2kKCSgLQMmtmHMtm56ZVHcJWHIArKzMJU9WlVJT1POS0zpvTGADNGZM9g8gWpSDmeoJZoTv1qwmoyC0NKu4hmUgrt4yymWeQ1H-UFzT2mni6f0wIIzbyIMfOg0XMKNp7NGyWnuMlzJTbI28fYXQzG5hTP-SgSMZVFkcBlnLV+itlalOFKpkpg2wDDbCRwBACsuDoENLEJL+hlBQQbDPT0uQQ1UM5sWioyUAJyAG0N8xo3ARbwBIoDgLwyqVTTkg6bVagkv3m4tvhy3VvrbGqwITMhVCgTHph90hY5CbjcLlm0FdDDcn-QrNAXKIDlfC5VzVpHyNtps1Ic12iuLJSNkazxRtaEKC8O4ZYuMUcYCBGj3gGOwsRawMQJqrUqk1K1G83C0i6s-xukWD6TBnDzTcOL7Q6SOv1CqEGuO47UoKrtRcQ6qB278fHLjpLNQzQUVSocnIKx4qfRAjkTanoWjVyylcTAEAuXimfEQAE92ceCaF-g9IjXqzuHUMcBkGUsusmgoKzQUyHOqGKFOxVqP0ce7I0l+oShaik+4j8zm8UoV2E9AxGyACiyt0hP6CWgPhA9nDH6aEOBD78DeHvHE-Or4UFTOmITjLEZfXUJ9ewP6WQQWpI0CCm13Ti5hWr6vTwy-DYr7KKvZ5-S17Kg3rATfREt7HBOdvXvdmei76jfXffnDll3FkY4OsRP0Ira2Ev0IZ+Gkr-KSMMY4CDgRFwIg94nxgDX5EDf18beU4VmFG9Wv8DERCCU3EiUgazgKg5YXaaUEEGUcwRQ+Sxe7Y0+a2s+GAT+fYr+cY0IH+X+j4z4f+ze18rsk4raMMYBN0EB2k6WUusBrMpszgmQBwOsCSkuvmk+i+9+2Bj+8+8o-BTw6EgISCvAu84M6+AurepA1BIB+OdBVghwIEcg7Bv6LQ9Q5Y70xgkKQa7I88GB54D+4weBU+UA4hAIkh0hp0shm+VBO+1mKh4U8060Rs8wLinEuhCuDidQnoDKiwJhpegh5hwh4IGupBL4Dh186yHSnqoBwu8MouDYweaUZOAKjobo2k9EFYLgahtQN+p4d+WB5euBERigYWokWAGEWEyyuEBEW2uMmiywegF+Uy0mbBoytyBwDQuQzQ3oiqohUAZhc+N4kRKEMR-+chrSGyWyLhyR4UwEBu7E80FEzgUyg6iAqB1YgyNQqg3IaevgpwGAXAem8A8Q5wSR3ukgC0NICgmGNgUE9gLIdxByuQT0RwjQlo-Wce94YM6mNxsilQ7m9g7h9gPeDg8Us8+QqgfWUUroIRHYgYUoIYERwJtMDEWQFE2gj6McNkR2OxLEnITg3Egy7EzYfBpRF4gk14vYlhmJX4FkOJ9QdQZJFohJA+jK1YagCgxQ7EuQ80yJzuiE6JExSq-Yb+0ITJDW4uNI+gTCDQhQ7EjGi42Ja0bgVIhQXIvBla9kNJnYaJ9JVed40REAspU0NgRCkmhQxQmpRs3JoyEmnhMU0UWUAkxpwkoklpaQrgloHxCMcgj6Uy8BpsfiH0o6qwzMgKx4fBQ0IM8CYBOytM6glENOeSiO80pqpsS8tgagaWRR9pn0hM56+UJMP8KZzJqwVYzxXENoBwEB8U7EdKyBfycOyUCcjsasjwvpGwFcqe+sToGUxs8UYEdgqBcwcwk8ugXZSc6s68juYAfZrIwZCpBwMwDYcGdYGMUcRQagqUrGc5TsC5qc6cK5mgqwVEJCNk7R0E7itcmQ+sNQ7iWxsEiqAsicJ5jwig94IIUAv2H+qIXAKCF5UESUVI80hwO0bg5yEclQtglsbojWu4FQcCFZTwK588VYdQbmxgUy4ur0wERCk6YeRsboEe6F5Sl6H8u8WF+wWwxO+FaRoCFcVEn0ewFQxw+gcZ+plwz8JSIGaC-AWFFoom3IAeIcqgapOQbFECnF+MPF06K5dxLQDxSpzxFYYZZQ7MWSMwDI0ExwagrQ-6ZSLyKAK5Qac8toRYfiiUjYr0UyRCMwCgFEFc4EA2mAHKTuUAF5AaByegpyBkzWHgBascNGegxYtQLKfmX2M6aqLqK5-qygNkNkZKhhRJCAk83i524J7IBQvFJ6-mjqCVCaNF16dFyhSxgyKV-q6V-IJ+IKDQ247ihlfyi8f0k+s2AGc6wGvAKCwlF5dQmQTlAxNQ2gFQRkx2alRqTIkCZyplpVF6TqIlVV3u96ByMU7E6gxgr6BaEEZotK7I5k9OsVNaJSeGBGRGK5ocLodCRYFEkCapC0VQ7RjIARFonVfF3VPGfGFpa1uygpOJxgzQkmJYGUaGiw2kcw-IYCyiepRVcVv5aA-5gFXAwFoFANC4pOygroBxt0uMBa9Mtg+hjQborQ6GhVM2xVa8xWIWZWbOlWK5+g6hYee4scFcIeCgrQH0hJDK-InGZ1AWlw12I2KlIy6lTxKi3WaphQzgAVdyyUiU21DOTO6OmOEWKl88WQfy1pboxQk8rmbFyM2Q3xdoFEWUGubcSZkAK5DiWwfItEEujYstvuxQnoMe7o5NduDuPlrwYAru92dtLZkZhCTI7tqGuZFQkURYwaNgMwjgWU8eLOolno3alYjQ2MG408jYBun03I0E0yKGIpoxYR4xvYF5ypByDgfWGQuMnRLIn0g5gxugBFQqJdYxFREpIxy+9elxtBSxEKRCyUqgsFXtDduZHEesnaNoJYfiX1t+mBpd5RFhL+A4RBn+3+z4flouu4Ul2Qr5BsQEgqF+x+yUeiHdZdXdDJIx1hthfAakVZYUuMAZOg1sHG+wDEcFZQEE3IAV25et-ql9K9lRURP+-1A93uL9s0CM8uPWX9jomMW5NgFoEK9MVNfEIxndFh1RttWNzJ+4WQVIugeg0E1OmV-Isw-hqDQRsgJx3gQAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./scanMachine.typegen').Typegen0,
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
          target: '#scan.disconnectDevice',
        },
        SCREEN_FOCUS: {
          target: '.checkStorage',
        },
        BLE_ERROR: {
          target: '.handlingBleError',
          actions: 'setBleError',
        },
        RESET: {
          target: '.checkStorage',
        },
      },
      states: {
        inactive: {
          entry: 'removeLoggers',
        },
        disconnectDevice: {
          invoke: {
            src: 'disconnect',
          },
          on: {
            DISCONNECT: {
              target: '#scan.inactive',
            },
          },
        },
        checkStorage: {
          invoke: {
            src: 'checkStorageAvailability',
            onDone: [
              {
                cond: 'isMinimumStorageRequiredForAuditEntryReached',
                target: 'restrictSharingVc',
              },
              {
                target: 'startPermissionCheck',
              },
            ],
          },
        },
        restrictSharingVc: {},
        startPermissionCheck: {
          on: {
            START_PERMISSION_CHECK: [
              {
                cond: 'uptoAndroid11',
                target: '#scan.checkBluetoothPermission',
              },
              {
                cond: 'isIOS',
                target: '#scan.checkBluetoothPermission',
              },
              {
                target: '#scan.checkNearbyDevicesPermission',
              },
            ],
          },
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
                  target: '#scan.checkBluetoothPermission',
                },
                NEARBY_DISABLED: {
                  target: '#scan.nearByDevicesPermissionDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkBluetoothPermission',
              },
            },
          },
        },

        checkBluetoothPermission: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothPermission',
              },
              on: {
                BLUETOOTH_PERMISSION_ENABLED: {
                  actions: 'setReadyForBluetoothStateCheck',
                  target: 'enabled',
                },
                BLUETOOTH_PERMISSION_DENIED: {
                  target: '#scan.bluetoothPermissionDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkBluetoothState',
              },
            },
          },
        },

        checkBluetoothState: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothState',
              },
              on: {
                BLUETOOTH_STATE_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_STATE_DISABLED: [
                  {
                    cond: 'isIOS',
                    target: '#scan.checkBluetoothPermission',
                  },
                  {
                    target: 'requesting',
                  },
                ],
              },
            },
            requesting: {
              invoke: {
                src: 'requestBluetooth',
              },
              on: {
                BLUETOOTH_STATE_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_STATE_DISABLED: {
                  target: '#scan.bluetoothDenied',
                },
              },
            },
            enabled: {
              always: [
                {
                  cond: 'uptoAndroid11',
                  target: '#scan.checkingLocationService',
                },
                {
                  target: '#scan.clearingConnection',
                },
              ],
            },
          },
        },

        recheckBluetoothState: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothState',
              },
              on: {
                BLUETOOTH_STATE_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_STATE_DISABLED: {
                  target: '#scan.bluetoothDenied',
                },
              },
            },
            enabled: {
              always: [
                {
                  cond: 'uptoAndroid11',
                  target: '#scan.checkingLocationService',
                },
                {
                  target: '#scan.clearingConnection',
                },
              ],
            },
          },
        },

        bluetoothPermissionDenied: {
          on: {
            APP_ACTIVE: '#scan.checkBluetoothState',
            GOTO_SETTINGS: {
              actions: 'openBluetoothSettings',
            },
          },
        },

        bluetoothDenied: {
          on: {
            APP_ACTIVE: '#scan.recheckBluetoothState',
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
            DISCONNECT: {
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
            'clearUri',
            'setChildRef',
          ],
          on: {
            SCAN: [
              {
                target: 'connecting',
                cond: 'isOpenIdQr',
                actions: 'setUri',
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
                  target: 'navigatingToHistory',
                  actions: ['storingActivityLog'],
                },
              },
            },
            navigatingToHistory: {},
          },
          entry: 'sendScanData',
        },
        connecting: {
          invoke: {
            src: 'startConnection',
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
              target: 'reviewing',
              actions: ['setSenderInfo', 'setReceiverInfo'],
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
                  on: {
                    CANCEL: {
                      target: '#scan.reviewing.cancelling',
                    },
                  },
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
                CANCEL: {
                  target: '#scan.reviewing.cancelling',
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

        requestToEnableLocation: () => requestLocation(),

        setUri: model.assign({
          openId4VpUri: (_context, event) => event.params,
        }),

        clearUri: assign({
          openId4VpUri: '',
        }),

        setSenderInfo: assign({
          senderInfo: () => {
            return { name: 'Wallet', deviceName: 'Wallet', deviceId: '' };
          },
        }),

        setReceiverInfo: assign({
          receiverInfo: () => {
            return { name: 'Verifier', deviceName: 'Verifier', deviceId: '' };
          },
        }),

        setReadyForBluetoothStateCheck: model.assign({
          readyForBluetoothStateCheck: () => true,
        }),

        setBleError: assign({
          bleError: (_context, event) => event.bleError,
        }),

        setReason: model.assign({
          reason: (_context, event) => event.reason,
        }),

        clearReason: assign({ reason: '' }),

        setSelectedVc: assign({
          selectedVc: (context, event) => {
            return {
              ...event.vc,
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
          loggers: () => {
            if (__DEV__) {
              return [
                wallet.handleDataEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Sender.Event>',
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
              callback(model.events.BLUETOOTH_PERMISSION_ENABLED());
            } else {
              callback(model.events.BLUETOOTH_PERMISSION_DENIED());
            }
          } catch (e) {
            console.error(e);
          }
        },

        checkBluetoothState: () => (callback) => {
          const subscription = BluetoothStateManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
              callback(model.events.BLUETOOTH_STATE_ENABLED());
            } else {
              callback(model.events.BLUETOOTH_STATE_DISABLED());
            }
          }, true);
          return () => subscription.remove();
        },

        requestBluetooth: () => (callback) => {
          BluetoothStateManager.requestToEnable()
            .then(() => callback(model.events.BLUETOOTH_STATE_ENABLED()))
            .catch(() => callback(model.events.BLUETOOTH_STATE_DISABLED()));
        },

        checkLocationPermission: () => async (callback) => {
          try {
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

        monitorConnection: () => (callback) => {
          const subscription = wallet.handleDataEvents((event) => {
            if (event.type === EventTypes.onDisconnected) {
              callback({ type: 'DISCONNECT' });
            }
            if (event.type === EventTypes.onError) {
              callback({
                type: 'BLE_ERROR',
                bleError: { message: event.message, code: event.code },
              });
              console.log('BLE Exception: ' + event.message);
            }
          });

          return () => subscription.remove();
        },

        checkNearByDevicesPermission: () => (callback) => {
          checkMultiple([
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

        checkLocationStatus: () => (callback) => {
          checkLocation(
            () => callback(model.events.LOCATION_ENABLED()),
            () => callback(model.events.LOCATION_DISABLED())
          );
        },

        startConnection: (context) => (callback) => {
          wallet.startConnection(context.openId4VpUri);
          const statusCallback = (event: WalletDataEvent) => {
            if (event.type === EventTypes.onSecureChannelEstablished) {
              callback({ type: 'CONNECTED' });
            }
          };

          const subscription = subscribe(statusCallback);
          return () => subscription?.remove();
        },

        sendVc: (context) => (callback) => {
          const vp = context.createdVp;
          const vc = {
            ...(vp != null ? vp : context.selectedVc),
            tag: '',
          };

          const reason = [];
          if (context.reason.trim() !== '') {
            reason.push({ message: context.reason, timestamp: Date.now() });
          }

          const statusCallback = (event: WalletDataEvent) => {
            if (event.type === EventTypes.onDataSent) {
              callback({ type: 'VC_SENT' });
            } else if (event.type === EventTypes.onVerificationStatusReceived) {
              callback({
                type:
                  event.status === VerificationStatus.ACCEPTED
                    ? 'VC_ACCEPTED'
                    : 'VC_REJECTED',
              });
            }
          };
          wallet.sendData(
            JSON.stringify({
              ...vc,
              reason,
            })
          );
          const subscription = subscribe(statusCallback);
          return () => subscription?.remove();
        },

        disconnect: () => () => {
          try {
            wallet.disconnect();
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

        checkStorageAvailability: () => async () => {
          return Promise.resolve(
            Storage.isMinimumLimitReached('minStorageRequiredForAuditEntry')
          );
        },
      },

      guards: {
        isOpenIdQr: (_context, event) => event.params.includes('OPENID4VP://'),

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

        uptoAndroid11: () => Platform.OS === 'android' && Platform.Version < 31,

        isIOS: () => Platform.OS === 'ios',

        isMinimumStorageRequiredForAuditEntryReached: (_context, event) =>
          Boolean(event.data),
      },

      delays: {
        DESTROY_TIMEOUT: 500,
        CONNECTION_TIMEOUT: 5 * 1000,
        SHARING_TIMEOUT: 15 * 1000,
      },
    }
  );

type State = StateFrom<typeof scanMachine>;

export function createScanMachine(serviceRefs: AppServices) {
  return scanMachine.withContext({
    ...scanMachine.context,
    serviceRefs,
  });
}

export function selectIsMinimumStorageRequiredForAuditEntryLimitReached(
  state: State
) {
  return state.matches('restrictSharingVc');
}
