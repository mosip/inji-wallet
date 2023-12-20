import {configure} from '@iriscan/biometric-sdk-react-native';
import {changeCrendetialRegistry} from '../constants';
import {CACHED_API} from '../api';
import {faceMatchConfig} from '../commonUtil';

export const COMMON_PROPS_KEY: string =
  'CommonPropsKey-' + '6964d04a-9268-11ed-a1eb-0242ac120002';

export default async function getAllConfigurations(
  host = undefined,
  isCachePreferred = true,
) {
  host && changeCrendetialRegistry(host);
  return await CACHED_API.getAllProperties(isCachePreferred);
}

export async function downloadModel() {
  try {
    var injiProp = await getAllConfigurations();
    const maxRetryStr = injiProp.modelDownloadMaxRetry;
    const maxRetry = parseInt(maxRetryStr);
    const resp: string = injiProp != null ? injiProp.faceSdkModelUrl : null;

    if (resp != null) {
      for (let counter = 0; counter < maxRetry; counter++) {
        let config = faceMatchConfig(resp);
        var result = await configure(config);
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
