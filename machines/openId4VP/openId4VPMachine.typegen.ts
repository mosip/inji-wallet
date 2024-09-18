// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]': {
      type: 'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    getAuthenticationResponse: 'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]';
    sendVP: 'done.invoke.OpenId4VP.sendingVP:invocation[0]';
  };
  missingImplementations: {
    actions:
      | 'forwardToParent'
      | 'getFaceAuthConsent'
      | 'getVcsMatchingAuthRequest'
      | 'logFailedVerification'
      | 'resetFaceCaptureBannerStatus'
      | 'setAuthenticationResponse'
      | 'setEncodedAuthorizationRequest'
      | 'setIsShareWithSelfie'
      | 'setSelectedVCs'
      | 'setShareLogTypeUnverified'
      | 'setShareLogTypeVerified'
      | 'setShowFaceAuthConsent'
      | 'storeShowFaceAuthConsent'
      | 'updateFaceCaptureBannerStatus'
      | 'updateShowFaceAuthConsent';
    delays: never;
    guards:
      | 'isFlowTypeSimpleShare'
      | 'isShareWithSelfie'
      | 'showFaceAuthConsentScreen';
    services: 'getAuthenticationResponse' | 'sendVP';
  };
  eventsCausingActions: {
    forwardToParent: 'CANCEL';
    getFaceAuthConsent: 'AUTHENTICATE';
    getVcsMatchingAuthRequest: 'DOWNLOADED_VCS';
    logFailedVerification: 'FACE_INVALID';
    resetFaceCaptureBannerStatus: 'ACCEPT_REQUEST';
    setAuthenticationResponse: 'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]';
    setEncodedAuthorizationRequest: 'AUTHENTICATE';
    setIsShareWithSelfie: 'VERIFY_AND_ACCEPT_REQUEST';
    setSelectedVCs: 'ACCEPT_REQUEST' | 'VERIFY_AND_ACCEPT_REQUEST';
    setShareLogTypeUnverified: 'ACCEPT_REQUEST';
    setShareLogTypeVerified: 'FACE_VALID';
    setShowFaceAuthConsent: 'FACE_VERIFICATION_CONSENT';
    storeShowFaceAuthConsent: 'FACE_VERIFICATION_CONSENT';
    updateFaceCaptureBannerStatus: 'FACE_VALID';
    updateShowFaceAuthConsent: 'STORE_RESPONSE';
  };
  eventsCausingDelays: {
    SHARING_TIMEOUT: 'CONFIRM' | 'FACE_VALID';
  };
  eventsCausingGuards: {
    isFlowTypeSimpleShare: 'CANCEL' | 'DISMISS';
    isShareWithSelfie: 'CONFIRM';
    showFaceAuthConsentScreen: 'CONFIRM';
  };
  eventsCausingServices: {
    getAuthenticationResponse: 'STORE_RESPONSE';
    sendVP: 'CONFIRM' | 'FACE_VALID';
  };
  matchesStates:
    | 'authenticateVerifier'
    | 'checkFaceAuthConsent'
    | 'faceVerificationConsent'
    | 'getConsentForVPSharing'
    | 'getVCsSatisfyingAuthRequest'
    | 'invalidIdentity'
    | 'selectingVCs'
    | 'sendingVP'
    | 'verifyingIdentity'
    | 'waitingForData';
  tags: never;
}
