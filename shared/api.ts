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
    const defaultIssuer = {
      id: 'UIN, VID, AID',
      displayName: 'UIN, VID, AID',
    };

    const response = await request(
      API_URLS.issuersList.method,
      API_URLS.issuersList.buildURL(),
    );
    return [defaultIssuer, ...(response.response.issuers || [])];
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
    catchAPIMethod({
      cacheKey: API_CACHED_STORAGE_KEYS.fetchIssuers,
      fetchCall: API.fetchIssuers,
    }),

  fetchIssuerConfig: (issuerId: string) =>
    catchAPIMethod({
      cacheKey: API_CACHED_STORAGE_KEYS.fetchIssuerConfig(issuerId),
      fetchCall: API.fetchIssuerConfig.bind(null, issuerId),
    }),

  getAllProperties: () =>
    catchAPIMethod({
      isCachePreferred: true,
      cacheKey: COMMON_PROPS_KEY,
      fetchCall: API.fetchAllProperties,
      onErrorHardCodedValue: INITIAL_CONFIG.allProperties,
    }),
};

interface cacheAPIMethodProps {
  isCachePreferred?: boolean;
  cacheKey: string;
  fetchCall: (...props: any) => Promise<any>;
  onErrorHardCodedValue?: any;
}

async function catchAPIMethod({
  isCachePreferred = false,
  cacheKey = '',
  fetchCall = () => Promise.resolve(),
  onErrorHardCodedValue = undefined,
}: cacheAPIMethodProps) {
  if (isCachePreferred) {
    return await cacheAPIMethodWithCachePreference(
      cacheKey,
      fetchCall,
      onErrorHardCodedValue,
    );
  } else {
    return await cacheAPIMethodWithAPIPreference(
      cacheKey,
      fetchCall,
      onErrorHardCodedValue,
    );
  }
}

async function cacheAPIMethodWithCachePreference(
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
    console.warn('Failed to load due to network issue');
    console.log(error);

    if (onErrorHardCodedValue != undefined) {
      return onErrorHardCodedValue;
    } else {
      throw error;
    }
  }
}

async function cacheAPIMethodWithAPIPreference(
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
    console.warn('Failed to load due to network issue');
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
