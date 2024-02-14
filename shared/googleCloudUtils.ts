import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CloudStorage, CloudStorageScope} from 'react-native-cloud-storage';
import {GOOGLE_ANDROID_CLIENT_ID} from 'react-native-dotenv';
import {readFile, writeFile} from 'react-native-fs';
import {BackupDetails} from '../types/backup-and-restore/backup';
import {bytesToMB, sleep} from './commonUtil';
import {
  IOS_SIGNIN_FAILED,
  isAndroid,
  isIOS,
  NETWORK_REQUEST_FAILED,
} from './constants';
import fileStorage, {backupDirectoryPath, zipFilePath} from './fileStorage';
import {request} from './request';

class Cloud {
  static status = {
    DECLINED: 'DECLINED',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
  };
  static timeout = 10000;
  private static readonly requiredScopes = [
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
  ];
  private static readonly BACKUP_FILE_REG_EXP = /backup_[0-9]*.zip$/g;
  private static readonly UNSYNCED_BACKUP_FILE_REG_EXP =
    /backup_[0-9]*.zip.icloud/g;
  private static readonly RETRY_SLEEP_TIME = 5000;

  private static configure() {
    GoogleSignin.configure({
      scopes: this.requiredScopes,
      androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    });
  }
  private static async profileInfo(): Promise<ProfileInfo | undefined> {
    try {
      const accessToken = await this.getAccessToken();
      const profileResponse = await request(
        'GET',
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
        undefined,
        '',
      );
      return {
        email: profileResponse.email,
        picture: profileResponse.picture,
      };
    } catch (error) {
      console.error('Error while getting profile info ', error);
      throw error;
    }
  }

  private static getBackupFilesList = async () => {
    return await CloudStorage.readdir(`/`, CloudStorageScope.AppData);
  };

  private static async syncBackupFiles() {
    const isSyncDone = await this.downloadUnSyncedBackupFiles();
    if (isSyncDone) return;
    await sleep(this.RETRY_SLEEP_TIME);
    await this.syncBackupFiles();
  }

