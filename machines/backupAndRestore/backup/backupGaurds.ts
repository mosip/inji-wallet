import {NetInfoState} from '@react-native-community/netinfo';

export const backupGaurds = () => {
  return {
    isInternetConnected: (_, event) =>
      !!(event.data as NetInfoState).isConnected,
    isMinimumStorageRequiredForBackupAvailable: (_context, event) => {
      return Boolean(!event.data);
    },
    checkIfAutoBackup: context => {
      return context.isAutoBackUp;
    },
    isVCFound: (_context, event) => {
      return !!(event.response && (event.response as object[]).length > 0);
    },
    isNetworkError: (_context, event) => {
      return !!event.data?.toString()?.includes('Network request failed');
    },
  };
};
