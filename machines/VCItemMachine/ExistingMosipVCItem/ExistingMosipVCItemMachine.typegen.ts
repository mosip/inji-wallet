// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    '': {type: ''};
    'done.invoke.checkStatus': {
      type: 'done.invoke.checkStatus';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.downloadCredential': {
      type: 'done.invoke.downloadCredential';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.addKeyPair:invocation[0]': {
      type: 'done.invoke.vc-item.addKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.addingWalletBindingId:invocation[0]': {
      type: 'done.invoke.vc-item.addingWalletBindingId:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.checkingServerData.loadDownloadLimitConfig:invocation[0]': {
      type: 'done.invoke.vc-item.checkingServerData.loadDownloadLimitConfig:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]': {
      type: 'done.invoke.vc-item.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.requestingBindingOtp:invocation[0]': {
      type: 'done.invoke.vc-item.requestingBindingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.requestingLock:invocation[0]': {
      type: 'done.invoke.vc-item.requestingLock:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.requestingOtp:invocation[0]': {
      type: 'done.invoke.vc-item.requestingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.requestingRevoke:invocation[0]': {
      type: 'done.invoke.vc-item.requestingRevoke:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.updatingPrivateKey:invocation[0]': {
      type: 'done.invoke.vc-item.updatingPrivateKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.verifyingCredential:invocation[0]': {
      type: 'done.invoke.vc-item.verifyingCredential:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.checkStatus': {
      type: 'error.platform.checkStatus';
      data: unknown;
    };
    'error.platform.downloadCredential': {
      type: 'error.platform.downloadCredential';
      data: unknown;
    };
    'error.platform.vc-item.acceptingBindingOtp.resendOTP:invocation[0]': {
      type: 'error.platform.vc-item.acceptingBindingOtp.resendOTP:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.addKeyPair:invocation[0]': {
      type: 'error.platform.vc-item.addKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.addingWalletBindingId:invocation[0]': {
      type: 'error.platform.vc-item.addingWalletBindingId:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]': {
      type: 'error.platform.vc-item.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.requestingBindingOtp:invocation[0]': {
      type: 'error.platform.vc-item.requestingBindingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.requestingLock:invocation[0]': {
      type: 'error.platform.vc-item.requestingLock:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.requestingRevoke:invocation[0]': {
      type: 'error.platform.vc-item.requestingRevoke:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.updatingPrivateKey:invocation[0]': {
      type: 'error.platform.vc-item.updatingPrivateKey:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.verifyingCredential:invocation[0]': {
      type: 'error.platform.vc-item.verifyingCredential:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    addWalletBindnigId: 'done.invoke.vc-item.addingWalletBindingId:invocation[0]';
    checkDownloadExpiryLimit: 'done.invoke.vc-item.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
    checkStatus: 'done.invoke.checkStatus';
    downloadCredential: 'done.invoke.downloadCredential';
    generateKeyPair: 'done.invoke.vc-item.addKeyPair:invocation[0]';
    loadDownloadLimitConfig: 'done.invoke.vc-item.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    requestBindingOtp:
      | 'done.invoke.vc-item.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'done.invoke.vc-item.requestingBindingOtp:invocation[0]';
    requestLock: 'done.invoke.vc-item.requestingLock:invocation[0]';
    requestOtp:
      | 'done.invoke.vc-item.acceptingOtpInput.resendOTP:invocation[0]'
      | 'done.invoke.vc-item.requestingOtp:invocation[0]';
    requestRevoke: 'done.invoke.vc-item.requestingRevoke:invocation[0]';
    updatePrivateKey: 'done.invoke.vc-item.updatingPrivateKey:invocation[0]';
    verifyCredential: 'done.invoke.vc-item.verifyingCredential:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    addVcToInProgressDownloads: 'STORE_RESPONSE';
    clearOtp:
      | ''
      | 'CANCEL'
      | 'DISMISS'
      | 'REVOKE_VC'
      | 'SHOW_BINDING_STATUS'
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.requestingBindingOtp:invocation[0]'
      | 'done.invoke.vc-item.requestingOtp:invocation[0]'
      | 'error.platform.vc-item.requestingLock:invocation[0]'
      | 'error.platform.vc-item.requestingRevoke:invocation[0]';
    clearTransactionId:
      | ''
      | 'CANCEL'
      | 'DISMISS'
      | 'SHOW_BINDING_STATUS'
      | 'STORE_RESPONSE';
    incrementDownloadCounter:
      | 'POLL'
      | 'done.invoke.vc-item.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    logDownloaded: 'STORE_RESPONSE';
    logRevoked: 'STORE_RESPONSE';
    logVCremoved: 'STORE_RESPONSE';
    logWalletBindingFailure:
      | 'error.platform.vc-item.addKeyPair:invocation[0]'
      | 'error.platform.vc-item.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item.updatingPrivateKey:invocation[0]';
    logWalletBindingSuccess:
      | 'done.invoke.vc-item.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.updatingPrivateKey:invocation[0]';
    markVcValid: 'done.invoke.vc-item.verifyingCredential:invocation[0]';
    refreshMyVcs: 'STORE_RESPONSE';
    removeTamperedVcItem: 'TAMPERED_VC';
    removeVcFromInProgressDownloads: 'STORE_RESPONSE';
    removeVcItem: 'CONFIRM';
    removeVcMetaDataFromStorage:
      | 'STORE_ERROR'
      | 'error.platform.vc-item.verifyingCredential:invocation[0]';
    removeVcMetaDataFromVcMachine: 'DISMISS';
    requestStoredContext: 'GET_VC_RESPONSE' | 'REFRESH';
    requestVcContext: 'DISMISS' | 'xstate.init';
    resetWalletBindingSuccess: 'DISMISS';
    revokeVID: 'done.invoke.vc-item.requestingRevoke:invocation[0]';
    sendActivationFailedEndEvent:
      | 'DISMISS'
      | 'error.platform.vc-item.updatingPrivateKey:invocation[0]';
    sendActivationStartEvent: 'CONFIRM';
    sendActivationSuccessEvent:
      | 'done.invoke.vc-item.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.updatingPrivateKey:invocation[0]';
    sendDownloadLimitExpire:
      | 'FAILED'
      | 'error.platform.vc-item.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
    sendTamperedVc: 'TAMPERED_VC';
    sendTelemetryEvents: 'STORE_RESPONSE';
    sendVcUpdated: 'PIN_CARD';
    sendVerificationError: 'STORE_RESPONSE';
    sendWalletBindingSuccess: 'SHOW_BINDING_STATUS';
    setCredential: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    setDownloadInterval: 'done.invoke.vc-item.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    setLock: 'done.invoke.vc-item.requestingLock:invocation[0]';
    setMaxDownloadCount: 'done.invoke.vc-item.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    setOtp: 'INPUT_OTP';
    setOtpError:
      | 'error.platform.vc-item.requestingLock:invocation[0]'
      | 'error.platform.vc-item.requestingRevoke:invocation[0]';
    setPinCard: 'PIN_CARD';
    setPrivateKey: 'done.invoke.vc-item.addKeyPair:invocation[0]';
    setPublicKey: 'done.invoke.vc-item.addKeyPair:invocation[0]';
    setRevoke: 'done.invoke.vc-item.requestingRevoke:invocation[0]';
    setStoreVerifiableCredential: 'CREDENTIAL_DOWNLOADED';
    setTempWalletBindingResponse: 'done.invoke.vc-item.addingWalletBindingId:invocation[0]';
    setThumbprintForWalletBindingId:
      | 'done.invoke.vc-item.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.updatingPrivateKey:invocation[0]';
    setTransactionId:
      | 'INPUT_OTP'
      | 'REVOKE_VC'
      | 'done.invoke.vc-item.requestingOtp:invocation[0]'
      | 'error.platform.vc-item.requestingLock:invocation[0]'
      | 'error.platform.vc-item.requestingRevoke:invocation[0]';
    setVcKey: 'REMOVE';
    setVcMetadata: 'UPDATE_VC_METADATA';
    setVerifiableCredential: 'done.invoke.vc-item.verifyingCredential:invocation[0]';
    setWalletBindingError:
      | 'error.platform.vc-item.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'error.platform.vc-item.addKeyPair:invocation[0]'
      | 'error.platform.vc-item.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item.updatingPrivateKey:invocation[0]';
    setWalletBindingErrorEmpty:
      | 'CANCEL'
      | 'done.invoke.vc-item.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.updatingPrivateKey:invocation[0]';
    setWalletBindingId:
      | 'done.invoke.vc-item.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.updatingPrivateKey:invocation[0]';
    setWalletBindingSuccess: 'SHOW_BINDING_STATUS';
    storeContext:
      | 'done.invoke.vc-item.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item.verifyingCredential:invocation[0]';
    storeLock: 'done.invoke.vc-item.requestingLock:invocation[0]';
    updatePrivateKey:
      | 'done.invoke.vc-item.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.updatingPrivateKey:invocation[0]';
    updateVc:
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.updatingPrivateKey:invocation[0]';
    updateVerificationErrorMessage: 'error.platform.vc-item.verifyingCredential:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasCredential: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    isCustomSecureKeystore:
      | 'done.invoke.vc-item.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item.addingWalletBindingId:invocation[0]';
    isDownloadAllowed: 'POLL';
    isVcValid: '';
  };
  eventsCausingServices: {
    addWalletBindnigId: 'done.invoke.vc-item.addKeyPair:invocation[0]';
    checkDownloadExpiryLimit:
      | 'POLL'
      | 'done.invoke.vc-item.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    checkStatus: 'done.invoke.vc-item.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
    downloadCredential: 'DOWNLOAD_READY';
    generateKeyPair: 'INPUT_OTP';
    loadDownloadLimitConfig: 'STORE_ERROR' | 'STORE_RESPONSE';
    requestBindingOtp: 'CONFIRM' | 'RESEND_OTP';
    requestLock: 'INPUT_OTP';
    requestOtp: 'LOCK_VC' | 'RESEND_OTP';
    requestRevoke: 'INPUT_OTP';
    updatePrivateKey: 'done.invoke.vc-item.addingWalletBindingId:invocation[0]';
    verifyCredential: '' | 'VERIFY';
  };
  matchesStates:
    | 'acceptingBindingOtp'
    | 'acceptingBindingOtp.idle'
    | 'acceptingBindingOtp.resendOTP'
    | 'acceptingOtpInput'
    | 'acceptingOtpInput.idle'
    | 'acceptingOtpInput.resendOTP'
    | 'acceptingRevokeInput'
    | 'addKeyPair'
    | 'addingWalletBindingId'
    | 'checkingServerData'
    | 'checkingServerData.checkingStatus'
    | 'checkingServerData.downloadingCredential'
    | 'checkingServerData.loadDownloadLimitConfig'
    | 'checkingServerData.savingFailed'
    | 'checkingServerData.savingFailed.idle'
    | 'checkingServerData.savingFailed.viewingVc'
    | 'checkingServerData.verifyingDownloadLimitExpiry'
    | 'checkingStore'
    | 'checkingVc'
    | 'checkingVerificationStatus'
    | 'handlingCredentialVerificationFailure'
    | 'idle'
    | 'invalid'
    | 'invalid.backend'
    | 'invalid.otp'
    | 'kebabPopUp'
    | 'kebabPopUp.idle'
    | 'kebabPopUp.removeWallet'
    | 'kebabPopUp.removingVc'
    | 'kebabPopUp.showActivities'
    | 'lockingVc'
    | 'loggingRevoke'
    | 'pinCard'
    | 'requestingBindingOtp'
    | 'requestingLock'
    | 'requestingOtp'
    | 'requestingRevoke'
    | 'revokingVc'
    | 'showBindingWarning'
    | 'showingWalletBindingError'
    | 'updatingContextVariables'
    | 'updatingPrivateKey'
    | 'verifyingCredential'
    | {
        acceptingBindingOtp?: 'idle' | 'resendOTP';
        acceptingOtpInput?: 'idle' | 'resendOTP';
        checkingServerData?:
          | 'checkingStatus'
          | 'downloadingCredential'
          | 'loadDownloadLimitConfig'
          | 'savingFailed'
          | 'verifyingDownloadLimitExpiry'
          | {savingFailed?: 'idle' | 'viewingVc'};
        invalid?: 'backend' | 'otp';
        kebabPopUp?: 'idle' | 'removeWallet' | 'removingVc' | 'showActivities';
      };
  tags: never;
}
