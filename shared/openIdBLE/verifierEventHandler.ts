import tuvali from '@mosip/tuvali';
import {VerifierDataEvent} from '@mosip/tuvali/src/types/events';

const {verifier} = tuvali;
export function subscribe(callback: (event: VerifierDataEvent) => void) {
  return verifier.handleDataEvents(e => {
    callback(e);
  });
}
