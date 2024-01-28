import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {CloudStorage, CloudStorageScope} from 'react-native-cloud-storage';
import {GOOGLE_ANDROID_CLIENT_ID} from 'react-native-dotenv';
import {request} from './request';
import {readFile} from "react-native-fs";
import {zipFilePath} from "./fileStorage";

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
        console.log('Not signed in');
        const profileInfo = await this.profileInfo();
        return {
          isSignedIn: true,
          profileInfo,
        };
      } else {
        const profileInfo = await this.profileInfo();
        console.log(' signed in');
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
  static async  removeOldDriveBackupFiles(fileName: string){
    const allFiles = await CloudStorage.readdir(`/`, CloudStorageScope.AppData);
    for (const oldFileName of allFiles.filter(file => file != fileName)) {
      await CloudStorage.unlink(`/${oldFileName}`);
    }
  }
  static async uploadBackupFileToDrive(fileName: string, retryCounter: number): Promise<string> {
    if (retryCounter < 0) return Promise.reject("failure");

    const cloudFileName = `/${fileName}.zip`;

    try {
      const tokenResult = await Cloud.getAccessToken();
      CloudStorage.setGoogleDriveAccessToken(tokenResult);

      const filePath = zipFilePath(fileName);
      const fileContent = await readFile(filePath, 'base64');

      await CloudStorage.writeFile(cloudFileName,fileContent,CloudStorageScope.AppData);

    } catch (error) {
      console.log(`Error occured while cloud upload.. retrying ${retryCounter} : Error : ${error}`);
    }

    const isFileUploaded = await CloudStorage.exists(cloudFileName,CloudStorageScope.AppData);

    if (isFileUploaded){
      console.log("file is there") // remove
      await this.removeOldDriveBackupFiles(cloudFileName);
      return Promise.resolve('success');
    }
    return this.uploadBackupFileToDrive(fileName,retryCounter - 1);
  }
  static async downloadLatestBackup(): Promise<string> {
    const allFiles = await CloudStorage.readdir(`/`, CloudStorageScope.AppData);
    const fileContent = await CloudStorage.readFile(allFiles[0]);
    return Promise.resolve(fileContent);
  }
}
export default Cloud;

export type ProfileInfo = {
  email: string;
  picture: string;
};

export type SignInResult = {
  status: keyof typeof Cloud.status;
  profileInfo?: ProfileInfo;
};

export type isSignedInResult = {
  isSignedIn: boolean;
  profileInfo?: ProfileInfo;
};
