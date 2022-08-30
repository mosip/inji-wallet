// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.RevokeVids.acceptingVIDs.requestingOtp:invocation[0]': {
      type: 'done.invoke.RevokeVids.acceptingVIDs.requestingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.RevokeVids.requestingRevoke:invocation[0]': {
      type: 'done.invoke.RevokeVids.requestingRevoke:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.RevokeVids.acceptingVIDs.requestingOtp:invocation[0]': {
      type: 'error.platform.RevokeVids.acceptingVIDs.requestingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.RevokeVids.requestingRevoke:invocation[0]': {
      type: 'error.platform.RevokeVids.requestingRevoke:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    requestOtp: 'done.invoke.RevokeVids.acceptingVIDs.requestingOtp:invocation[0]';
    requestRevoke: 'done.invoke.RevokeVids.requestingRevoke:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    clearOtp:
      | 'REVOKE_VCS'
      | 'done.invoke.RevokeVids.acceptingVIDs.requestingOtp:invocation[0]'
      | 'error.platform.RevokeVids.requestingRevoke:invocation[0]'
      | 'xstate.init';
    logRevoked: 'done.invoke.RevokeVids.requestingRevoke:invocation[0]';
    setIdBackendError: 'error.platform.RevokeVids.acceptingVIDs.requestingOtp:invocation[0]';
    setOtp: 'INPUT_OTP';
    setOtpError: 'error.platform.RevokeVids.requestingRevoke:invocation[0]';
    setTransactionId: 'REVOKE_VCS' | 'xstate.init';
    setVIDs: 'REVOKE_VCS';
  };
  'eventsCausingServices': {
    requestOtp: never;
    requestRevoke: 'INPUT_OTP';
  };
  'eventsCausingGuards': {};
  'eventsCausingDelays': {};
  'matchesStates':
    | 'acceptingOtpInput'
    | 'acceptingVIDs'
    | 'acceptingVIDs.idle'
    | 'acceptingVIDs.requestingOtp'
    | 'idle'
    | 'invalid'
    | 'invalid.backend'
    | 'invalid.otp'
    | 'requestingRevoke'
    | 'revokingVc'
    | { acceptingVIDs?: 'idle' | 'requestingOtp'; invalid?: 'backend' | 'otp' };
  'tags': never;
}
