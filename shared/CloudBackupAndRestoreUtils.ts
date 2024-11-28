import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CloudStorage, CloudStorageScope} from 'react-native-cloud-storage';
import {GOOGLE_ANDROID_CLIENT_ID} from 'react-native-dotenv';
import {readFile, writeFile} from 'react-native-fs';
import {BackupDetails} from '../types/backup-and-restore/backup';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {bytesToMB, sleep} from './commonUtil';
import {
  IOS_SIGNIN_FAILED,
  isAndroid,
  isIOS,
  NETWORK_REQUEST_FAILED,
} from './constants';
import fileStorage, {backupDirectoryPath, zipFilePath} from './fileStorage';
import {API} from './api';
import {NativeModules} from 'react-native';

class Cloud {
  static status = {
    DECLINED: 'DECLINED',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
  };
  static readonly timeout = 10000;
  private static readonly requiredScopes = [
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
  ];
  private static readonly BACKUP_FILE_REG_EXP = /backup_[0-9]*.zip$/g;
  private static readonly ALL_BACKUP_FILE_REG_EXP = /backup_[0-9]*.zip/g;
  private static readonly UNSYNCED_BACKUP_FILE_REG_EXP =
    /backup_[0-9]*.zip.icloud/g;
  private static readonly RETRY_SLEEP_TIME = 5000;

  static readonly NO_BACKUP_FILE = 'Backup files not available';

  private static configure() {
    GoogleSignin.configure({
      scopes: this.requiredScopes,
      androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    });
  }

