import {NativeModules} from 'react-native';

const {ODKIntentModule} = NativeModules;

export enum ODKIntentVcField {
  UIN = 'uin',
  FullName = 'full_name',
  DateOfBirth = 'date_of_birth',
  Email = 'email',
  Phone = 'phone',
  Biometrics = 'biometrics',
  Issuer = 'issuer',
  IssuanceDate = 'issuance_date',
}

export type ODKIntentVcData = Partial<Record<ODKIntentVcField, string>>;
interface ODKIntentInterface {
  isRequestIntent: () => Promise<boolean>;
  sendBundleResult: (vcData: ODKIntentVcData) => void;
}

export default ODKIntentModule as ODKIntentInterface;
