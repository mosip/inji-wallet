// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'eventsCausingActions': {
    setContext: 'STORE_RESPONSE';
    setPasscode: 'SETUP_PASSCODE';
    storeContext: 'SETUP_PASSCODE' | 'SETUP_BIOMETRICS' | 'STORE_RESPONSE';
    setBiometrics: 'SETUP_BIOMETRICS';
    requestStoredContext: 'xstate.init';
  };
  'internalEvents': {
    '': { type: '' };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {};
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {
    hasData: 'STORE_RESPONSE';
    hasPasscodeSet: '';
  };
  'eventsCausingDelays': {};
  'matchesStates':
    | 'init'
    | 'savingDefaults'
    | 'checkingAuth'
    | 'settingUp'
    | 'unauthorized'
    | 'authorized';
  'tags': never;
}
