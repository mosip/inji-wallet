import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CloudStorage, CloudStorageScope} from 'react-native-cloud-storage';
import {GOOGLE_ANDROID_CLIENT_ID} from 'react-native-dotenv';
import {readFile, writeFile} from 'react-native-fs';
import {NETWORK_REQUEST_FAILED} from './constants';
import fileStorage, {backupDirectoryPath, zipFilePath} from './fileStorage';
import {request} from './request';
import {getBackupFileName} from './commonUtil';

class Cloud {
  static status = {
    DECLINED: 'DECLINED',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
  };
  private static configure() {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.file',
      ],
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
  static async signIn(): Promise<SignInResult> {
    this.configure();
    try {
      await GoogleSignin.signIn();
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
        };
      }
      return {
        status: this.status.FAILURE,
      };
    }
  }
  static async isSignedInAlready(): Promise<isSignedInResult> {
    try {
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
      return {
        isSignedIn: false,
      };
    }
  }
  static async removeOldDriveBackupFiles(fileName: string) {
    const allFiles = await CloudStorage.readdir(`/`, CloudStorageScope.AppData);
    const toBeRemovedFiles = allFiles.filter(file => file !== fileName);
    console.log(
      'removeOldDriveBackupFiles toBeRemovedFiles ',
      toBeRemovedFiles,
    );
    for (const oldFileName of toBeRemovedFiles) {
      console.log('removing -> ', oldFileName);
      await CloudStorage.unlink(`/${oldFileName}`);
    }
    const allFilesPost = await CloudStorage.readdir(
      `/`,
      CloudStorageScope.AppData,
    );
    console.log('removeOldDriveBackupFiles allFiles ', allFilesPost);
  }
  static async uploadBackupFileToDrive(
    fileName: string,
    retryCounter: number,
    error: string | undefined = undefined,
  ): Promise<string> {
    if (retryCounter < 0 || error === NETWORK_REQUEST_FAILED) {
      return Promise.reject(error);
    }

    const cloudFileName = `/${fileName}.zip`;
    let uploadError: string | undefined = undefined;

    try {
      const tokenResult = await Cloud.getAccessToken();
      CloudStorage.setGoogleDriveAccessToken(tokenResult);

      const filePath = zipFilePath(fileName);
      const fileContent = await readFile(filePath, 'base64');

      const writeResult = await CloudStorage.writeFile(
        cloudFileName,
        fileContent,
        CloudStorageScope.AppData,
      );
      const isFileUploaded = await CloudStorage.exists(
        cloudFileName,
        CloudStorageScope.AppData,
      );

      if (isFileUploaded) {
        const backupFileMeta = await fileStorage.getInfo(filePath);
        // return backupFileMeta;
        console.log('wrote to cloudFileName ', cloudFileName);
        console.log('writeResult ', writeResult);
        await this.removeOldDriveBackupFiles(`${fileName}.zip`);
        return Promise.resolve(Cloud.status.SUCCESS);
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
      }
    }

    return this.uploadBackupFileToDrive(
      fileName,
      retryCounter - 1,
      uploadError,
    );
  }

  static async downloadLatestBackup(): Promise<string | null> {
    const tokenResult = await Cloud.getAccessToken();
    CloudStorage.setGoogleDriveAccessToken(tokenResult);
    const allFiles = await CloudStorage.readdir('/', CloudStorageScope.AppData);
    console.log('allFiles ', allFiles);
    // TODO: do basic sanity about this .zip file
    const fileName = allFiles[0];
    const fileContent = await CloudStorage.readFile(
      fileName,
      CloudStorageScope.AppData,
    );

    if (fileContent.length === 0) return Promise.resolve(null);
    // write the file content in the bkp directory path
    await writeFile(
      backupDirectoryPath + '/' + fileName,
      fileContent,
      'base64',
    );
    // return the path
    return Promise.resolve(fileName.split('.zip')[0]);
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
};

export type isSignedInResult = {
  isSignedIn: boolean;
  profileInfo?: ProfileInfo;
};
