// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]': {
      type: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]': {
      type: 'done.invoke.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backupRestore.restoreBackup.unzipBackupFile:invocation[0]': {
      type: 'done.invoke.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]': {
      type: 'error.platform.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]';
      data: unknown;
    };
    'error.platform.backupRestore.restoreBackup.unzipBackupFile:invocation[0]': {
      type: 'error.platform.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkStorageAvailability: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
    downloadLatestBackup: 'done.invoke.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]';
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
    cleanupFiles:
      | 'STORE_ERROR'
      | 'STORE_RESPONSE'
      | 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
    downloadUnsyncedBackupFiles: 'DOWNLOAD_UNSYNCED_BACKUP_FILES';
    loadDataToMemory: 'DATA_FROM_FILE';
    refreshVCs: 'STORE_RESPONSE';
    sendDataRestoreFailureEvent:
      | 'STORE_ERROR'
      | 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
    sendDataRestoreStartEvent: 'BACKUP_RESTORE';
    sendDataRestoreSuccessEvent: 'STORE_RESPONSE';
    setBackupFileName: 'done.invoke.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]';
    setDataFromBackupFile: 'DATA_FROM_FILE';
    setRestoreErrorReason:
      | 'error.platform.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
    setRestoreTechnicalError:
      | 'STORE_ERROR'
      | 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
    setShowRestoreInProgress: 'BACKUP_RESTORE';
    unsetShowRestoreInProgress:
      | 'DISMISS_SHOW_RESTORE_IN_PROGRESS'
      | 'STORE_ERROR'
      | 'STORE_RESPONSE'
      | 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isMinimumStorageRequiredForBackupRestorationReached: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
  };
  eventsCausingServices: {
    checkStorageAvailability: 'BACKUP_RESTORE';
    downloadLatestBackup: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
    readBackupFile: 'done.invoke.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
    unzipBackupFile: 'done.invoke.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]';
  };
  matchesStates:
    | 'init'
    | 'restoreBackup'
    | 'restoreBackup.checkStorageAvailability'
    | 'restoreBackup.downloadBackupFileFromCloud'
    | 'restoreBackup.failure'
    | 'restoreBackup.idle'
    | 'restoreBackup.loadDataToMemory'
    | 'restoreBackup.readBackupFile'
    | 'restoreBackup.success'
    | 'restoreBackup.unzipBackupFile'
    | {
        restoreBackup?:
          | 'checkStorageAvailability'
          | 'downloadBackupFileFromCloud'
          | 'failure'
          | 'idle'
          | 'loadDataToMemory'
          | 'readBackupFile'
          | 'success'
          | 'unzipBackupFile';
      };
  tags: never;
}
