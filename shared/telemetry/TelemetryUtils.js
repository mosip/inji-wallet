import telemetry from '@project-sunbird/telemetry-sdk';
import { HOST, deviceId } from '../constants';
import { Platform } from 'react-native';
import { __AppId, __InjiVersion, __TuvaliVersion } from '../GlobalVariables';

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
    did: deviceId,
    uid: __AppId.getValue(),
    sid: 'session-id',
    batchsize: 5,
    mode: '',
    host: 'https://dataset-api.obsrv.mosip.net',
    endpoint: '/obsrv/v1/data/mosip-dataset',
    tags: [
      {
        osName: Platform.OS,
        osVersion: Platform.Version.toString(),
        injiVersion: __InjiVersion.getValue(),
        tuvaliVersion: __TuvaliVersion.getValue(),
      },
    ],
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
