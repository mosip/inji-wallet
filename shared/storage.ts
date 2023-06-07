import { MMKVLoader } from 'react-native-mmkv-storage';
import { VC_ITEM_STORE_KEY_REGEX } from './constants';
import {
  DocumentDirectoryPath,
  mkdir,
  readFile,
  unlink,
  writeFile,
  exists,
} from 'react-native-fs';

const MMKV = new MMKVLoader().initialize();
const vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);
const vcDirectoryPath = `${DocumentDirectoryPath}/inji/VC`;

class Storage {
  static getItem = async (key: string) => {
    if (vcKeyRegExp.exec(key)) {
      const path = getFilePath(key);
      return await readFile(path, 'utf8');
    }
    return await MMKV.getItem(key);
  };

  static setItem = async (key: string, data: string) => {
    try {
      if (vcKeyRegExp.exec(key)) {
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
}
/**
 * replace ':' with '_' in the key to get the file name as ':' are not allowed in filenames
 * eg: "vc:UIN:6732935275:e7426576-112f-466a-961a-1ed9635db628" is changed to "vc_UIN_6732935275_e7426576-112f-466a-961a-1ed9635db628"
 */
const getFileName = (key: string) => {
  return key.split(':').join('_');
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
