import tuvali from 'react-native-tuvali';
import { VerifierDataEvent } from 'react-native-tuvali/src/types/events';

const { verifier } = tuvali;
export function subscribe(callback: (event: VerifierDataEvent) => void) {
  return verifier.handleDataEvents((e) => {
    callback(e);
  });
}
