/* eslint-disable sonarjs/no-duplicate-string */
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import openIdBLE from 'react-native-openid4vp-ble';
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
import { DeviceInfo } from '../../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC, VerifiablePresentation } from '../../types/vc';
import { AppServices } from '../../shared/GlobalContext';
import { ActivityLogEvents, ActivityLogType } from '../activityLog';
import { MY_LOGIN_STORE_KEY, VC_ITEM_STORE_KEY } from '../../shared/constants';
import { offlineSubscribe } from '../../shared/openIdBLE/walletEventHandler';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  RESULTS,
} from 'react-native-permissions';
import { checkLocation, requestLocation } from '../../shared/location';
import { CameraCapturedPicture } from 'expo-camera';
import { log } from 'xstate/lib/actions';
import { isBLEEnabled } from '../../lib/smartshare';
import { createQrLoginMachine, qrLoginMachine } from '../QrLoginMachine';
import { StoreEvents } from '../store';
import { WalletDataEvent } from 'react-native-openid4vp-ble/lib/typescript/types/bleshare';

const { wallet } = openIdBLE;

type SharingProtocol = 'OFFLINE' | 'ONLINE';

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
    openId4VpUri: '',
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
      BLE_ERROR: () => ({}),
      CONNECTION_DESTROYED: () => ({}),
      SCREEN_BLUR: () => ({}),
      SCREEN_FOCUS: () => ({}),
      BLUETOOTH_ALLOWED: () => ({}),
      BLUETOOTH_DENIED: () => ({}),
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
const QR_LOGIN_REF_ID = 'QrLogin';

