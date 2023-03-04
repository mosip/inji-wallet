// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.walletBinding.addKeyPair:invocation[0]': {
      type: 'done.invoke.walletBinding.addKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.walletBinding.addingWalletBindingId:invocation[0]': {
      type: 'done.invoke.walletBinding.addingWalletBindingId:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.walletBinding.requestingBindingOtp:invocation[0]': {
      type: 'done.invoke.walletBinding.requestingBindingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.walletBinding.updatingPrivateKey:invocation[0]': {
      type: 'done.invoke.walletBinding.updatingPrivateKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.walletBinding.addKeyPair:invocation[0]': {
      type: 'error.platform.walletBinding.addKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.walletBinding.addingWalletBindingId:invocation[0]': {
      type: 'error.platform.walletBinding.addingWalletBindingId:invocation[0]';
      data: unknown;
    };
    'error.platform.walletBinding.requestingBindingOtp:invocation[0]': {
      type: 'error.platform.walletBinding.requestingBindingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.walletBinding.updatingPrivateKey:invocation[0]': {
      type: 'error.platform.walletBinding.updatingPrivateKey:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    addWalletBindnigId: 'done.invoke.walletBinding.addingWalletBindingId:invocation[0]';
    generateKeyPair: 'done.invoke.walletBinding.addKeyPair:invocation[0]';
    requestBindingOtp: 'done.invoke.walletBinding.requestingBindingOtp:invocation[0]';
    updatePrivateKey: 'done.invoke.walletBinding.updatingPrivateKey:invocation[0]';
  };
  'missingImplementations': {
    actions: 'clearTransactionId';
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    clearOtp:
      | 'DISMISS'
      | 'done.invoke.walletBinding.requestingBindingOtp:invocation[0]';
    clearTransactionId: 'DISMISS';
    setOtp: 'INPUT_OTP';
    setPrivateKey: 'done.invoke.walletBinding.addKeyPair:invocation[0]';
    setPublicKey: 'done.invoke.walletBinding.addKeyPair:invocation[0]';
    setWalletBindingError:
      | 'error.platform.walletBinding.addKeyPair:invocation[0]'
      | 'error.platform.walletBinding.addingWalletBindingId:invocation[0]'
      | 'error.platform.walletBinding.requestingBindingOtp:invocation[0]'
      | 'error.platform.walletBinding.updatingPrivateKey:invocation[0]';
    setWalletBindingErrorEmpty:
      | 'CANCEL'
      | 'done.invoke.walletBinding.updatingPrivateKey:invocation[0]';
    setWalletBindingId: 'done.invoke.walletBinding.addingWalletBindingId:invocation[0]';
    storeContext: 'done.invoke.walletBinding.updatingPrivateKey:invocation[0]';
    updatePrivateKey: 'done.invoke.walletBinding.updatingPrivateKey:invocation[0]';
    updateVc: 'done.invoke.walletBinding.updatingPrivateKey:invocation[0]';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {
    addWalletBindnigId: 'done.invoke.walletBinding.addKeyPair:invocation[0]';
    generateKeyPair: 'INPUT_OTP';
    requestBindingOtp: 'CONFIRM';
    updatePrivateKey: 'done.invoke.walletBinding.addingWalletBindingId:invocation[0]';
  };
  'matchesStates':
    | 'acceptingBindingOtp'
    | 'addKeyPair'
    | 'addingWalletBindingId'
    | 'requestingBindingOtp'
    | 'showBindingWarning'
    | 'showingWalletBindingError'
    | 'updatingPrivateKey';
  'tags': never;
}
