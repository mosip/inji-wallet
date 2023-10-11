import telemetry from 'telemetry-sdk';
import {Platform} from 'react-native';
import {HOST} from '../constants';
import {
  __AppId,
  __InjiVersion,
  __SelectedLanguage,
  __SessionId,
  __TuvaliVersion,
} from '../GlobalVariables';
import {OBSRV_HOST} from 'react-native-dotenv';
import DeviceInfo from 'react-native-device-info';
import {isCustomSecureKeystore} from '../cryptoutil/cryptoUtil';
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

export function sendInteractEvent(data) {
  telemetry.interact(data, {});
}

export function sendErrorEvent(data) {
  telemetry.error(data, {});
}

export function getTelemetryConfigData() {
  return {
    authtoken: '',
    appid: __AppId.getValue(),
    sid: __SessionId.getValue(),
    batchsize: 5,
    host: OBSRV_HOST,
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

export function getEndData(type, status, additionalParameters = {}) {
  return {
    type: type,
    status: status,
    additionalParameters: additionalParameters,
  };
}

export function getInteractData(
  type,
  ineteractionType,
  interactingOn,
  additionParameters = {},
) {
  const subtype = getInteractDataSubtype(ineteractionType, interactingOn);
  return {
    type,
    subtype,
    additionParameters: additionParameters,
  };
}

export function getImpressionData(type, subtype, additionalParameters = {}) {
  return {
    type,
    subtype,
    additionalParameters: additionalParameters,
  };
}

export function getErrorData(type, errorId, errorMessage, stacktrace = {}) {
  return {
    type: type,
    env: HOST,
    brandName: DeviceInfo.getBrand(),
    modelName: DeviceInfo.getModel(),
    osName: DeviceInfo.getSystemName(),
    osVersion: DeviceInfo.getSystemVersion(),
    osApiLevel: Platform.Version.toString(),
    isHardwareKeystoreSupported: isCustomSecureKeystore(),
    buildNumber: DeviceInfo.getBuildNumber(),
    injiVersion: __InjiVersion.getValue(),
    tuvaliVersion: __TuvaliVersion.getValue(),
    dateTime: new Date().getTime(),
    zone: RNLocalize.getTimeZone(),
    offset: new Date().getTimezoneOffset() * 60 * 1000,
    preferredLanguage: __SelectedLanguage.getValue(),
    errorId: errorId,
    errorMessage: errorMessage,
    stacktrace: stacktrace,
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

let passcodeRetryCount = 1;

export const incrementPasscodeRetryCount = isSettingUp => {
  if (passcodeRetryCount < 5) {
    passcodeRetryCount += 1;
  } else {
    isSettingUp
      ? sendErrorEvent(
          getErrorData(
            'App Onboarding',
            'mismatch',
            'Passcode did not match',
            {},
          ),
        )
      : sendErrorEvent(
          getErrorData('App Login', 'mismatch', 'Passcode did not match', {}),
        );
    passcodeRetryCount = 1;
  }
};

export const getInteractDataSubtype = (ineteractionType, interactingOn) => {
  return ineteractionType + '_' + interactingOn;
};
