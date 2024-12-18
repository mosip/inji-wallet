import Cloud from '../../../shared/CloudBackupAndRestoreUtils';
import {UPLOAD_MAX_RETRY} from '../../../shared/constants';
import {
  compressAndRemoveFile,
  writeToBackupFile,
} from '../../../shared/fileStorage';
import {isMinimumLimitForBackupReached} from '../../../shared/storage';
import NetInfo from '@react-native-community/netinfo';

export const backupService = model => {
  return {
    checkInternet: async () => await NetInfo.fetch(),

    getLastBackupDetailsFromCloud: () => async () =>
      await Cloud.lastBackupDetails(),

    checkStorageAvailability: () => async () => {
      try {
        const isAvailable = await isMinimumLimitForBackupReached();
        return isAvailable;
      } catch (error) {
        console.error('Error in checkStorageAvailability:', error);
        throw error;
      }
    },

    writeDataToFile: (context: any, _event: any) => async callack => {
      const fileName = await writeToBackupFile(context.dataFromStorage);
      callack(model.events.FILE_NAME(fileName));
    },

    zipBackupFile: (context: any, _event: any) => async () => {
      const result = await compressAndRemoveFile(context.fileName);
      return result;
    },
    uploadBackupFile: (context: any, _event: any) => async () => {
      const result = await Cloud.uploadBackupFileToDrive(
        context.fileName,
        UPLOAD_MAX_RETRY,
      );
      return result;
    },
  };
};
