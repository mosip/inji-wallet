import NetInfo from '@react-native-community/netinfo';
import Cloud from '../../../shared/CloudBackupAndRestoreUtils';
import { isMinimumStorageLimitReached } from '../../../shared/storage';
import fileStorage, {
  getBackupFilePath,
  unZipAndRemoveFile,
} from '../../../shared/fileStorage';

export const restoreService = model => {
  return {
    checkInternet: async () => await NetInfo.fetch(),

    checkStorageAvailability: () => async () => {
      return await isMinimumStorageLimitReached('minStorageRequired');
    },

    downloadLatestBackup: () => async () => {
      const backupFileName = await Cloud.downloadLatestBackup();
      if (backupFileName === null) {
        return new Error('unable to download backup file');
      }
      return backupFileName;
    },

    unzipBackupFile: (context: any, _event: any) => async () => {
      return await unZipAndRemoveFile(context.fileName);
    },
    readBackupFile: (context: any, _event: any) => async callback => {
      // trim extension
      context.fileName = context.fileName.endsWith('.injibackup')
        ? context.fileName.split('.injibackup')[0]
        : context.fileName;
      const dataFromBackupFile = await fileStorage.readFile(
        getBackupFilePath(context.fileName),
      );
      callback(model.events.DATA_FROM_FILE(dataFromBackupFile));
    },
  };
};
