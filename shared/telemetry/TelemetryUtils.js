import telemetry from '@project-sunbird/telemetry-sdk';
import { Platform } from 'react-native';
import { HOST } from '../constants';
import {
  __AppId,
  __InjiVersion,
  __SelectedLanguage,
  __SessionId,
  __TuvaliVersion,
} from '../GlobalVariables';
import DeviceInfo from 'react-native-device-info';
import { isCustomSecureKeystore } from '../cryptoutil/cryptoUtil';
import * as RNLocalize from 'react-native-localize';

export function sendImpressionEvent(data) {
  telemetry.impression(data, {});
}

export function sendEndEvent(data) {
  telemetry.end(data, {});
}

export function initializeTelemetry(config) {
  telemetry.initialize(config);
}

export function sendStartEvent(data) {
  telemetry.start({}, '', '', data, {});
}

export function sendAppInfoEvent(data) {
  telemetry.appinfo(data);
}

export function getTelemetryConfigData() {
  return {
    authtoken: '',
    appid: __AppId.getValue(),
    sid: __SessionId.getValue(),
    batchsize: 5,
    host: 'https://dataset-api.obsrv.mosip.net',
    endpoint: '/obsrv/v1/data/mosip-dataset',
    telemetryDebugEnabled: true,
    enableValidation: true,
    schemaBaseUrl: 'http://mosip.io/telemetry/',
  };
}

export function getData(type) {
  return {
    type: type,
  };
}

export function getAppInfoData() {
  return {
    env: HOST,
    brandName: DeviceInfo.getBrand(),
    modelName: DeviceInfo.getModel(),
    osName: DeviceInfo.getSystemName(),
    osVersion: DeviceInfo.getSystemVersion(),
    osApiLevel: Platform.Version.toString(),
    isHardwareKeystoreSupported: isCustomSecureKeystore(),
    dateTime: new Date().getTime(),
    zone: RNLocalize.getTimeZone(),
    offset: new Date().getTimezoneOffset() * 60 * 1000,
    preferredLanguage: __SelectedLanguage.getValue(),
    buildNumber: DeviceInfo.getBuildNumber(),
    injiVersion: __InjiVersion.getValue(),
    tuvaliVersion: __TuvaliVersion.getValue(),
  };
}
