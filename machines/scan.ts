import SmartShare from '@idpass/smartshare-react-native';
import LocationEnabler from 'react-native-location-enabler';
import SystemSetting from 'react-native-system-setting';
import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { EmitterSubscription, Linking, PermissionsAndroid } from 'react-native';
import { DeviceInfo } from '../components/DeviceInfoList';
import { Message } from '../shared/Message';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import { ActivityLogEvents } from './activityLog';
import { VC_ITEM_STORE_KEY } from '../shared/constants';

const checkingAirplaneMode = '#checkingAirplaneMode';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    selectedVc: {} as VC,
    reason: '',
    loggers: [] as EmitterSubscription[],
    locationConfig: {
      priority: LocationEnabler.PRIORITIES.BALANCED_POWER_ACCURACY,
      alwaysShow: false,
      needBle: true,
    },
    vcName: '',
  },
  {
    events: {
      EXCHANGE_DONE: (receiverInfo: DeviceInfo) => ({ receiverInfo }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      SELECT_VC: (vc: VC) => ({ vc }),
      SCAN: (params: string) => ({ params }),
      ACCEPT_REQUEST: () => ({}),
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
      FLIGHT_ENABLED: () => ({}),
      FLIGHT_DISABLED: () => ({}),
      FLIGHT_REQUEST: () => ({}),
      LOCATION_REQUEST: () => ({}),
      UPDATE_VC_NAME: (vcName: string) => ({ vcName }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      APP_ACTIVE: () => ({}),
    },
  }
);

export const ScanEvents = model.events;

export const scanMachine = model.createMachine(
  {
    tsTypes: {} as import('./scan.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'scan',
    initial: 'inactive',
    on: {
      SCREEN_BLUR: 'inactive',
      SCREEN_FOCUS: 'checkingAirplaneMode',
    },
    states: {
      inactive: {
        entry: ['removeLoggers'],
      },
      checkingAirplaneMode: {
        id: 'checkingAirplaneMode',
        invoke: {
          src: 'checkAirplaneMode',
        },
        initial: 'checkingStatus',
        states: {
          checkingStatus: {
            on: {
              FLIGHT_DISABLED: '#checkingLocationService',
              FLIGHT_ENABLED: 'enabled',
            },
          },
          requestingToDisable: {
            entry: ['requestToDisableFlightMode'],
            on: {
              FLIGHT_DISABLED: 'checkingStatus',
            },
          },
          enabled: {
            on: {
              FLIGHT_REQUEST: 'requestingToDisable',
              FLIGHT_DISABLED: checkingAirplaneMode,
              FLIGHT_ENABLED: checkingAirplaneMode,
            },
          },
        },
      },
      checkingLocationService: {
        id: 'checkingLocationService',
        invoke: {
          src: 'checkLocationStatus',
        },
        initial: 'checkingStatus',
        states: {
          checkingStatus: {
            on: {
              LOCATION_ENABLED: 'checkingPermission',
              LOCATION_DISABLED: 'requestingToEnable',
              FLIGHT_ENABLED: checkingAirplaneMode,
            },
          },
          requestingToEnable: {
            entry: ['requestToEnableLocation'],
            on: {
              LOCATION_ENABLED: 'checkingPermission',
              LOCATION_DISABLED: 'disabled',
            },
          },
          checkingPermission: {
            invoke: {
              src: 'checkLocationPermission',
            },
            on: {
              LOCATION_ENABLED: '#clearingConnection',
              LOCATION_DISABLED: 'denied',
            },
          },
          denied: {
            on: {
              LOCATION_REQUEST: {
                actions: ['openSettings'],
              },
              APP_ACTIVE: 'checkingPermission',
            },
          },
          disabled: {
            on: {
              LOCATION_REQUEST: 'requestingToEnable',
            },
          },
        },
      },
      clearingConnection: {
        id: 'clearingConnection',
        entry: ['disconnect'],
        after: {
          CLEAR_DELAY: 'findingConnection',
        },
      },
      findingConnection: {
        id: 'findingConnection',
        entry: ['removeLoggers', 'registerLoggers'],
        on: {
          SCAN: [
            {
              cond: 'isQrValid',
              target: 'preparingToConnect',
              actions: ['setConnectionParams'],
            },
            { target: 'invalid' },
          ],
          FLIGHT_ENABLED: checkingAirplaneMode,
        },
      },
      preparingToConnect: {
        entry: ['requestSenderInfo'],
        on: {
          RECEIVE_DEVICE_INFO: {
            target: 'connecting',
            actions: ['setSenderInfo'],
          },
        },
      },
      connecting: {
        invoke: {
          src: 'discoverDevice',
        },
        on: {
          CONNECTED: 'exchangingDeviceInfo',
        },
      },
      exchangingDeviceInfo: {
        invoke: {
          src: 'exchangeDeviceInfo',
        },
        on: {
          DISCONNECT: '#scan.disconnected',
          EXCHANGE_DONE: {
            target: 'reviewing',
            actions: ['setReceiverInfo'],
          },
        },
      },
      reviewing: {
        on: {
          CANCEL: 'findingConnection',
          DISMISS: 'findingConnection',
          ACCEPT_REQUEST: '.selectingVc',
          UPDATE_REASON: {
            actions: ['setReason'],
          },
        },
        initial: 'idle',
        states: {
          idle: {
            on: {
              ACCEPT_REQUEST: 'selectingVc',
            },
          },
          selectingVc: {
            on: {
              SELECT_VC: {
                target: 'sendingVc',
                actions: ['setSelectedVc'],
              },
              CANCEL: 'idle',
            },
          },
          sendingVc: {
            invoke: {
              src: 'sendVc',
            },
            on: {
              DISCONNECT: '#scan.disconnected',
              VC_ACCEPTED: 'accepted',
              VC_REJECTED: 'rejected',
            },
          },
          accepted: {
            entry: ['logShared'],
            on: {
              DISMISS: 'navigatingToHome',
            },
          },
          rejected: {},
          cancelled: {},
          navigatingToHome: {},
        },
        exit: ['disconnect', 'clearReason'],
      },
      disconnected: {
        on: {
          DISMISS: 'findingConnection',
        },
      },
      invalid: {
        on: {
          DISMISS: 'findingConnection',
        },
      },
    },
  },
  {
    actions: {
      requestSenderInfo: sendParent('REQUEST_DEVICE_INFO'),

      setSenderInfo: model.assign({
        senderInfo: (_, event) => event.info,
      }),

      requestToEnableLocation: (context) => {
        LocationEnabler.requestResolutionSettings(context.locationConfig);
      },

      requestToDisableFlightMode: () => {
        SystemSetting.switchAirplane();
      },

      disconnect: () => {
        try {
          SmartShare.destroyConnection();
        } catch (e) {
          //
        }
      },

      setConnectionParams: (_, event) => {
        SmartShare.setConnectionParameters(event.params);
      },

      setReceiverInfo: model.assign({
        receiverInfo: (_, event) => event.receiverInfo,
      }),

      setReason: model.assign({
        reason: (_, event) => event.reason,
      }),

      clearReason: assign({ reason: '' }),

      setSelectedVc: model.assign({
        selectedVc: (context, event) => {
          const reason = [];
          if (context.reason.trim() !== '') {
            reason.push({ message: context.reason, timestamp: Date.now() });
          }
          return { ...event.vc, reason };
        },
      }),

      registerLoggers: assign({
        loggers: () => {
          if (__DEV__) {
            return [
              SmartShare.handleNearbyEvents((event) => {
                console.log(
                  getDeviceNameSync(),
                  '<Sender.Event>',
                  JSON.stringify(event)
                );
              }),
              SmartShare.handleLogEvents((event) => {
                console.log(
                  getDeviceNameSync(),
                  '<Sender.Log>',
                  JSON.stringify(event)
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

      openSettings: () => {
        Linking.openSettings();
      },
    },

    services: {
      checkLocationPermission: () => async (callback) => {
        try {
          // wait a bit for animation to finish when app becomes active
          await new Promise((resolve) => setTimeout(resolve, 250));

          const response = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location access',
              message:
                'Location access is required for the scanning functionality.',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (response === 'granted') {
            callback(model.events.LOCATION_ENABLED());
          } else {
            callback(model.events.LOCATION_DISABLED());
          }
        } catch (e) {
          console.error(e);
        }
      },

      checkLocationStatus: (context) => (callback) => {
        const listener = LocationEnabler.addListener(({ locationEnabled }) => {
          if (locationEnabled) {
            callback(model.events.LOCATION_ENABLED());
          } else {
            callback(model.events.LOCATION_DISABLED());
          }
        });

        LocationEnabler.checkSettings(context.locationConfig);

        return () => listener.remove();
      },

      checkAirplaneMode: () => (callback) => {
        SystemSetting.isAirplaneEnabled().then((enable) => {
          if (enable) {
            callback(model.events.FLIGHT_ENABLED());
          } else {
            callback(model.events.FLIGHT_DISABLED());
          }
        });
      },

      discoverDevice: () => (callback) => {
        SmartShare.createConnection('discoverer', () => {
          callback({ type: 'CONNECTED' });
        });
      },

      exchangeDeviceInfo: (context) => (callback) => {
        let subscription: EmitterSubscription;

        const message = new Message('exchange:sender-info', context.senderInfo);
        SmartShare.send(message.toString(), () => {
          subscription = SmartShare.handleNearbyEvents((event) => {
            if (event.type === 'onDisconnected') {
              callback({ type: 'DISCONNECT' });
            }

            if (event.type !== 'msg') return;
            const response = Message.fromString<DeviceInfo>(event.data);
            if (response.type === 'exchange:receiver-info') {
              callback({
                type: 'EXCHANGE_DONE',
                receiverInfo: response.data,
              });
            }
          });
        });

        return () => subscription?.remove();
      },

      sendVc: (context) => (callback) => {
        let subscription: EmitterSubscription;

        const vc = {
          ...context.selectedVc,
          tag: '',
        };

        const message = new Message<VC>('send:vc', vc);

        SmartShare.send(message.toString(), () => {
          subscription = SmartShare.handleNearbyEvents((event) => {
            if (event.type === 'onDisconnected') {
              callback({ type: 'DISCONNECT' });
            }

            if (event.type !== 'msg') return;

            const response = Message.fromString<SendVcStatus>(event.data);
            if (response.type === 'send:vc:response') {
              callback({
                type:
                  response.data.status === 'accepted'
                    ? 'VC_ACCEPTED'
                    : 'VC_REJECTED',
              });
            }
          });
        });

        return () => subscription?.remove();
      },
    },

    guards: {
      isQrValid: (_, event) => {
        const param: SmartShare.ConnectionParams = Object.create(null);
        try {
          Object.assign(param, JSON.parse(event.params));
          return 'cid' in param && 'pk' in param;
        } catch (e) {
          return false;
        }
      },
    },

    delays: {
      CLEAR_DELAY: 250,
    },
  }
);

export function createScanMachine(serviceRefs: AppServices) {
  return scanMachine.withContext({
    ...scanMachine.context,
    serviceRefs,
  });
}

interface SendVcStatus {
  status: 'accepted' | 'rejected';
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

export function selectIsScanning(state: State) {
  return state.matches('findingConnection');
}

export function selectIsConnecting(state: State) {
  return state.matches('connecting');
}

export function selectIsExchangingDeviceInfo(state: State) {
  return state.matches('exchangingDeviceInfo');
}

export function selectIsReviewing(state: State) {
  return state.matches('reviewing');
}

export function selectIsSelectingVc(state: State) {
  return state.matches('reviewing.selectingVc');
}

export function selectIsSendingVc(state: State) {
  return state.matches('reviewing.sendingVc');
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

export function selectIsAirplaneEnabled(state: State) {
  return state.matches('checkingAirplaneMode.enabled');
}
