import telemetry from 'telemetry-sdk';
import {Platform} from 'react-native';
import {MIMOTO_BASE_URL} from '../constants';
import i18next from 'i18next';
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

export function sendStartEvent(data) {
  telemetry.start({}, '', '', data, {});
}

export function sendEndEvent(data) {
  telemetry.end(data, {});
}

export function sendImpressionEvent(data) {
  telemetry.impression(data, {});
}

export function sendInteractEvent(data) {
  telemetry.interact(data, {});
}

export function sendAppInfoEvent(data) {
  telemetry.appinfo(data);
}

export function sendErrorEvent(data) {
  telemetry.error(data, {});
}

export function initializeTelemetry(config) {
  telemetry.initialize(config);
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

export function getStartEventData(type, additionalParameters = {}) {
  return {
    type: type,
    additionalParameters: additionalParameters,
  };
}

export function getEndEventData(type, status, additionalParameters = {}) {
  return {
    type: type,
    status: status,
    additionalParameters: additionalParameters,
  };
}

export function getInteractEventData(
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

export const getInteractDataSubtype = (ineteractionType, interactingOn) => {
  return ineteractionType + '_' + interactingOn;
};

export function getImpressionEventData(
  type,
  subtype,
  additionalParameters = {},
) {
  return {
    type,
    subtype,
    additionalParameters: additionalParameters,
  };
}

export function getErrorEventData(
  type,
  errorId,
  errorMessage,
  stacktrace = {},
) {
  return {
    type: type,
    errorId: errorId,
    errorMessage: errorMessage,
    stacktrace: stacktrace,
    ...getAppInfoEventData(),
  };
}

export function getAppInfoEventData() {
  return {
    env: MIMOTO_BASE_URL,
    brandName: DeviceInfo.getBrand(),
    modelName: DeviceInfo.getModel(),
    osName: DeviceInfo.getSystemName(),
    osVersion: DeviceInfo.getSystemVersion(),
    osApiLevel: Platform.Version.toString(),
    isHardwareKeystoreSupported: isCustomSecureKeystore(),
    dateTime: new Date().getTime(),
    zone: RNLocalize.getTimeZone(),
    offset: new Date().getTimezoneOffset() * 60 * 1000,
    preferredLanguage: languageCodeMap[i18next.language] ?? i18next.language,
    buildNumber: DeviceInfo.getBuildNumber(),
    injiVersion: __InjiVersion.getValue(),
    tuvaliVersion: __TuvaliVersion.getValue(),
  };
}

let passcodeRetryCount = 1;

export const incrementPasscodeRetryCount = eventType => {
  if (passcodeRetryCount < 5) {
    passcodeRetryCount += 1;
  } else {
    sendErrorEvent(
      getErrorEventData(eventType, 'mismatch', 'Passcode did not match'),
    );
    passcodeRetryCount = 1;
  }
};

export function configureTelemetry() {
  const config = getTelemetryConfigData();
  initializeTelemetry(config);
  sendAppInfoEvent(getAppInfoEventData());
}

export function getEventType(isSettingUp) {
  return isSettingUp ? FlowType.AppOnboarding : FlowType.AppLogin;
}

const languageCodeMap = {
  en: 'English',
  fil: 'Filipino',
  ar: 'Arabic',
  hi: 'Hindi',
  kn: 'Kannada',
  ta: 'Tamil',
};

export const FlowType = Object.freeze({
  vcDownload: 'VC Download',
  qrLogin: 'QR Login',
  vcShare: 'VC Share',
  vcActivation: 'VC Activation',
  appOnboarding: 'App Onboarding',
  appLogin: 'App Login',
});

export const EndEventStatus = Object.freeze({
  success: 'SUCCESS',
  failure: 'FAILURE',
});

export const InteractEventSubtype = Object.freeze({
  click: 'CLICK',
});
