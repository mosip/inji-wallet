import {MMKVLoader} from 'react-native-mmkv-storage';
import getAllConfigurations from './commonprops/commonProps';
import {
  getFreeDiskStorageOldSync,
  getFreeDiskStorageSync,
} from 'react-native-device-info';
import SecureKeystore from '@mosip/secure-keystore';
import {
  decryptJson,
  encryptJson,
  HMAC_ALIAS,
  hmacSHA,
  isHardwareKeystoreExists,
} from './cryptoutil/cryptoUtil';
import {VCMetadata} from './VCMetadata';
import {ENOENT, getItem} from '../machines/store';
import {
  androidVersion,
  isAndroid,
  MY_VCS_STORE_KEY,
  RECEIVED_VCS_STORE_KEY,
  SETTINGS_STORE_KEY,
} from './constants';
import FileStorage, {
  getFilePath,
  getFilePathOfEncryptedHmac,
  getFilePathOfHmac,
  vcDirectoryPath,
} from './fileStorage';
import {__AppId} from './GlobalVariables';
import {
  getErrorEventData,
  getImpressionEventData,
  sendErrorEvent,
  sendImpressionEvent,
} from './telemetry/TelemetryUtils';
import {TelemetryConstants} from './telemetry/TelemetryConstants';

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
    return hmacSHA(encryptionKey, data);
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
          'Error Occurred while retriving from Storage',
        ),
      );

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
    VCkey: string,
    encryptionKey: string,
    data: string,
  ) {
    // TODO: INJI-612 refactor
    const encryptedHMAC_mmkv = await this.getHMAC(VCkey);
    const plainHMAC_calculated = await generateHmac(encryptionKey, data);
    const hmacStoredinFile = await this.readHmacForVCFromFile(VCkey);
    if (hmacStoredinFile !== this.hexEncode(plainHMAC_calculated)) {
      if (__DEV__) {
        sendImpressionEvent(
          getImpressionEventData('VC Corruption Event', 'VC Download', {
            key: VCkey,
            'HMAC stored in MMKV': this.hexEncode(encryptedHMAC_mmkv!),
            'Length HMAC stored in MMKV': encryptedHMAC_mmkv?.length,
            'HMAC of VC': this.hexEncode(plainHMAC_calculated),
            'Length of HMAC of VC': plainHMAC_calculated.length,
            'HMAC stored in file': this.hexEncode(hmacStoredinFile),
            'File vs mmkv data':
              hmacStoredinFile === this.hexEncode(encryptedHMAC_mmkv!),
          }),
        );
      }
      console.log(
        `VC corruption Details: ${JSON.stringify({
          key: VCkey,
          'HMAC stored in MMKV': this.hexEncode(encryptedHMAC_mmkv!),
          'Length HMAC stored in MMKV': encryptedHMAC_mmkv?.length,
          'HMAC of VC': this.hexEncode(plainHMAC_calculated),
          'Length of HMAC of VC': plainHMAC_calculated.length,
          'HMAC stored in file': this.hexEncode(hmacStoredinFile),
          'File vs mmkv data':
            hmacStoredinFile === this.hexEncode(encryptedHMAC_mmkv!),
        })}`,
      );
    }
    return hmacStoredinFile !== this.hexEncode(plainHMAC_calculated);
  }

  private static async readHmacForVC(key: string, encryptionKey: string) {
    const encryptedHMACofCurrentVC = await MMKV.getItem(key);
    if (encryptedHMACofCurrentVC) {
      return decryptJson(encryptionKey, encryptedHMACofCurrentVC);
    }
    return null;
  }

  //TODO: added temporarily for INJI-612
  private static async readHmacForVCFromFile(key: string) {
    const HMACofCurrentVC = await FileStorage.readFile(getFilePathOfHmac(key));
    return HMACofCurrentVC;
  }

  // getHMAC
  private static async getHMAC(key: string) {
    return await MMKV.getItem(key);
  }

  private static async readHmacForDataCorruptionCheck(
    key: string,
    encryptionKey: string,
  ) {
    const encryptedHMAC_mmkv = await MMKV.getItem(key);
    const encryptedHMAC_file = await FileStorage.readFile(
      getFilePathOfEncryptedHmac(key),
    );

    if (encryptedHMAC_mmkv !== encryptedHMAC_file) {
      if (__DEV__) {
        sendImpressionEvent(
          getImpressionEventData('Encrypted HMac Corruption', 'VC Download', {
            key: key,
            'Encrypted HMAC of Current VC from MMKV store': encryptedHMAC_mmkv,
            'Encrypted HMAC of Current VC from file': encryptedHMAC_file,
            'encryptedHMAC_file vs encryptedHMAC_mmkv': `${
              encryptedHMAC_file === encryptedHMAC_mmkv
            }`,
          }),
        );
      }

      console.log(
        `VC corruption Details: ${{
          key: key,
          'Encrypted HMAC of Current VC from MMKV store': encryptedHMAC_mmkv,
          'Encrypted HMAC of Current VC from file': encryptedHMAC_file,
          'encryptedHMACofCurrentVC vs encryptedHMACofCurrentVCFromMMKVFile': `${
            encryptedHMAC_file === encryptedHMAC_mmkv
          }`,
        }}`,
      );
    }

    if (encryptedHMAC_mmkv) {
      return decryptJson(encryptionKey, encryptedHMAC_mmkv);
    }
    return null;
  }

  private static async readVCFromFile(key: string) {
    return await FileStorage.readFile(getFilePath(key));
  }

  private static async storeVC(key: string, data: string) {
    await FileStorage.createDirectory(vcDirectoryPath);
    const path = getFilePath(key);
    return await FileStorage.writeFile(path, data);
  }

  // TODO: INJI-612 refactor
  private static hexEncode(inp: string) {
    var hex, i;
    var result = '';
    for (i = 0; i < inp.length; i++) {
      hex = inp.charCodeAt(i).toString(16);
      result += ('000' + hex).slice(-4);
    }
    return result;
  }

  // TODO: INJI-612 refactor
  private static async storeVcHmac(
    encryptionKey: string,
    data: string,
    key: string,
  ) {
    const HMACofVC = await generateHmac(encryptionKey, data);
    const encryptedHMACofVC = await encryptJson(encryptionKey, HMACofVC);
    const keyOfEncodedHmacStorage = getFilePathOfHmac(key);
    const keyOfEncryptedHmacStorage = getFilePathOfEncryptedHmac(key);

    const encodedHMACofVC = this.hexEncode(HMACofVC);
    await FileStorage.writeFile(keyOfEncodedHmacStorage, encodedHMACofVC);
    await FileStorage.writeFile(keyOfEncryptedHmacStorage, encryptedHMACofVC);
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
      const settings = await MMKV.getItem(SETTINGS_STORE_KEY);
      const appId = JSON.parse(settings).appId;
      __AppId.setValue(appId);
      MMKV.clearStore();
      await MMKV.setItem(SETTINGS_STORE_KEY, JSON.stringify({appId: appId}));
    } catch (e) {
      console.log('Error Occurred while Clearing Storage.', e);
    }
  };

  static isMinimumLimitReached = async (limitInMB: string) => {
    const configurations = await getAllConfigurations();
    if (!configurations[limitInMB]) return false;

    const minimumStorageLimitInBytes = configurations[limitInMB] * 1000 * 1000;

    const freeDiskStorageInBytes =
      isAndroid() && androidVersion < 29
        ? getFreeDiskStorageOldSync()
        : getFreeDiskStorageSync();

    console.log('minimumStorageLimitInBytes ', minimumStorageLimitInBytes);
    console.log('freeDiskStorageInBytes ', freeDiskStorageInBytes);

    return freeDiskStorageInBytes <= minimumStorageLimitInBytes;
  };
}

export default Storage;
