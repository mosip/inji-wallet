// TODO: fix export from smartshare library
// import {
//   IdpassSmartshare,
//   GoogleNearbyMessages,
// } from '@idpass/smartshare-react-native';

import SmartshareReactNative from '@idpass/smartshare-react-native';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
const { GoogleNearbyMessages, IdpassSmartshare } = SmartshareReactNative;
import { getDeviceNameSync } from 'react-native-device-info';

import { DeviceInfo } from '../components/DeviceInfoList';
import { VC } from '../types/vc';

export async function onlineSubscribe<T extends SmartshareEventType>(
  eventType: T,
  callback: (data: SmartshareEventData<T>) => void,
  disconectCallback?: (data: SmartshareEventData<T>) => void,
  config?: { keepAlive?: boolean; pairId?: string }
) {
  return GoogleNearbyMessages.subscribe(
    (foundMessage) => {
      if (__DEV__) {
        console.log(
          `[${getDeviceNameSync()}] MESSAGE_FOUND`,
          foundMessage.slice(0, 100)
        );
      }
      const response = SmartshareEvent.fromString<T>(foundMessage);
      if (response.pairId !== config?.pairId) {
        return;
      } else if (response.type === 'disconnect') {
        GoogleNearbyMessages.unsubscribe();
        disconectCallback(response.data);
      } else if (response.type === eventType) {
        !config?.keepAlive && GoogleNearbyMessages.unsubscribe();
        callback(response.data);
      }
    },
    (lostMessage) => {
      if (__DEV__) {
        console.log(
          `[${getDeviceNameSync()}] MESSAGE_LOST`,
          lostMessage.slice(0, 100)
        );
      }
    }
  ).catch((error: Error) => {
    if (error.message.includes('existing callback is already subscribed')) {
      console.log(
        `${getDeviceNameSync()} Existing callback found for ${eventType}. Unsubscribing then retrying...`
      );
      return onlineSubscribe(eventType, callback, disconectCallback, config);
    }
  });
}

export async function onlineSend(event: SmartshareEvents, pairId: string) {
  return GoogleNearbyMessages.publish(
    new SmartshareEvent(event.type, event.data, pairId).toString()
  );
}

export function offlineSubscribe<T extends SmartshareEventType>(
  eventType: T,
  callback: (data: SmartshareEventData<T>) => void
) {
  return IdpassSmartshare.handleNearbyEvents(({ type, data }) => {
    if (type !== 'msg') return;

    const response = SmartshareEvent.fromString<T>(data);
    if (response.type === eventType) {
      callback(response.data);
    }
  });
}

export function offlineSend(event: SmartshareEvents, callback: () => void) {
  IdpassSmartshare.send(
    new SmartshareEvent(event.type, event.data).toString(),
    callback
  );
}

class SmartshareEvent<T extends SmartshareEventType> {
  constructor(
    public type: T | string,
    public data: SmartshareEventData<T>,
    public pairId = ''
  ) {}

  static fromString<T extends SmartshareEventType>(json: string) {
    const [pairId, type, data] = json.split('\n');
    return new SmartshareEvent<T>(
      type,
      data ? JSON.parse(data) : undefined,
      pairId
    );
  }

  toString() {
    const message =
      this.data != null
        ? this.type + '\n' + JSON.stringify(this.data)
        : this.type;
    return [this.pairId, message].join('\n');
  }
}

export interface PairingEvent {
  type: 'pairing';
  data: ConnectionParams;
}

export interface PairingResponseEvent {
  type: 'pairing:response';
  data: string;
}

export interface ExchangeReceiverInfoEvent {
  type: 'exchange-receiver-info';
  data: DeviceInfo;
}

export interface ExchangeSenderInfoEvent {
  type: 'exchange-sender-info';
  data: DeviceInfo;
}

export interface VcChunk {
  total: number;
  chunk: number;
  rawData: string;
}
export interface SendVcEvent {
  type: 'send-vc';
  data: {
    isChunked: boolean;
    vc?: VC;
    vcChunk?: VcChunk;
  };
}

export type SendVcStatus = 'ACCEPTED' | 'REJECTED' | 'RECEIVED';
export interface SendVcResponseEvent {
  type: 'send-vc:response';
  data: SendVcStatus | number;
}

export interface DisconnectEvent {
  type: 'disconnect';
  data: string;
}

type SmartshareEventType = SmartshareEvents['type'];

type SmartshareEventData<T> = Extract<SmartshareEvents, { type: T }>['data'];

type SmartshareEvents =
  | PairingEvent
  | PairingResponseEvent
  | ExchangeReceiverInfoEvent
  | ExchangeSenderInfoEvent
  | SendVcEvent
  | SendVcResponseEvent
  | DisconnectEvent;
