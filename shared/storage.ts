import {MMKVLoader} from 'react-native-mmkv-storage';
import getAllConfigurations from './api';
import {
  getFreeDiskStorageOldSync,
  getFreeDiskStorageSync,
} from 'react-native-device-info';
import {NativeModules} from 'react-native';
import {
  decryptJson,
  encryptJson,
  HMAC_ALIAS,
  hmacSHA,
  isHardwareKeystoreExists,
} from './cryptoutil/cryptoUtil';
import {VCMetadata} from './VCMetadata';
import {
  androidVersion,
  isAndroid,
  MY_VCS_STORE_KEY,
  SETTINGS_STORE_KEY,
  ENOENT,
  API_CACHED_STORAGE_KEYS,
} from './constants';
import FileStorage, {
  getFilePath,
  getDirectorySize,
  vcDirectoryPath,
} from './fileStorage';
import {__AppId} from './GlobalVariables';
import {getErrorEventData, sendErrorEvent} from './telemetry/TelemetryUtils';
import {TelemetryConstants} from './telemetry/TelemetryConstants';
import {BYTES_IN_MEGABYTE} from './commonUtil';
import fileStorage from './fileStorage';
import {DocumentDirectoryPath, ReadDirItem} from 'react-native-fs';
import {verifyCredential} from './vcjs/verifyCredential';
import {Credential} from '../machines/VerifiableCredential/VCMetaMachine/vc';
import {VCFormat} from './VCFormat';
import {isMockVC} from './Utils';

export const MMKV = new MMKVLoader().initialize();
const {RNSecureKeystoreModule} = NativeModules;

async function generateHmac(
  encryptionKey: string,
  data: string,
): Promise<string> {
  if (!isHardwareKeystoreExists) {
    return hmacSHA(encryptionKey, data);
  }
  return await RNSecureKeystoreModule.generateHmacSha(HMAC_ALIAS, data);
}

