// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    '': { type: '' };
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
    'error.platform.vc-item.requestingLock:invocation[0]': {
      type: 'error.platform.vc-item.requestingLock:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.requestingRevoke:invocation[0]': {
      type: 'error.platform.vc-item.requestingRevoke:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.verifyingCredential:invocation[0]': {
      type: 'error.platform.vc-item.verifyingCredential:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    checkStatus: 'done.invoke.checkStatus';
    downloadCredential: 'done.invoke.downloadCredential';
    requestLock: 'done.invoke.vc-item.requestingLock:invocation[0]';
    requestOtp: 'done.invoke.vc-item.requestingOtp:invocation[0]';
    requestRevoke: 'done.invoke.vc-item.requestingRevoke:invocation[0]';
    verifyCredential: 'done.invoke.vc-item.verifyingCredential:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    clearOtp:
      | ''
      | 'DISMISS'
      | 'REVOKE_VC'
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.requestingOtp:invocation[0]'
      | 'done.invoke.vc-item.verifyingCredential:invocation[0]'
      | 'error.platform.vc-item.requestingLock:invocation[0]'
      | 'error.platform.vc-item.requestingRevoke:invocation[0]'
      | 'error.platform.vc-item.verifyingCredential:invocation[0]';
    clearTransactionId:
      | ''
      | 'DISMISS'
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.verifyingCredential:invocation[0]'
      | 'error.platform.vc-item.verifyingCredential:invocation[0]';
    logDownloaded: 'CREDENTIAL_DOWNLOADED';
    logRevoked: 'STORE_RESPONSE';
    markVcValid: 'done.invoke.vc-item.verifyingCredential:invocation[0]';
    requestStoredContext: 'GET_VC_RESPONSE' | 'REFRESH';
    requestVcContext: 'xstate.init';
    revokeVID: 'done.invoke.vc-item.requestingRevoke:invocation[0]';
    setCredential:
      | 'CREDENTIAL_DOWNLOADED'
      | 'GET_VC_RESPONSE'
      | 'STORE_RESPONSE';
    setLock: 'done.invoke.vc-item.requestingLock:invocation[0]';
    setOtp: 'INPUT_OTP';
    setOtpError:
      | 'error.platform.vc-item.requestingLock:invocation[0]'
      | 'error.platform.vc-item.requestingRevoke:invocation[0]';
    setRevoke: 'done.invoke.vc-item.requestingRevoke:invocation[0]';
    setTag: 'SAVE_TAG';
    setTransactionId:
      | 'INPUT_OTP'
      | 'REVOKE_VC'
      | 'done.invoke.vc-item.requestingOtp:invocation[0]'
      | 'error.platform.vc-item.requestingLock:invocation[0]'
      | 'error.platform.vc-item.requestingRevoke:invocation[0]';
    storeContext:
      | 'CREDENTIAL_DOWNLOADED'
      | 'done.invoke.vc-item.verifyingCredential:invocation[0]';
    storeLock: 'done.invoke.vc-item.requestingLock:invocation[0]';
    storeTag: 'SAVE_TAG';
    updateVc:
      | 'CREDENTIAL_DOWNLOADED'
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.verifyingCredential:invocation[0]';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {
    hasCredential: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    isVcValid: '';
  };
  'eventsCausingServices': {
    checkStatus: 'STORE_RESPONSE';
    downloadCredential: 'DOWNLOAD_READY';
    requestLock: 'INPUT_OTP';
    requestOtp: 'LOCK_VC';
    requestRevoke: 'INPUT_OTP';
    verifyCredential: '' | 'VERIFY';
  };
  'matchesStates':
    | 'acceptingOtpInput'
    | 'acceptingRevokeInput'
    | 'checkingServerData'
    | 'checkingServerData.checkingStatus'
    | 'checkingServerData.downloadingCredential'
    | 'checkingStore'
    | 'checkingVc'
    | 'checkingVerificationStatus'
    | 'editingTag'
    | 'idle'
    | 'invalid'
    | 'invalid.backend'
    | 'invalid.otp'
    | 'lockingVc'
    | 'loggingRevoke'
    | 'requestingLock'
    | 'requestingOtp'
    | 'requestingRevoke'
    | 'revokingVc'
    | 'storingTag'
    | 'verifyingCredential'
    | {
        checkingServerData?: 'checkingStatus' | 'downloadingCredential';
        invalid?: 'backend' | 'otp';
      };
  'tags': never;
}
