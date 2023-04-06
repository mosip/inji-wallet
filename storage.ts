import { MMKVLoader } from 'react-native-mmkv-storage';
import { VC_ITEM_STORE_KEY_REGEX } from './shared/constants';
import {
  DocumentDirectoryPath,
  readDir,
  readFile,
  unlink,
  writeFile,
} from 'react-native-fs';

const MMKV = new MMKVLoader().initialize();
let regExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);
export const getDataFromStorage = async (key: string) => {
  if (regExp.exec(key)) {
    const path = getFilePath(key);
    return await readFile(path, 'utf8');
  }
  return await MMKV.getItem(key);
};

export const setDataToStorage = async (key: string, data: string) => {
  if (regExp.exec(key)) {
    const path = getFilePath(key);
    return await writeFile(path, data, 'utf8');
  }
  await MMKV.setItem(key, data);
};

export const clearDataFromStorage = async () => {
  const filesArr = await readDir(DocumentDirectoryPath);
  filesArr.forEach((file) => unlink(file.path));
  MMKV.clearStore();
};

const getFileNameFrom = (key) => {
  return key.split(':').join('_');
};

const getFilePath = (key: string) => {
  let fileName = getFileNameFrom(key);
  return `${DocumentDirectoryPath}/${fileName}.txt`;
};
