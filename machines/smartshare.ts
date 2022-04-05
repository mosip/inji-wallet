import SmartShare from '@idpass/smartshare-react-native';
import { EmitterSubscription } from 'react-native';
import { createModel } from 'xstate/lib/model';
import { Message } from '../shared/Message';
import { EventFrom } from 'xstate';

const model = createModel(
  {
    eventChannel: {} as EmitterSubscription,
    logChannel: {} as EmitterSubscription,
    connectedTo: {} as DeviceInfo,
    mode: '' as SmartShare.ConnectionMode,
  },
  {
    events: {
      DISCOVER: () => ({}),
      ADVERTISE: (params: SmartShare.ConnectionParams) => ({ params }),
      DEVICE_FOUND: (qrCode: string) => ({ qrCode }),
      EVENT: (event: SmartShare.NearbyEvent) => ({ event }),
      SEND: (message: Message<unknown>) => ({ message }),
      SENT: () => ({}),
      LOG: (message: string) => ({ message }),
      DESTROY: () => ({}),
      // $msg: () => ({}),
      // $transferupdate: () => ({}),
      // $onDisconnected: () => ({}),
    },
  }
);

type DeviceFoundEvent = EventFrom<typeof model, 'DEVICE_FOUND'>;

export const smartShareMachine = model.createMachine(
  {
    id: 'smartshare',
    context: model.initialContext,
    invoke: {
      src: 'listenForLogs',
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          DISCOVER: {
            target: 'connecting',
            actions: ['setDiscoverer'],
          },
          ADVERTISE: {
            target: 'connecting',
            actions: ['setAdvertiser'],
          },
        },
      },
      connecting: {
        invoke: {
          src: 'connect',
        },
        on: {
          DEVICE_FOUND: [
            {
              cond: 'isQrValid',
              target: 'connected',
            },
            { target: 'invalid' },
          ],
        },
      },
      connected: {
        invoke: {
          src: 'listenForEvents',
        },
        on: {},
      },
      disconnected: {
        type: 'final',
      },
      invalid: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      setAdvertiser: model.assign({ mode: 'advertiser' }),

      setDiscoverer: model.assign({ mode: 'discoverer' }),
    },

    services: {
      connect: (context) => (callback) => {
        SmartShare.createConnection(context.mode, () => {
          callback(model.events.DEVICE_FOUND());
        });
      },

      listenForEvents: () => (callback, onReceive) => {
        const subscription = SmartShare.handleNearbyEvents((event) => {
          callback(model.events.EVENT(event));
        });

        onReceive((event: EventFrom<typeof model>) => {
          switch (event.type) {
            case 'SEND':
              SmartShare.send(event.message.toString(), () => {
                callback(model.events.SENT());
              });
              break;
            case 'DESTROY':
              SmartShare.destroyConnection();
              break;
          }
        });

        return () => subscription.remove();
      },

      listenForLogs: () => (callback) => {
        const subscription = SmartShare.handleLogEvents((event) => {
          callback(model.events.LOG(event.log));
        });

        return () => subscription.remove();
      },
    },

    guards: {
      isQrValid: (context, event: DeviceFoundEvent) => {
        const params: SmartShare.ConnectionParams = Object.create(null);
        try {
          Object.assign(params, JSON.parse(event.qrCode));
          return 'cid' in params && 'pk' in params;
        } catch (e) {
          return false;
        }
      },
    },

    delays: {
      // TIMEOUT: 5000
    },
  }
);

export interface DeviceInfo {
  deviceName: string;
  name: string;
  deviceId: string;
}
