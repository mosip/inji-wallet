import { MMKVLoader } from 'react-native-mmkv-storage';
import { VC_ITEM_STORE_KEY_REGEX } from './constants';
import {
  DocumentDirectoryPath,
  readDir,
  readFile,
  unlink,
  writeFile,
} from 'react-native-fs';

const MMKV = new MMKVLoader().initialize();
const vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);

class Storage {
  static getDataFromStorage = async (key: string) => {
    if (vcKeyRegExp.exec(key)) {
      const path = getFilePath(key);
      return await readFile(path, 'utf8');
    }
    return await MMKV.getItem(key);
  };

  static setDataToStorage = async (key: string, data: string) => {
    if (vcKeyRegExp.exec(key)) {
      const path = getFilePath(key);
      return await writeFile(path, data, 'utf8');
    }
    await MMKV.setItem(key, data);
  };

  static clearDataFromStorage = async () => {
    console.log('Clearing the entire storage');
    const filesArr = await readDir(DocumentDirectoryPath);
    filesArr.forEach((file) => unlink(file.path));
    MMKV.clearStore();
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
 * iOS: /var/mobile/Containers/Data/Application/196A05AD-6B11-403D-BA2D-6DC1F30075E1/Documents/<filename>
 * android: /data/user/0/io.mosip.residentapp/files/<filename>
 * These paths are coming from DocumentDirectoryPath in react-native-fs.
 */
const getFilePath = (key: string) => {
  const fileName = getFileName(key);
  console.log('Printing file path: ', DocumentDirectoryPath);
  return `${DocumentDirectoryPath}/${fileName}.txt`;
};

export default Storage;
