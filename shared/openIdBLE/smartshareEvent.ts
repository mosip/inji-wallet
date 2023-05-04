import { DeviceInfo } from '../../components/DeviceInfoList';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import { VC } from '../../types/vc';

export class SmartshareEvent<T extends SmartshareEventType> {
  constructor(public type: T | string, public data: SmartshareEventData<T>) {}

  static fromString<T extends SmartshareEventType>(json: string) {
    const [type, data] = json.split('\n');
    return new SmartshareEvent<T>(type, data ? JSON.parse(data) : undefined);
  }

  toString() {
    return this.data != null
      ? this.type + '\n' + JSON.stringify(this.data)
      : this.type;
  }
}

export interface PairingEvent {
  type: 'pairing';
  data: ConnectionParams;
}

export interface PairingResponseEvent {
  type: 'pairing:response';
  data: 'ok';
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

export type SendVcStatus = 'RECEIVED' | 'ACCEPTED' | 'REJECTED';

export interface SendVcResponseEvent {
  type: 'send-vc:response';
  data: SendVcStatus | number;
}

export interface DisconnectEvent {
  type: 'disconnect';
  data: string;
}

export type SmartshareEventType = SmartshareEvents['type'];
export type SmartshareEventData<T> = Extract<
  SmartshareEvents,
  { type: T }
>['data'];
export type SmartshareEvents =
  | PairingEvent
  | PairingResponseEvent
  | ExchangeReceiverInfoEvent
  | ExchangeSenderInfoEvent
  | SendVcEvent
  | SendVcResponseEvent
  | DisconnectEvent;
