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
let vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);
export const getDataFromStorage = async (key: string) => {
  if (vcKeyRegExp.exec(key)) {
    const path = getFilePath(key);
    return await readFile(path, 'utf8');
  }
  return await MMKV.getItem(key);
};

export const setDataToStorage = async (key: string, data: string) => {
  if (vcKeyRegExp.exec(key)) {
    const path = getFilePath(key);
    return await writeFile(path, data, 'utf8');
  }
  await MMKV.setItem(key, data);
};

export const clearDataFromStorage = async () => {
  console.log('Clearing the entire storage');
  const filesArr = await readDir(DocumentDirectoryPath);
  filesArr.forEach((file) => unlink(file.path));
  MMKV.clearStore();
};

const getFileName = (key: string) => {
  return key.split(':').join('_');
};

const getFilePath = (key: string) => {
  let fileName = getFileName(key);
  return `${DocumentDirectoryPath}/${fileName}.txt`;
};
