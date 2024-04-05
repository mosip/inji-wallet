import {CredentialTypes} from '../VerifiableCredential/VCMetaMachine/vc';

export const IssuersEvents = {
  SELECTED_ISSUER: (id: string) => ({id}),
  DOWNLOAD_ID: () => ({}),
  BIOMETRIC_CANCELLED: (requester?: string) => ({requester}),
  COMPLETED: () => ({}),
  TRY_AGAIN: () => ({}),
  RESET_ERROR: () => ({}),
  CHECK_KEY_PAIR: () => ({}),
  CANCEL: () => ({}),
  STORE_RESPONSE: (response?: unknown) => ({response}),
  STORE_ERROR: (error: Error, requester?: string) => ({error, requester}),
  RESET_VERIFY_ERROR: () => ({}),
  SELECTED_CREDENTIAL_TYPE: (credType: CredentialTypes) => ({credType}),
};
