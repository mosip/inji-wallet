import { NativeModules } from 'react-native';
import {
  getFreeDiskStorageOldSync,
  getFreeDiskStorageSync,
} from 'react-native-device-info';
import { MMKVLoader } from 'react-native-mmkv-storage';
import getAllConfigurations from './api';
import { exportData as backupData } from './backupUtils/backupData';
import { loadBackupData } from './backupUtils/restoreData';
import { BYTES_IN_MEGABYTE } from './commonUtil';
import {
  androidVersion,
  API_CACHED_STORAGE_KEYS,
  ENOENT,
  isAndroid,
  SETTINGS_STORE_KEY
} from './constants';
import {
  decryptJson,
  encryptJson,
  HMAC_ALIAS,
  hmacSHA,
  isHardwareKeystoreExists,
} from './cryptoutil/cryptoUtil';
import FileStorage, {
  getDirectorySize,
  getFilePath,
  vcDirectoryPath,
} from './fileStorage';
import { __AppId } from './GlobalVariables';
import { TelemetryConstants } from './telemetry/TelemetryConstants';
import { getErrorEventData, sendErrorEvent } from './telemetry/TelemetryUtils';
import { VCMetadata } from './VCMetadata';

export const MMKV = new MMKVLoader().initialize();
const {RNSecureKeystoreModule} = NativeModules;

async function generateHmac(
  encryptionKey: string,
  data: string,
): Promise<string> {
  if (!isHardwareKeystoreExists) {
    return hmacSHA(encryptionKey, data);
  }
  return await RNSecureKeystoreModule.generateHmacSha(HMAC_ALIAS, data);
}

class Storage {

  static backupData = async (encryptionKey: string) => {
    return await backupData(encryptionKey)
  };
 
  static async restoreBackedUpData(data: string, encryptionKey: string): Promise<any> {
    return await loadBackupData(data, encryptionKey)
  }

