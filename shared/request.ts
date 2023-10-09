import {
  DecodedCredential,
  VerifiableCredential,
} from '../types/VC/ExistingMosipVC/vc';
import {__AppId} from './GlobalVariables';
import {MIMOTO_BASE_URL} from './constants';

export type HTTP_METHOD = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export class BackendResponseError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export async function request(
  method: HTTP_METHOD,
  path: `/${string}`,
  body?: Record<string, unknown>,
  host = MIMOTO_BASE_URL,
  headers: Record<string, string> = {
    'Content-Type': 'application/json',
  },
  timeout?: undefined | number,
) {
  if (path.includes('residentmobileapp'))
    headers['X-AppId'] = __AppId.getValue();
  let response;
  if (timeout === undefined) {
    response = await fetch(host + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } else {
    console.log(`making a web request to ${host + path}`);
    let controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, timeout * 1000);
    try {
      response = await fetch(host + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (error) {
      console.log(
        `Error occurred while making request: ${host + path}: ${error}`,
      );
      if (error.name === 'AbortError') {
        throw new Error('request timedout');
      }
      throw error;
    }
  }

  const jsonResponse = await response.json();

  if (response.status >= 400) {
    let backendUrl = host + path;
    let errorMessage = jsonResponse.message || jsonResponse.error;
    console.error(
      `The backend API ${backendUrl} returned error code ${response.status} with message --> ${errorMessage}`,
    );
    throw new Error(errorMessage);
  }

  if (jsonResponse.errors && jsonResponse.errors.length) {
    let backendUrl = host + path;
    const {errorCode, errorMessage} = jsonResponse.errors.shift();
    console.error(
      'The backend API ' +
        backendUrl +
        ' returned error response --> error code is : ' +
        errorCode +
        ' error message is : ' +
        errorMessage,
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
