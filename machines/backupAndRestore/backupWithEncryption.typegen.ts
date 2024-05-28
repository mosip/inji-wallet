// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.WithEncryption.backingUp.checkStorageAvailability:invocation[0]': {
      type: 'done.invoke.WithEncryption.backingUp.checkStorageAvailability:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.WithEncryption.backingUp.zipBackupFile:invocation[0]': {
      type: 'done.invoke.WithEncryption.backingUp.zipBackupFile:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.WithEncryption.hashKey:invocation[0]': {
      type: 'done.invoke.WithEncryption.hashKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.WithEncryption.backingUp.zipBackupFile:invocation[0]': {
      type: 'error.platform.WithEncryption.backingUp.zipBackupFile:invocation[0]';
      data: unknown;
    };
    'error.platform.WithEncryption.requestOtp:invocation[0]': {
      type: 'error.platform.WithEncryption.requestOtp:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkStorageAvailability: 'done.invoke.WithEncryption.backingUp.checkStorageAvailability:invocation[0]';
    hashEncKey: 'done.invoke.WithEncryption.hashKey:invocation[0]';
    requestOtp: 'done.invoke.WithEncryption.requestOtp:invocation[0]';
    writeDataToFile: 'done.invoke.WithEncryption.backingUp.writeDataToFile:invocation[0]';
    zipBackupFile: 'done.invoke.WithEncryption.backingUp.zipBackupFile:invocation[0]';
  };
  missingImplementations: {
    actions:
      | ''
      | 'sendDataBackupFailureEvent'
      | 'sendDataBackupStartEvent'
      | 'sendDataBackupSuccessEvent'
      | 'setFileName';
    delays: never;
    guards: 'isMinimumStorageRequiredForBackupReached';
    services: 'checkStorageAvailability' | 'requestOtp';
  };
  eventsCausingActions: {
    '': 'error.platform.WithEncryption.requestOtp:invocation[0]';
    fetchAllDataFromDB: 'done.invoke.WithEncryption.backingUp.checkStorageAvailability:invocation[0]';
    sendDataBackupFailureEvent:
      | 'done.invoke.WithEncryption.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.WithEncryption.backingUp.zipBackupFile:invocation[0]';
    sendDataBackupStartEvent: 'STORE_RESPONSE';
    sendDataBackupSuccessEvent: 'done.invoke.WithEncryption.backingUp.zipBackupFile:invocation[0]';
    setBaseEncKey: 'SET_BASE_ENC_KEY';
    setDataFromStorage: 'STORE_RESPONSE';
    setFileName: 'FILE_NAME';
    setHashedKey: 'done.invoke.WithEncryption.hashKey:invocation[0]';
    setOtp: 'INPUT_OTP';
    storeHashedEncKey: 'done.invoke.WithEncryption.hashKey:invocation[0]';
    storePasswordKeyType: 'SET_BASE_ENC_KEY';
    storePhoneNumberKeyType: 'INPUT_OTP';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isMinimumStorageRequiredForBackupReached: 'done.invoke.WithEncryption.backingUp.checkStorageAvailability:invocation[0]';
  };
  eventsCausingServices: {
    checkStorageAvailability: 'STORE_RESPONSE';
    hashEncKey: 'INPUT_OTP' | 'STORE_RESPONSE';
    requestOtp: 'SEND_OTP';
    writeDataToFile: 'STORE_RESPONSE';
    zipBackupFile: 'FILE_NAME';
  };
  matchesStates:
    | 'backUp'
    | 'backingUp'
    | 'backingUp.checkStorageAvailability'
    | 'backingUp.failure'
    | 'backingUp.fetchDataFromDB'
    | 'backingUp.idle'
    | 'backingUp.success'
    | 'backingUp.writeDataToFile'
    | 'backingUp.zipBackupFile'
    | 'hashKey'
    | 'init'
    | 'passwordBackup'
    | 'phoneNumberBackup'
    | 'requestOtp'
    | 'selectPref'
    | {
        backingUp?:
          | 'checkStorageAvailability'
          | 'failure'
          | 'fetchDataFromDB'
          | 'idle'
          | 'success'
          | 'writeDataToFile'
          | 'zipBackupFile';
      };
  tags: never;
}
