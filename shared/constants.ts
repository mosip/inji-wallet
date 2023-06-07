import { VC } from '../types/vc';
import {
  MIMOTO_HOST,
  GOOGLE_NEARBY_MESSAGES_API_KEY,
} from 'react-native-dotenv';

export let HOST = MIMOTO_HOST;

export const changeCrendetialRegistry = (host) => (HOST = host);

export const MY_VCS_STORE_KEY = 'myVCs';

export const RECEIVED_VCS_STORE_KEY = 'receivedVCs';

export const MY_LOGIN_STORE_KEY = 'myLogins';

export const VC_ITEM_STORE_KEY = (vc: Partial<VC>) =>
  `vc:${vc.idType}:${vc.id}:${vc.requestId}`;

//Regex expression to evaluate if the key is for a VC
export const VC_ITEM_STORE_KEY_REGEX = '^vc:(UIN|VID):[0-9]+:[a-z0-9-]+$';

export let individualId = '';

export const GET_INDIVIDUAL_ID = (ind_Id: string) => {
  individualId = ind_Id;
};

export const ACTIVITY_LOG_STORE_KEY = 'activityLog';

export const SETTINGS_STORE_KEY = 'settings';

export const ONBOARDING_STATUS_STORE_KEY = 'isOnboardingDone';

export const GNM_API_KEY = GOOGLE_NEARBY_MESSAGES_API_KEY;

// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Message#MAX_CONTENT_SIZE_BYTES
export const GNM_MESSAGE_LIMIT = 102400 - 6400; // allowance for metadata
