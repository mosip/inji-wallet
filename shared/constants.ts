import { VC } from '../types/vc';
import Constants from 'expo-constants';

export const HOST =
  Constants.manifest.extra.backendServiceUrl ||
  'https://resident-app.newlogic.dev';

export const MY_VIDS_STORE_KEY = 'myVCs';

export const RECEIVED_VIDS_STORE_KEY = 'receivedVCs';

export const VID_ITEM_STORE_KEY = (vc: Partial<VC>) =>
  `vc:${vc.idType}:${vc.id}:${vc.requestId}`;

export const ACTIVITY_LOG_STORE_KEY = 'activityLog';

export const SETTINGS_STORE_KEY = 'settings';

export const ONBOARDING_STATUS_STORE_KEY = 'isOnboardingDone';
