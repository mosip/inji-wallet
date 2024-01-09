// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'error.platform.backup.requestOtp:invocation[0]': {
      type: 'error.platform.backup.requestOtp:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    requestOtp: 'done.invoke.backup.requestOtp:invocation[0]';
  };
  missingImplementations: {
    actions: '';
    delays: never;
    guards: never;
    services: 'requestOtp';
  };
  eventsCausingActions: {
    '': 'error.platform.backup.requestOtp:invocation[0]';
    setOtp: 'INPUT_OTP';
    setPassword: 'SET_PASSWORD';
    setPhoneNumber: 'SET_PHONE_NUMBER';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    requestOtp: 'SEND_OTP';
  };
  matchesStates:
    | 'backUp'
    | 'backingUp'
    | 'init'
    | 'passwordBackup'
    | 'phoneNumberBackup'
    | 'requestOtp'
    | 'selectPref';
  tags: never;
}
