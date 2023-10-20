// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.requestingBindingOtp:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.requestingBindingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.vc-item-openid4vci.addKeyPair:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.addKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.addingWalletBindingId:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.addingWalletBindingId:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.requestingBindingOtp:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.requestingBindingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.updatingPrivateKey:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    addWalletBindnigId:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
    generateKeyPair:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
    requestBindingOtp:
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.requestingBindingOtp:invocation[0]';
    requestOtp:
      | 'done.invoke.vc-item-openid4vci.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.acceptingBindingOtp.resendOTP:invocation[0]';
    updatePrivateKey:
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
  };
  missingImplementations: {
    actions: 'clearTransactionId';
    delays: never;
    guards: never;
    services: 'requestOtp';
  };
  eventsCausingActions: {
    VcUpdated: 'STORE_RESPONSE';
    clearOtp:
      | 'DISMISS'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.requestingBindingOtp:invocation[0]';
    clearTransactionId: 'DISMISS';
    logVCremoved: 'STORE_RESPONSE';
    logWalletBindingFailure:
      | 'error.platform.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'error.platform.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    logWalletBindingSuccess:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    removeVcItem: 'CONFIRM';
    removedVc: 'STORE_RESPONSE';
    requestStoredContext: 'GET_VC_RESPONSE' | 'REFRESH';
    requestVcContext: 'DISMISS' | 'xstate.init';
    resetWalletBindingSuccess: 'DISMISS';
    sendActivationFailedEndEvent: 'DISMISS';
    sendActivationStartEvent: 'CONFIRM';
    sendActivationSuccessEvent:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    sendVcUpdated: 'STORE_RESPONSE';
    sendWalletBindingSuccess:
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]';
    setContext: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    setGeneratedOn: 'GET_VC_RESPONSE';
    setOtp: 'INPUT_OTP';
    setPinCard: 'PIN_CARD';
    setPrivateKey:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
    setPublicKey:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
    setThumbprintForWalletBindingId:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
    setVcKey: 'REMOVE';
    setVcMetadata: 'UPDATE_VC_METADATA';
    setVerifiableCredential: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    setWalletBindingError:
      | 'error.platform.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'error.platform.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'error.platform.vc-item-openid4vci.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    setWalletBindingErrorEmpty:
      | 'CANCEL'
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    setWalletBindingId:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
    setWalletBindingSuccess: 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    storeContext:
      | 'PIN_CARD'
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    updatePrivateKey:
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    updateVc:
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasCredential: 'GET_VC_RESPONSE';
    isCustomSecureKeystore:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
  };
  eventsCausingServices: {
    addWalletBindnigId:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
    generateKeyPair: 'INPUT_OTP';
    requestBindingOtp: 'CONFIRM';
    requestOtp: 'RESEND_OTP';
    updatePrivateKey:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
  };
  matchesStates:
    | 'acceptingBindingOtp'
    | 'acceptingBindingOtp.idle'
    | 'acceptingBindingOtp.resendOTP'
    | 'addKeyPair'
    | 'addingWalletBindingId'
    | 'checkingStore'
    | 'checkingVc'
    | 'idle'
    | 'kebabPopUp'
    | 'kebabPopUp.acceptingBindingOtp'
    | 'kebabPopUp.acceptingBindingOtp.idle'
    | 'kebabPopUp.acceptingBindingOtp.resendOTP'
    | 'kebabPopUp.addKeyPair'
    | 'kebabPopUp.addingWalletBindingId'
    | 'kebabPopUp.idle'
    | 'kebabPopUp.removeWallet'
    | 'kebabPopUp.removingVc'
    | 'kebabPopUp.requestingBindingOtp'
    | 'kebabPopUp.showActivities'
    | 'kebabPopUp.showBindingWarning'
    | 'kebabPopUp.showingWalletBindingError'
    | 'kebabPopUp.updatingPrivateKey'
    | 'pinCard'
    | 'requestingBindingOtp'
    | 'showBindingWarning'
    | 'showingWalletBindingError'
    | 'updatingPrivateKey'
    | {
        acceptingBindingOtp?: 'idle' | 'resendOTP';
        kebabPopUp?:
          | 'acceptingBindingOtp'
          | 'addKeyPair'
          | 'addingWalletBindingId'
          | 'idle'
          | 'removeWallet'
          | 'removingVc'
          | 'requestingBindingOtp'
          | 'showActivities'
          | 'showBindingWarning'
          | 'showingWalletBindingError'
          | 'updatingPrivateKey'
          | {acceptingBindingOtp?: 'idle' | 'resendOTP'};
      };
  tags: never;
}

// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.requestingBindingOtp:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.requestingBindingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.vc-item-openid4vci.addKeyPair:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.addKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.addingWalletBindingId:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.addingWalletBindingId:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.requestingBindingOtp:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.requestingBindingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.updatingPrivateKey:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    addWalletBindnigId:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
    generateKeyPair:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
    requestBindingOtp:
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.requestingBindingOtp:invocation[0]';
    requestOtp:
      | 'done.invoke.vc-item-openid4vci.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.acceptingBindingOtp.resendOTP:invocation[0]';
    updatePrivateKey:
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
  };
  missingImplementations: {
    actions: 'clearTransactionId';
    delays: never;
    guards: never;
    services: 'requestOtp';
  };
  eventsCausingActions: {
    VcUpdated: 'STORE_RESPONSE';
    clearOtp:
      | 'DISMISS'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.requestingBindingOtp:invocation[0]';
    clearTransactionId: 'DISMISS';
    logVCremoved: 'STORE_RESPONSE';
    logWalletBindingFailure:
      | 'error.platform.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'error.platform.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    logWalletBindingSuccess:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    removeVcItem: 'CONFIRM';
    removedVc: 'STORE_RESPONSE';
    requestStoredContext: 'GET_VC_RESPONSE' | 'REFRESH';
    requestVcContext: 'DISMISS' | 'xstate.init';
    resetWalletBindingSuccess: 'DISMISS';
    sendVcUpdated: 'STORE_RESPONSE';
    sendWalletBindingSuccess:
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]';
    setContext: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    setGeneratedOn: 'GET_VC_RESPONSE';
    setOtp: 'INPUT_OTP';
    setPinCard: 'PIN_CARD';
    setPrivateKey:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
    setPublicKey:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
    setThumbprintForWalletBindingId:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
    setVcKey: 'REMOVE';
    setVcMetadata: 'UPDATE_VC_METADATA';
    setVerifiableCredential: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    setWalletBindingError:
      | 'error.platform.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'error.platform.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'error.platform.vc-item-openid4vci.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    setWalletBindingErrorEmpty:
      | 'CANCEL'
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    setWalletBindingId:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
    setWalletBindingSuccess: 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    storeContext:
      | 'PIN_CARD'
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    updatePrivateKey:
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
    updateVc:
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.updatingPrivateKey:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasCredential: 'GET_VC_RESPONSE';
    isCustomSecureKeystore:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
  };
  eventsCausingServices: {
    addWalletBindnigId:
      | 'done.invoke.vc-item-openid4vci.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addKeyPair:invocation[0]';
    generateKeyPair: 'INPUT_OTP';
    requestBindingOtp: 'CONFIRM';
    requestOtp: 'RESEND_OTP';
    updatePrivateKey:
      | 'done.invoke.vc-item-openid4vci.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.kebabPopUp.addingWalletBindingId:invocation[0]';
  };
  matchesStates:
    | 'acceptingBindingOtp'
    | 'acceptingBindingOtp.idle'
    | 'acceptingBindingOtp.resendOTP'
    | 'addKeyPair'
    | 'addingWalletBindingId'
    | 'checkingStore'
    | 'checkingVc'
    | 'idle'
    | 'kebabPopUp'
    | 'kebabPopUp.acceptingBindingOtp'
    | 'kebabPopUp.acceptingBindingOtp.idle'
    | 'kebabPopUp.acceptingBindingOtp.resendOTP'
    | 'kebabPopUp.addKeyPair'
    | 'kebabPopUp.addingWalletBindingId'
    | 'kebabPopUp.idle'
    | 'kebabPopUp.removeWallet'
    | 'kebabPopUp.removingVc'
    | 'kebabPopUp.requestingBindingOtp'
    | 'kebabPopUp.showActivities'
    | 'kebabPopUp.showBindingWarning'
    | 'kebabPopUp.showingWalletBindingError'
    | 'kebabPopUp.updatingPrivateKey'
    | 'pinCard'
    | 'requestingBindingOtp'
    | 'showBindingWarning'
    | 'showingWalletBindingError'
    | 'updatingPrivateKey'
    | {
        acceptingBindingOtp?: 'idle' | 'resendOTP';
        kebabPopUp?:
          | 'acceptingBindingOtp'
          | 'addKeyPair'
          | 'addingWalletBindingId'
          | 'idle'
          | 'removeWallet'
          | 'removingVc'
          | 'requestingBindingOtp'
          | 'showActivities'
          | 'showBindingWarning'
          | 'showingWalletBindingError'
          | 'updatingPrivateKey'
          | {acceptingBindingOtp?: 'idle' | 'resendOTP'};
      };
  tags: never;
}
