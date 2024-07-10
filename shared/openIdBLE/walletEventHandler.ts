import {WalletDataEvent} from '../tuvali/types/events';

import {wallet} from '../tuvali';

export function subscribe(callback: (event: WalletDataEvent) => void) {
  return wallet.handleDataEvents(e => {
    callback(e);
  });
}
