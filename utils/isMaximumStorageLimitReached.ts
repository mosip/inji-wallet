import { Platform } from 'react-native';
import {
  getFreeDiskStorageOldSync,
  getFreeDiskStorageSync,
} from 'react-native-device-info';
import { MAXIMUM_STORAGE_LIMIT_IN_MB } from 'react-native-dotenv';

export default function isMaximumStorageLimitReached() {
  const storageLimitInBytes = MAXIMUM_STORAGE_LIMIT_IN_MB * 1024 * 1024;

  if (Platform.OS === 'android' && Platform.Version < 29) {
    const freeDiskStorageOldInBytes = getFreeDiskStorageOldSync();
    return freeDiskStorageOldInBytes <= storageLimitInBytes;
  }

  const freeDiskStorageInBytes = getFreeDiskStorageSync();
  return freeDiskStorageInBytes <= storageLimitInBytes;
}
