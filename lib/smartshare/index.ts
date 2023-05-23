import SmartshareReactNative from '@idpass/smartshare-react-native';
import OpenIdBle from 'react-native-openid4vp-ble';
import { OpenIDBLEShare } from 'react-native-openid4vp-ble/lib/typescript/types/bleshare';
import { IdpassSmartshare as IdpassSmartshareType } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
const { Openid4vpBle } = OpenIdBle;

type ShareProtocol = OpenIDBLEShare | IdpassSmartshareType;
let ShareLib: ShareProtocol;

ShareLib = Openid4vpBle;

export default ShareLib;
