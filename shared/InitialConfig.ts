// Initial configs used by app if network is not available when app is opened for first time. once network is available response is cached and used from then
// Note: Need to keep this config in sync with actual mimoto response.

export const INITIAL_CONFIG = {
  allProperties: {
    modelDownloadMaxRetry: '10',
    audience: 'ida-binding',
    allowedInternalAuthType: 'otp,bio-Finger,bio-Iris,bio-Face',
    vcDownloadMaxRetry: '10',
    minStorageRequiredForAuditEntry: '2',
    minStorageRequired: '2',
    vcDownloadPoolInterval: '6000',
    issuer: 'residentapp',
    allowedAuthType: 'demo,otp,bio-Finger,bio-Iris,bio-Face',
    allowedEkycAuthType: 'demo,otp,bio-Finger,bio-Iris,bio-Face',
    warningDomainName: 'https://api.qa-inji.mosip.net',
    aboutInjiUrl: 'https://docs.mosip.io/inji',
    faceSdkModelUrl: 'https://api.qa-inji.mosip.net/inji',
  },
};
