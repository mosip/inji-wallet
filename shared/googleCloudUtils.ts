import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import {CloudStorage, CloudStorageScope} from 'react-native-cloud-storage';
import {GOOGLE_ANDROID_CLIENT_ID} from 'react-native-dotenv';
import {request} from '../shared/request';
import {GCLOUD_BACKUP_DIR_NAME} from './constants';

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

class Cloud {
  private static configured = false;
  static status = {
    DECLINED: 'DECLINED',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
  };

  private static async configure(): Promise<void> {
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
    this.configured = true;
  }

  static async signIn(): Promise<SignInResult> {
    this.initialize();
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
      this.initialize();
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

  private static initialize(): void {
    if (!this.configured) {
      this.configure();
    }
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

  private static async getAccessToken() {
    try {
      const tokenResult = await GoogleSignin.getTokens();
      return tokenResult.accessToken;
    } catch (error) {
      console.error('Error while getting access token ', error);
      throw error;
    }
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
