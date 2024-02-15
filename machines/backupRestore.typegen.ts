// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.backupRestore.preload:invocation[0]': {
      type: 'done.invoke.backupRestore.preload:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]': {
      type: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backupRestore.restoreBackup.deleteBackupDir:invocation[0]': {
      type: 'done.invoke.backupRestore.restoreBackup.deleteBackupDir:invocation[0]';
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
    bootstrap: 'done.invoke.backupRestore.preload:invocation[0]';
    checkStorageAvailability: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
    deleteBkpDir: 'done.invoke.backupRestore.restoreBackup.deleteBackupDir:invocation[0]';
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
    downloadUnsyncedBackupFiles: 'DOWNLOAD_UNSYNCED_BACKUP_FILES';
    loadDataToMemory: 'DATA_FROM_FILE';
    refreshVCs: 'done.invoke.backupRestore.restoreBackup.deleteBackupDir:invocation[0]';
    sendDataRestoreFailureEvent:
      | 'STORE_ERROR'
      | 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
    sendDataRestoreStartEvent:
      | 'BACKUP_RESTORE'
      | 'EXTRACT_DATA'
      | 'done.invoke.backupRestore.preload:invocation[0]';
    sendDataRestoreSuccessEvent: 'done.invoke.backupRestore.restoreBackup.deleteBackupDir:invocation[0]';
    setBackupFileName: 'done.invoke.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]';
    setDataFromBackupFile: 'DATA_FROM_FILE';
    setRestoreErrorReason:
      | 'error.platform.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]'
      | 'error.platform.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
    setRestoreTechnicalError:
      | 'STORE_ERROR'
      | 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isBackupFile: 'done.invoke.backupRestore.preload:invocation[0]';
    isMinimumStorageRequiredForBackupRestorationReached: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
  };
  eventsCausingServices: {
    bootstrap: 'xstate.init';
    checkStorageAvailability:
      | 'BACKUP_RESTORE'
      | 'EXTRACT_DATA'
      | 'done.invoke.backupRestore.preload:invocation[0]';
    deleteBkpDir: 'STORE_RESPONSE';
    downloadLatestBackup: 'done.invoke.backupRestore.restoreBackup.checkStorageAvailability:invocation[0]';
    readBackupFile:
      | 'done.invoke.backupRestore.preload:invocation[0]'
      | 'done.invoke.backupRestore.restoreBackup.unzipBackupFile:invocation[0]';
    unzipBackupFile: 'done.invoke.backupRestore.restoreBackup.downloadBackupFileFromCloud:invocation[0]';
  };
  matchesStates:
    | 'init'
    | 'preload'
    | 'restoreBackup'
    | 'restoreBackup.checkStorageAvailability'
    | 'restoreBackup.deleteBackupDir'
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
          | 'deleteBackupDir'
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
