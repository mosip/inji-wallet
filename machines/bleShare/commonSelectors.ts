import {StateFrom} from 'xstate';
import {scanMachine} from './scan/scanMachine';
import {requestMachine} from './request/requestMachine';

type State = StateFrom<typeof scanMachine & typeof requestMachine>;

export function selectIsCancelling(state: State) {
  return state.matches('cancelling');
}

export function selectIsReviewing(state: State) {
  return state.matches('reviewing');
}

export function selectIsAccepted(state: State) {
  return state.matches('reviewing.accepted');
}

export function selectIsRejected(state: State) {
  return state.matches('reviewing.rejected');
}

export function selectIsVerifyingIdentity(state: State) {
  return state.matches('reviewing.verifyingIdentity');
}

export function selectIsInvalidIdentity(state: State) {
  return state.matches('reviewing.invalidIdentity');
}

export function selectIsDisconnected(state: State) {
  return state.matches('disconnected');
}

export function selectIsBluetoothDenied(state: State) {
  return state.matches('bluetoothDenied');
}

export function selectBleError(state: State) {
  return state.context.bleError;
}

export function selectIsHandlingBleError(state: State) {
  return state.matches('handlingBleError');
}

export function selectReadyForBluetoothStateCheck(state: State) {
  return state.context.readyForBluetoothStateCheck;
}

export function selectIsNearByDevicesPermissionDenied(state: State) {
  return state.matches('nearByDevicesPermissionDenied');
}

export function selectIsBluetoothPermissionDenied(state: State) {
  return state.matches('bluetoothPermissionDenied');
}

export function selectIsStartPermissionCheck(state: State) {
  return state.matches('startPermissionCheck');
}
