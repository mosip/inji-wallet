import {request} from './request';
import {API_CACHED_STORAGE_KEYS} from './storage';
import {COMMON_PROPS_KEY} from './commonprops/commonProps';
import {INITIAL_CONFIG} from './InitialConfig';
import Keychain from 'react-native-keychain';
import {getItem, setItem} from '../machines/store';

export const API_URLS: ApiUrls = {
  issuersList: {
    method: 'GET',
    buildURL: (): `/${string}` => '/residentmobileapp/issuers',
  },
  issuerConfig: {
    method: 'GET',
    buildURL: (issuerId: string): `/${string}` =>
      `/residentmobileapp/issuers/${issuerId}`,
  },
  allProperties: {
    method: 'GET',
    buildURL: (): `/${string}` => '/residentmobileapp/allProperties',
  },
  getIndividualId: {
    method: 'POST',
    buildURL: (): `/${string}` => '/residentmobileapp/aid/get-individual-id',
  },
  reqIndividualOTP: {
    method: 'POST',
    buildURL: (): `/${string}` => '/residentmobileapp/req/individualId/otp',
  },
  walletBinding: {
    method: 'POST',
    buildURL: (): `/${string}` => '/residentmobileapp/wallet-binding',
  },
  bindingOtp: {
    method: 'POST',
    buildURL: (): `/${string}` => '/residentmobileapp/binding-otp',
  },
  requestOtp: {
    method: 'POST',
    buildURL: (): `/${string}` => '/residentmobileapp/req/otp',
  },
  credentialRequest: {
    method: 'POST',
    buildURL: (): `/${string}` => '/residentmobileapp/credentialshare/request',
  },
  credentialStatus: {
    method: 'GET',
    buildURL: (id: string): `/${string}` =>
      `/residentmobileapp/credentialshare/request/status/${id}`,
  },
  credentialDownload: {
    method: 'POST',
    buildURL: (): `/${string}` => '/residentmobileapp/credentialshare/download',
  },
  authLock: {
    method: 'POST',
    buildURL: (): `/${string}` => '/residentmobileapp/req/auth/lock',
  },
  authUnLock: {
    method: 'POST',
    buildURL: (): `/${string}` => '/residentmobileapp/req/auth/unlock',
  },
  requestRevoke: {
    method: 'PATCH',
    buildURL: (id: string): `/${string}` => `/residentmobileapp/vid/${id}`,
  },
  linkTransaction: {
    method: 'POST',
    buildURL: (): `/${string}` =>
      '/v1/esignet/linked-authorization/v2/link-transaction',
  },
  authenticate: {
    method: 'POST',
    buildURL: (): `/${string}` =>
      '/v1/esignet/linked-authorization/v2/authenticate',
  },
  sendConsent: {
    method: 'POST',
    buildURL: (): `/${string}` => '/v1/esignet/linked-authorization/v2/consent',
  },
};

export const API = {
  fetchIssuers: async () => {
    const response = await request(
      API_URLS.issuersList.method,
      API_URLS.issuersList.buildURL(),
    );
    return response.response.issuers || [];
  },

  fetchIssuerConfig: async (issuerId: string) => {
    const response = await request(
      API_URLS.issuerConfig.method,
      API_URLS.issuerConfig.buildURL(issuerId),
    );
    return response.response;
  },

  fetchAllProperties: async () => {
    const response = await request(
      API_URLS.allProperties.method,
      API_URLS.allProperties.buildURL(),
    );
    return response.response;
  },
};

export const CACHED_API = {
  fetchIssuers: () =>
    generateCacheAPIFunction({
      cacheKey: API_CACHED_STORAGE_KEYS.fetchIssuers,
      fetchCall: API.fetchIssuers,
    }),

  fetchIssuerConfig: (issuerId: string) =>
    generateCacheAPIFunction({
      cacheKey: API_CACHED_STORAGE_KEYS.fetchIssuerConfig(issuerId),
      fetchCall: API.fetchIssuerConfig.bind(null, issuerId),
    }),

  getAllProperties: (isCachePreferred: boolean) =>
    generateCacheAPIFunction({
      isCachePreferred,
      cacheKey: COMMON_PROPS_KEY,
      fetchCall: API.fetchAllProperties,
      onErrorHardCodedValue: INITIAL_CONFIG.allProperties,
    }),
};

