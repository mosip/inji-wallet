import { MMKVLoader } from 'react-native-mmkv-storage';
import { VC_ITEM_STORE_KEY_REGEX } from './constants';
import CryptoJS from 'crypto-js';
import {
  DocumentDirectoryPath,
  exists,
  mkdir,
  readFile,
  stat,
  unlink,
  writeFile,
} from 'react-native-fs';
import getAllConfigurations from './commonprops/commonProps';
import { Platform } from 'react-native';
import {
  getFreeDiskStorageOldSync,
  getFreeDiskStorageSync,
} from 'react-native-device-info';
import SecureKeystore from 'react-native-secure-keystore';
import {
  decryptJson,
  encryptJson,
  isCustomSecureKeystore,
} from './cryptoutil/cryptoUtil';

const MMKV = new MMKVLoader().initialize();
const vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);
const vcDirectoryPath = `${DocumentDirectoryPath}/inji/VC`;
export const HMAC_ALIAS = 'Hmacalias';

async function generateHmac(
  encryptionKey: string,
  data: string
): Promise<string> {
  if (!isCustomSecureKeystore()) {
    return CryptoJS.HmacSHA256(encryptionKey, data).toString();
  }
  return await SecureKeystore.generateHmacSha(HMAC_ALIAS, data);
}

class Storage {
  static isVCStorageInitialised = async (): Promise<boolean> => {
    try {
      const res = await stat(vcDirectoryPath);
      return res.isDirectory();
    } catch (_) {
      return false;
    }
  };

  static setItem = async (
    key: string,
    data: string,
    encryptionKey?: string
  ) => {
    try {
      const isSavingVC = vcKeyRegExp.exec(key);
      if (isSavingVC) {
        await this.storeVcHmac(encryptionKey, data, key);
        return await this.storeVC(key, data);
      }

      await MMKV.setItem(key, data);
    } catch (error) {
      console.log('Error Occurred while saving in Storage.', error);
      throw error;
    }
  };

  static getItem = async (key: string, encryptionKey?: string) => {
    try {
      const isSavingVC = vcKeyRegExp.exec(key);

      if (isSavingVC) {
        const data = await this.readVCFromFile(key);
        const isCorrupted = await this.isCorruptedVC(key, encryptionKey, data);

        return isCorrupted ? null : data;
      }

      return await MMKV.getItem(key);
    } catch (error) {
      console.log('Error Occurred while retriving from Storage.', error);
      throw error;
    }
  };

  private static async isCorruptedVC(
    key: string,
    encryptionKey: string,
    data: string
  ) {
    const storedHMACofCurrentVC = await this.readHmacForVC(key, encryptionKey);
    const HMACofVC = await generateHmac(encryptionKey, data);
    return HMACofVC !== storedHMACofCurrentVC;
  }

  private static async readHmacForVC(key: string, encryptionKey: string) {
    const encryptedHMACofCurrentVC = await MMKV.getItem(getVCKeyName(key));
    return decryptJson(encryptionKey, encryptedHMACofCurrentVC);
  }

  private static async readVCFromFile(key: string) {
    const path = getFilePath(key);
    return await readFile(path, 'utf8');
  }

  private static async storeVC(key: string, data: string) {
    await mkdir(vcDirectoryPath);
    const path = getFilePath(key);
    return await writeFile(path, data, 'utf8');
  }

  private static async storeVcHmac(
    encryptionKey: string,
    data: string,
    key: string
  ) {
    const HMACofVC = await generateHmac(encryptionKey, data);
    const encryptedHMACofVC = await encryptJson(encryptionKey, HMACofVC);
    await MMKV.setItem(getVCKeyName(key), encryptedHMACofVC);
  }

  static removeItem = async (key: string) => {
    if (vcKeyRegExp.exec(key)) {
      const path = getFilePath(key);
      return await unlink(path);
    }
    MMKV.removeItem(key);
  };

  static clear = async () => {
    try {
      (await exists(`${vcDirectoryPath}`)) &&
        (await unlink(`${vcDirectoryPath}`));
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
/**
 * The VC file name will not have the pinned / unpinned state, we will splice the state as this will change.
 * replace ':' with '_' in the key to get the file name as ':' are not allowed in filenames
 * eg: "vc:UIN:6732935275:e7426576-112f-466a-961a-1ed9635db628" is changed to "vc_UIN_6732935275_e7426576-112f-466a-961a-1ed9635db628"
 */
const getFileName = (key: string) => {
  return key.split(':').splice(0, 4).join('_');
};

/**
 * iOS: /var/mobile/Containers/Data/Application/196A05AD-6B11-403D-BA2D-6DC1F30075E1/Documents/inji/VC/<filename>
 * android: /data/user/0/io.mosip.residentapp/files/inji/VC/<filename>
 * These paths are coming from DocumentDirectoryPath in react-native-fs.
 */
const getFilePath = (key: string) => {
  const fileName = getFileName(key);
  return `${vcDirectoryPath}/${fileName}.txt`;
};

/**
 * The VC key will not have the pinned / unpinned state, we will splice the state as this will change.
 * eg: "vc:UIN:6732935275:e7426576-112f-466a-961a-1ed9635db628:true" is changed to "vc:UIN:6732935275:e7426576-112f-466a-961a-1ed9635db628"
 */
const getVCKeyName = (key: string) => {
  return key.split(':').splice(0, 4).join(':');
};

export default Storage;