export const scanMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYEMB2BiAygYQCUBRIgOQH0AhAGQFUCBtABgF1FQAHAe1gEsAXXlwzsQAD0QAWAEwAaEAE9E0gOzSAdNICsTbaq0BOLdoAcAXzPzUmXIRIUAYgHk8tHMzZIQ3PoOGiJBBl5JQQTAwN1HSYARgMmADYDSS0TLS0LK3RsGiJyIgICJ0ZWUR8BIREvQODFRBjpEyimXSZJBNTdE2lpTJBrDHUUAAswFABrXgwoSgAbAFcwfi4ufmGcMAAnADdeFDAh0YmpqCwaWiIAFScnS4AJcgBBamonAHUiABEPMp4K-2qiC0kkiagSCQAzCYIZIVAkVLCQogjJJ1C1dNIYroIkwVH0BocxpNpnNFstVustrt9oTjtMznQrjd7uRPmQAJJfH5ecp+KqgQIGCEQ9RxLQQmIqcVQ1JyOphaQJZq6GRSmKSKH47K04kzBZLFZrDY7PYHTZgACOi1ggnp5yZtweZEeuW+pR5fz5ASBIPUYMh0Nh8MR8pUTC0fp02niMlSCRiWswOpOpINFON1LNlutttO9uujtZ7JwLuoXPdnE9lW9CCFIrFEqlwrS3SRQQ6ysV3RUJjUYYyln62pGRJT+vJRqppvUYAwaAARrNIFhuZXfNXAbXhaKjI3pS25aFeyo0S1MbEkuqYglE4NF2TDcNPrPeMvHgAFd9PPCXdkANSIVdvCrAEBWUOJ1GhQwYTaeIJSMNtJBiCN0QhFoTHjXQYVvdR7zTNZnwwV8ICwABxW4nHIHArl-UhSPcCtgPXUDxEQCFpFiTQYUaMMNVhHo23YppDDULRkJ0GFYRwlAlzQTYTjwYQMDGPksE+Ys8CcUhSCIH8gN5DcwIVQSTHDTRoRiBomHYrR4QhaTZPk6ZFIwZSUFUsQbTQfgDjQAAzHzNgACjZHBLiKABNchfwAWSIJxaEuABKLACRksA5IUpSVMqfSQP5Vja0PNipSYdR4wSSQmGSHQb0HAk-KmCAstcnLhFsR5SDy5iCsCcUIxiISEhMNIsRSLREJVcqWkkNIqq0FQYm6HDGowZrnOy9zKg6rqYk8Nd-l6n0BqGkaxLadJBIRMrewlUb42hSEVqalq3NU-BOoYaR9qYw6a2BE7GmG0aLom+UoWhP0NWkGEVGSAwEl6ertVgYYuAAdwARU2aguCgKYsAgYQDimbYuHGA5sdx-GMG6v7N26EVMRGxIhQMJaVBUK7OcgkFoXY6yxLqrIk1RjGqbxgn1JwGLiwYn6DJYvqIUBjCzrGy7waF9QVZaSVGjPNocLFrGcclwYbS4JzTjC4o8mIHB3y06i6a9TdLIiSCVaFcNrIhOGEiu8UdZUO6haWiEnuRpMUE23MsE07TdMucsFfymtEcE68yt1phukkAv43s6PBlj1qtumdQpnfTY8fNWBYCwTz+G83yAq2ILE50n92S06L2TihLktS4c45OKuMBruu4FgV3DMKgxFXUWb2mBAw1A1UPJo7btmfSRG4WksfK8EABbMAuHmfgE86vAiGoOelcQTPwfPSDoj5xHGxw81djAdHx6wDAEuCuUA-woCwLQd8nxHgp3IMQR4OAtKPyOggdUPQdZ2W6KoFI7RA7ynEhoZCSRMRxGGhxYuItBi-1fAAyuQCQG5nAWpDSWlu6XBQTWJaC1RSxCFhxW6ec2yqFMuVdo3YEaxlUD-MAf86FQHUAwnK0xmHUTLD+cgf48CcPdhqJUWJbLIVhD2RaXMCHjT9NZeEI0Ei4h7OYEu6gaH-0AcA5RYCIEAQIOyBwUVOqfG-Hfd8lx4FEExhcMKOijLDRPMCXisFpBIVsm2a88YdwwnZhqVIDQHFUKcbI2hrjGEnGYY8PAQSQnEHCUQSJjFFaoJiVEWEbQElJPwaEZC6pNBVUaNeboiRclDiTM4+Rii3GgOYXgW+98omFUGmY0IiSUg6wRqY2auJcTCyGdQgpLj6HjKYRA64pFSJlnIG4Ao5BE7UVIBwup6d3YQkXpBboERtDpAwmDDp3tNA6D0cYWEkcDAyLkePbI+xZizBOCue5PUuEmFhLwzpiM86hyEQQ6qN1hQLXPADGGILCn7LWiUiB0su7J1mYEJaiKsTIoEWikwwi0WinEbY4EHQV4Er2QooBxKVGeLwFRMgdy05ws3P7GI6gIjSvVLEaqGEFnKDhJEcIw0qpYjSItSh2z8mgqJetDxWAtGBKIME1OvwxVGUspHTQCMhRqG0M2Rl8pVD+xWcNdIlkKpbIJCM1xfLDXGuIAAKWTuaj0lq5kNCVNIO1-sej7mdYsiqYjwTDVsWCaRji-X6pJRPKeUB66N2bq3dQ-lApBRwHcR43i6L90HolFKvrdmjN5Qa8B+ba6FpnpSoEec-QmAaDoYdQovnKFGiysMyEOKtGsly1ts520oHUGfC+V8b6kDvg-WF9MrVettUkeNjqIbCNsvo9oU6lpGGgvO8eaAUD7A4D5Ei0tZY4Hlha3dcyQQniEteKdfylpMrdU8j1YlrypNvZXc0AArFSy5X1y17WghFJ5aX8NRWhJNygU2VRibK0O6ooMKO2FsXgfkFAnHZBAWcgh+AKCwA4MpeQ-zPHZG6UVX6qWSmERhes4iYaDoRPi7NLbx6kfkhRqjNGMB0YY0xu+5B2SkFY9QdjyHGlxJaSCRJxCUnxA0IelIZ0VaSmI+oCT5HKPTGo7RgQDGpmbpmTut20TexNPiTptpKTMLlVHYk2Ig7qqSHMygc03kSkcEJsTCeZMKaKO1DmhRYWMpMI4AgUmXB0B8g8MhhoiqEDaB7H54UEQEWQjEqF8LaWsBbFrpsdQHBZjeT8lbU+CXhlicriliLKj0uZey7lVgyHGgiiSP1BaecYY2RSekSIHQ7JGHjHDMzom9UKNJmgKFEBbOyfsywmWSGXPz0CKYcqiT14AtiBxAr15g6WQvCrIajRzObe27tuTWBiDhSil4nx7Ipm-mQcdp+hXhrnZ-Vdqyt2eySuSLDMShcOU4WaqgOOCHixvo-RGrj4FQ47mMAjcU7N-bAd-QjNI4HvU4WGJgCAUKSRLiIJserB2sfIcjqicEVVJHhl7LGsdaDGjKj1pq9e4IcJvd4C+zHR3OOucKmoRCDRJXhnjZzJCh9HEjjpFAXGg3hAZmnDr3UOAW78HmI3V4gPe4UGdK6PL7RIi7ksvzYzkg2w+y9hk2y6QuxIzySbk4+uIuG6nDSIP0wzfeUt1ga3sDbdFhLA7kHqD1RJCleKV3wp3dthMcvVI4o0hLdMgOQPRxdQh75Ebmk5orRwFzJcLgRA5yLjAHHlwCe+727LBxz9CuqUGBGsvf2OmOiJBhm2ILaIoIe3aEhSq0kK-B6y6HjANesz15tCcJvLeFxLg7zbvu0tSzhoOgP+oQ+mibzH7VSfoZDBRCggXYwvYclL9HNMKvlQN-JmmO+LYU+XgBubaePIHO3UgU-PvHHC-QrdeNDWaBETmIWReT3KEEOWqcICGR1D-XXb-MPE0CPZff-QA4AvgdqMAxPE-FPeXE7ZQMSEUCfDoR1aMdpRAQdJURGMSDCRGaVReXAyvVfavcPA4VHffZcSgvuKpCJEVfvOgtBCIOHWNMMFESyBaQXFQmfYUBECUaqBaELbXYgvXIQn-EQ9QGTYiLAD8L8MpX8ACEbBaJobnJCdieMKqDoPPcEUUPQOITEHoJbAQlfA3dfMwiwiQzvcA0JapWpWg0HVQWNHWbgvOVIBEL1PPJaUURaZIGQNmBaPEPoDALgGjeALwAYOQ0HAAWjYIQCqMlznC2lI3KNQVITEUp0qgwklEHWEV9G0EC0emBjPECMZwfHTBEKaJrA4iVCgiFCqhBGsjFDbGyVPFaCQg1CeXyPL0-z1BGMnEIIOEjygHGM3G0FRGmJgjmPgkF3ZiVFKn0FMhhEhADx1QONTAnEpD2PyS31zCOKMglElVh30HXhaThDbHBGEj1h7AqixDhiGO2PwneMzBnFbyXAgB+MVzSEgl6VxH9nXksmKlrERV6J6Dwy6HXhwjwjeMImIjRO43iCfyHwLmh3VEQjQjRCjHZjzkhBhDL2eMclejagKnqRrHYkSV4XXhSCxANghBSRVnKjBKhGlUWk12egDRcjenniFPFUSGXmZieTQkji9UFwlQGjKwdSHUGh9RRjRlNmpimBpMQGQM0CWlMkPXZmPEEg+V5jKyd05kSWNmtIlhpirnpzAHtLCB4Sv0jhZkMQRCugggyU+R7GySzTyRNkDKmEUWWGtjDKH0lSKzf25xGmvCDhFAySlGwWmIMNTIDLNiDLnF2CgF6ygCbzuC4HPjDMGk9lHyHyhEsjhgMG5imL5mJPPHDCrOeOPkOJgPkIRBuOsljULilClEEi91cNMnDGITSCPnLlzE7WngbjDLhlRDDHYmyPhHUO3lONUCxA6FDlDmBW10nJXV4HPkvn4A7L6UghyVWUXmxUvMxMWkSAWn9ieWIzDJBBSX1kjAvEXkSHcMtM63WzGWKX5XAqMCRQDkbEXnZh82DkwmvCeyBhezW0JWS0wAhQZynPP3kIaCQjZPEW6EqkslqEWRf0glWUlHWTDC1zySSzGQDXATDPYhFD4MyTlSH3hGESLlTUI3FySALnMzbTzWri7SLSEsWilT4NlSxAkoK0aB0BZSSHnMlHBH9kUsXTzVXTfJzI0qhEaHXlVThChF4wMvTzgkxDhEhA2J1T4qUv5X4vfOnNBx0CaABOHXDFHSZVmkMseL4kqgWnM3vUfWfQ7Kw2XkwneUJxJyZS6VAxlAaBhElB5ObSQtg3g1RKCrTwXKiCFAskjmGhVkF0VElBivTVxEVBTJ8q6wUXrN4EbMby4FbPbMqq4URg0HzMXh-XhHxNdRPFVQLiMGzgq3M0sykxsxkzkxzPXj9CBN9kYsWmqMlB5mqmEr+VG21RKtIqGGq0ixstmw1BeWbFSLiDJJIu5Viy22lw+3szuoIXZhPDhnOhf0YrzhR2ALLjekgDDI4g4lPE5m6CKpSOqNmvYrAy9Ug0cVpzWkormDAGZ3qw7PCGaEhLznVXsUOoSPRFFwWjkrqO2E+oquotBzhGPPnLPKXKNJGhVUVFVB-V7EGTSiMPwJCL2I-LSQoWqgXJnXv1CERklVSFKx7Pzgl0MK2OFt-wOOjwtxKKZqquqk0GskluSGlulPlCwKf0araEaHznHMFrVpMIIMRLrxzB32b2RNDJGvdkvG6Q8tjSwNDlNtCBZoL01VskNtsQQtLiFodpFsRIOIAM2CAJAJYk1KMh6H1v9EQLHJlCn2eVKjzivQBhVs2LwJjt-zELb0Zt+lgPTtBEVHaP7A1DSDz2BE7FSSKzGthPVtCJfChs9rTp7BFF7Cz38KskF0HXm20CWnBFjWlSRgsCAA */
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
        BLE_ERROR: {
          target: '.handlingBleError',
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
                src: 'checkBluetoothPermission',
              },
              on: {
                BLUETOOTH_ALLOWED: {
                  target: 'enabled',
                },
                BLUETOOTH_DENIED: {
                  target: '#scan.bluetoothDenied',
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
            APP_ACTIVE: '#scan.checkingBluetoothService',
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
                  target: 'navigatingToHome',
                  actions: ['storingActivityLog'],
                },
              },
            },
            navigatingToHome: {},
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
              callback(model.events.BLUETOOTH_ALLOWED());
            } else {
              callback(model.events.BLUETOOTH_DENIED());
            }
          } catch (e) {
            console.error(e);
          }
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

        monitorConnection: () => (callback) => {
          const subscription = wallet.handleDataEvents((event) => {
            if (event.type === 'onDisconnected') {
              callback({ type: 'DISCONNECT' });
            }
            if (event.type === 'onError') {
              callback({ type: 'BLE_ERROR' });
              console.log('BLE Exception: ' + event.message);
            }
          });

          return () => subscription.remove();
        },

        checkLocationStatus: () => (callback) => {
          checkLocation(
            () => callback(model.events.LOCATION_ENABLED()),
            () => callback(model.events.LOCATION_DISABLED())
          );
        },

        startConnection: (context) => (callback) => {
          wallet.startConnection('OVPMOSIP', context.openId4VpUri);
          const statusCallback = (event: WalletDataEvent) => {
            if (event.type === 'onKeyExchangeSuccess') {
              callback({ type: 'CONNECTED' });
            }
          };

          const subscription = offlineSubscribe(statusCallback);
          return () => subscription?.remove();
        },

        sendVc: (context) => (callback) => {
          const vp = context.createdVp;
          const vc = {
            ...(vp != null ? vp : context.selectedVc),
            tag: '',
          };

          const statusCallback = (event: WalletDataEvent) => {
            if (
              event.type === 'onTransferStatusUpdate' &&
              event.status == 'SUCCESS'
            ) {
              callback({ type: 'VC_SENT' });
            } else if (event.type === 'onVerificationStatusReceived') {
              callback({
                type:
                  event.status === 'ACCEPTED' ? 'VC_ACCEPTED' : 'VC_REJECTED',
              });
            }
          };
          wallet.sendData(JSON.stringify(vc));
          const subscription = offlineSubscribe(statusCallback);
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
      },

      guards: {
        isOpenIdQr: (_context, event) => {
          // don't scan if QR is offline and Google Nearby is enabled
          if (
            Platform.OS === 'ios' &&
            !isBLEEnabled &&
            !event.params.includes('OPENID4VP://')
          )
            return false;

          const param: ConnectionParams = Object.create(null);
          try {
            const pk = event.params.split('OPENID4VP://')[1];
            Object.assign(param, { pk });
            return pk != '';
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
        CONNECTION_TIMEOUT: 5 * 1000,
        SHARING_TIMEOUT: 15 * 1000,
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

//TODO: post discussion with team remove the selectIsExchangingDeviceInfo & selectIsExchangingDeviceInfoTimeOut functions
export function selectIsExchangingDeviceInfo() {
  return true;
}

export function selectIsExchangingDeviceInfoTimeout() {
  return true;
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

export function selectIsHandlingBleError(state: State) {
  return state.matches('handlingBleError');
}
