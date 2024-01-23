// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.backupRestore.restoreBackup.checkStorageAvailibility:invocation[0]': {
      type: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailibility:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backupRestore.restoreBackup.unzipBackupFile:invocation[0]': {
      type: 'done.invoke.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkStorageAvailability: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailibility:invocation[0]';
    readBackupFile: 'done.invoke.backupRestore.restoreBackup.readBackupFile:invocation[0]';
    unzipBackupFile: 'done.invoke.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    loadDataToMemory: 'DATA_FROM_FILE';
    setBackedUpFileName: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailibility:invocation[0]';
    setDataFromBackupFile: 'DATA_FROM_FILE';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isMinimumStorageRequiredForBackupRestorationReached: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailibility:invocation[0]';
  };
  eventsCausingServices: {
    checkStorageAvailability: 'EXTRACT_DATA';
    readBackupFile: 'done.invoke.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
    unzipBackupFile: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailibility:invocation[0]';
  };
  matchesStates:
    | 'init'
    | 'restoreBackup'
    | 'restoreBackup.checkStorageAvailibility'
    | 'restoreBackup.failure'
    | 'restoreBackup.idle'
    | 'restoreBackup.loadDataToMemory'
    | 'restoreBackup.readBackupFile'
    | 'restoreBackup.success'
    | 'restoreBackup.unzipBackupFile'
    | {
        restoreBackup?:
          | 'checkStorageAvailibility'
          | 'failure'
          | 'idle'
          | 'loadDataToMemory'
          | 'readBackupFile'
          | 'success'
          | 'unzipBackupFile';
      };
  tags: never;
}
