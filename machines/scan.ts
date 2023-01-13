/* eslint-disable sonarjs/no-duplicate-string */
import SmartshareReactNative from '@idpass/smartshare-react-native';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import { default as IdpassSmartshare } from '../lib/smartshare';
import { USE_BLE_SHARE } from 'react-native-dotenv';
const { GoogleNearbyMessages } = SmartshareReactNative;

import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
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
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYEMB2BiAygYQCUBRIgOQH0AhAGQFUCBtABgF1FQAHAe1gEsAXXlwzsQAD0QBmSQDoAjAqYA2AJwAmABxMVAFgDsAViY6ANCACeUgwfkrrWg2oN79SyQF93Z1JlyESFABiAPJ4tDjMbEgg3HyCwqISCAC0TmoyKipKOmp6GvlacnZmlgiS1rb2TI7Orh5eID4YMigANmBoAE68GFB4whhgKPHYYrD8aPxgMmgAZlOdABR41EQAggTkACJE1GsAmgCUWE0t7V09fQNDI5GisQJCItFJcgZyGUpyGkpfakr-NIlRBvFRMDKZXJyST6Jj-eredDNWY9CCXfoYQbDJ5+NakO7RB4jRKIZJKcG-NRMH5yfTQr56YEIb4aGxvDRyAFMPS07IqTyIzAyFEYNG9DFYka4-FyKKcHiPBIvEEGWTclyc-7OYwGDRMoo6cGSJQaY06SQ-U3UgWNJHC1Ho67Y4TShhqOUxBXE5UINRUmSGvTVPRZFSSTlKJlUoMyPRatTGuMmpQ204cTpgDgXXoAFS4EpuWGIeCIAEkAGpEbZEculkvkUukEIE+VxJ4k5mSFQyZzQnkMjSG6FRhM2NRFMEmlQFAypu0oJ2CXpYPDBUikIh4HNELYtz1tpWgV56JQybmOQdfHJxzRRpQGHTycc6NzspgI21CheYm6XGQ9AAFTouCgDNYFgLAxgmKYZnmMAllXddNxzUs13IFCAFkiGCWgc2OU5v0lP9AOA0C4FgPciXbH05HHHtqStHQ5BPN53ijd4jXNY0tGnLs1DnL9Fz-QQAFswC4ABXfgVzxEtqEor1qKPRBnHSDR+x+f4dGsNiLEQJwFB7MMdB0ME5CYIpjAE5owDEFAAAtMCgS4tjAAA3XgUDAUsMFmLgsC2Ut8DXDctwUg9nmUhBrFkEMXGnclciDUw9N9TJHxfKlDQMOwNDsayZFshynJc9zPO83z-KIAANPAAAk8QAcSrLY1yIcLFUi8QVRsPQQxycp8jDTUmUkbRHzG9T1BMlwOQKorHN6UqPK8ny-Mg8ZJmmOYFmWELkNQihMOw3D8LtBaSt6VyVoqvyOu9KKKi+DQnDpS11B+KNdFPHQfhyIpAVe+a7MW5yrrK1bKpkUTxKkmTSDk+6lO6hBDXBQxzKDIpfhylRRoUPQz3KC1qSTFRoQKjMPLAAB3P9YDAdpsV6csUCwWgAK2NZt3IYg1hwNckcPFHkloj4uzyvQ+L6pxjVG+8NB7HKORPE1VRMymytp+nGd-Fm2cC4KkLC1h7kU4WkmSEz0mMLSmIMAF1DkfHmKJ1UHfvZwxtnBpTip3htd6GQGaZpcoFZ3BdmQ8hyzwIWustzGZHvJQ8nJdTU-JxlUvKd4ial5jfnJnKU19u1-cDqBg915nw7ZysCFLQJ9nIPEtlbvASwAnNeaIABFWgiBwHN447MlYpDdLfpPcnWVGwdwWcLQtByQdp016m6aDkO9brrA1k7ohu97geh5H03CXNhPEH0bsTO0r4mFt36mSYmMwycVVtCfyQ9A3gOt5Vx3rXCOeBZK7FHjRU0yc-TZH+NoK8Dt5YcljPkRMoIOT8TLkKCugDq6h0uBHHMwRGqNVWOQcIRBNiIRwGQc+HoqIW1JG8cEaDpD6EMA+Wk2dSgwl-snTOv83BwiKD7QUzRcF-iRF5VorRLgbWgttOCCFwHUHQqWLCOE8InHLlrPB0jGZyN6JAqK5knD0SfjlcyfF8ijSYt2B8kgqS-0yOSHQ-9K7V1FIQg2QVEKhXoWbCKHZeTpGsCGeBSUpYpVKC+N4MhchP2ML8ZQH4-Z6J1t4-WWBY4dy7tuXcF9WydQ7GoXQAYTLky7G4FQLhJCvwBB8IwrgnaqGqB4vBDMsl71ycQAAUshHcJiUZ5Q+MIp+agmJdnpK-UyhMHaDWNBOfk2CJEZO3mAbprN-wYCAiBMCEEoJbVgrtHADVG6kEauozRp0dE4PWUAzZYo647L2WRcCwykiAljExQcBMQyqk+qlEyupk7GGUOOCy6UOmZOedsmGklpJgIRhAop+4Sk+iqRkP6vzNCWIMLM+J5RAzBnHBTVZMhJFBzQCgLyHApgQACkFDCQUIhosYdfMo3wzxckcKofI74eE3x+GqEyyTf5jT6jCoOGYABWNxIBMpwCynAbKGFXxCWU8EL59Cml0N8bkeoc4mVkICpxoI3HSGlVXNy8FeCzHMJcUsEBNmCH4OYLAgQD5VnLGsagpZCnquCT6b28gnFMQBGU1Q2lX4Gh7JoB26gwQhmtTIW13QHVOpdRgN1HqvX1kbL6-1gagkYtMSeIyIjoSOF0M4WNnIzyGC1ayRwcJU3pvtY63ozrXUCA9cixG7KNU+iSjIcM3x3iGnKAmQw884wZAsiav0VipappQBmSYhCOBYAgMIaYPQ3JcAANbTHSZvKRG6w7lg4AgA9XB0C3FYJ8xAN4ElmWpFwz+ahY2mTHXlD2zj7xrsvVurA8FgKdBkBwVokw-KdBEsHXR56g7ro6Fem9d6H1PEiM+hAcZZD0gBDq2i6khVlA5KeLQuQAS-2Yu7VNB60ByIgD2nNfalUqrVaWh6ItxyE2hEULQ3JuROPqTnPK4IoXji+GCHVDGMBuSY7wFj2bc1FiIDmAgLcG5NzrNzQ6uGTRnlZC9C89takEuBdUR8jgymZVZCwtJdo0SoEXIqw2nHDPOADBJv0JqXphjvDGd82RJ7vmYvlCljHmMcdZbhnI3Y-g8i7KpMMRrShUgbSGaEdQ7DGjEZ+ZoDkhhHsuNQe9m7hA4HgjdFo9kSuXBwNBCSEFqChH02hMgawaBDKHcGqKqRXbqGE6ZP06VU76ltkZPqFoeS6H0E5r89WUCld6OVrDVWavlTqw13oTXJgtawG1sBKE0KG266sEtl9+si1+hkE15ltDMRPBZJk5MbaTP+DPWT7iKXFZW2VirIxqudFqxmAAjhJOAYc8xEAwGgAARu0I77XTsUC6z1q7xSeOvBfMnE8l5NBMQNelxAdh+PMWqayYyXwCr-dW1AdblWMAg7B2ASH0PLiw-h0jsAKOTuHW2EFC7vWg1lpRgNGQL1zQ8TmZ-GJiBNKxmsWGXG3JyXiJ2wDtbQOnis+2-Ty4AF4IiV4OBHEx2Ovo9ICLrH6Kccgjx6nE09nifL31MaWQppvj6F1MoZQpdNeG51xtlnW2vJa4Z8b+DZu+Aukt2joXOBbfxdohkVUdhJn3l99+1KtEn5nm-qockP9ftB+WwzpnwPw-TBc4j9ojKE+C+IKfYe8XzEMmcKoHkcVSd4a0AGYlbxfh9VpFg8vu3Ge6826D7b2aA6MrWABACHcUKVni9pWMD5DAAunG8Z2efDXyCMOZd4yV6R04r4D0P+uI-z8VU3tCLfB5t76+LpIqszyaBPG-T3gXD9PRSy6ipwUbaT1ANAYBcAurwDRBNDcbIyWymSSY5DZD2yOzjhRjcqqAPjWC0j5ZUgFanA9A0qCC2rwFMKoxjpCLwKpyaDlC-CzI2BjRjS0TZAmgwhyB07nDdDihCTCwcohIPgBj-DqSTQSxOJ960jeZpD3j5ZwjqQFQijPIFjOhdQCE0Suw+45R+ZJLq76hBini5B5Thi2Yj6B6FZQYZhZg8FQB5gqH8DkGcrJAwjYqSxdiJgioK6+jfxPjhhxisgFyOB05CS9COFjygq5CTJixOJGAJh94zpe5cS6CsiGj-DBE-i1yvKkQHJhE+iizgiRFMTjgxFwgWi54ZYcRS5cQmjaB6rj4WGES7zQy8BiSIq5FRTZT45lKOCcgvjhrsTmRVHSA1G8TqDAzFRLTgw3RrRcDtEoyEzPSvQ8jvSaCRipS5C-oJQy60jk7GjjGgzLTlQzFZH7LkRzGvBlJjoILmjGASyq5Rj5A-R-S-wRIJgmj7GXRQDXRHFQwIpSTnFSBdioJ+isjhgwjZRfR45bHjjqCRoPjWoAkpBahhqCZPxBhSwJijSTLdici75JIciLZrLIaPIEL6yIkNqAguDvgvgTJrG8J9SSZaBqzPZhjvhrqYAyJGJQCIm6CEwGEE5ZDGC0TywOw-JxiGrUifZl4WFUqPJbIoCIkAhgrUHew-DvivxOLpDmSGgzgni5CppdJwooAnHvIwHY4IEgiDHkgqnVBqliaxLaSKxuIQrmQTjSlnoAKwo+LNGtH-HXbv4qTlA9jGjcjkzTiDg8iMFOngqNJQq6Cpo0p0oMqIl0FGTsKTT5ARZ0k3xBg4m0S1rqQ9GGCppyoKoQDkllKmrhjBiajaReHcToyUisjUhPyJSprw4eRQCbq5hcB1RcBiQpnQKn7cgmgzz3yWaxJZAfBpZon5mwntp2qZrdqqZ9opm-ovY6qZCqT9SjT6rJy6hE4vRUbaTAZoZbqIlzZEypzJRd5jT1nThhLGBxhGBPzqRvDyaKbMasa5qImixMSD4-DDTPkOyci7kVpjTCIApPlSoUouaNHDCQCKmGgBgEyWg3jQjxF9R8mU4vhcg+4FTRbKaInTqNrJL-Cci4G-yYF47fzaSqjimrp-ZX4h7M635gC-nInDbJTqBlK8lMi-CnjhbkhxSyEOyX6T5V56416R6NbNZmn24WlImuzlDKDmh9RZCmTfBMicLBmcjhh+aGiRYT7a5T437SUQ5Q7jBc5cBw717sX+kO4IDZCxgYkWSYzmjZATkvoVCqh6W0STKGXunzjMWmWsXSXB5QDR6m7m78HDqmLUg+YfysjJgsF4wAGyBghPyCnmhpZ-xMUSXT5h6z535m52XlkOWKVBjpDJHCWjamiDjaUhgCI9F8QWQ8jiUmWSUz61b37lXmkUEpxPjvDTjTjvgpb6gTgJI5RwjOAPh5TmieCeBAA */
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
          exit: ['disconnect', 'clearReason', 'clearCreatedVp'],
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
            IdpassSmartshare.createConnection('discoverer', () => {
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
          // don't scan if QR is offline and Google Nearby is enabled
          if (Platform.OS === 'ios' && !USE_BLE_SHARE) return false;

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
