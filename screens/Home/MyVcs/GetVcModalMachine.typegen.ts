// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.GetVcModal.acceptingIdInput.requestingOtp:invocation[0]': {
      type: 'done.invoke.GetVcModal.acceptingIdInput.requestingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.GetVcModal.requestingUinVid:invocation[0]': {
      type: 'done.invoke.GetVcModal.requestingUinVid:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.GetVcModal.acceptingIdInput.requestingOtp:invocation[0]': {
      type: 'error.platform.GetVcModal.acceptingIdInput.requestingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.GetVcModal.requestingUinVid:invocation[0]': {
      type: 'error.platform.GetVcModal.requestingUinVid:invocation[0]';
      data: unknown;
    };
    'xstate.after(100)#GetVcModal.acceptingIdInput.focusing': {
      type: 'xstate.after(100)#GetVcModal.acceptingIdInput.focusing';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    requestOtp: 'done.invoke.GetVcModal.acceptingIdInput.requestingOtp:invocation[0]';
    requestingUinVid: 'done.invoke.GetVcModal.requestingUinVid:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    clearIdError: 'INPUT_ID';
    clearOtp:
      | 'DISMISS'
      | 'done.invoke.GetVcModal.acceptingIdInput.requestingOtp:invocation[0]'
      | 'error.platform.GetVcModal.requestingUinVid:invocation[0]'
      | 'xstate.init';
    focusInput:
      | 'DISMISS'
      | 'INPUT_ID'
      | 'VALIDATE_INPUT'
      | 'error.platform.GetVcModal.acceptingIdInput.requestingOtp:invocation[0]'
      | 'error.platform.GetVcModal.requestingUinVid:invocation[0]'
      | 'xstate.after(100)#GetVcModal.acceptingIdInput.focusing';
    forwardToParent: 'DISMISS';
    setIconColorActivate: 'ACTIVATE_ICON_COLOR';
    setIconColorDeactivate: 'DEACTIVATE_ICON_COLOR';
    setId: 'INPUT_ID';
    setIdBackendError:
      | 'error.platform.GetVcModal.acceptingIdInput.requestingOtp:invocation[0]'
      | 'error.platform.GetVcModal.requestingUinVid:invocation[0]';
    setIdErrorEmpty: 'VALIDATE_INPUT';
    setIdErrorWrongFormat: 'VALIDATE_INPUT';
    setIdInputRef: 'READY';
    setIndividualId: 'done.invoke.GetVcModal.requestingUinVid:invocation[0]';
    setOtp: 'INPUT_OTP';
    setOtpError: 'error.platform.GetVcModal.requestingUinVid:invocation[0]';
    setTransactionId:
      | 'DISMISS'
      | 'error.platform.GetVcModal.requestingUinVid:invocation[0]'
      | 'xstate.init';
  };
  'eventsCausingServices': {
    requestOtp: 'VALIDATE_INPUT';
    requestingUinVid: 'INPUT_OTP';
  };
  'eventsCausingGuards': {
    isEmptyId: 'VALIDATE_INPUT';
    isIdInvalid: 'error.platform.GetVcModal.requestingUinVid:invocation[0]';
    isWrongIdFormat: 'VALIDATE_INPUT';
  };
  'eventsCausingDelays': {};
  'matchesStates':
    | 'acceptingIdInput'
    | 'acceptingIdInput.focusing'
    | 'acceptingIdInput.idle'
    | 'acceptingIdInput.invalid'
    | 'acceptingIdInput.invalid.backend'
    | 'acceptingIdInput.invalid.empty'
    | 'acceptingIdInput.invalid.format'
    | 'acceptingIdInput.rendering'
    | 'acceptingIdInput.requestingOtp'
    | 'acceptingOtpInput'
    | 'done'
    | 'requestingUinVid'
    | {
        acceptingIdInput?:
          | 'focusing'
          | 'idle'
          | 'invalid'
          | 'rendering'
          | 'requestingOtp'
          | { invalid?: 'backend' | 'empty' | 'format' };
      };
  'tags': never;
}
