/* eslint-disable sonarjs/no-duplicate-string */
import SmartshareReactNative from '@idpass/smartshare-react-native';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
const { IdpassSmartshare, GoogleNearbyMessages } = SmartshareReactNative;

import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { DeviceInfo } from '../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC, VerifiablePresentation } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import { ActivityLogEvents } from './activityLog';
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
    shouldVerifySender: false,
  },
  {
    events: {
      EXCHANGE_DONE: (receiverInfo: DeviceInfo) => ({ receiverInfo }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      SELECT_VC: (vc: VC) => ({ vc }),
      SCAN: (params: string) => ({ params }),
      ACCEPT_REQUEST: (shouldVerifySender: boolean) => ({ shouldVerifySender }),
      VERIFY_AND_ACCEPT_REQUEST: () => ({}),
      VC_ACCEPTED: () => ({}),
      VC_REJECTED: () => ({}),
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
    },
  }
);

export const ScanEvents = model.events;

export const scanMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYEMB2BiAygYQCUBRIgOQH0AhAGQFUCBtABgF1FQAHAe1gEsAXXlwzsQAD0QBmSQDoAjAqYA2AJwAmABxMVAFgDsAViY6ANCACeUgwfkrrWg2oN79SyQF93Z1JlyESFABiAPJ4tDjMbEgg3HyCwqISCAC0TmoyKipKOmp6GvlacnZmlgiS1rb2TI7Orh5eID4YMigANmBoAE68GFB4whhgKPHYYrD8aPxgMmgAZlOdABR41EQAggTkACJE1GsAmgCUWE0t7V09fQNDI5GisQJCItFJcgZyGUpyGkpfakr-NIlRBvFRMDKZXJyST6Jj-eredDNWY9CCXfoYQbDJ5+NakO7RB4jRKIZJKcG-NRMH5yfTQr56YEIb4aGxvDRyAFMPS07IqTyIzAyFEYNG9DFYka4-FyKKcHiPBIvEEGWTclyc-7OYwGDRMoo6cGSJQaY06SQ-U3UgWNJHC1Ho67Y4TShhqOUxBXE5UINRUmSGvTVPRZFSSTlKJlUoMyPRatTGuMmpQ204cTpgDgXXoAFS4EpuWGIeCIAEkAGpEbZEculkvkUukEIE+VxJ4k5mSFQyZzQnkMjSG6FRhM2NRFMEmlQFAypu0oJ2CXpYPDBUikIh4HNELYtz1tpWgV56JQybmOQdfHJxzRRpQGHTycc6NzspgI21CheYm6XGQ9AAFTouCgDNYFgLAxgmKYZnmMAllXddNxzUs13IFCAFkiGCWgc2OU5v0lP9AOA0C4FgPciXbH05HHHtqStHQ5BPN53ijd4jXNY0tGnLs1DnL9Fz-QQAFswC4ABXfgVzxEtqEor1qKPRBnHSDR+x+f4dGsNiLEQJwFB7MMdB0ME5CYIpjAE5owDEFAAAtMCgS4tjAAA3XgUDAUsMFmLgsC2Ut8DXDctwUg9nmUhBrFkEMXGnclciDUw9N9TJHxfKlDQMOwNDsayZFshynJc9zPO83z-KIAANPAAAk8QAcSrLY1yIcLFUi8QVRsPQQxycp8jDTUmUkbRHzG9T1BMlwOQKorHN6UqPK8ny-Mg8ZJmmOYFmWELkNQihMOw3D8LtBaSt6VyVoqvyOu9KKKi+DQnDpS11B+KNdFPHQfhyIpAVe+a7MW5yrrK1bKpkUTxKkmTSDk+6lO6hBB0fKkEwsk9DEkUamL0eQmAsw1yUHU0CozDywAAdz-WAwHabFenLFAsFoACtjWbdyGINYcDXJHDxR5JaXBYxTJ5bl-pxvH-XDGFymkPL1I-U5Kd4Gm6YZ39mdZwLgqQsLWHuRShaSZILVPZRsk0Ixx2UJxRoUAmwV+6lshemEKbKzXehkenGaXKAWdwXZkPIcs8EFrrXhMmQxunbRaU1aEUtKGE5dTjk3hcVQUwaNWfdpv2A514PWcrAhS0CfZyDxLY67wEsAJzHmiAARVoIgcBzaOO2SB9YxPSQQ10TQEwtUactkLRNHi5x1N+b2qeLqB-e1pny6wNYm6IFu2877ve+NwlTZjxBfo0ANfuY6xTIUbJI1SvjHxzmEWN0dll411f18Dy4Q54FkrsPuPpkqxnyOaaobxlDqDxm4a+fVZoanHLOAudp1a+zXkiLyrRWiXA2tBbacEELAOoOhUsWEcJ4ROBgouf4cEM3wb0UBUVzJOHokTHK5k+L5DxkUHs5oqQj0yOSHQ38sHr1FAAvWQVEKhWPh6KiZsQSuEESxUyFllAmSZOad4MgTQPhhMTGE4j0FCkwb-em0jdZYEjo3Zu25dwn1bJ1DsY1ZAmVZLbBi1404XxHo+OMdg3C500KrOhK8tY2K3vY4gAApZCO5WEozBBSaQXxVC6jyOOXRThwR5FNHkWkYYTQSKsWAGJLN-wYCAiBMCEEoJbVgrtHADUq6kEahQqhp1aEWPoSXSpYpy41LqWRcCKSkhQljNpbSqlx4JjyYZF6+QDC-HlnGcp0ThnVJhpJaSQCEYgJcfuNxPp1DpEyFw0Jc8uy6M5FfBePwOIlP4uY5oli-xoBQF5DgUwIABSChhIKEQTnKPPmUXIZ57y-DjOaJQN5dGZJkP8SB2g4TaXzoKD5Ay14ZgAFY3EgICnAwKcCgqUWfDstEwwyB+CoJMahtJBkns-fGhNibKGpL9CJ-Sol+zcvBXgsxzCXFLBASpgh+DmCwIEHeVZyxrGoKWZxlKIruNpPIY0751SYtxs-XQBMcbGgtFSB5aDsUyE+QKoVIqxUSowFKmVcr6yNkVcq1VJt1U0VZEZU1uoGUciYk-dO9L45E2pKqQcuplBbJtd0O1vRxWSoEDKw5iMwVUp9JoU84YHz3l0KaC5o0ASnlogCEehhHB2D0HG7BGZJgAI4FgCAwhpg9DclwAA1tMQu-L60dCDuWDgCAO1cHQLcVgkzEB6HDCisMcZJp-BHqNME6QrzatnWNNQ-J3lWtxS0BtQ7m3wWAp0GQHBWiTD8p0ES-tIk-wYUepto6MCdonU8SI06ECzvSKLBMKhvhfDWXIKeMY4RVtUBZaEbzLXWrXh2tA+CIDJsdamklZKKVerOVFVI1InymnvDUH4Fp-FlGyLIJlQ5uRFEHLBz8OL+01Lckh3gKGHVOqLEQHMBBa6V2rnWLmh1v19TPHlc004d1whemoUaWgjX6BcNSWkF5a17rRKgRcxL9aYe-feAmv011UdNWGO84GzSj3fMxfKe7EPIYwyC79ORux-B5F2VSYY9SpTNaeEMqdh52GNBahjLR7JDC7Zcag47G3CBwPBG6oXwuXBwNBCSEFqChCE2hMgawaDJMzd63D44XbRmMBc9KCL9TGHSDlPqFoeS6H0Ly5oDkku9Cix+2L8XyqJZQBF3oKXJhpawBloBKE0L61y6sT1p9CvC1+hkEy4YiaAb6uSUDqVAPpAxf8E8VyTIFVa31yL0WRhxc6AljMABHCScAg55iIBgNAAAjdoI3MvjYoDlvLM3XEPRRryAxJ5LyaCYt8akTIa3yGYl2QxxkviHbC8d9rp2njncu2AG7d3LgPae69sA72xuHW2EFKb+W1U4ZRgNOlTKLTjQZU4B8TJNKxh4WGHKYI3OI7a1ADrMWMDo560d-rUAALwRErwcCOJRtZa+6QMnv3Tn-djqeBFJpMqDgUFoLzpR6Qz3DIOQwWhyRLz3cLk7nWBfda8r1kXYvb2S74C6GXn2Sc4AV052iGRVR2CZfefQjh9RUjFuivOEavZm6RyLvnZ3rfTA0y99oAKXfE+IIfHuTmOEMmcKoHkcUdczq0AGcoTE1kIp5DkbnyPeeo66xdnrDqNYArWABACjcUKVic9pWMD5DAhhyhyXSuvuRXxgeZd4yV6RV+j7Xq39ebeN+JSntCaeu4Z4K5TpIfUPjvkyEGTQbwR4F+ZNUNks7HAKFpOUTwDQMBcAlfAaITRsPK9JOaR81scisjhOZAEBgowCJFBRrSBmoGQFQ9DfKCCCov7IxJATQjylrKBximhl66Ld4eIWRaQmgwhyCHbnDdDihCRCzgrUqDw5AmizrUhdimi3ipQqYExpD3hBbSZqaWoijDIFjOhdQkE0TMTyDRoXKGgRo8j6hBini5B5R5p+iwpYohbpiZjZhQB5icH8AwEqIpAwgZBDSzqlJ5BuBkZUhghPjhjIHOBSGHZCS9BqEQoDxXy5BMq0QwZ2ysqlAJguDxxcTlDGAwgPgaAWE-ibyjKkQNLWH9zmQopwqOGSD5IJgvTsThGDgZI8RFr0YESWFrx7JSShE+jZRA47oX6PzREGEcR0pcQmjaApHAzFRLTgw3RrRcDZFRQEzPSvQ8jvQ5pRiGDgi-Qewmjlql5VGgzLTlT1FBH1LkSNEA47rhpZBQISaSH-7eb5A-R-SVoXLcSDGXRQDXQjFQyZGqGzab5SBdgQJ+isjywmTVBfQvhaE2wAwAhAx7rwaTHmxOBlrhJEZOAkaDijQJjpAXHZR1ZZCpEPqSKlybwswvH6RjjrK+FgjqTmSMjPyOCyBjS94MrciTSsEhbwYtCYC4LMJQBQkIBQ7QiAYPhYwPEqBTymQGJbYMrJhEysh1pSI7IoDEk8gGKYnA5GDIF9S6Lng07LEvjJyxpPEHrWJsljHjKP5-awEggCLkizo8nchzxImlD-QfArKsjrJ9ggl8qPqDJVIoDQy8BiT7LEkPiPg+6qCBIjxvAhoXzjhamaA6mvgjz6mMaGlrzfK-L-LEk7o1ahg55JEUZoEAjxyVqGjRk5SyF9ren7qErDCQDEk0qnh2CYq6jaQ7o6LInVDxy5xQIGRjRmJwYHpPYeRQCNq5hcB1RcBiQBnqCEz0q0jjgcg7q6I8hsgAiFAFolksmCoJqipJocapoBm6ixjZDcgZnVCzElq6B0pWghjlBKbNb7pMYoDPrMwcAcmaBniGgWhGAYrTjUnPzn6xj5FAHbrBbxmSJ2ZsaoZOrEkizRHF68maTA78lnnTGqiKBMohg6kFQaaEREoQDElTkBjOyWg3jQjH5JRGow4vhcjfClkhb3lgWHGv5lCOBnjJSlqcjWB9gAE3HopzIemYnT4W786C5eTPlagZClamR+jpTqmIC-Cni-kV4UE5mUUo6W40XTDm4DapaylK7ykpDFbxxGAUZ9SzGAbH5Vo9jhivh+iXE2aWpCU178Vx77pY7jA45cCPaJ5gDgVBK-rQZSxmiLGlCKW-kqVUbjS8VaXUU6WaX24S5S7EFZpsL4aGbRE6kkYWSnnD6qgZARpZDeGebYkERR5UWx7z7x6S7GUYVynqH76LY-BSwfSkZMiyUGL3jjh8RYy4GR484x5o46WL4pViXqEwpPjvAnlaDSDFB0ETgoo5RwjOBwnmg37uBAA */
  model.createMachine(
    {
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
                  actions: 'setShouldVerifyPresence',
                },
                CANCEL: {
                  target: 'cancelling',
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
                },
                FACE_INVALID: {
                  target: 'invalidIdentity',
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
            return { ...event.vc, reason };
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

        logShared: send(
          (context) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context.selectedVc),
              action: 'shared',
              timestamp: Date.now(),
              deviceName:
                context.receiverInfo.name || context.receiverInfo.deviceName,
              vcLabel: context.selectedVc.tag || context.selectedVc.id,
            }),
          { to: (context) => context.serviceRefs.activityLog }
        ),

        openSettings: () => Linking.openSettings(),

        setShouldVerifyPresence: assign({
          selectedVc: (context) => ({
            ...context.selectedVc,
            shouldVerifyPresence: context.shouldVerifySender,
          }),
        }),
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
