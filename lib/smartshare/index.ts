import SmartshareReactNative from '@idpass/smartshare-react-native';
import OpenIdBle from 'react-native-openid4vp-ble';
import { OpenIDBLEShare } from 'react-native-openid4vp-ble/lib/typescript/types/bleshare';
import { IdpassSmartshare } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import { USE_BLE_SHARE } from 'react-native-dotenv';
const { IdpassSmartshare } = SmartshareReactNative;
const { Openid4vpBle } = OpenIdBle;

type ShareProtocol = OpenIDBLEShare | IdpassSmartshare;
let exporter: ShareProtocol;

if (USE_BLE_SHARE) {
  exporter = Openid4vpBle;
} else {
  exporter = IdpassSmartshare;
}

export default exporter;
