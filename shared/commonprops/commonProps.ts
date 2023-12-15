import {changeCrendetialRegistry} from '../constants';
import {CACHED_API} from '../api';

export const COMMON_PROPS_KEY: string =
  'CommonPropsKey-' + '6964d04a-9268-11ed-a1eb-0242ac120002';

export default async function getAllConfigurations(host = undefined) {
  host && changeCrendetialRegistry(host);
  return await CACHED_API.getAllProperties();
}

export interface DownloadProps {
  maxDownloadLimit: number;
  downloadInterval: number;
}
