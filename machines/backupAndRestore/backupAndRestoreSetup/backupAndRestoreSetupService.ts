import Cloud from '../../../shared/CloudBackupAndRestoreUtils';
import NetInfo from '@react-native-community/netinfo';

export const backupAndRestoreSetupService = () => {
  return {
    isUserSignedAlready: () => async () => {
      return await Cloud.isSignedInAlready();
    },
    signIn: () => async () => {
      return await Cloud.signIn();
    },
    checkInternet: async () => await NetInfo.fetch(),
  };
};
