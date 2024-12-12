// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.OpenID4VP.authenticateVerifier:invocation[0]': {
      type: 'done.invoke.OpenID4VP.authenticateVerifier:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.OpenID4VP.checkIfClientValidationIsRequired:invocation[0]': {
      type: 'done.invoke.OpenID4VP.checkIfClientValidationIsRequired:invocation[0]';
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
    'xstate.stop': {type: 'xstate.stop'};
  };
  invokeSrcNameMap: {
    fetchTrustedVerifiers: 'done.invoke.OpenID4VP.getTrustedVerifiersList:invocation[0]';
    getAuthenticationResponse: 'done.invoke.OpenID4VP.authenticateVerifier:invocation[0]';
    getClientValidationConfig: 'done.invoke.OpenID4VP.checkIfClientValidationIsRequired:invocation[0]';
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
      | 'logActivity'
      | 'resetError'
      | 'resetFaceCaptureBannerStatus'
      | 'resetIsFaceVerificationRetryAttempt'
      | 'resetIsShareWithSelfie'
      | 'resetIsShowLoadingScreen'
      | 'resetOpenID4VPRetryCount'
      | 'setAuthenticationError'
      | 'setAuthenticationResponse'
      | 'setEncodedAuthorizationRequest'
      | 'setError'
      | 'setFlowType'
      | 'setIsFaceVerificationRetryAttempt'
      | 'setIsShareWithSelfie'
      | 'setIsShowLoadingScreen'
      | 'setMiniViewShareSelectedVC'
      | 'setSelectedVCs'
      | 'setSendVPShareError'
      | 'setShareLogTypeUnverified'
      | 'setShowFaceAuthConsent'
      | 'setTrustedVerifiers'
      | 'setTrustedVerifiersApiCallError'
      | 'shareDeclineStatus'
      | 'storeShowFaceAuthConsent'
      | 'updateFaceCaptureBannerStatus'
      | 'updateShowFaceAuthConsent';
    delays: never;
    guards:
      | 'hasKeyPair'
      | 'isAnyVCHasImage'
      | 'isClientValidationRequred'
      | 'isFaceVerificationRetryAttempt'
      | 'isSelectedVCMatchingRequest'
      | 'isShareWithSelfie'
      | 'isSimpleOpenID4VPShare'
      | 'showFaceAuthConsentScreen';
    services:
      | 'fetchTrustedVerifiers'
      | 'getAuthenticationResponse'
      | 'getClientValidationConfig'
      | 'getKeyPair'
      | 'getSelectedKey'
      | 'sendVP';
  };
  eventsCausingActions: {
    compareAndStoreSelectedVC: 'SET_SELECTED_VC';
    forwardToParent: 'CANCEL' | 'DISMISS_POPUP';
    getFaceAuthConsent: 'AUTHENTICATE';
    getVcsMatchingAuthRequest: 'DOWNLOADED_VCS';
    incrementOpenID4VPRetryCount: 'RETRY';
    loadKeyPair: 'done.invoke.OpenID4VP.getKeyPairFromKeystore:invocation[0]';
    logActivity: 'LOG_ACTIVITY';
    resetError: 'RESET_ERROR';
    resetFaceCaptureBannerStatus: 'ACCEPT_REQUEST' | 'CLOSE_BANNER';
    resetIsFaceVerificationRetryAttempt: 'DISMISS';
    resetIsShareWithSelfie: 'CANCEL' | 'DISMISS_POPUP';
    resetIsShowLoadingScreen:
      | 'DISMISS_POPUP'
      | 'done.invoke.OpenID4VP.authenticateVerifier:invocation[0]'
      | 'error.platform.OpenID4VP.authenticateVerifier:invocation[0]'
      | 'xstate.stop';
    resetOpenID4VPRetryCount: 'RESET_RETRY_COUNT';
    setAuthenticationError: 'error.platform.OpenID4VP.authenticateVerifier:invocation[0]';
    setAuthenticationResponse: 'done.invoke.OpenID4VP.authenticateVerifier:invocation[0]';
    setEncodedAuthorizationRequest: 'AUTHENTICATE';
    setError:
      | 'error.platform.OpenID4VP.checkKeyPair:invocation[0]'
      | 'error.platform.OpenID4VP.getKeyPairFromKeystore:invocation[0]';
    setFlowType: 'AUTHENTICATE';
    setIsFaceVerificationRetryAttempt: 'FACE_INVALID';
    setIsShareWithSelfie: 'AUTHENTICATE';
    setIsShowLoadingScreen: 'AUTHENTICATE';
    setMiniViewShareSelectedVC: 'AUTHENTICATE';
    setSelectedVCs: 'ACCEPT_REQUEST' | 'VERIFY_AND_ACCEPT_REQUEST';
    setSendVPShareError: 'error.platform.OpenID4VP.sendingVP:invocation[0]';
    setShareLogTypeUnverified: 'ACCEPT_REQUEST';
    setShowFaceAuthConsent: 'FACE_VERIFICATION_CONSENT';
    setTrustedVerifiers: 'done.invoke.OpenID4VP.getTrustedVerifiersList:invocation[0]';
    setTrustedVerifiersApiCallError: 'error.platform.OpenID4VP.getTrustedVerifiersList:invocation[0]';
    shareDeclineStatus: 'CONFIRM';
    storeShowFaceAuthConsent: 'FACE_VERIFICATION_CONSENT';
    updateFaceCaptureBannerStatus: 'FACE_VALID';
    updateShowFaceAuthConsent: 'done.invoke.OpenID4VP.checkIfClientValidationIsRequired:invocation[0]';
  };
  eventsCausingDelays: {
    SHARING_TIMEOUT: 'CONFIRM' | 'FACE_VALID' | 'RETRY';
  };
  eventsCausingGuards: {
    hasKeyPair:
      | 'FACE_VALID'
      | 'done.invoke.OpenID4VP.checkKeyPair:invocation[0]';
    isAnyVCHasImage: 'CHECK_FOR_IMAGE';
    isClientValidationRequred: 'done.invoke.OpenID4VP.checkIfClientValidationIsRequired:invocation[0]';
    isFaceVerificationRetryAttempt: 'FACE_INVALID';
    isSelectedVCMatchingRequest: 'CHECK_SELECTED_VC';
    isShareWithSelfie:
      | 'CONFIRM'
      | 'done.invoke.OpenID4VP.sendingVP:invocation[0]';
    isSimpleOpenID4VPShare:
      | 'CANCEL'
      | 'DISMISS'
      | 'DISMISS_POPUP'
      | 'DOWNLOADED_VCS'
      | 'FACE_VERIFICATION_CONSENT';
    showFaceAuthConsentScreen: 'CONFIRM';
  };
  eventsCausingServices: {
    fetchTrustedVerifiers: 'done.invoke.OpenID4VP.checkIfClientValidationIsRequired:invocation[0]';
    getAuthenticationResponse: 'done.invoke.OpenID4VP.checkKeyPair:invocation[0]';
    getClientValidationConfig: 'STORE_RESPONSE';
    getKeyPair:
      | 'done.invoke.OpenID4VP.checkIfClientValidationIsRequired:invocation[0]'
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
    | 'checkIfClientValidationIsRequired'
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
    | 'shareVPDeclineStatusToVerifier'
    | 'showConfirmationPopup'
    | 'showError'
    | 'success'
    | 'verifyingIdentity'
    | 'waitingForData';
  tags: never;
}
