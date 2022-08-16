import { VC } from '../types/vc';
import Constants from 'expo-constants';

export const HOST =
  Constants.manifest.extra.backendServiceUrl ||
  'https://api.qa4.mosip.net/residentmobileapp'; // 'https://resident-app.newlogic.dev';

export const MY_VCS_STORE_KEY = 'myVCs';

export const RECEIVED_VCS_STORE_KEY = 'receivedVCs';

export const VC_ITEM_STORE_KEY = (vc: Partial<VC>) =>
  `vc:${vc.idType}:${vc.id}:${vc.requestId}`;

export const ACTIVITY_LOG_STORE_KEY = 'activityLog';

export const SETTINGS_STORE_KEY = 'settings';

export const ONBOARDING_STATUS_STORE_KEY = 'isOnboardingDone';

// TODO: move API key
export const GNM_API_KEY = 'AIzaSyBt_ne78gyEk5AAsheh6q6TZAgAy1ncFVE';

// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Message#MAX_CONTENT_SIZE_BYTES
export const GNM_MESSAGE_LIMIT = 102400 - 6400; // allowance for metadata
