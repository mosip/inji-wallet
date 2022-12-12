import { DecodedCredential, VerifiableCredential } from '../types/vc';
import { HOST } from './constants';

export class BackendResponseError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export async function request(
  method: 'GET' | 'POST' | 'PATCH',
  path: `/${string}`,
  body?: Record<string, unknown>
) {
  const response = await fetch(HOST + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const jsonResponse = await response.json();

  if (response.status >= 400) {
    throw new Error(jsonResponse.message || jsonResponse.error);
  }

  if (jsonResponse.errors && jsonResponse.errors.length) {
    const { errorCode, errorMessage } = jsonResponse.errors.shift();
    throw new BackendResponseError(errorCode, errorMessage);
  }

  return jsonResponse;
}

interface ResponseError {
  errorCode: string;
  errorMessage: string;
}

interface BackendResponse<T> {
  id: string;
  version: string;
  response: T;
  str?: string;
  responsetime?: string;
  metadata?: string;
  errors?: ResponseError[];
}

export type OtpRequestResponse = BackendResponse<{
  maskedMobile?: string;
  maskedEmail?: string;
}>;

export type VcGenerateResponse = BackendResponse<{
  vc: string;
  message: string;
}>;

export type CredentialRequestResponse = BackendResponse<{
  id: string;
  requestId: string;
}>;

export type CredentialStatusResponse = BackendResponse<{
  statusCode: 'NEW' | 'ISSUED' | 'printing';
}>;

export interface CredentialDownloadResponse {
  credential?: DecodedCredential;
  verifiableCredential?: VerifiableCredential;
}

export type linkTransactionResponse = {
  authFactors?: [];
  authorizeScopes?: null;
  clientName?: string;
  configs?: {};
  essentialClaims?: [];
  linkTransactionId?: string;
  logoUrl?: string;
  voluntaryClaims?: [];
};

//  {
// "authFactors": [{"count": 0, "subTypes": null, "type": "OTP"}, {"count": 1, "subTypes": null, "type": "BIO"}, {"count": 0, "subTypes": null, "type": "PIN"}],
// "authorizeScopes": null,
// "clientName": "Health Service",
// "configs": {"sbi.env": "Developer", "sbi.timeout.CAPTURE": 30, "sbi.timeout.DINFO": 30, "sbi.timeout.DISC": 30},
// "essentialClaims": ["email"],
// "linkTransactionId": "Lw7b1Yu9kJGK2oNzOONDIEpJUTe0nlqTl5PCsrUIjkw",
// "logoUrl": "https://healthservices.dev.mosip.net/images/doctor_logo.png",
// "voluntaryClaims": ["birthdate", "gender", "phone", "name", "picture"]
// }