class Storage {
  static exportData = async (encryptionKey: string) => {
    try {
      const completeBackupData = {};
      let dataFromDB: Record<string, any> = {};

      const allKeysInDB = await MMKV.indexer.strings.getKeys();

      const keysToBeExported = allKeysInDB.filter(key =>
        key.includes('CACHE_FETCH_ISSUER_WELLKNOWN_CONFIG_'),
      );
      keysToBeExported?.push(MY_VCS_STORE_KEY);

      const encryptedDataPromises = keysToBeExported.map(key =>
        MMKV.getItem(key),
      );
      const encryptedDataList = await Promise.all(encryptedDataPromises);
      for (let index = 0; index < keysToBeExported.length; index++) {
        const key = keysToBeExported[index];
        let encryptedData = encryptedDataList[index];
        if (encryptedData != null) {
          const decryptedData = await decryptJson(encryptionKey, encryptedData);
          dataFromDB[key] = JSON.parse(decryptedData);
        }
      }

      dataFromDB[MY_VCS_STORE_KEY].map(myVcMetadata => {
        myVcMetadata.isPinned = false;
      });

      completeBackupData['VC_Records'] = {};

      let vcKeys = allKeysInDB.filter(key => key.indexOf('VC_') === 0);
      for (let ind in vcKeys) {
        const key = vcKeys[ind];
        const vc = await this.getItem(key, encryptionKey);

        if (vc) {
          const decryptedVCData = await decryptJson(encryptionKey, vc);
          const deactivatedVC =
            removeWalletBindingDataBeforeBackup(decryptedVCData);
          completeBackupData['VC_Records'][key] = deactivatedVC;
        } else {
          dataFromDB.myVCs = dataFromDB.myVCs.filter(vcMetaData => {
            return (
              VCMetadata.fromVcMetadataString(vcMetaData).getVcKey() !== key
            );
          });
        }
      }
      completeBackupData['dataFromDB'] = dataFromDB;

      return completeBackupData;
    } catch (error) {
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.dataBackup,
          error.message,
          error.stack,
        ),
      );
      console.error('exporting data is failed due to this error:', error);
      throw error;
    }
  };

  /**
   * Load backup data with improved error handling and logging
   * @param data Backup data to be loaded
   * @param encryptionKey Key used for encryption/decryption
   * @returns Promise resolving to loaded data or error
   */
  static async loadBackupData(
    data: string,
    encryptionKey: string,
  ): Promise<any> {
    const PREV_BACKUP_STATE_PATH = `${DocumentDirectoryPath}/.prev`;
    try {
      await this.handlePreviousBackup(PREV_BACKUP_STATE_PATH, encryptionKey);
      const completeBackupData = JSON.parse(data);
      const backupStartState = Date.now().toString();
      await fileStorage.writeFile(PREV_BACKUP_STATE_PATH, backupStartState);
      const dataFromDB = await this.loadVCs(completeBackupData, encryptionKey);
      await this.updateWellKnownConfigs(dataFromDB, encryptionKey);
    } catch (error) {
      console.error('Error while loading backup data:', error);
    }
  }

  /**
   * Handle cleanup of previous backup state
   * @param prevBackupStatePath Path to previous backup state file
   * @param encryptionKey Encryption key
   * @returns Previous restore timestamp
   */
  private static async handlePreviousBackup(
    prevBackupStatePath: string,
    encryptionKey: string,
  ) {
    const previousBackupExists = await fileStorage.exists(prevBackupStatePath);
    if (previousBackupExists) {
      const previousRestoreTimestamp = await fileStorage.readFile(
        prevBackupStatePath,
      );
      const timestampNum = parseInt(previousRestoreTimestamp.trim());
      await this.unloadVCs(encryptionKey, timestampNum);
    }
  }

  /**
   * Unload Verifiable Credentials based on a cutoff timestamp
   * @param encryptionKey Encryption key
   * @param cutOffTimestamp Timestamp to use as cutoff
   */
  private static async unloadVCs(
    encryptionKey: string,
    cutOffTimestamp: number,
  ) {
    try {
      await this.removeOldVCFiles(cutOffTimestamp);
      await this.removeVCMetadataFromDB(encryptionKey, cutOffTimestamp);
    } catch (error) {
      console.error('Error while unloading VCs:', error);
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.dataRestore,
          TelemetryConstants.ErrorId.failure,
          error.message,
        ),
      );
    }
  }

  /**
   * Remove VC files created after the cutoff timestamp
   * @param cutOffTimestamp Timestamp to use as cutoff
   */
  private static async removeOldVCFiles(cutOffTimestamp: number) {
    const vcDirectory = `${DocumentDirectoryPath}/inji/VC/`;
    const files = await fileStorage.getAllFilesInDirectory(vcDirectory);

    const filesToRemove = files.filter(file => {
      const fileName = file.name.split('.')[0];
      const fileTimestamp = parseInt(fileName.split('_')[1]);
      return fileTimestamp >= cutOffTimestamp;
    });

    await Promise.all(
      filesToRemove.map(file => fileStorage.removeItem(file.path)),
    );
  }

  /**
   * Update MMKV store to remove VCs after cutoff timestamp
   * @param encryptionKey Encryption key
   * @param cutOffTimestamp Timestamp to use as cutoff
   */
  private static async removeVCMetadataFromDB(
    encryptionKey: any,
    cutOffTimestamp: number,
  ) {
    const myVCsEnc = await MMKV.getItem(MY_VCS_STORE_KEY, encryptionKey);

    if (myVCsEnc === null) return;

    const mmkvVCs = await decryptJson(encryptionKey, myVCsEnc);
    const vcList: VCMetadata[] = JSON.parse(mmkvVCs);
    const newVCList = vcList.filter(
      vc => !vc.timestamp || parseInt(vc.timestamp) < cutOffTimestamp,
    );
    const finalVC = await encryptJson(encryptionKey, JSON.stringify(newVCList));
    await MMKV.setItem(MY_VCS_STORE_KEY, finalVC);
  }

  /**
   * Handle cleanup of previous backup state
   * @param completeBackupData Entire Backup data to be loaded
   * @param encryptionKey Encryption key
   * @returns Previous
   */
  private static async loadVCs(
    completeBackupData: Record<string, any>,
    encryptionKey: string,
  ): Promise<Record<string, any> | undefined> {
    try {
      const {VC_Records: allVCs, dataFromDB: dataFromDB} = completeBackupData;

      await this.processAndStoreVCs(allVCs, dataFromDB, encryptionKey);
      await this.updateMyVcList(dataFromDB, encryptionKey);
      await fileStorage.removeItemIfExist(`${DocumentDirectoryPath}/.prev`);
      return dataFromDB;
    } catch (error) {
      console.error('Error while loading VCs:', error);
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.dataBackup,
          TelemetryConstants.ErrorId.failure,
          error.message,
        ),
      );
    }
  }

  /**
   * Process and store individual Verifiable Credentials
   * @param allVCs All Verifiable Credentials from backup
   * @param dataFromDB Database data containing VC metadata
   * @param encryptionKey Encryption key
   */
  private static async processAndStoreVCs(
    allVCs: Record<string, any>,
    dataFromDB: Record<string, any>,
    encryptionKey: string,
  ) {
    const vcKeys = Object.keys(allVCs);

    await Promise.all(
      vcKeys.map(async key => {
        const vcData = allVCs[key];
        // Add randomness to timestamp to maintain uniqueness
        const timestamp =
          Date.now() + Math.random().toString().substring(2, 10);
        const prevUnixTimeStamp = vcData.vcMetadata.timestamp;

        // Verify and update the credential
        const isVerified = await this.verifyCredential(
          vcData,
          vcData.vcMetadata,
        );
        vcData.vcMetadata.timestamp = timestamp;
        vcData.vcMetadata.isVerified = isVerified;

        //update the vcMetadata
        dataFromDB.myVCs.forEach(myVcMetadata => {
          if (
            myVcMetadata.requestId === vcData.vcMetadata.requestId &&
            myVcMetadata.timestamp === prevUnixTimeStamp
          ) {
            myVcMetadata.timestamp = timestamp;
            myVcMetadata.isVerified = isVerified;
          }
        });

        // Encrypt and store the VC
        const updatedVcKey = new VCMetadata(vcData.vcMetadata).getVcKey();
        const encryptedVC = await encryptJson(
          encryptionKey,
          JSON.stringify(vcData),
        );
        await this.setItem(updatedVcKey, encryptedVC, encryptionKey);
      }),
    );
  }

  /**
   * Verify the restored credential
   * @param vcData  Verifiable Credential from backup
   * @param vcMetadata  VC metadata
   */
  private static async verifyCredential(vcData: any, vcMetadata: any) {
    let isVerified = true;
    const verifiableCredential =
      vcData.verifiableCredential?.credential || vcData.verifiableCredential;
    if (
      vcMetadata.format === VCFormat.mso_mdoc ||
      !isMockVC(vcMetadata.issuer)
    ) {
      const verificationResult = await verifyCredential(
        verifiableCredential,
        vcMetadata.format,
      );
      isVerified = verificationResult.isVerified;
    }
    return isVerified;
  }

  /**
   * Update MMKV store with new VC metadata
   * @param dataFromDB Database data containing VC metadata
   * @param encryptionKey Encryption key
   */
  private static async updateMyVcList(
    dataFromDB: Record<string, any>,
    encryptionKey: string,
  ) {
    const dataFromMyVCKey = dataFromDB[MY_VCS_STORE_KEY];
    const encryptedMyVCKeyFromMMKV = await MMKV.getItem(MY_VCS_STORE_KEY);

    let newDataForMyVCKey: VCMetadata[];

    if (encryptedMyVCKeyFromMMKV != null) {
      const myVCKeyFromMMKV = await decryptJson(
        encryptionKey,
        encryptedMyVCKeyFromMMKV,
      );

      newDataForMyVCKey = [...JSON.parse(myVCKeyFromMMKV), ...dataFromMyVCKey];
    } else {
      newDataForMyVCKey = dataFromMyVCKey;
    }
    const encryptedDataForMyVCKey = await encryptJson(
      encryptionKey,
      JSON.stringify(newDataForMyVCKey),
    );

    await this.setItem(
      MY_VCS_STORE_KEY,
      encryptedDataForMyVCKey,
      encryptionKey,
    );
  }

  /**
   * Update Well Known configs for cached issuers
   * @param dataFromDB Database data
   * @param encryptionKey Encryption key
   */
  private static async updateWellKnownConfigs(
    dataFromDB: Record<string, any>,
    encryptionKey: string,
  ) {
    const cacheKeys = Object.keys(dataFromDB).filter(key =>
      key.includes('CACHE_FETCH_ISSUER_WELLKNOWN_CONFIG_'),
    );

    await Promise.all(
      cacheKeys.map(async key => {
        const value = dataFromDB[key];
        const encryptedValue = await encryptJson(
          encryptionKey,
          JSON.stringify(value),
        );
        await this.setItem(key, encryptedValue, encryptionKey);
      }),
    );
  }

  static fetchAllWellknownConfig = async (encryptionKey: string) => {
    let wellknownConfigData: Record<string, Object> = {};
    const allKeysInDB = await MMKV.indexer.strings.getKeys();
    const wellknownConfigCacheKey =
      API_CACHED_STORAGE_KEYS.fetchIssuerWellknownConfig('');
    const wellknownKeys = allKeysInDB.filter(key =>
      key.includes(wellknownConfigCacheKey),
    );

    for (const wellknownKey of wellknownKeys) {
      const configData = await this.getItem(wellknownKey, encryptionKey);
      const decryptedConfigData = await decryptJson(encryptionKey, configData);
      wellknownConfigData[
        wellknownKey.substring(wellknownConfigCacheKey.length)
      ] = JSON.parse(JSON.stringify(decryptedConfigData));
    }
    return wellknownConfigData;
  };

  static isVCStorageInitialised = async (): Promise<boolean> => {
    try {
      const res = await FileStorage.getInfo(vcDirectoryPath);
      return res.isDirectory();
    } catch (_) {
      return false;
    }
  };

  static setItem = async (
    key: string,
    data: string,
    encryptionKey?: string,
  ) => {
    try {
      const isSavingVC = VCMetadata.isVCKey(key);
      if (isSavingVC) {
        await this.storeVC(key, data);
        return await this.storeVcHmac(encryptionKey, data, key);
      }

      await MMKV.setItem(key, data);
    } catch (error) {
      console.error('Error Occurred while saving in Storage.', error);
      throw error;
    }
  };

  static getItem = async (key: string, encryptionKey?: string) => {
    try {
      const isVCKey = VCMetadata.isVCKey(key);

      if (isVCKey) {
        const data = await this.readVCFromFile(key);
        const isCorrupted = await this.isCorruptedVC(key, encryptionKey, data);

        if (isCorrupted) {
          sendErrorEvent(
            getErrorEventData(
              TelemetryConstants.FlowType.fetchData,
              TelemetryConstants.ErrorId.tampered,
              'VC is corrupted and will be deleted from storage',
            ),
          );
          console.debug(
            '[Inji-406]: VC is corrupted and will be deleted from storage',
          );
          console.debug('[Inji-406]: VC key: ', key);
          console.debug('[Inji-406]: is Data null', data === null);
        }

        return isCorrupted ? null : data;
      }

      return await MMKV.getItem(key);
    } catch (error) {
      const isVCKey = VCMetadata.isVCKey(key);

      if (isVCKey) {
        const isDownloaded = await this.isVCAlreadyDownloaded(
          key,
          encryptionKey,
        );

        if (isDownloaded && error.message.includes(ENOENT)) {
          sendErrorEvent(
            getErrorEventData(
              TelemetryConstants.FlowType.fetchData,
              TelemetryConstants.ErrorId.dataRetrieval,
              error.message,
            ),
          );
          throw new Error(ENOENT);
        }
      }
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.fetchData,
          TelemetryConstants.ErrorId.dataRetrieval,
          'Error Occurred while retrieving from Storage',
        ),
      );

      console.error('Error Occurred while retrieving from Storage.', error);
      throw error;
    }
  };

  private static async isVCAlreadyDownloaded(
    key: string,
    encryptionKey: string,
  ) {
    try {
      const storedHMACofCurrentVC = await this.readHmacForVC(
        key,
        encryptionKey,
      );
      return storedHMACofCurrentVC !== null;
    } catch (e) {
      throw e;
    }
  }

  private static async isCorruptedVC(
    key: string,
    encryptionKey: string,
    data: string,
  ) {
    // TODO: INJI-612 refactor
    try {
      const storedHMACofCurrentVC = await this.readHmacForDataCorruptionCheck(
        key,
        encryptionKey,
      );
      const HMACofVC = await generateHmac(encryptionKey, data);
      return HMACofVC !== storedHMACofCurrentVC;
    } catch (e) {
      throw e;
    }
  }

  private static async readHmacForVC(key: string, encryptionKey: string) {
    try {
      const encryptedHMACofCurrentVC = await MMKV.getItem(key);
      if (encryptedHMACofCurrentVC) {
        return decryptJson(encryptionKey, encryptedHMACofCurrentVC);
      }
      return null;
    } catch (e) {
      console.error('error while reading Hmac for VC ', e);
      throw e;
    }
  }

  private static async readHmacForDataCorruptionCheck(
    key: string,
    encryptionKey: string,
  ) {
    try {
      const encryptedHMACofCurrentVC = await MMKV.getItem(key);
      if (encryptedHMACofCurrentVC) {
        return decryptJson(encryptionKey, encryptedHMACofCurrentVC);
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  private static async readVCFromFile(key: string) {
    return await FileStorage.readFile(getFilePath(key));
  }

  private static async storeVC(key: string, data: string) {
    await FileStorage.createDirectory(vcDirectoryPath);
    const path = getFilePath(key);
    return await FileStorage.writeFile(path, data);
  }

  // TODO: INJI-612 refactor
  private static async storeVcHmac(
    encryptionKey: string,
    data: string,
    key: string,
  ) {
    const HMACofVC = await generateHmac(encryptionKey, data);
    const encryptedHMACofVC = await encryptJson(encryptionKey, HMACofVC);
    await MMKV.setItem(key, encryptedHMACofVC);
  }

  static removeItem = async (key: string) => {
    if (VCMetadata.isVCKey(key)) {
      const path = getFilePath(key);
      const isFileExists = await FileStorage.exists(path);
      if (isFileExists) {
        return await FileStorage.removeItem(path);
      } else {
        console.warn('file not exist`s');
      }
    }
    MMKV.removeItem(key);
  };

  static clear = async () => {
    try {
      (await FileStorage.exists(`${vcDirectoryPath}`)) &&
        (await FileStorage.removeItem(`${vcDirectoryPath}`));
      const settings = await MMKV.getItem(SETTINGS_STORE_KEY);
      const appId = JSON.parse(settings).appId;
      __AppId.setValue(appId);
      MMKV.clearStore();
      await MMKV.setItem(SETTINGS_STORE_KEY, JSON.stringify({appId: appId}));
    } catch (e) {
      console.error('Error Occurred while Clearing Storage.', e);
    }
  };

  static isMinimumLimitReached = async (limitInMB: string) => {
    const configurations = await getAllConfigurations();
    if (!configurations[limitInMB]) return false;

    const minimumStorageLimitInBytes =
      configurations[limitInMB] * BYTES_IN_MEGABYTE;

    const freeDiskStorageInBytes =
      isAndroid() && androidVersion < 29
        ? getFreeDiskStorageOldSync()
        : getFreeDiskStorageSync();

    return freeDiskStorageInBytes <= minimumStorageLimitInBytes;
  };
}

export default Storage;

function removeWalletBindingDataBeforeBackup(data: string) {
  const vcData = JSON.parse(data);
  vcData.walletBindingResponse = null;
  vcData.publicKey = null;
  vcData.privateKey = null;
  return vcData;
}

export async function isMinimumLimitForBackupReached() {
  try {
    const directorySize = await getDirectorySize(vcDirectoryPath);
    const freeDiskStorageInBytes =
      isAndroid() && androidVersion < 29
        ? getFreeDiskStorageOldSync()
        : getFreeDiskStorageSync();

    return freeDiskStorageInBytes <= 2 * directorySize;
  } catch (error) {
    console.error('Error in isMinimumLimitForBackupReached:', error);
    throw error;
  }
}

export async function isMinimumLimitForBackupRestorationReached() {
  // TODO: Have two checks, one for downloading the ZIP file from the cloud &
  //  then by looking at it's metadata to check it's expanded size
  // APIs:
  // 1. CloudStorage.stat(file, context)
  // 2. getUncompressedSize()
  return await Storage.isMinimumLimitReached('minStorageRequired');
}
