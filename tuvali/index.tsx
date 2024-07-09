import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import type {Verifier, VersionModule, Wallet} from './types/interface';
import {EventTypes, VerificationStatus} from './types/events';
import {isAndroid, isIOS} from '../shared/constants';
import {tuvaliVersion} from './tuvaliVersion';

const LINKING_ERROR =
  `The package 'tuvali' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const VERIFIER_NOT_IMPLEMENTATED_ERROR = `Verifier is not yet implemented on IOS. Please remove Verifier usage on IOS Platform`;

const versionModule: VersionModule = NativeModules.VersionModule
  ? NativeModules.VersionModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

const wallet: Wallet = NativeModules.WalletModule
  ? NativeModules.WalletModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

// TODO: Use Actual Verifier module on IOS once Verifier is implemented
let verifier: Verifier = NativeModules.VerifierModule;

if (!isIOS()) {
  if (verifier) setupModule(verifier);
  else
    new Proxy(
      {},
      {
        get() {
          throw new Error(VERIFIER_NOT_IMPLEMENTATED_ERROR);
        },
      },
    );
}

versionModule.setTuvaliVersion(tuvaliVersion);

setupModule(wallet);

//
// ErrorUtils.setGlobalHandler((error, isFatal) => {
//   const eventEmitter = new NativeEventEmitter(NativeModules.Openid4vpBle);
//
//   console.error(
//     `Exception in Tuvali: isFatal: ${isFatal}, error: ${JSON.stringify(
//       error,
//       null,
//       4
//     )}`
//   );
//
//   eventEmitter.emit('EVENT_NEARBY', { type: 'onError', message: '' });
//   Openid4vpBle.destroyConnection(() => {});
// });

function setupModule(module: any) {
  if (isAndroid()) {
    const eventEmitter = new NativeEventEmitter();
    module.handleDataEvents = (callback: (event: any) => void) =>
      eventEmitter.addListener('DATA_EVENT', callback);
  }

  if (isIOS()) {
    const eventEmitter = new NativeEventEmitter(module);
    module.handleDataEvents = (callback: (event: any) => void) =>
      eventEmitter.addListener('DATA_EVENT', callback);
  }
}

export {verifier, wallet, EventTypes, VerificationStatus};
