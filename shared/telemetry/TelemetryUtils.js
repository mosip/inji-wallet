import telemetry from '@project-sunbird/telemetry-sdk';
import { Platform } from 'react-native';
import { HOST } from '../constants';
import { Platform } from 'react-native';
import {
  __AppId,
  __InjiVersion,
  __SessionId,
  __TuvaliVersion,
  __DeviceId,
} from '../GlobalVariables';
import DeviceInfo from 'react-native-device-info';

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

export function getTelemetryConfigData() {
  return {
    pdata: {
      id: '',
      ver: '',
      pid: '',
    },
    env: HOST,
    channel: '',
    authtoken: '',
    did: __DeviceId.getValue(),
    uid: __AppId.getValue(),
    sid: __SessionId.getValue(),
    batchsize: 5,
    mode: '',
    host: 'https://dataset-api.obsrv.mosip.net',
    endpoint: '/obsrv/v1/data/mosip-dataset',
    deviceInformation: {
      brandName: DeviceInfo.getBrand(),
      modelName: DeviceInfo.getModel(),
      osName: DeviceInfo.getSystemName(),
      osVersion: DeviceInfo.getSystemVersion(),
      osApiLevel: Platform.Version.toString(),
    },
    tags: {
      buildNumber: DeviceInfo.getBuildNumber(),
      injiVersion: __InjiVersion.getValue(),
      tuvaliVersion: __TuvaliVersion.getValue(),
    },
    cdata: [],
    rollup: {},
    telemetryDebugEnabled: true,
    runningEnv: 'client',
    enableValidation: true,
    schemaBaseUrl: 'http://mosip.io/telemetry/',
    timeDiff: 0,
  };
}

export function getData(type) {
  return {
    type: type,
  };
}
