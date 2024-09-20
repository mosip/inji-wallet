// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]': {
      type: 'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.OpenId4VP.checkKeyPair:invocation[0]': {
      type: 'done.invoke.OpenId4VP.checkKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.OpenId4VP.getKeyPairFromKeystore:invocation[0]': {
      type: 'done.invoke.OpenId4VP.getKeyPairFromKeystore:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.OpenId4VP.authenticateVerifier:invocation[0]': {
      type: 'error.platform.OpenId4VP.authenticateVerifier:invocation[0]';
      data: unknown;
    };
    'error.platform.OpenId4VP.checkKeyPair:invocation[0]': {
      type: 'error.platform.OpenId4VP.checkKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.OpenId4VP.getKeyPairFromKeystore:invocation[0]': {
      type: 'error.platform.OpenId4VP.getKeyPairFromKeystore:invocation[0]';
      data: unknown;
    };
    'error.platform.OpenId4VP.sendingVP:invocation[0]': {
      type: 'error.platform.OpenId4VP.sendingVP:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    getAuthenticationResponse: 'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]';
    getKeyPair: 'done.invoke.OpenId4VP.getKeyPairFromKeystore:invocation[0]';
    getSelectedKey: 'done.invoke.OpenId4VP.checkKeyPair:invocation[0]';
    sendVP: 'done.invoke.OpenId4VP.sendingVP:invocation[0]';
  };
  missingImplementations: {
    actions:
      | 'compareVCwithMatchingVCs'
      | 'forwardToParent'
      | 'getFaceAuthConsent'
      | 'getVcsMatchingAuthRequest'
      | 'loadKeyPair'
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
      | 'setShowFaceAuthConsent'
      | 'storeShowFaceAuthConsent'
      | 'updateShowFaceAuthConsent';
    delays: never;
    guards:
      | 'hasKeyPair'
      | 'isSelectedVCMatchingRequest'
      | 'isShareWithSelfie'
      | 'isSimpleOpenID4VPShare'
      | 'showFaceAuthConsentScreen';
    services:
      | 'getAuthenticationResponse'
      | 'getKeyPair'
      | 'getSelectedKey'
      | 'sendVP';
  };
  eventsCausingActions: {
    compareVCwithMatchingVCs: 'SET_SELECTED_VC';
    forwardToParent: 'CANCEL';
    getFaceAuthConsent: 'AUTHENTICATE';
    getVcsMatchingAuthRequest: 'DOWNLOADED_VCS';
    loadKeyPair: 'done.invoke.OpenId4VP.getKeyPairFromKeystore:invocation[0]';
    logFailedVerification: 'FACE_INVALID';
    resetFaceCaptureBannerStatus: 'ACCEPT_REQUEST';
    setAuthenticationResponse: 'done.invoke.OpenId4VP.authenticateVerifier:invocation[0]';
    setEncodedAuthorizationRequest: 'AUTHENTICATE';
    setError:
      | 'error.platform.OpenId4VP.authenticateVerifier:invocation[0]'
      | 'error.platform.OpenId4VP.checkKeyPair:invocation[0]'
      | 'error.platform.OpenId4VP.getKeyPairFromKeystore:invocation[0]'
      | 'error.platform.OpenId4VP.sendingVP:invocation[0]';
    setFlowType: 'AUTHENTICATE';
    setIsShareWithSelfie: 'AUTHENTICATE';
    setSelectedVCs: 'ACCEPT_REQUEST' | 'VERIFY_AND_ACCEPT_REQUEST';
    setSelectedVc: 'AUTHENTICATE';
    setShareLogTypeUnverified: 'ACCEPT_REQUEST';
    setShowFaceAuthConsent: 'FACE_VERIFICATION_CONSENT';
    storeShowFaceAuthConsent: 'FACE_VERIFICATION_CONSENT';
    updateShowFaceAuthConsent: 'STORE_RESPONSE';
  };
  eventsCausingDelays: {
    SHARING_TIMEOUT: 'CONFIRM' | 'FACE_VALID';
  };
  eventsCausingGuards: {
    hasKeyPair:
      | 'FACE_VALID'
      | 'done.invoke.OpenId4VP.checkKeyPair:invocation[0]';
    isSelectedVCMatchingRequest: 'CHECK_SELECTED_VC';
    isShareWithSelfie: 'CONFIRM';
    isSimpleOpenID4VPShare: 'CANCEL' | 'DISMISS' | 'DOWNLOADED_VCS';
    showFaceAuthConsentScreen: 'CONFIRM';
  };
  eventsCausingServices: {
    getAuthenticationResponse: 'done.invoke.OpenId4VP.checkKeyPair:invocation[0]';
    getKeyPair: 'STORE_RESPONSE';
    getSelectedKey:
      | 'FACE_VALID'
      | 'done.invoke.OpenId4VP.getKeyPairFromKeystore:invocation[0]';
    sendVP: 'CONFIRM' | 'FACE_VALID';
  };
  matchesStates:
    | 'authenticateVerifier'
    | 'checkFaceAuthConsent'
    | 'checkIfMatchingVCsHasSelectedVC'
    | 'checkKeyPair'
    | 'faceVerificationConsent'
    | 'getConsentForVPSharing'
    | 'getKeyPairFromKeystore'
    | 'getVCsSatisfyingAuthRequest'
    | 'invalidIdentity'
    | 'selectingVCs'
    | 'sendingVP'
    | 'setSelectedVC'
    | 'showConfirmationPopup'
    | 'showError'
    | 'verifyingIdentity'
    | 'waitingForData';
  tags: never;
}
