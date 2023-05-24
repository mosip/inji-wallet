import openIdBLE from 'react-native-openid4vp-ble';
import { WalletDataEvent } from 'react-native-openid4vp-ble/src/types/events';

const { wallet } = openIdBLE;

export function subscribe(callback: (event: WalletDataEvent) => void) {
  return wallet.handleDataEvents((e) => {
    callback(e);
  });
}
