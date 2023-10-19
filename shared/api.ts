import {request} from './request';
import Storage, {API_CACHED_STORAGE_KEYS} from './storage';
import {COMMON_PROPS_KEY} from './commonprops/commonProps';
import {INITIAL_CONFIG} from './InitialConfig';

export const API_URLS = {
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

  getAllProperties: () =>
    generateCacheAPIFunction({
      isCachePreferred: true,
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
  try {
    const response = (await Storage.getItem(cacheKey)) as string;

    if (response) {
      return JSON.parse(response);
    } else {
      const response = await fetchCall();

      Storage.setItem(cacheKey, JSON.stringify(response)).then(() =>
        console.log('Cached response for ' + cacheKey),
      );

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
  try {
    const response = await fetchCall();
    Storage.setItem(cacheKey, JSON.stringify(response)).then(() =>
      console.log('Cached response for ' + cacheKey),
    );
    return response;
  } catch (error) {
    console.warn(`Failed to load due to network issue in API preferred api call.
     cache key:${cacheKey} and has onErrorHardCodedValue:${
      onErrorHardCodedValue != undefined
    }`);

    console.log(error);

    const response = (await Storage.getItem(cacheKey)) as string;

    if (response) {
      return JSON.parse(response);
    } else {
      if (onErrorHardCodedValue != undefined) {
        return onErrorHardCodedValue;
      } else {
        throw error;
      }
    }
  }
}
