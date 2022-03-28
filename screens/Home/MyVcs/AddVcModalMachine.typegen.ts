// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'xstate.after(100)#AddVcModal.acceptingIdInput.focusing': {
      type: 'xstate.after(100)#AddVcModal.acceptingIdInput.focusing';
    };
    'error.platform.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]': {
      type: 'error.platform.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.AddVcModal.requestingCredential:invocation[0]': {
      type: 'error.platform.AddVcModal.requestingCredential:invocation[0]';
      data: unknown;
    };
    'done.invoke.AddVcModal.requestingCredential:invocation[0]': {
      type: 'done.invoke.AddVcModal.requestingCredential:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': { type: 'xstate.init' };
    'done.invoke.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]': {
      type: 'done.invoke.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
  };
  'invokeSrcNameMap': {
    requestOtp: 'done.invoke.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]';
    requestCredential: 'done.invoke.AddVcModal.requestingCredential:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    forwardToParent: 'DISMISS';
    setIdInputRef: 'READY';
    setId: 'INPUT_ID';
    setIdType: 'SELECT_ID_TYPE';
    clearId: 'SELECT_ID_TYPE';
    clearIdError: 'INPUT_ID';
    setIdBackendError:
      | 'error.platform.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]'
      | 'error.platform.AddVcModal.requestingCredential:invocation[0]';
    setOtp: 'INPUT_OTP';
    setRequestId: 'done.invoke.AddVcModal.requestingCredential:invocation[0]';
    setOtpError: 'error.platform.AddVcModal.requestingCredential:invocation[0]';
    setTransactionId:
      | 'xstate.init'
      | 'DISMISS'
      | 'error.platform.AddVcModal.requestingCredential:invocation[0]';
    clearOtp:
      | 'xstate.init'
      | 'DISMISS'
      | 'error.platform.AddVcModal.requestingCredential:invocation[0]'
      | 'done.invoke.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]';
    focusInput:
      | 'xstate.after(100)#AddVcModal.acceptingIdInput.focusing'
      | 'INPUT_ID'
      | 'SELECT_ID_TYPE'
      | 'DISMISS'
      | 'VALIDATE_INPUT'
      | 'error.platform.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]'
      | 'error.platform.AddVcModal.requestingCredential:invocation[0]';
    setIdErrorEmpty: 'VALIDATE_INPUT';
    setIdErrorWrongFormat: 'VALIDATE_INPUT';
  };
  'eventsCausingServices': {
    requestOtp: 'VALIDATE_INPUT';
    requestCredential: 'INPUT_OTP';
  };
  'eventsCausingGuards': {
    isEmptyId: 'VALIDATE_INPUT';
    isWrongIdFormat: 'VALIDATE_INPUT';
    isIdInvalid: 'error.platform.AddVcModal.requestingCredential:invocation[0]';
  };
  'eventsCausingDelays': {};
  'matchesStates':
    | 'acceptingIdInput'
    | 'acceptingIdInput.rendering'
    | 'acceptingIdInput.focusing'
    | 'acceptingIdInput.idle'
    | 'acceptingIdInput.invalid'
    | 'acceptingIdInput.invalid.empty'
    | 'acceptingIdInput.invalid.format'
    | 'acceptingIdInput.invalid.backend'
    | 'acceptingIdInput.requestingOtp'
    | 'acceptingOtpInput'
    | 'requestingCredential'
    | 'done'
    | {
        acceptingIdInput?:
          | 'rendering'
          | 'focusing'
          | 'idle'
          | 'invalid'
          | 'requestingOtp'
          | { invalid?: 'empty' | 'format' | 'backend' };
      };
  'tags': never;
}
