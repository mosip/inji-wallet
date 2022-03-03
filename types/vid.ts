export interface VID {
  tag: string;
  uin: string;
  credential: {
    biometrics: {
      face: string;
      finger: {
        left_thumb: string;
        right_thumb: string;
      };
    };
  };
  verifiableCredential: VerifiableCredential;
  generatedOn: Date;
  requestId: string;
  reason?: string;
}

export interface CredentialSubject {
  UIN: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  biometrics: string; // Encrypted Base64Encoded Biometrics
  city: string;
  dateOfBirth: string;
  email: string;
  fullName: string;
  gender: string;
  id: string;
  phone: string;
  postalCode: string;
  province: string;
  region: string;
}

export interface VerifiableCredential {
  '@context': (string | Record<string, unknown>)[];
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

export type VerifiableCredentialType =
  | 'VerifiableCredential'
  | 'MOSIPVerfiableCredential'
  | string;

export interface VIDLabel {
  singular: string;
  plural: string;
}
