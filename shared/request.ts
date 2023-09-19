import { DecodedCredential, VerifiableCredential } from '../types/vc';
import { __AppId } from './GlobalVariables';
import { HOST, MIMOTO_BASE_URL } from './constants';

export class BackendResponseError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export async function request(
  method: 'GET' | 'POST' | 'PATCH',
  path: `/${string}`,
  body?: Record<string, unknown>,
  host= MIMOTO_BASE_URL
) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (path.includes('residentmobileapp'))
    headers['X-AppId'] = __AppId.getValue();

  const response = await fetch(host + path, {
    method,
    headers,
    body: JSON.stringify(body),
  });

  const jsonResponse = await response.json();

  if (response.status >= 400) {
    let backendUrl = host + path;
    let errorMessage = jsonResponse.message || jsonResponse.error;
    console.error(
      'The backend API ' +
        backendUrl +
        ' returned error code 400 with message --> ' +
        errorMessage
    );
    throw new Error(errorMessage);
  }

  if (jsonResponse.errors && jsonResponse.errors.length) {
    let backendUrl = host + path;
    const { errorCode, errorMessage } = jsonResponse.errors.shift();
    console.error(
      'The backend API ' +
        backendUrl +
        ' returned error response --> error code is : ' +
        errorCode +
        ' error message is : ' +
        errorMessage
    );
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