  private static async profileInfo(): Promise<ProfileInfo | undefined> {
    try {
      const accessToken = await this.getAccessToken();
      const profileResponse = await API.getGoogleAccountProfileInfo(
        accessToken,
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

  private static getLatestFileName = (allFiles: string[]): string => {
    const sortedFiles = allFiles.sort((a, b) => {
      const dateA = new Date(Number(a.split('.')[0].split('_')[1]));
      const dateB = new Date(Number(b.split('.')[0].split('_')[1]));
      return dateB > dateA ? 1 : dateB < dateA ? -1 : 0;
    });
    return `/${sortedFiles[0]}`;
  };

  /**
   * This method is specific to iOS for downloading files from iCloud, which can be processed after
   * Ref - https://react-native-cloud-storage.vercel.app/docs/api/CloudStorage#downloadfilepath-scope
   */
  private static async syncBackupFiles() {
    const isSyncDone = await this.downloadUnSyncedBackupFiles();
    if (isSyncDone) return;
    await sleep(this.RETRY_SLEEP_TIME);
    await this.syncBackupFiles();
  }

  /**
   * TODO: Remove the test call(get profile info) to reduce extra api calls
   */
  static async getAccessToken() {
    try {
      const tokenResult = await GoogleSignin.getTokens();

      try {
        await API.getGoogleAccountProfileInfo(tokenResult.accessToken);
        return tokenResult.accessToken;
      } catch (error) {
        console.error('Error while using the current token ', error);
        if (
          error.toString().includes('401') &&
          error.toString().includes('UNAUTHENTICATED')
        ) {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        } else if (
          error.toString().includes('401') ||
          error.toString().includes('Unauthorized')
        ) {
          return await refreshToken(tokenResult);
        } else if (this.isNetworkError(error)) {
          throw new Error(NETWORK_REQUEST_FAILED);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error while getting access token ', error);
      throw error;
    }

    async function refreshToken(tokenResult: {
      idToken: string;
      accessToken: string;
    }) {
      await GoogleSignin.clearCachedAccessToken(tokenResult.accessToken);
      await GoogleSignin.signInSilently();
      const {accessToken} = await GoogleSignin.getTokens();
      return accessToken;
    }
  }

  static async signIn(): Promise<SignInResult | IsIOSResult> {
    const {RNSecureKeystoreModule} = NativeModules;
    if (isIOS()) {
      let profileInfo;

      // start a login request
      try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });
        const {email, user, nonce, identityToken, realUserStatus /* etc */} =
          appleAuthRequestResponse;
        profileInfo = {email: email, picture: null};

        if (email) {
          await RNSecureKeystoreModule.storeValueInCloud(user, email);
          await RNSecureKeystoreModule.storeData(
            'userIdentifier',
            JSON.stringify({user, email}),
          );
        } else {
          const userEmailFromCloud =
            await RNSecureKeystoreModule.retrieveValueFromCloud(user);
          profileInfo.email = userEmailFromCloud;
          await RNSecureKeystoreModule.storeData(
            'userIdentifier',
            JSON.stringify({user, userEmailFromCloud}),
          );
        }

        return {status: this.status.SUCCESS, profileInfo: profileInfo};
      } catch (error) {
        if (error.code === appleAuth.Error.CANCELED) {
          console.warn('User canceled Apple Sign in.');
          return {
            status: this.status.DECLINED,
            error,
          };
        } else {
          console.error(error);
          return {
            status: this.status.FAILURE,
            error,
          };
        }
      }
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
      } else if (this.isNetworkError(error)) {
        error = NETWORK_REQUEST_FAILED;
      }
      return {
        status: this.status.FAILURE,
        error,
      };
    }
  }

  static async isSignedInAlready(): Promise<isSignedInResult> {
    const {RNSecureKeystoreModule} = NativeModules;
    try {
      if (isIOS()) {
        const isSignedIn = await CloudStorage.isCloudAvailable();

        const userIdentifier = await RNSecureKeystoreModule.getData(
          'userIdentifier',
        );
        const userToken = JSON.parse(userIdentifier[1]);
        const {user, email} = userToken;

        const userEmail = email
          ? email
          : await RNSecureKeystoreModule.retrieveValueFromCloud(user);

        const credentialState = await appleAuth.getCredentialStateForUser(user);
        const profileInfo = {email: userEmail, picture: undefined};
        if (
          credentialState === appleAuth.State.AUTHORIZED &&
          isSignedIn === true
        ) {
          return {
            isSignedIn: true,
            isAuthorised: true,
            profileInfo: profileInfo,
          };
        } else {
          return {
            isSignedIn: false,
            isAuthorised: true,
            profileInfo: profileInfo,
          };
        }
      }
      this.configure();
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (!isSignedIn) {
        await GoogleSignin.signInSilently();
        const profileInfo = await this.profileInfo();
        return {
          isSignedIn: true,
          profileInfo,
          isAuthorised: true,
        };
      } else {
        const profileInfo = await this.profileInfo();
        return {
          isSignedIn: true,
          profileInfo,
          isAuthorised: true,
        };
      }
    } catch (error) {
      console.error(
        'Error while checking if user is already signed in ',
        error,
      );
      let errorReason: null | string = null;
      if (this.isNetworkError(error)) errorReason = NETWORK_REQUEST_FAILED;
      //TODO: resolve and reject promise so it can be handled in onError
      return {
        error: errorReason || error,
        isSignedIn: false,
        isAuthorised: false,
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
      const availableBackupFilesInCloud = (
        await this.getBackupFilesList()
      ).filter(file => file.match(this.BACKUP_FILE_REG_EXP));
      if (availableBackupFilesInCloud.length === 0) {
        throw new Error(this.NO_BACKUP_FILE);
      }
      cloudFileName = this.getLatestFileName(availableBackupFilesInCloud);
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
      .filter(file => file.match(this.ALL_BACKUP_FILE_REG_EXP));
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
      console.error(
        `Error occurred while cloud upload.. retrying ${retryCounter} : Error : ${error}`,
      );
      if (this.isNetworkError(error)) {
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
      // TODO: do basic sanity about this .zip file
      const availableBackupFilesInCloud = (
        await this.getBackupFilesList()
      ).filter(file => file.match(this.BACKUP_FILE_REG_EXP));
      if (availableBackupFilesInCloud.length === 0) {
        throw new Error(Cloud.NO_BACKUP_FILE);
      }

      const fileName = `/${this.getLatestFileName(
        availableBackupFilesInCloud,
      )}`;
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
      console.error('error while downloading backup file ', error);
      let downloadError;
      if (this.isNetworkError(error)) {
        downloadError = NETWORK_REQUEST_FAILED;
      } else if (
        error.code?.toString() === 'ERR_DIRECTORY_NOT_FOUND' ||
        error.toString().includes(this.NO_BACKUP_FILE)
      ) {
        downloadError = this.NO_BACKUP_FILE;
      } else {
        downloadError = error;
      }
      return Promise.reject({error: downloadError});
    }
  }

  private static isNetworkError(error: Error): boolean {
    if (
      error.toString().includes('NETWORK_ERROR') ||
      error.toString().includes('Network Error') ||
      error.toString().includes('NetworkError') ||
      error.toString().includes(NETWORK_REQUEST_FAILED)
    )
      return true;
    return false;
  }
}

export default Cloud;

export type ProfileInfo = {
  email: string;
  picture: string | undefined;
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
  isAuthorised?: boolean;
};

export type CloudUploadResult = {
  status: (typeof Cloud.status)[keyof typeof Cloud.status];
  error: string | null;
  backupDetails?: BackupDetails;
};
