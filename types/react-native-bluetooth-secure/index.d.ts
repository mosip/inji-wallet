import { EmitterSubscription } from 'react-native';
import { BluetoothState } from 'react-native-bluetooth-state-manager';

declare module 'react-native-idpass-smartshare' {
  class BluetoothApi {
    getConnectionParameters: () => string;

    setConnectionParameters: (params: string) => void;

    getConnectionParametersDebug: () => string;

    createConnection: (mode: ConnectionMode, callback: () => void) => void;

    destroyConnection: () => void;

    send: (message: string, callback: () => void) => void;

    handleNearbyEvents: (
      callback: (event: NearbyEvent) => void
    ) => EmitterSubscription;

    handleLogEvents: (
      callback: (event: NearbyLog) => void
    ) => EmitterSubscription;
  }

  export type ConnectionMode = 'dual' | 'advertiser' | 'discoverer';

  export type TransferUpdateStatus =
    | 'SUCCESS'
    | 'FAILURE'
    | 'IN_PROGRESS'
    | 'CANCELED';

  export type NearbyEvent =
    | { type: 'msg'; data: string }
    | { type: 'transferupdate'; data: TransferUpdateStatus }
    | { type: 'onDisconnected'; data: string };

  export interface NearbyLog {
    log: string;
  }

  export interface ConnectionParams {
    // appId: string;
    cid: string;
    pk: string;
  }

  export = new BluetoothApi();
}

declare module 'react-native-bluetooth-state-manager' {
  type StateChangeCallback = (state: BluetoothState) => void;

  type StateChangeEmitter = Pick<EmitterSubscription, 'remove'>;

  export function onStateChange(
    callback: StateChangeCallback,
    emitCurrentState: boolean
  ): StateChangeEmitter;
}
