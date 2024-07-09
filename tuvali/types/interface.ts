import type {EmitterSubscription} from 'react-native';
import type {VerifierDataEvent, WalletDataEvent} from './events';
import type {VerificationStatus} from './events';

interface TuvaliModule {
  noop: () => void;
  disconnect: () => void;
}

export interface Verifier extends TuvaliModule {
  startAdvertisement: (advIdentifier: String) => string;
  sendVerificationStatus: (status: VerificationStatus) => void;
  handleDataEvents: (
    callback: (events: VerifierDataEvent) => void,
  ) => EmitterSubscription;
}

export interface Wallet extends TuvaliModule {
  startConnection: (uri: String) => void;
  sendData: (data: string) => void;
  handleDataEvents: (
    callback: (events: WalletDataEvent) => void,
  ) => EmitterSubscription;
}

export interface VersionModule {
  setTuvaliVersion: (version: string) => void;
}
