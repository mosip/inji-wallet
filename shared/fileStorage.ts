import {
  DocumentDirectoryPath,
  exists,
  mkdir,
  readFile,
  stat,
  unlink,
  writeFile,
} from 'react-native-fs';

interface CacheData {
  data?: any;
  count?: number;
}

interface Cache {
  [key: string]: CacheData;
}

class FileStorage {
  cache: Cache = {};

  async readFile(path: string) {
    return await readFile(path, 'utf8');
  }

  async readFromCacheFile(path: string) {
    if (this.cache[path]?.data) {
      const count = this.cache[path]?.count ?? 0;
      const data = this.cache[path]?.data;

      if (count != undefined && count <= 1) {
        this.cache[path] = {};
      } else {
        this.cache[path].count = count - 1;
      }

      return data;
    }

    return this.readFile(path);
  }

  async readAndCacheFile(path: string, useCount: number = 1) {
    const data = await this.readFile(path);

    this.cache[path] = {
      data,
      count: useCount,
    };

    return data;
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
export const getFilePath = (key: string) => {
  return `${vcDirectoryPath}/${key}.txt`;
};

export const vcDirectoryPath = `${DocumentDirectoryPath}/inji/VC`;
