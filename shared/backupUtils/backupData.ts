import { MY_VCS_STORE_KEY } from "../constants";
import { decryptJson } from "../cryptoutil/cryptoUtil";
import Storage, { MMKV } from "../storage";
import { TelemetryConstants } from "../telemetry/TelemetryConstants";
import { getErrorEventData, sendErrorEvent } from "../telemetry/TelemetryUtils";
import { VCMetadata } from "../VCMetadata";



/**
  * Main method to export data with clear, separated concerns
  */
export async function exportData(encryptionKey: string): Promise<Record<string, any>> {
    try {
        const allKeysInDB = await getAllDatabaseKeys();
        const dataFromDB = await extractConfigAndStoreData(allKeysInDB, encryptionKey);
        const vcRecords = await extractVerifiableCredentials(allKeysInDB, encryptionKey, dataFromDB);
        return {
            VC_Records: vcRecords,
            dataFromDB
        };
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
}

/**
 * Retrieve all keys from the database
 */
async function getAllDatabaseKeys(): Promise<string[]> {
    return await MMKV.indexer.strings.getKeys();
}

/**
 * Extract configuration and store data
 */
async function extractConfigAndStoreData(
    allKeysInDB: string[],
    encryptionKey: string
): Promise<Record<string, any>> {
    const keysToBeExported = [
        ...allKeysInDB.filter(key => key.includes('CACHE_FETCH_ISSUER_WELLKNOWN_CONFIG_')),
        MY_VCS_STORE_KEY
    ];

    const dataFromDB: Record<string, any> = await fetchAndDecryptData(
        keysToBeExported,
        encryptionKey
    );

    return processVCMetadata(dataFromDB);
}

/**
 * Fetch and decrypt data for given keys
 */
async function fetchAndDecryptData(
    keys: string[],
    encryptionKey: string
): Promise<Record<string, any>> {
    const dataFromDB: Record<string, any> = {};

    // Fetch encrypted data concurrently
    const encryptedDataList = await Promise.all(
        keys.map(key => MMKV.getItem(key))
    );

    // Decrypt each item
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const encryptedData = encryptedDataList[i];

        if (encryptedData) {
            const decryptedData = await decryptJson(encryptionKey, encryptedData);
            dataFromDB[key] = JSON.parse(decryptedData);
        }
    }
    return dataFromDB;
}

/**
 * Process and modify VC metadata
 */
function processVCMetadata(
    dataFromDB: Record<string, any>
): Record<string, any> {
    if (dataFromDB[MY_VCS_STORE_KEY]) {
        dataFromDB[MY_VCS_STORE_KEY] = dataFromDB[MY_VCS_STORE_KEY].map(
            myVcMetadata => ({ ...myVcMetadata, isPinned: false })
        );
    }
    return dataFromDB;
}

/**
 * Extract Verifiable Credentials
 */
async function extractVerifiableCredentials(
    allKeysInDB: string[],
    encryptionKey: string,
    dataFromDB: Record<string, any>
): Promise<Record<string, any>> {
    const vcRecords: Record<string, any> = {};
    const vcKeys = allKeysInDB.filter(key => key.startsWith('VC_'));

    // Process each VC key
    for (const key of vcKeys) {
        try {
            const vc = await Storage.getItem(key, encryptionKey);

            if (vc) {
                const decryptedVCData = await decryptJson(encryptionKey, vc);
                const deactivatedVC = removeWalletBindingDataBeforeBackup(decryptedVCData);
                vcRecords[key] = deactivatedVC;
            } else {
                removeNonExistentVCMetadata(dataFromDB, key);
            }
        } catch (error) {
            throw error;
        }
    }

    return vcRecords;
}

/**
 * Remove metadata for non-existent VCs
 */
function removeNonExistentVCMetadata(
    dataFromDB: Record<string, any>,
    key: string
) {
    if (dataFromDB.myVCs) {
        dataFromDB.myVCs = dataFromDB.myVCs.filter(
            vcMetaData =>
                VCMetadata.fromVcMetadataString(vcMetaData).getVcKey() !== key
        );
    }
}

/**
 * Remove wallet binding details from the VC
 */
function removeWalletBindingDataBeforeBackup(data: string) {
    const vcData = JSON.parse(data);
    vcData.walletBindingResponse = null;
    vcData.publicKey = null;
    vcData.privateKey = null;
    return vcData;
  }
