import {NativeModules} from 'react-native';

const {ODKIntentModule} = NativeModules;

export enum ODKIntentVcField {
  UIN = 'uin',
  CredentialId = 'credential_id',
  VcVersion = 'vc_version',
  FullName = 'full_name',
  DateOfBirth = 'date_of_birth',
  Email = 'email',
  Phone = 'phone',
  Issuer = 'issuer',
  IssuanceDate = 'issuance_date',
  Gender = 'gender',
  Region = 'region',
  Province = 'province',
  City = 'city',
  PostalCode = 'postal_code',
  Biometrics = 'biometrics',
}

export type ODKIntentVcData = Partial<Record<ODKIntentVcField, string>>;
interface ODKIntentInterface {
  isRequestIntent: () => Promise<boolean>;
  sendBundleResult: (vcData: ODKIntentVcData) => void;
}

export default ODKIntentModule as ODKIntentInterface;
