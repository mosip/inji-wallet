import {NetInfoState} from '@react-native-community/netinfo';
import Cloud, {
  SignInResult,
  isSignedInResult,
} from '../../../shared/CloudBackupAndRestoreUtils';
import {NETWORK_REQUEST_FAILED, isIOS} from '../../../shared/constants';

export const backupAndRestoreSetupGaurds = () => {
  return {
    isInternetConnected: (_context: any, event: any) =>
      !!(event.data as NetInfoState).isConnected,
    isNetworkError: (_context: any, event: any) =>
      event.data.error === NETWORK_REQUEST_FAILED,
    isSignedIn: (_context: any, event: any) => {
      return (event.data as isSignedInResult).isSignedIn;
    },

    isIOSAndSignInFailed: (_context: any, event: any) => {
      const isSignInFailed = !(
        (event.data as SignInResult).status === Cloud.status.SUCCESS
      );
      return isIOS() && isSignInFailed;
    },
    isConfirmationAlreadyShown: (_context: any, event: any) => {
      return (
        (event.response as Object)['encryptedData'][
          'isAccountSelectionConfirmationShown'
        ] || false
      );
    },
    isSignInSuccessful: (_context: any, event: any) => {
      return (event.data as SignInResult).status === Cloud.status.SUCCESS;
    },
    isAuthorisedAndCloudAccessNotGiven: (_context: any, event: any) => {
      return (event.data as isSignedInResult).isAuthorised || false;
    },
  };
};
