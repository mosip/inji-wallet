import {NetInfoState} from '@react-native-community/netinfo';

export const restoreGaurd = () => {
  return {
    isInternetConnected: (_, event: any) =>
      !!(event.data as NetInfoState).isConnected,
    isMinimumStorageRequiredForBackupRestorationReached: (_context, event) =>
      Boolean(event.data),
  };
};
