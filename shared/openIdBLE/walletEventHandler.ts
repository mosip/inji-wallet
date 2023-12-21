import tuvali from '@mosip/tuvali';
import {WalletDataEvent} from '@mosip/tuvali/src/types/events';

const {wallet} = tuvali;

export function subscribe(callback: (event: WalletDataEvent) => void) {
  return wallet.handleDataEvents(e => {
    callback(e);
  });
}