  static fetchAllWellknownConfig = async (encryptionKey: string) => {
    let wellknownConfigData: Record<string, Object> = {};
    const allKeysInDB = await MMKV.indexer.strings.getKeys();
    const wellknownConfigCacheKey =
      API_CACHED_STORAGE_KEYS.fetchIssuerWellknownConfig('');
    const wellknownKeys = allKeysInDB.filter(key =>
      key.includes(wellknownConfigCacheKey),
    );

    for (const wellknownKey of wellknownKeys) {
      const configData = await this.getItem(wellknownKey, encryptionKey);
      const decryptedConfigData = await decryptJson(encryptionKey, configData);
      wellknownConfigData[
        wellknownKey.substring(wellknownConfigCacheKey.length)
      ] = JSON.parse(JSON.stringify(decryptedConfigData));
    }
    return wellknownConfigData;
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
      console.error('Error Occurred while saving in Storage.', error);
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
          sendErrorEvent(
            getErrorEventData(
              TelemetryConstants.FlowType.fetchData,
              TelemetryConstants.ErrorId.tampered,
              'VC is corrupted and will be deleted from storage',
            ),
          );
          console.debug(
            '[Inji-406]: VC is corrupted and will be deleted from storage',
          );
          console.debug('[Inji-406]: VC key: ', key);
          console.debug('[Inji-406]: is Data null', data === null);
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
          sendErrorEvent(
            getErrorEventData(
              TelemetryConstants.FlowType.fetchData,
              TelemetryConstants.ErrorId.dataRetrieval,
              error.message,
            ),
          );
          throw new Error(ENOENT);
        }
      }
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.fetchData,
          TelemetryConstants.ErrorId.dataRetrieval,
          'Error Occurred while retrieving from Storage',
        ),
      );

      console.error('Error Occurred while retrieving from Storage.', error);
      throw error;
    }
  };

  static removeItem = async (key: string) => {
    if (VCMetadata.isVCKey(key)) {
      const path = getFilePath(key);
      const isFileExists = await FileStorage.exists(path);
      if (isFileExists) {
        return await FileStorage.removeItem(path);
      } else {
        console.warn('file not exist`s');
      }
    }
    MMKV.removeItem(key);
  };

  static clear = async () => {
    try {
      (await FileStorage.exists(`${vcDirectoryPath}`)) &&
        (await FileStorage.removeItem(`${vcDirectoryPath}`));
      const settings = await MMKV.getItem(SETTINGS_STORE_KEY);
      const appId = JSON.parse(settings).appId;
      __AppId.setValue(appId);
      MMKV.clearStore();
      await MMKV.setItem(SETTINGS_STORE_KEY, JSON.stringify({appId: appId}));
    } catch (e) {
      console.error('Error Occurred while Clearing Storage.', e);
    }
  };

  private static async isVCAlreadyDownloaded(
    key: string,
    encryptionKey: string,
  ) {
    try {
      const storedHMACofCurrentVC = await this.readHmacForVC(
        key,
        encryptionKey,
      );
      return storedHMACofCurrentVC !== null;
    } catch (e) {
      throw e;
    }
  }

  private static async isCorruptedVC(
    key: string,
    encryptionKey: string,
    data: string,
  ) {
    // TODO: INJI-612 refactor
    try {
      const storedHMACofCurrentVC = await this.readHmacForDataCorruptionCheck(
        key,
        encryptionKey,
      );
      const HMACofVC = await generateHmac(encryptionKey, data);
      return HMACofVC !== storedHMACofCurrentVC;
    } catch (e) {
      throw e;
    }
  }

  private static async readHmacForVC(key: string, encryptionKey: string) {
    try {
      const encryptedHMACofCurrentVC = await MMKV.getItem(key);
      if (encryptedHMACofCurrentVC) {
        return decryptJson(encryptionKey, encryptedHMACofCurrentVC);
      }
      return null;
    } catch (e) {
      console.error('error while reading Hmac for VC ', e);
      throw e;
    }
  }

  private static async readHmacForDataCorruptionCheck(
    key: string,
    encryptionKey: string,
  ) {
    try {
      const encryptedHMACofCurrentVC = await MMKV.getItem(key);
      if (encryptedHMACofCurrentVC) {
        return decryptJson(encryptionKey, encryptedHMACofCurrentVC);
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  private static async readVCFromFile(key: string) {
    return await FileStorage.readFile(getFilePath(key));
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
    const encryptedHMACofVC = await encryptJson(encryptionKey, HMACofVC);
    await MMKV.setItem(key, encryptedHMACofVC);
  }
}

export default Storage;

export async function isMinimumLimitForBackupReached() {
  try {
    const directorySize = await getDirectorySize(vcDirectoryPath);
    const freeDiskStorageInBytes =
      isAndroid() && androidVersion < 29
        ? getFreeDiskStorageOldSync()
        : getFreeDiskStorageSync();

    return freeDiskStorageInBytes <= 2 * directorySize;
  } catch (error) {
    console.error('Error in isMinimumLimitForBackupReached:', error);
    throw error;
  }
}

export async function isMinimumLimitForBackupRestorationReached() {
  // TODO: Have two checks, one for downloading the ZIP file from the cloud &
  //  then by looking at it's metadata to check it's expanded size
  // APIs:
  // 1. CloudStorage.stat(file, context)
  // 2. getUncompressedSize()
  return await isMinimumLimitReached('minStorageRequired');
}

export async function  isMinimumLimitReached(limitInMB: string) {
  const configurations = await getAllConfigurations();
  if (!configurations[limitInMB]) return false;

  const minimumStorageLimitInBytes =
    configurations[limitInMB] * BYTES_IN_MEGABYTE;

  const freeDiskStorageInBytes =
    isAndroid() && androidVersion < 29
      ? getFreeDiskStorageOldSync()
      : getFreeDiskStorageSync();

  return freeDiskStorageInBytes <= minimumStorageLimitInBytes;
};
