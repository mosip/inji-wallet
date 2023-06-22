import { request } from '../request';
import Storage from '../storage';
import { init } from 'mosip-inji-face-sdk';
import { changeCrendetialRegistry } from '../constants';

export const COMMON_PROPS_KEY: string =
  'CommonPropsKey-' + '6964d04a-9268-11ed-a1eb-0242ac120002';

export default async function getAllConfigurations(host = undefined) {
  try {
    host && changeCrendetialRegistry(host);
    var response = await Storage.getItem(COMMON_PROPS_KEY);
    if (response) {
      return JSON.parse(response);
    } else {
      const resp = await request('GET', '/residentmobileapp/allProperties');
      const injiProps = resp.response;
      const injiPropsString = JSON.stringify(injiProps);
      await Storage.setItem(COMMON_PROPS_KEY, injiPropsString);
      return injiProps;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downloadModel() {
  try {
    var injiProp = await getAllConfigurations();
    const maxRetryStr = injiProp.modelDownloadMaxRetry;
    const maxRetry = parseInt(maxRetryStr);
    const resp: string = injiProp != null ? injiProp.faceSdkModelUrl : null;
    if (resp != null) {
      for (let counter = 0; counter < maxRetry; counter++) {
        var result = await init(resp, false);
        console.log('model download result is = ' + result);
        if (result) {
          break;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export interface DownloadProps {
  maxDownloadLimit: number;
  downloadInterval: number;
}
