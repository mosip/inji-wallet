import { WalletBindingResponse } from '../shared/cryptoutil/cryptoUtil';

export interface VC {
  id: string;
  idType: VcIdType;
  tag: string;
  credential: DecodedCredential;
  verifiableCredential: VerifiableCredential;
  verifiablePresentation?: VerifiablePresentation;
  generatedOn: Date;
  requestId: string;
  isVerified: boolean;
  lastVerifiedOn: number;
  locked: boolean;
  reason?: VCSharingReason[];
  shouldVerifyPresence?: boolean;
  walletBindingResponse?: WalletBindingResponse;
  credentialRegistry: string;
}

export interface VCSharingReason {
  timestamp: number;
  message: string;
}

export type VcIdType = 'UIN' | 'VID';

export interface DecodedCredential {
  biometrics: {
    face: string;
    finger: {
      left_thumb: string;
      right_thumb: string;
    };
  };
}

export interface CredentialSubject {
  UIN: string;
  VID: string;
  addressLine1: LocalizedField[] | string;
  addressLine2: LocalizedField[] | string;
  addressLine3: LocalizedField[] | string;
  biometrics: string; // Encrypted Base64Encoded Biometrics
  city: LocalizedField[] | string;
  dateOfBirth: string;
  email: string;
  fullName: string;
  gender: LocalizedField[] | string;
  id: string;
  phone: string;
  postalCode: string;
  province: LocalizedField[] | string;
  region: LocalizedField[] | string;
  vcVer: 'VC-V1' | string;
}

type VCContext = (string | Record<string, unknown>)[];

export interface VerifiableCredential {
  '@context': VCContext;
  'credentialSubject': CredentialSubject;
  'id': string;
  'issuanceDate': string;
  'issuer': string;
  'proof': {
    created: string;
    jws: string;
    proofPurpose: 'assertionMethod' | string;
    type: 'RsaSignature2018' | string;
    verificationMethod: string;
  };
  'type': VerifiableCredentialType[];
}

export interface VerifiablePresentation {
  '@context': VCContext;
  'verifiableCredential': VerifiableCredential[];
  'type': 'VerifiablePresentation';
  'proof': {
    created: string;
    jws: string;
    proofPurpose: 'authentication' | string;
    type: 'RsaSignature2018' | string;
    verificationMethod: string;
    challenge: string;
    domain: string;
  };
}

export type VerifiableCredentialType =
  | 'VerifiableCredential'
  | 'MOSIPVerfiableCredential'
  | string;

export interface VCLabel {
  singular: string;
  plural: string;
}

export interface LocalizedField {
  language: string;
  value: string;
}

export interface linkTransactionResponse {
  authFactors: Object[];
  authorizeScopes: null;
  clientName: string;
  configs: {};
  essentialClaims: string[];
  linkTransactionId: string;
  logoUrl: string;
  voluntaryClaims: string[];
}
