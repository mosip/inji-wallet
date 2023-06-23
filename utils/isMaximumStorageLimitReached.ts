import { Platform } from 'react-native';
import {
  getFreeDiskStorageOldSync,
  getFreeDiskStorageSync,
} from 'react-native-device-info';
import getAllConfigurations from '../shared/commonprops/commonProps';

export default async function isMaximumStorageLimitReached() {
  const configurations = await getAllConfigurations();
  const storageLimitInBytes =
    configurations['maximumStorageLimitInMB'] * 1024 * 1024;

  if (Platform.OS === 'android' && Platform.Version < 29) {
    const freeDiskStorageOldInBytes = getFreeDiskStorageOldSync();
    return freeDiskStorageOldInBytes <= storageLimitInBytes;
  }

  const freeDiskStorageInBytes = getFreeDiskStorageSync();
  return freeDiskStorageInBytes <= storageLimitInBytes;
}
