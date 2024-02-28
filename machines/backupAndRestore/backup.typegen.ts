// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]': {
      type: 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backup.backingUp.uploadBackupFile:invocation[0]': {
      type: 'done.invoke.backup.backingUp.uploadBackupFile:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backup.backingUp.zipBackupFile:invocation[0]': {
      type: 'done.invoke.backup.backingUp.zipBackupFile:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backup.fetchLastBackupDetails:invocation[0]': {
      type: 'done.invoke.backup.fetchLastBackupDetails:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.backup.backingUp.checkStorageAvailability:invocation[0]': {
      type: 'error.platform.backup.backingUp.checkStorageAvailability:invocation[0]';
      data: unknown;
    };
    'error.platform.backup.backingUp.uploadBackupFile:invocation[0]': {
      type: 'error.platform.backup.backingUp.uploadBackupFile:invocation[0]';
      data: unknown;
    };
    'error.platform.backup.backingUp.zipBackupFile:invocation[0]': {
      type: 'error.platform.backup.backingUp.zipBackupFile:invocation[0]';
      data: unknown;
    };
    'error.platform.backup.fetchLastBackupDetails:invocation[0]': {
      type: 'error.platform.backup.fetchLastBackupDetails:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkStorageAvailability: 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]';
    getLastBackupDetailsFromCloud: 'done.invoke.backup.fetchLastBackupDetails:invocation[0]';
    uploadBackupFile: 'done.invoke.backup.backingUp.uploadBackupFile:invocation[0]';
    writeDataToFile: 'done.invoke.backup.backingUp.writeDataToFile:invocation[0]';
    zipBackupFile: 'done.invoke.backup.backingUp.zipBackupFile:invocation[0]';
  };
  missingImplementations: {
    actions: 'unsetShowBackupInProgress';
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    cleanupFiles:
      | 'STORE_ERROR'
      | 'STORE_RESPONSE'
      | 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.backup.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.backup.backingUp.uploadBackupFile:invocation[0]'
      | 'error.platform.backup.backingUp.zipBackupFile:invocation[0]';
    extractLastBackupDetails: 'done.invoke.backup.backingUp.uploadBackupFile:invocation[0]';
    fetchAllDataFromDB: 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]';
    loadVcs: 'DATA_BACKUP';
    sendDataBackupFailureEvent:
      | 'STORE_ERROR'
      | 'STORE_RESPONSE'
      | 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.backup.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.backup.backingUp.uploadBackupFile:invocation[0]'
      | 'error.platform.backup.backingUp.zipBackupFile:invocation[0]';
    sendDataBackupStartEvent: 'DATA_BACKUP';
    sendDataBackupSuccessEvent: 'STORE_RESPONSE';
    setBackUpNotPossible:
      | 'STORE_RESPONSE'
      | 'error.platform.backup.backingUp.checkStorageAvailability:invocation[0]';
    setBackupErrorReason:
      | 'STORE_ERROR'
      | 'error.platform.backup.backingUp.uploadBackupFile:invocation[0]';
    setDataFromStorage: 'STORE_RESPONSE';
    setErrorReasonAsStorageLimitReached: 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]';
    setFileName: 'FILE_NAME';
    setIsAutoBackup: 'DATA_BACKUP';
    setLastBackupDetails: 'done.invoke.backup.fetchLastBackupDetails:invocation[0]';
    storeLastBackupDetails: 'done.invoke.backup.backingUp.uploadBackupFile:invocation[0]';
    unsetIsLoading:
      | 'done.invoke.backup.fetchLastBackupDetails:invocation[0]'
      | 'error.platform.backup.fetchLastBackupDetails:invocation[0]';
    unsetLastBackupDetails: 'LAST_BACKUP_DETAILS';
    unsetShowBackupInProgress:
      | 'STORE_ERROR'
      | 'STORE_RESPONSE'
      | 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.backup.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.backup.backingUp.uploadBackupFile:invocation[0]'
      | 'error.platform.backup.backingUp.zipBackupFile:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    checkIfAutoBackup:
      | 'STORE_ERROR'
      | 'STORE_RESPONSE'
      | 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.backup.backingUp.checkStorageAvailability:invocation[0]'
      | 'error.platform.backup.backingUp.uploadBackupFile:invocation[0]'
      | 'error.platform.backup.backingUp.zipBackupFile:invocation[0]';
    isMinimumStorageRequiredForBackupAvailable: 'done.invoke.backup.backingUp.checkStorageAvailability:invocation[0]';
    isVCFound: 'STORE_RESPONSE';
  };
  eventsCausingServices: {
    checkStorageAvailability: 'STORE_RESPONSE';
    getLastBackupDetailsFromCloud: 'LAST_BACKUP_DETAILS';
    uploadBackupFile: 'done.invoke.backup.backingUp.zipBackupFile:invocation[0]';
    writeDataToFile: 'STORE_RESPONSE';
    zipBackupFile: 'FILE_NAME';
  };
  matchesStates:
    | 'backingUp'
    | 'backingUp.checkDataAvailabilityForBackup'
    | 'backingUp.checkStorageAvailability'
    | 'backingUp.failure'
    | 'backingUp.fetchDataFromDB'
    | 'backingUp.idle'
    | 'backingUp.silentFailure'
    | 'backingUp.silentSuccess'
    | 'backingUp.success'
    | 'backingUp.uploadBackupFile'
    | 'backingUp.writeDataToFile'
    | 'backingUp.zipBackupFile'
    | 'fetchLastBackupDetails'
    | 'init'
    | {
        backingUp?:
          | 'checkDataAvailabilityForBackup'
          | 'checkStorageAvailability'
          | 'failure'
          | 'fetchDataFromDB'
          | 'idle'
          | 'silentFailure'
          | 'silentSuccess'
          | 'success'
          | 'uploadBackupFile'
          | 'writeDataToFile'
          | 'zipBackupFile';
      };
  tags: never;
}
