import { VC } from '../types/vc';
import {
  MIMOTO_HOST,
  GOOGLE_NEARBY_MESSAGES_API_KEY,
} from 'react-native-dotenv';

export const HOST = 'https://api.qa5.mosip.net/residentmobileapp';

export const MY_VCS_STORE_KEY = 'myVCs';

export const RECEIVED_VCS_STORE_KEY = 'receivedVCs';

export const VC_ITEM_STORE_KEY = (vc: Partial<VC>) =>
  `vc:${vc.idType}:${vc.id}:${vc.requestId}`;

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
