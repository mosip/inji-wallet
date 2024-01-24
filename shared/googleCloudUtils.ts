import {GoogleSignin} from 'react-native-google-signin';
import {CloudStorage, CloudStorageScope} from 'react-native-cloud-storage';
import {GCLOUD_BACKUP_DIR_NAME} from './constants';

export const getToken = async (): Promise<string> => {
  const res = await GoogleSignin.getTokens();
  //signin if ampty
  // await  GoogleSignin.signInSilently()
  return res.accessToken;
};

export const removeOldDriveBackupFiles = async (fileName: string) => {
  const allFiles = await CloudStorage.readdir(
    GCLOUD_BACKUP_DIR_NAME,
    CloudStorageScope.AppData,
  );
  for (const oldFileName of allFiles.filter(file => file != fileName)) {
    await CloudStorage.unlink(`${GCLOUD_BACKUP_DIR_NAME}/${oldFileName}`);
  }
};
