// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.checkInternet': {
      type: 'done.invoke.checkInternet';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.checkKeyPair:invocation[0]': {
      type: 'done.invoke.issuersMachine.checkKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.displayIssuers:invocation[0]': {
      type: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.downloadCredentialTypes:invocation[0]': {
      type: 'done.invoke.issuersMachine.downloadCredentialTypes:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.downloadCredentials:invocation[0]': {
      type: 'done.invoke.issuersMachine.downloadCredentials:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.downloadIssuerWellknown:invocation[0]': {
      type: 'done.invoke.issuersMachine.downloadIssuerWellknown:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.fetchAuthorizationEndpoint:invocation[0]': {
      type: 'done.invoke.issuersMachine.fetchAuthorizationEndpoint:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.generateKeyPair:invocation[0]': {
      type: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]': {
      type: 'done.invoke.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.performAuthorization.setSelectedKey:invocation[0]': {
      type: 'done.invoke.issuersMachine.performAuthorization.setSelectedKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.performAuthorization:invocation[0]': {
      type: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.storing:invocation[0]': {
      type: 'done.invoke.issuersMachine.storing:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.verifyingCredential:invocation[0]': {
      type: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.checkInternet': {
      type: 'error.platform.checkInternet';
      data: unknown;
    };
    'error.platform.issuersMachine.displayIssuers:invocation[0]': {
      type: 'error.platform.issuersMachine.displayIssuers:invocation[0]';
      data: unknown;
    };
    'error.platform.issuersMachine.downloadCredentialTypes:invocation[0]': {
      type: 'error.platform.issuersMachine.downloadCredentialTypes:invocation[0]';
      data: unknown;
    };
    'error.platform.issuersMachine.downloadCredentials:invocation[0]': {
      type: 'error.platform.issuersMachine.downloadCredentials:invocation[0]';
      data: unknown;
    };
    'error.platform.issuersMachine.downloadIssuerWellknown:invocation[0]': {
      type: 'error.platform.issuersMachine.downloadIssuerWellknown:invocation[0]';
      data: unknown;
    };
    'error.platform.issuersMachine.fetchAuthorizationEndpoint:invocation[0]': {
      type: 'error.platform.issuersMachine.fetchAuthorizationEndpoint:invocation[0]';
      data: unknown;
    };
    'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]': {
      type: 'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]';
      data: unknown;
    };
    'error.platform.issuersMachine.performAuthorization.setSelectedKey:invocation[0]': {
      type: 'error.platform.issuersMachine.performAuthorization.setSelectedKey:invocation[0]';
      data: unknown;
    };
    'error.platform.issuersMachine.performAuthorization:invocation[0]': {
      type: 'error.platform.issuersMachine.performAuthorization:invocation[0]';
      data: unknown;
    };
    'error.platform.issuersMachine.verifyingCredential:invocation[0]': {
      type: 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkInternet: 'done.invoke.checkInternet';
    downloadCredential: 'done.invoke.issuersMachine.downloadCredentials:invocation[0]';
    downloadCredentialTypes: 'done.invoke.issuersMachine.downloadCredentialTypes:invocation[0]';
    downloadIssuerWellknown: 'done.invoke.issuersMachine.downloadIssuerWellknown:invocation[0]';
    downloadIssuersList: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
    fetchAuthorizationEndpoint: 'done.invoke.issuersMachine.fetchAuthorizationEndpoint:invocation[0]';
    generateKeyPair: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    getKeyOrderList: 'done.invoke.issuersMachine.performAuthorization.setSelectedKey:invocation[0]';
    getKeyPair: 'done.invoke.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]';
    getSelectedKey: 'done.invoke.issuersMachine.checkKeyPair:invocation[0]';
    invokeAuthorization: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
    isUserSignedAlready: 'done.invoke.issuersMachine.storing:invocation[0]';
    verifyCredential: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
  };
  missingImplementations: {
    actions:
      | 'downloadIssuerWellknown'
      | 'loadKeyPair'
      | 'logDownloaded'
      | 'resetError'
      | 'resetIsVerified'
      | 'resetLoadingReason'
      | 'resetSelectedCredentialType'
      | 'resetVerificationErrorMessage'
      | 'sendBackupEvent'
      | 'sendDownloadingFailedToVcMeta'
      | 'sendErrorEndEvent'
      | 'sendImpressionEvent'
      | 'sendSuccessEndEvent'
      | 'setCredentialTypeListDownloadFailureError'
      | 'setCredentialWrapper'
      | 'setError'
      | 'setIsVerified'
      | 'setIssuers'
      | 'setLoadingReasonAsDisplayIssuers'
      | 'setLoadingReasonAsDownloadingCredentials'
      | 'setLoadingReasonAsSettingUp'
      | 'setMetadataInCredentialData'
      | 'setNetworkOrTechnicalError'
      | 'setNoInternet'
      | 'setOIDCConfigError'
      | 'setPrivateKey'
      | 'setPublicKey'
      | 'setSelectedCredentialType'
      | 'setSelectedIssuerId'
      | 'setSelectedIssuers'
      | 'setSelectedKey'
      | 'setSupportedCredentialTypes'
      | 'setTokenResponse'
      | 'setVCMetadata'
      | 'setVerifiableCredential'
      | 'storeKeyPair'
      | 'storeVcMetaContext'
      | 'storeVcsContext'
      | 'storeVerifiableCredentialData'
      | 'storeVerifiableCredentialMeta'
      | 'updateAuthorizationEndpoint'
      | 'updateIssuerFromWellknown'
      | 'updateSelectedIssuerWellknownResponse'
      | 'updateVerificationErrorMessage';
    delays: never;
    guards:
      | 'canSelectIssuerAgain'
      | 'hasKeyPair'
      | 'hasUserCancelledBiometric'
      | 'isCustomSecureKeystore'
      | 'isGenericError'
      | 'isInternetConnected'
      | 'isKeyTypeNotFound'
      | 'isOIDCConfigError'
      | 'isOIDCflowCancelled'
      | 'isSignedIn'
      | 'isVerificationPendingBecauseOfNetworkIssue'
      | 'shouldFetchIssuersAgain';
    services:
      | 'checkInternet'
      | 'downloadCredential'
      | 'downloadCredentialTypes'
      | 'downloadIssuerWellknown'
      | 'downloadIssuersList'
      | 'fetchAuthorizationEndpoint'
      | 'generateKeyPair'
      | 'getKeyOrderList'
      | 'getKeyPair'
      | 'getSelectedKey'
      | 'invokeAuthorization'
      | 'isUserSignedAlready'
      | 'verifyCredential';
  };
  eventsCausingActions: {
    downloadIssuerWellknown: 'TRY_AGAIN';
    loadKeyPair: 'done.invoke.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]';
    logDownloaded:
      | 'done.invoke.issuersMachine.verifyingCredential:invocation[0]'
      | 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    resetError:
      | 'RESET_ERROR'
      | 'TRY_AGAIN'
      | 'error.platform.issuersMachine.performAuthorization:invocation[0]';
    resetIsVerified: 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    resetLoadingReason:
      | 'RESET_ERROR'
      | 'done.invoke.checkInternet'
      | 'done.invoke.issuersMachine.displayIssuers:invocation[0]'
      | 'error.platform.issuersMachine.downloadCredentialTypes:invocation[0]'
      | 'error.platform.issuersMachine.downloadCredentials:invocation[0]'
      | 'error.platform.issuersMachine.downloadIssuerWellknown:invocation[0]'
      | 'error.platform.issuersMachine.fetchAuthorizationEndpoint:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.setSelectedKey:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization:invocation[0]'
      | 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    resetSelectedCredentialType:
      | 'CANCEL'
      | 'error.platform.issuersMachine.downloadCredentials:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.setSelectedKey:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization:invocation[0]';
    resetVerificationErrorMessage: 'RESET_VERIFY_ERROR';
    sendBackupEvent: 'done.invoke.issuersMachine.storing:invocation[0]';
    sendDownloadingFailedToVcMeta:
      | 'error.platform.issuersMachine.downloadCredentials:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.setSelectedKey:invocation[0]';
    sendErrorEndEvent: 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    sendImpressionEvent: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
    sendSuccessEndEvent: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
    setCredentialTypeListDownloadFailureError: 'error.platform.issuersMachine.downloadCredentialTypes:invocation[0]';
    setCredentialWrapper: 'done.invoke.issuersMachine.downloadCredentials:invocation[0]';
    setError:
      | 'error.platform.issuersMachine.displayIssuers:invocation[0]'
      | 'error.platform.issuersMachine.downloadCredentials:invocation[0]'
      | 'error.platform.issuersMachine.fetchAuthorizationEndpoint:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.setSelectedKey:invocation[0]';
    setIsVerified: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
    setIssuers: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
    setLoadingReasonAsDisplayIssuers: 'TRY_AGAIN';
    setLoadingReasonAsDownloadingCredentials:
      | 'TRY_AGAIN'
      | 'done.invoke.issuersMachine.generateKeyPair:invocation[0]'
      | 'done.invoke.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]';
    setLoadingReasonAsSettingUp:
      | 'RESET_ERROR'
      | 'SELECTED_ISSUER'
      | 'TRY_AGAIN'
      | 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
    setMetadataInCredentialData:
      | 'done.invoke.issuersMachine.verifyingCredential:invocation[0]'
      | 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    setNetworkOrTechnicalError:
      | 'error.platform.issuersMachine.downloadIssuerWellknown:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization:invocation[0]';
    setNoInternet: 'done.invoke.checkInternet';
    setOIDCConfigError: 'error.platform.issuersMachine.performAuthorization:invocation[0]';
    setPrivateKey: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    setPublicKey: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    setSelectedCredentialType: 'SELECTED_CREDENTIAL_TYPE';
    setSelectedIssuerId: 'SELECTED_ISSUER';
    setSelectedIssuers: 'SELECTED_ISSUER';
    setSelectedKey: 'done.invoke.issuersMachine.performAuthorization.setSelectedKey:invocation[0]';
    setSupportedCredentialTypes: 'done.invoke.issuersMachine.downloadCredentialTypes:invocation[0]';
    setTokenResponse: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
    setVCMetadata:
      | 'done.invoke.issuersMachine.verifyingCredential:invocation[0]'
      | 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    setVerifiableCredential: 'done.invoke.issuersMachine.downloadCredentials:invocation[0]';
    storeKeyPair: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    storeVcMetaContext:
      | 'done.invoke.issuersMachine.verifyingCredential:invocation[0]'
      | 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    storeVcsContext:
      | 'done.invoke.issuersMachine.verifyingCredential:invocation[0]'
      | 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    storeVerifiableCredentialData:
      | 'done.invoke.issuersMachine.verifyingCredential:invocation[0]'
      | 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    storeVerifiableCredentialMeta:
      | 'done.invoke.issuersMachine.verifyingCredential:invocation[0]'
      | 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    updateAuthorizationEndpoint: 'done.invoke.issuersMachine.fetchAuthorizationEndpoint:invocation[0]';
    updateIssuerFromWellknown: 'done.invoke.issuersMachine.downloadIssuerWellknown:invocation[0]';
    updateSelectedIssuerWellknownResponse: 'done.invoke.issuersMachine.downloadIssuerWellknown:invocation[0]';
    updateVerificationErrorMessage: 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canSelectIssuerAgain: 'TRY_AGAIN';
    hasKeyPair: 'done.invoke.issuersMachine.checkKeyPair:invocation[0]';
    hasUserCancelledBiometric:
      | 'error.platform.issuersMachine.downloadCredentials:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]';
    isCustomSecureKeystore: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    isGenericError: 'error.platform.issuersMachine.downloadCredentials:invocation[0]';
    isInternetConnected: 'done.invoke.checkInternet';
    isKeyTypeNotFound: 'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]';
    isOIDCConfigError: 'error.platform.issuersMachine.performAuthorization:invocation[0]';
    isOIDCflowCancelled: 'error.platform.issuersMachine.performAuthorization:invocation[0]';
    isSignedIn: 'done.invoke.issuersMachine.storing:invocation[0]';
    isVerificationPendingBecauseOfNetworkIssue: 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    shouldFetchIssuersAgain: 'TRY_AGAIN';
  };
  eventsCausingServices: {
    checkInternet:
      | 'done.invoke.issuersMachine.downloadCredentialTypes:invocation[0]'
      | 'done.invoke.issuersMachine.fetchAuthorizationEndpoint:invocation[0]';
    downloadCredential:
      | 'done.invoke.issuersMachine.checkKeyPair:invocation[0]'
      | 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    downloadCredentialTypes: 'done.invoke.issuersMachine.downloadIssuerWellknown:invocation[0]';
    downloadIssuerWellknown: 'SELECTED_ISSUER' | 'TRY_AGAIN';
    downloadIssuersList: 'CANCEL' | 'TRY_AGAIN' | 'xstate.init';
    fetchAuthorizationEndpoint: 'SELECTED_CREDENTIAL_TYPE';
    generateKeyPair: 'done.invoke.issuersMachine.checkKeyPair:invocation[0]';
    getKeyOrderList: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
    getKeyPair:
      | 'TRY_AGAIN'
      | 'done.invoke.issuersMachine.performAuthorization.setSelectedKey:invocation[0]';
    getSelectedKey:
      | 'done.invoke.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization.getKeyPairFromKeystore:invocation[0]';
    invokeAuthorization: 'done.invoke.checkInternet';
    isUserSignedAlready:
      | 'done.invoke.issuersMachine.verifyingCredential:invocation[0]'
      | 'error.platform.issuersMachine.verifyingCredential:invocation[0]';
    verifyCredential: 'done.invoke.issuersMachine.downloadCredentials:invocation[0]';
  };
  matchesStates:
    | 'checkInternet'
    | 'checkKeyPair'
    | 'displayIssuers'
    | 'done'
    | 'downloadCredentialTypes'
    | 'downloadCredentials'
    | 'downloadCredentials.idle'
    | 'downloadCredentials.userCancelledBiometric'
    | 'downloadIssuerWellknown'
    | 'error'
    | 'fetchAuthorizationEndpoint'
    | 'fetchAuthorizationEndpoint.error'
    | 'fetchAuthorizationEndpoint.idle'
    | 'generateKeyPair'
    | 'handleVCVerificationFailure'
    | 'idle'
    | 'performAuthorization'
    | 'performAuthorization.getKeyPairFromKeystore'
    | 'performAuthorization.idle'
    | 'performAuthorization.setSelectedKey'
    | 'performAuthorization.userCancelledBiometric'
    | 'selectingCredentialType'
    | 'selectingIssuer'
    | 'storing'
    | 'verifyingCredential'
    | {
        downloadCredentials?: 'idle' | 'userCancelledBiometric';
        fetchAuthorizationEndpoint?: 'error' | 'idle';
        performAuthorization?:
          | 'getKeyPairFromKeystore'
          | 'idle'
          | 'setSelectedKey'
          | 'userCancelledBiometric';
      };
  tags: never;
}
