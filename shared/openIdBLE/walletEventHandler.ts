import openIdBLE from 'react-native-openid4vp-ble';
import { WalletDataEvent } from 'react-native-openid4vp-ble/lib/typescript/types/bleshare';

const { wallet } = openIdBLE;

export function subscribe(callback: (event: WalletDataEvent) => void) {
  return wallet.handleDataEvents((e) => {
    callback(e);
  });
}
