import telemetry from '@project-sunbird/telemetry-sdk';
import {
  APP_ID_LENGTH,
  HOST,
  SESSION_ID_DICTIONARY,
  deviceId,
} from '../constants';
import { Platform } from 'react-native';
import {
  __AppId,
  __InjiVersion,
  __SessionId,
  __TuvaliVersion,
} from '../GlobalVariables';
import ShortUniqueId from 'short-unique-id';

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
    sid: __SessionId.getValue(),
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

export function generateSessionId() {
  const shortUUID = new ShortUniqueId({
    length: APP_ID_LENGTH,
    dictionary: SESSION_ID_DICTIONARY,
  });
  return shortUUID.randomUUID() + Date.now();
}
