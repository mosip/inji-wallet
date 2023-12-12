import {configure} from '@iriscan/biometric-sdk-react-native';
import {changeCrendetialRegistry} from '../constants';
import {CACHED_API} from '../api';

export const COMMON_PROPS_KEY: string =
  'CommonPropsKey-' + '6964d04a-9268-11ed-a1eb-0242ac120002';

export default async function getAllConfigurations(host = undefined) {
  host && changeCrendetialRegistry(host);
  return await CACHED_API.getAllProperties();
}

export async function downloadModel() {
  try {
    var injiProp = await getAllConfigurations();
    const maxRetryStr = injiProp.modelDownloadMaxRetry;
    const maxRetry = parseInt(maxRetryStr);
    const resp: string = injiProp != null ? injiProp.faceSdkModelUrl : null;

    const config = {
      withFace: {
        encoder: {
          tfModel: {
            path: resp + '/model.tflite',
            inputWidth: 160,
            inputHeight: 160,
            outputLength: 512,
            modelChecksum:
              '797b4d99794965749635352d55da38d4748c28c659ee1502338badee4614ed06',
          },
        },
        matcher: {
          threshold: 0.8,
        },
      },
    };

    if (resp != null) {
      for (let counter = 0; counter < maxRetry; counter++) {
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
