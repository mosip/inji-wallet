export interface VID {
  tag: string;
  uin: string;
  credential: VIDCredential;
  verifiableCredential: VIDVerifiableCredential;
  generatedOn: Date;
  requestId: string;
  reason?: string;
}

export interface VIDCredential {
  id: string;
  uin: string;
  fullName: string;
  gender: string;
  biometrics: {
    // Encrypted Base64Encoded Biometrics
    face: string;
    finger: {
      left_thumb: string;
      right_thumb: string;
    };
  };
  dateOfBirth: string;
  phone: string;
  email: string;
  region: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface VIDVerifiableCredential {
  id: string;
  transactionId: string;
  type: {
    namespace: string;
    name: string;
  };
  timestamp: string;
  dataShareUri: string;
  data: {
    credential: string;
    proof: {
      signature: string;
    };
    credentialType: string;
    protectionKey: string;
  };
}

export interface VIDLabel {
  singular: string;
  plural: string;
}