interface GenerateCacheAPIFunctionProps {
  isCachePreferred?: boolean;
  cacheKey: string;
  fetchCall: (...props: any) => Promise<any>;
  onErrorHardCodedValue?: any;
}

async function generateCacheAPIFunction({
  isCachePreferred = false,
  cacheKey = '',
  fetchCall = () => Promise.resolve(),
  onErrorHardCodedValue = undefined,
}: GenerateCacheAPIFunctionProps) {
  if (isCachePreferred) {
    return await generateCacheAPIFunctionWithCachePreference(
      cacheKey,
      fetchCall,
      onErrorHardCodedValue,
    );
  } else {
    return await generateCacheAPIFunctionWithAPIPreference(
      cacheKey,
      fetchCall,
      onErrorHardCodedValue,
    );
  }
}

async function generateCacheAPIFunctionWithCachePreference(
  cacheKey: string,
  fetchCall: (...props: any[]) => any,
  onErrorHardCodedValue?: any,
) {
  const existingCredentials = await Keychain.getGenericPassword();
  try {
    const response = (await getItem(
      cacheKey,
      null,
      existingCredentials?.password,
    )) as string;

    if (response) {
      return JSON.parse(response);
    } else {
      const response = await fetchCall();
      setItem(
        cacheKey,
        JSON.stringify(response),
        existingCredentials?.password,
      ).then(() => console.log('Cached response for ' + cacheKey));

      return response;
    }
  } catch (error) {
    console.warn(`Failed to load due to network issue in cache preferred api call.
     cache key:${cacheKey} and has onErrorHardCodedValue:${
      onErrorHardCodedValue != undefined
    }`);
    console.log(error);

    if (onErrorHardCodedValue != undefined) {
      return onErrorHardCodedValue;
    } else {
      throw error;
    }
  }
}

async function generateCacheAPIFunctionWithAPIPreference(
  cacheKey: string,
  fetchCall: (...props: any[]) => any,
  onErrorHardCodedValue?: any,
) {
  const existingCredentials = await Keychain.getGenericPassword();
  try {
    const response = await fetchCall();
    setItem(
      cacheKey,
      JSON.stringify(response),
      existingCredentials.password,
    ).then(() => console.log('Cached response for ' + cacheKey));
    return response;
  } catch (error) {
    console.warn(`Failed to load due to network issue in API preferred api call.
     cache key:${cacheKey} and has onErrorHardCodedValue:${
      onErrorHardCodedValue != undefined
    }`);

    console.log(error);

    const response = (await getItem(
      cacheKey,
      null,
      existingCredentials.password,
    )) as string;

    if (response) {
      return JSON.parse(response);
    } else {
      if (response == null) {
        throw error;
      } else if (onErrorHardCodedValue != undefined) {
        return onErrorHardCodedValue;
      } else {
        throw error;
      }
    }
  }
}

type Api_Params = {
  method: 'GET' | 'POST' | 'PATCH'; // Define the HTTP methods
  buildURL: (param?: string) => `/${string}`; // Define the buildURL function signature
};

type ApiUrls = {
  issuersList: Api_Params;
  issuerConfig: Api_Params;
  allProperties: Api_Params;
  getIndividualId: Api_Params;
  reqIndividualOTP: Api_Params;
  walletBinding: Api_Params;
  bindingOtp: Api_Params;
  requestOtp: Api_Params;
  credentialRequest: Api_Params;
  credentialStatus: Api_Params;
  credentialDownload: Api_Params;
  authLock: Api_Params;
  authUnLock: Api_Params;
  requestRevoke: Api_Params;
  linkTransaction: Api_Params;
  authenticate: Api_Params;
  sendConsent: Api_Params;
};
