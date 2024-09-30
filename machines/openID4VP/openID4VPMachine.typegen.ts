// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.OpenID4VP.authenticateVerifier:invocation[0]': {
      type: 'done.invoke.OpenID4VP.authenticateVerifier:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.OpenID4VP.checkKeyPair:invocation[0]': {
      type: 'done.invoke.OpenID4VP.checkKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.OpenID4VP.getKeyPairFromKeystore:invocation[0]': {
      type: 'done.invoke.OpenID4VP.getKeyPairFromKeystore:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.OpenID4VP.getTrustedVerifiersList:invocation[0]': {
      type: 'done.invoke.OpenID4VP.getTrustedVerifiersList:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.OpenID4VP.sendingVP:invocation[0]': {
      type: 'done.invoke.OpenID4VP.sendingVP:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.OpenID4VP.authenticateVerifier:invocation[0]': {
      type: 'error.platform.OpenID4VP.authenticateVerifier:invocation[0]';
      data: unknown;
    };
    'error.platform.OpenID4VP.checkKeyPair:invocation[0]': {
      type: 'error.platform.OpenID4VP.checkKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.OpenID4VP.getKeyPairFromKeystore:invocation[0]': {
      type: 'error.platform.OpenID4VP.getKeyPairFromKeystore:invocation[0]';
      data: unknown;
    };
    'error.platform.OpenID4VP.getTrustedVerifiersList:invocation[0]': {
      type: 'error.platform.OpenID4VP.getTrustedVerifiersList:invocation[0]';
      data: unknown;
    };
    'error.platform.OpenID4VP.sendingVP:invocation[0]': {
      type: 'error.platform.OpenID4VP.sendingVP:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    fetchTrustedVerifiers: 'done.invoke.OpenID4VP.getTrustedVerifiersList:invocation[0]';
    getAuthenticationResponse: 'done.invoke.OpenID4VP.authenticateVerifier:invocation[0]';
    getKeyPair: 'done.invoke.OpenID4VP.getKeyPairFromKeystore:invocation[0]';
    getSelectedKey: 'done.invoke.OpenID4VP.checkKeyPair:invocation[0]';
    sendVP: 'done.invoke.OpenID4VP.sendingVP:invocation[0]';
  };
  missingImplementations: {
    actions:
      | 'compareAndStoreSelectedVC'
      | 'forwardToParent'
      | 'getFaceAuthConsent'
      | 'getVcsMatchingAuthRequest'
      | 'incrementOpenID4VPRetryCount'
      | 'loadKeyPair'
      | 'logFailedVerification'
      | 'resetFaceCaptureBannerStatus'
      | 'resetOpenID4VPRetryCount'
      | 'setAuthenticationError'
      | 'setAuthenticationResponse'
      | 'setEncodedAuthorizationRequest'
      | 'setError'
      | 'setFlowType'
      | 'setIsShareWithSelfie'
      | 'setMiniViewShareSelectedVC'
      | 'setSelectedVCs'
      | 'setShareLogTypeUnverified'
      | 'setShowFaceAuthConsent'
      | 'setTrustedVerifiers'
      | 'setTrustedVerifiersApiCallError'
      | 'storeShowFaceAuthConsent'
      | 'updateShowFaceAuthConsent';
    delays: never;
    guards:
      | 'hasKeyPair'
      | 'isAnyVCHasImage'
      | 'isSelectedVCMatchingRequest'
      | 'isShareWithSelfie'
      | 'isSimpleOpenID4VPShare'
      | 'showFaceAuthConsentScreen';
    services:
      | 'fetchTrustedVerifiers'
      | 'getAuthenticationResponse'
      | 'getKeyPair'
      | 'getSelectedKey'
      | 'sendVP';
  };
  eventsCausingActions: {
    compareAndStoreSelectedVC: 'SET_SELECTED_VC';
    forwardToParent: 'CANCEL';
    getFaceAuthConsent: 'AUTHENTICATE';
    getVcsMatchingAuthRequest: 'DOWNLOADED_VCS';
    incrementOpenID4VPRetryCount: 'RETRY';
    loadKeyPair: 'done.invoke.OpenID4VP.getKeyPairFromKeystore:invocation[0]';
    logFailedVerification: 'FACE_INVALID';
    resetFaceCaptureBannerStatus: 'ACCEPT_REQUEST';
    resetOpenID4VPRetryCount: 'RESET_RETRY_COUNT';
    setAuthenticationError: 'error.platform.OpenID4VP.authenticateVerifier:invocation[0]';
    setAuthenticationResponse: 'done.invoke.OpenID4VP.authenticateVerifier:invocation[0]';
    setEncodedAuthorizationRequest: 'AUTHENTICATE';
    setError:
      | 'error.platform.OpenID4VP.checkKeyPair:invocation[0]'
      | 'error.platform.OpenID4VP.getKeyPairFromKeystore:invocation[0]'
      | 'error.platform.OpenID4VP.sendingVP:invocation[0]';
    setFlowType: 'AUTHENTICATE';
    setIsShareWithSelfie: 'AUTHENTICATE';
    setMiniViewShareSelectedVC: 'AUTHENTICATE';
    setSelectedVCs: 'ACCEPT_REQUEST' | 'VERIFY_AND_ACCEPT_REQUEST';
    setShareLogTypeUnverified: 'ACCEPT_REQUEST';
    setShowFaceAuthConsent: 'FACE_VERIFICATION_CONSENT';
    setTrustedVerifiers: 'done.invoke.OpenID4VP.getTrustedVerifiersList:invocation[0]';
    setTrustedVerifiersApiCallError: 'error.platform.OpenID4VP.getTrustedVerifiersList:invocation[0]';
    storeShowFaceAuthConsent: 'FACE_VERIFICATION_CONSENT';
    updateShowFaceAuthConsent: 'STORE_RESPONSE';
  };
  eventsCausingDelays: {
    SHARING_TIMEOUT: 'CONFIRM' | 'FACE_VALID' | 'RETRY';
  };
  eventsCausingGuards: {
    hasKeyPair:
      | 'FACE_VALID'
      | 'done.invoke.OpenID4VP.checkKeyPair:invocation[0]';
    isAnyVCHasImage: 'CHECK_FOR_IMAGE';
    isSelectedVCMatchingRequest: 'CHECK_SELECTED_VC';
    isShareWithSelfie: 'CONFIRM';
    isSimpleOpenID4VPShare:
      | 'CANCEL'
      | 'DISMISS'
      | 'DOWNLOADED_VCS'
      | 'FACE_VERIFICATION_CONSENT';
    showFaceAuthConsentScreen: 'CONFIRM';
  };
  eventsCausingServices: {
    fetchTrustedVerifiers: never;
    getAuthenticationResponse: 'done.invoke.OpenID4VP.checkKeyPair:invocation[0]';
    getKeyPair:
      | 'STORE_RESPONSE'
      | 'done.invoke.OpenID4VP.getTrustedVerifiersList:invocation[0]';
    getSelectedKey:
      | 'FACE_VALID'
      | 'done.invoke.OpenID4VP.getKeyPairFromKeystore:invocation[0]';
    sendVP: 'CONFIRM' | 'FACE_VALID' | 'RETRY';
  };
  matchesStates:
    | 'authenticateVerifier'
    | 'checkFaceAuthConsent'
    | 'checkIfAnySelectedVCHasImage'
    | 'checkIfMatchingVCsHasSelectedVC'
    | 'checkKeyPair'
    | 'faceVerificationConsent'
    | 'getConsentForVPSharing'
    | 'getKeyPairFromKeystore'
    | 'getTrustedVerifiersList'
    | 'getVCsSatisfyingAuthRequest'
    | 'invalidIdentity'
    | 'selectingVCs'
    | 'sendingVP'
    | 'setSelectedVC'
    | 'showConfirmationPopup'
    | 'showError'
    | 'success'
    | 'verifyingIdentity'
    | 'waitingForData';
  tags: never;
}
