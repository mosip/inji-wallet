import { VC } from '../types/vc';

export const HOST = 'https://api-internal.dev3.mosip.net/resident/v1/';

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
