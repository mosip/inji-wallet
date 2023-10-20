import {MMKVLoader} from 'react-native-mmkv-storage';
import CryptoJS from 'crypto-js';
import getAllConfigurations from './commonprops/commonProps';
import {Platform} from 'react-native';
import {
  getFreeDiskStorageOldSync,
  getFreeDiskStorageSync,
} from 'react-native-device-info';
import SecureKeystore from 'react-native-secure-keystore';
import {
  decryptJson,
  encryptJson,
  HMAC_ALIAS,
  isHardwareKeystoreExists,
} from './cryptoutil/cryptoUtil';
import {VCMetadata} from './VCMetadata';
import {ENOENT, getItem} from '../machines/store';
import {MY_VCS_STORE_KEY, RECEIVED_VCS_STORE_KEY} from './constants';
import FileStorage, {getFilePath, vcDirectoryPath} from './fileStorage';

export const MMKV = new MMKVLoader().initialize();

export const API_CACHED_STORAGE_KEYS = {
  fetchIssuers: 'CACHE_FETCH_ISSUERS',
  fetchIssuerConfig: (issuerId: string) =>
    `CACHE_FETCH_ISSUER_CONFIG_${issuerId}`,
};

async function generateHmac(
  encryptionKey: string,
  data: string,
): Promise<string> {
  if (!isHardwareKeystoreExists) {
    return CryptoJS.HmacSHA256(encryptionKey, data).toString();
  }
  return await SecureKeystore.generateHmacSha(HMAC_ALIAS, data);
}

class Storage {
  static isVCStorageInitialised = async (): Promise<boolean> => {
    try {
      const res = await FileStorage.getInfo(vcDirectoryPath);
      return res.isDirectory();
    } catch (_) {
      return false;
    }
  };

  static setItem = async (
    key: string,
    data: string,
    encryptionKey?: string,
  ) => {
    try {
      const isSavingVC = VCMetadata.isVCKey(key);
      if (isSavingVC) {
        await this.storeVC(key, data);
        return await this.storeVcHmac(encryptionKey, data, key);
      }

      await MMKV.setItem(key, data);
    } catch (error) {
      console.log('Error Occurred while saving in Storage.', error);
      throw error;
    }
  };

  static getItem = async (key: string, encryptionKey?: string) => {
    try {
      const isVCKey = VCMetadata.isVCKey(key);

      if (isVCKey) {
        const data = await this.readVCFromFile(key);
        const isCorrupted = await this.isCorruptedVC(key, encryptionKey, data);

        if (isCorrupted) {
          console.debug(
            '[Inji-406]: VC is corrupted and will be deleted from storage',
          );
          console.debug('[Inji-406]: VC key: ', key);
          console.debug('[Inji-406]: is Data null', data === null);
          getItem(MY_VCS_STORE_KEY, [], encryptionKey).then(res => {
            console.debug('[Inji-406]: vcKeys are ', JSON.stringify(res));
          });
          getItem(RECEIVED_VCS_STORE_KEY, null, encryptionKey).then(res => {
            console.debug(
              '[Inji-406]: received vcKeys is ',
              JSON.stringify(res),
            );
          });
        }

        return isCorrupted ? null : data;
      }

      return await MMKV.getItem(key);
    } catch (error) {
      const isVCKey = VCMetadata.isVCKey(key);

      if (isVCKey) {
        const isDownloaded = await this.isVCAlreadyDownloaded(
          key,
          encryptionKey,
        );

        if (isDownloaded && error.message.includes(ENOENT)) {
          throw new Error(ENOENT);
        }
      }

      console.log('Error Occurred while retriving from Storage.', error);
      throw error;
    }
  };

  private static async isVCAlreadyDownloaded(
    key: string,
    encryptionKey: string,
  ) {
    const storedHMACofCurrentVC = await this.readHmacForVC(key, encryptionKey);
    return storedHMACofCurrentVC !== null;
  }

  private static async isCorruptedVC(
    key: string,
    encryptionKey: string,
    data: string,
  ) {
    const storedHMACofCurrentVC = await this.readHmacForVC(key, encryptionKey);
    const HMACofVC = await generateHmac(encryptionKey, data);

    if (HMACofVC !== storedHMACofCurrentVC) {
      console.debug(
        `[Inji-406]: storedHmacOfCurrentVC: ${storedHMACofCurrentVC}, HMACofVC: ${HMACofVC}`,
      );
    }

    return HMACofVC !== storedHMACofCurrentVC;
  }

  private static async readHmacForVC(key: string, encryptionKey: string) {
    const encryptedHMACofCurrentVC = await MMKV.getItem(key);
    if (encryptedHMACofCurrentVC) {
      return decryptJson(encryptionKey, encryptedHMACofCurrentVC);
    }
    return null;
  }

  private static async readVCFromFile(key: string) {
    return await FileStorage.readFromCacheFile(getFilePath(key));
  }

  private static async storeVC(key: string, data: string) {
    await FileStorage.createDirectory(vcDirectoryPath);
    const path = getFilePath(key);
    return await FileStorage.writeFile(path, data);
  }

  private static async storeVcHmac(
    encryptionKey: string,
    data: string,
    key: string,
  ) {
    const HMACofVC = await generateHmac(encryptionKey, data);
    console.log('[Inji-406]: Updating hmac of the vc: ', HMACofVC);
    const encryptedHMACofVC = await encryptJson(encryptionKey, HMACofVC);
    await MMKV.setItem(key, encryptedHMACofVC);
  }

  static removeItem = async (key: string) => {
    if (VCMetadata.isVCKey(key)) {
      const path = getFilePath(key);
      const isFileExists = await FileStorage.exists(path);
      if (isFileExists) {
        return await FileStorage.removeItem(path);
      } else {
        console.log('file not exist`s');
      }
    }
    MMKV.removeItem(key);
  };

  static clear = async () => {
    try {
      (await FileStorage.exists(`${vcDirectoryPath}`)) &&
        (await FileStorage.removeItem(`${vcDirectoryPath}`));
      MMKV.clearStore();
    } catch (e) {
      console.log('Error Occurred while Clearing Storage.', e);
    }
  };

  static isMinimumLimitReached = async (limitInMB: string) => {
    const configurations = await getAllConfigurations();
    if (!configurations[limitInMB]) return false;

    const minimumStorageLimitInBytes = configurations[limitInMB] * 1000 * 1000;

    const freeDiskStorageInBytes =
      Platform.OS === 'android' && Platform.Version < 29
        ? getFreeDiskStorageOldSync()
        : getFreeDiskStorageSync();

    console.log('minimumStorageLimitInBytes ', minimumStorageLimitInBytes);
    console.log('freeDiskStorageInBytes ', freeDiskStorageInBytes);

    return freeDiskStorageInBytes <= minimumStorageLimitInBytes;
  };
}

export default Storage;
