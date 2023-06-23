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

  const freeDiskStorageInBytes =
    Platform.OS === 'android' && Platform.Version < 29
      ? getFreeDiskStorageOldSync()
      : getFreeDiskStorageSync();

  return freeDiskStorageInBytes <= storageLimitInBytes;
}
