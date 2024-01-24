import {GoogleSignin} from 'react-native-google-signin';
import {CloudStorage, CloudStorageScope} from 'react-native-cloud-storage';
import {GCLOUD_BACKUP_DIR_NAME} from './constants';
import {GOOGLE_ANDROID_CLIENT_ID} from 'react-native-dotenv';

export const getToken = async (): Promise<string> => {
  try {
    await GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.appfolder',
        'https://www.googleapis.com/auth/drive.file',
      ], // what API you want to access on behalf of the user, default is email and profile
      androidClientId: GOOGLE_ANDROID_CLIENT_ID, // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
      forceConsentPrompt: false,
    });
    await GoogleSignin.signIn();
    const tokenResult = await GoogleSignin.getTokens();
    console.log('GoogleSignin result ', JSON.stringify(tokenResult, null, 2));
    return tokenResult.accessToken;
  } catch (error) {
    console.error('Error while getting token ', error);
    return '';
  }
};

export const removeOldDriveBackupFiles = async (fileName: string) => {
  const allFiles = await CloudStorage.readdir(
    `${GCLOUD_BACKUP_DIR_NAME}`,
    CloudStorageScope.AppData,
  );
  console.log('allFiles ', allFiles);
  return;
  for (const oldFileName of allFiles.filter(file => file != fileName)) {
    await CloudStorage.unlink(`${GCLOUD_BACKUP_DIR_NAME}/${oldFileName}`);
  }
};
