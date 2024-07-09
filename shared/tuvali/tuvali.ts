import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import type {Verifier, Wallet} from './types/interface';

const LINKING_ERROR =
  `The package '@mosip/tuvali' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const VERIFIER_NOT_IMPLEMENTATED_ERROR = `Verifier is not yet implemented on IOS. Please remove Verifier usage on IOS Platform`;
const isIOS = Platform.OS === 'ios';

export const wallet: Wallet = NativeModules.WalletModule
  ? NativeModules.WalletModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export let verifier: Verifier = NativeModules.VerifierModule
  ? NativeModules.VerifierModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(
            isIOS ? VERIFIER_NOT_IMPLEMENTATED_ERROR : LINKING_ERROR,
          );
        },
      },
    );

if (!isIOS) {
  setupModule(verifier);
}

setupModule(wallet);

function setupModule(module: any) {
  if (Platform.OS === 'android') {
    const eventEmitter = new NativeEventEmitter();
    module.handleDataEvents = (callback: (event: any) => void) =>
      eventEmitter.addListener('DATA_EVENT', callback);
  }

  if (isIOS) {
    const eventEmitter = new NativeEventEmitter(module);
    module.handleDataEvents = (callback: (event: any) => void) =>
      eventEmitter.addListener('DATA_EVENT', callback);
  }
}
