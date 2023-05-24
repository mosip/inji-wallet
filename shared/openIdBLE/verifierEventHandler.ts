import openIdBLE from 'react-native-openid4vp-ble';
import { VerifierDataEvent } from 'react-native-openid4vp-ble/src/types/events';

const { verifier } = openIdBLE;
export function subscribe(callback: (event: VerifierDataEvent) => void) {
  return verifier.handleDataEvents((e) => {
    callback(e);
  });
}
