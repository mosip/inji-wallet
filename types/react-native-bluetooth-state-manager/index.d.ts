import { EmitterSubscription } from 'react-native';
import { BluetoothState } from 'react-native-bluetooth-state-manager';

declare module 'react-native-bluetooth-state-manager' {
  type StateChangeCallback = (state: BluetoothState) => void;

  type StateChangeEmitter = Pick<EmitterSubscription, 'remove'>;

  export function onStateChange(
    callback: StateChangeCallback,
    emitCurrentState: boolean
  ): StateChangeEmitter;
}
