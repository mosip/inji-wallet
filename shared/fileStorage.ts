import {
  DocumentDirectoryPath,
  exists,
  mkdir,
  readDir,
  ReadDirItem,
  readFile,
  stat,
  StatResult,
  unlink,
  writeFile,
} from 'react-native-fs';
import * as RNZipArchive from 'react-native-zip-archive';
import {getBackupFileName} from './commonUtil';

interface CacheData {
  data?: any;
  count?: number;
}

interface Cache {
  [key: string]: CacheData;
}

//static try
class FileStorage {
  cache: Cache = {};

  async readFile(path: string) {
    return await readFile(path, 'utf8');
  }

  async getAllFilesInDirectory(path: string) {
    return await readDir(path);
  }

  async writeFile(path: string, data: string) {
    return await writeFile(path, data, 'utf8');
  }

  async createDirectory(path: string) {
    return await mkdir(path);
  }

  async exists(path: string) {
    return await exists(path);
  }

  async removeItem(path: string) {
    return await unlink(path);
  }

  async removeItemIfExist(path: string) {
    const res = await exists(path);
    return res && (await unlink(path));
  }

  async getInfo(path: string) {
    return await stat(path);
  }
}

export default new FileStorage();

/**
 * iOS: /var/mobile/Containers/Data/Application/196A05AD-6B11-403D-BA2D-6DC1F30075E1/Documents/inji/VC/<filename>
 * android: /data/user/0/io.mosip.residentapp/files/inji/VC/<filename>
 * These paths are coming from DocumentDirectoryPath in react-native-fs.
 */

export const vcDirectoryPath = `${DocumentDirectoryPath}/inji/VC`;
export const backupDirectoryPath = `${DocumentDirectoryPath}/inji/backup`;
export const zipFilePath = (filename: string) =>
  `${DocumentDirectoryPath}/inji/backup/${filename}.zip`;

export const getFilePath = (key: string) => {
  return `${vcDirectoryPath}/${key}.txt`;
};

export const getBackupFilePath = (
  key: string,
  extension: string = '.injibackup',
) => {
  return `${backupDirectoryPath}/${key}${extension}`;
};
export async function compressAndRemoveFile(
  fileNameSansExtension: string,
): Promise<StatResult> {
  const compressedFilePath = await compressFile(fileNameSansExtension);
  await removeFile(fileNameSansExtension);
  return await new FileStorage().getInfo(compressedFilePath);
}

export async function cleanupLocalBackups() {
  const isDirectoryExists = await new FileStorage().exists(backupDirectoryPath);
  if (isDirectoryExists) {
    const availableBackupDirFiles =
      await new FileStorage().getAllFilesInDirectory(backupDirectoryPath);
    for (const availableBackupDirFile of availableBackupDirFiles) {
      await removeFile(availableBackupDirFile.name, '');
    }
  }
}

export async function unZipAndRemoveFile(fileName: string): Promise<string> {
  const result = await RNZipArchive.unzip(
    zipFilePath(fileName),
    backupDirectoryPath,
  );
  await removeFile(fileName, '.zip');
  return result;
}

async function compressFile(fileName: string): Promise<string> {
  return await RNZipArchive.zip(backupDirectoryPath, zipFilePath(fileName));
}

async function removeFile(fileName: string, extension: string = '.injibackup') {
  const file = getBackupFilePath(fileName, extension);
  await new FileStorage().removeItem(file);
}

export async function getDirectorySize(path: string) {
  return await new FileStorage()
    .getAllFilesInDirectory(path)
    .then((result: ReadDirItem[]) => {
      let folderEntriesSizeInBytes = 0;
      result.forEach(fileItem => {
        folderEntriesSizeInBytes += Number(fileItem.size);
      });
      return folderEntriesSizeInBytes;
    });
}

export async function writeToBackupFile(data: any): Promise<string> {
  const fileName = getBackupFileName();
  const isDirectoryExists = await exists(backupDirectoryPath);
  if (isDirectoryExists) {
    const [availableBackupFile] =
      await new FileStorage().getAllFilesInDirectory(backupDirectoryPath);

    availableBackupFile && (await removeFile(availableBackupFile.name, ''));
  }
  // TODO: create dir using a named instance of FileStorage later
  await new FileStorage().createDirectory(backupDirectoryPath);
  const path = getBackupFilePath(fileName);
  await writeFile(path, JSON.stringify(data));
  return fileName;
}