  static async getAccessToken() {
    try {
      const tokenResult = await GoogleSignin.getTokens();
      await GoogleSignin.clearCachedAccessToken(tokenResult.accessToken);
      await GoogleSignin.signInSilently();
      const {accessToken} = await GoogleSignin.getTokens();
      return accessToken;
    } catch (error) {
      console.error('Error while getting access token ', error);
      throw error;
    }
  }
  static async signIn(): Promise<SignInResult | IsIOSResult> {
    if (isIOS()) {
      return {isIOS: true};
    }
    this.configure();
    try {
      const {scopes: userProvidedScopes} = await GoogleSignin.signIn();
      const userNotProvidedRequiredAccessInConsent = !this.requiredScopes.every(
        requiredScope => userProvidedScopes?.includes(requiredScope),
      );
      if (userNotProvidedRequiredAccessInConsent) {
        return {
          status: this.status.DECLINED,
        };
      }
      const profileInfo = await this.profileInfo();
      return {
        status: this.status.SUCCESS,
        profileInfo,
      };
    } catch (error) {
      console.error('Cloud sign in failed due to ', error);
      //User cancelled confirmation / manually closed sign in WebView
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          status: this.status.DECLINED,
          error,
        };
      }
      return {
        status: this.status.FAILURE,
        error,
      };
    }
  }
  static async isSignedInAlready(): Promise<isSignedInResult> {
    try {
      if (isIOS()) {
        const isSignedIn = await CloudStorage.isCloudAvailable();
        return {
          isSignedIn,
        };
      }
      this.configure();
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (!isSignedIn) {
        await GoogleSignin.signInSilently();
        const profileInfo = await this.profileInfo();
        return {
          isSignedIn: true,
          profileInfo,
        };
      } else {
        const profileInfo = await this.profileInfo();
        return {
          isSignedIn: true,
          profileInfo,
        };
      }
    } catch (error) {
      console.error(
        'Error while checking if user is already signed in ',
        error,
      );
      let errorReason: null | string = null;
      if (
        error.toString() === 'Error: NetworkError' ||
        error.toString() === ' Error: NetworkError'
      )
        errorReason = NETWORK_REQUEST_FAILED;
      //TODO: resolve and reject promise so it can be handled in onError
      return {
        error: errorReason || error,
        isSignedIn: false,
      };
    }
  }
  static async downloadUnSyncedBackupFiles(): Promise<Boolean> {
    if (isIOS()) {
      const unSyncedFiles = (await this.getBackupFilesList()).filter(file =>
        file.match(this.UNSYNCED_BACKUP_FILE_REG_EXP),
      );
      if (unSyncedFiles.length > 0) {
        await CloudStorage.downloadFile(`/${unSyncedFiles[0]}`);
        return false;
      }
    }
    return true;
  }
  static async lastBackupDetails(
    cloudFileName?: string | undefined,
  ): Promise<BackupDetails> {
    CloudStorage.setTimeout(this.timeout);
    if (isAndroid()) {
      const tokenResult = await Cloud.getAccessToken();
      CloudStorage.setGoogleDriveAccessToken(tokenResult);
    }
    if (isIOS()) {
      const isCloudAvailable = await CloudStorage.isCloudAvailable();
      if (!isCloudAvailable) {
        return Promise.reject({
          status: this.status.FAILURE,
          error: IOS_SIGNIN_FAILED,
        });
      }
      await this.syncBackupFiles();
    }

    if (!cloudFileName) {
      cloudFileName = (await this.getBackupFilesList()).filter(file =>
        file.match(this.BACKUP_FILE_REG_EXP),
      )[0];
    }
    const {birthtimeMs: creationTime, size} = await CloudStorage.stat(
      cloudFileName,
      CloudStorageScope.AppData,
    );

    return {
      backupCreationTime: creationTime,
      backupFileSize: bytesToMB(size),
    };
  }
  static async removeOldDriveBackupFiles(fileName: string) {
    const toBeRemovedFiles = (await this.getBackupFilesList())
      .filter(file => file !== fileName)
      .filter(file => file.match(this.BACKUP_FILE_REG_EXP));
    for (const oldFileName of toBeRemovedFiles) {
      await CloudStorage.unlink(`/${oldFileName}`);
    }
  }
  static async uploadBackupFileToDrive(
    fileName: string,
    retryCounter: number,
    error: string | undefined = undefined,
  ): Promise<CloudUploadResult> {
    if (retryCounter < 0 || error === NETWORK_REQUEST_FAILED) {
      return Promise.reject({
        status: this.status.FAILURE,
        error: error || 'Retry limit reached',
      });
    }

    const cloudFileName = `/${fileName}.zip`;
    let uploadError: string | undefined = undefined;

    try {
      CloudStorage.setTimeout(this.timeout);
      if (isAndroid()) {
        const tokenResult = await Cloud.getAccessToken();
        CloudStorage.setGoogleDriveAccessToken(tokenResult);
      }
      if (isIOS()) {
        const isCloudAvailable = await CloudStorage.isCloudAvailable();
        if (!isCloudAvailable) {
          return Promise.reject({
            status: this.status.FAILURE,
            error: IOS_SIGNIN_FAILED,
          });
        }
      }

      const filePath = zipFilePath(fileName);
      const fileContent = await readFile(filePath, 'base64');

      await CloudStorage.writeFile(
        cloudFileName,
        fileContent,
        CloudStorageScope.AppData,
      );
      const isFileUploaded = await CloudStorage.exists(
        cloudFileName,
        CloudStorageScope.AppData,
      );

      if (isFileUploaded) {
        const backupDetails = await this.lastBackupDetails(cloudFileName);
        await this.removeOldDriveBackupFiles(`${fileName}.zip`);
        return Promise.resolve({
          status: this.status.SUCCESS,
          error: null,
          backupDetails,
        });
      }
    } catch (error) {
      console.log(
        `Error occurred while cloud upload.. retrying ${retryCounter} : Error : ${error}`,
      );
      if (
        error.toString() === 'Error: NetworkError' ||
        error.toString() === ' Error: NetworkError'
      ) {
        uploadError = NETWORK_REQUEST_FAILED;
      } else {
        uploadError = error;
      }
    }

    return this.uploadBackupFileToDrive(
      fileName,
      retryCounter - 1,
      uploadError,
    );
  }

  static async downloadLatestBackup(): Promise<string | null> {
    try {
      CloudStorage.setTimeout(this.timeout);
      if (isAndroid()) {
        const tokenResult = await Cloud.getAccessToken();
        CloudStorage.setGoogleDriveAccessToken(tokenResult);
      }
      if (isIOS()) {
        const isCloudAvailable = await CloudStorage.isCloudAvailable();
        if (!isCloudAvailable) {
          return Promise.reject({
            status: this.status.FAILURE,
            error: IOS_SIGNIN_FAILED,
          });
        }
        await this.syncBackupFiles();
      }
      const allFiles = (await this.getBackupFilesList()).filter(file =>
        file.match(this.BACKUP_FILE_REG_EXP),
      );
      // TODO: do basic sanity about this .zip file
      const fileName = `/${allFiles[0]}`;
      const fileContent = await CloudStorage.readFile(
        fileName,
        CloudStorageScope.AppData,
      );

      if (fileContent.length === 0) return Promise.resolve(null);
      // write the file content in the backup directory path, create backup directory if not exists
      const isDirectoryExists = await fileStorage.exists(backupDirectoryPath);
      if (!isDirectoryExists) {
        await fileStorage.createDirectory(backupDirectoryPath);
      }
      await writeFile(
        backupDirectoryPath + '/' + fileName,
        fileContent,
        'base64',
      );
      // return the path
      return Promise.resolve(fileName.split('.zip')[0]);
    } catch (error) {
      console.log('error while downloading backup file ', error);
      let downloadError;
      if (error.toString() === 'Error: NetworkError') {
        downloadError = NETWORK_REQUEST_FAILED;
      } else if (error.code?.toString() === 'ERR_DIRECTORY_NOT_FOUND') {
        downloadError = 'No backup file';
      } else {
        downloadError = error;
      }
      return Promise.reject({error: downloadError});
    }
  }
}

export default Cloud;

export type ProfileInfo = {
  email: string;
  picture: string;
};

export type SignInResult = {
  status: (typeof Cloud.status)[keyof typeof Cloud.status];
  profileInfo?: ProfileInfo;
  error?: string;
};

export type IsIOSResult = {
  isIOS?: boolean;
};

export type isSignedInResult = {
  isSignedIn: boolean;
  error?: string | null;
  profileInfo?: ProfileInfo;
};

export type CloudUploadResult = {
  status: (typeof Cloud.status)[keyof typeof Cloud.status];
  error: string | null;
  backupDetails?: BackupDetails;
};
