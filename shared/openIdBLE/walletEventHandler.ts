import tuvali from 'react-native-tuvali';
import { WalletDataEvent } from 'react-native-tuvali/src/types/events';

const { wallet } = tuvali;

export function subscribe(callback: (event: WalletDataEvent) => void) {
  return wallet.handleDataEvents((e) => {
    callback(e);
  });
}
