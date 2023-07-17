import { MMKVLoader } from 'react-native-mmkv-storage';
import { VC_ITEM_STORE_KEY_REGEX } from './constants';
import CryptoJS from 'crypto-js';
import {
  DocumentDirectoryPath,
  mkdir,
  readFile,
  unlink,
  writeFile,
  exists,
} from 'react-native-fs';
import getAllConfigurations from './commonprops/commonProps';
import { Platform } from 'react-native';
import {
  getFreeDiskStorageOldSync,
  getFreeDiskStorageSync,
} from 'react-native-device-info';

const MMKV = new MMKVLoader().initialize();
const vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);
const vcDirectoryPath = `${DocumentDirectoryPath}/inji/VC`;

class Storage {
  static getItem = async (key: string, encryptionKey: string) => {
    try {
      if (vcKeyRegExp.exec(key)) {
        const path = getFilePath(key);
        const data = await readFile(path, 'utf8');

        const encryptedHMACofCurrentVC = await MMKV.getItem(key);
        const HMACofCurrentVC = CryptoJS.AES.decrypt(
          encryptedHMACofCurrentVC,
          encryptionKey
        ).toString(CryptoJS.enc.Utf8);

        const HMACofVC = CryptoJS.HmacSHA256(encryptionKey, data).toString();
        if (HMACofVC === HMACofCurrentVC) {
          return data;
        } else {
          return null;
        }
      }
      return await MMKV.getItem(key);
    } catch (error) {
      console.log('Error Occurred while retriving from Storage.', error);
      throw error;
    }
  };

  static setItem = async (key: string, data: string, encryptionKey: string) => {
    try {
      if (vcKeyRegExp.exec(key)) {
        const HMACofVC = CryptoJS.HmacSHA256(encryptionKey, data).toString();
        const encryptedHMACofVC = CryptoJS.AES.encrypt(
          HMACofVC,
          encryptionKey
        ).toString();
        await MMKV.setItem(key, encryptedHMACofVC);

        await mkdir(vcDirectoryPath);
        const path = getFilePath(key);
        return await writeFile(path, data, 'utf8');
      }
      await MMKV.setItem(key, data);
    } catch (error) {
      console.log('Error Occurred while saving in Storage.', error);
      throw error;
    }
  };

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

export default Storage;
