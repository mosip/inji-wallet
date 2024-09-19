// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]': {
      type: 'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.OpenId4VP.authenticateVerifier:invocation[0]': {
      type: 'error.platform.OpenId4VP.authenticateVerifier:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    getAuthenticationResponse: 'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]';
    sendVP: 'done.invoke.OpenId4VP.sendingVP:invocation[0]';
  };
  missingImplementations: {
    actions:
      | 'compareVCwithMatchingVCs'
      | 'forwardToParent'
      | 'getFaceAuthConsent'
      | 'getVcsMatchingAuthRequest'
      | 'logFailedVerification'
      | 'resetFaceCaptureBannerStatus'
      | 'setAuthenticationResponse'
      | 'setEncodedAuthorizationRequest'
      | 'setError'
      | 'setFlowType'
      | 'setIsShareWithSelfie'
      | 'setSelectedVCs'
      | 'setSelectedVc'
      | 'setShareLogTypeUnverified'
      | 'setShareLogTypeVerified'
      | 'setShowFaceAuthConsent'
      | 'storeShowFaceAuthConsent'
      | 'updateFaceCaptureBannerStatus'
      | 'updateShowFaceAuthConsent';
    delays: never;
    guards:
      | 'isSelectedVCMatchingRequest'
      | 'isShareWithSelfie'
      | 'isSimpleOpenID4VPShare'
      | 'showFaceAuthConsentScreen';
    services: 'getAuthenticationResponse' | 'sendVP';
  };
  eventsCausingActions: {
    compareVCwithMatchingVCs: 'SET_SELECTED_VC';
    forwardToParent: 'CANCEL';
    getFaceAuthConsent: 'AUTHENTICATE';
    getVcsMatchingAuthRequest: 'DOWNLOADED_VCS';
    logFailedVerification: 'FACE_INVALID';
    resetFaceCaptureBannerStatus: 'ACCEPT_REQUEST';
    setAuthenticationResponse: 'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]';
    setEncodedAuthorizationRequest: 'AUTHENTICATE';
    setError: 'error.platform.OpenId4VP.authenticateVerifier:invocation[0]';
    setFlowType: 'AUTHENTICATE';
    setIsShareWithSelfie: 'VERIFY_AND_ACCEPT_REQUEST';
    setSelectedVCs: 'ACCEPT_REQUEST' | 'VERIFY_AND_ACCEPT_REQUEST';
    setSelectedVc: 'AUTHENTICATE';
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
    isSelectedVCMatchingRequest: 'CHECK_SELECTED_VC';
    isShareWithSelfie: 'CONFIRM';
    isSimpleOpenID4VPShare: 'CANCEL' | 'DISMISS' | 'DOWNLOADED_VCS';
    showFaceAuthConsentScreen: 'CONFIRM';
  };
  eventsCausingServices: {
    getAuthenticationResponse: 'STORE_RESPONSE';
    sendVP: 'CONFIRM' | 'FACE_VALID';
  };
  matchesStates:
    | 'authenticateVerifier'
    | 'checkFaceAuthConsent'
    | 'checkIfMatchingVCsHasSelectedVC'
    | 'faceVerificationConsent'
    | 'getConsentForVPSharing'
    | 'getVCsSatisfyingAuthRequest'
    | 'invalidIdentity'
    | 'selectingVCs'
    | 'sendingVP'
    | 'setSelectedVC'
    | 'showConfirmationPopup'
    | 'verifyingIdentity'
    | 'waitingForData';
  tags: never;
}
