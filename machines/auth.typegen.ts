// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
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
  'eventsCausingActions': {
    requestStoredContext: 'xstate.init';
    setBiometrics: 'SETUP_BIOMETRICS';
    setContext: 'STORE_RESPONSE';
    setPasscode: 'SETUP_PASSCODE';
    storeContext: 'SETUP_BIOMETRICS' | 'SETUP_PASSCODE' | 'STORE_RESPONSE';
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {
    hasBiometricSet: '';
    hasData: 'STORE_RESPONSE';
    hasPasscodeSet: '';
  };
  'eventsCausingDelays': {};
  'matchesStates':
    | 'authorized'
    | 'checkingAuth'
    | 'init'
    | 'savingDefaults'
    | 'settingUp'
    | 'unauthorized';
  'tags': never;
}
