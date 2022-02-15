export const MY_VIDS_STORE_KEY = 'myVids';

export const RECEIVED_VIDS_STORE_KEY = 'receivedVids';

export const VID_ITEM_STORE_KEY = (uin: string, requestId: string) =>
  `vid:${uin}:${requestId}`;

export const ACTIVITY_LOG_STORE_KEY = 'activityLog';

export const SETTINGS_STORE_KEY = 'settings';

export const ONBOARDING_STATUS_STORE_KEY = 'isOnboardingDone';
