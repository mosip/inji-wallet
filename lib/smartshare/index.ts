import SmartshareReactNative from '@idpass/smartshare-react-native';
import OpenIdBle from 'react-native-openid4vp-ble';
import { OpenIDBLEShare } from 'react-native-openid4vp-ble/lib/typescript/types/bleshare';
import { IdpassSmartshare as IdpassSmartshareType } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import { USE_BLE_SHARE } from 'react-native-dotenv';
const { IdpassSmartshare } = SmartshareReactNative;
const { Openid4vpBle } = OpenIdBle;

type ShareProtocol = OpenIDBLEShare | IdpassSmartshareType;
let ShareLib: ShareProtocol;

export const isBLEEnabled = USE_BLE_SHARE === 'true';

if (isBLEEnabled) {
  ShareLib = Openid4vpBle;
} else {
  ShareLib = IdpassSmartshare;
}

export default ShareLib;
