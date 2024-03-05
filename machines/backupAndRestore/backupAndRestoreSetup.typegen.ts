// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.backupAndRestoreSetup.checkInternet:invocation[0]': {
      type: 'done.invoke.backupAndRestoreSetup.checkInternet:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]': {
      type: 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.signIn:invocation[0]': {
      type: 'done.invoke.signIn:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkInternet: 'done.invoke.backupAndRestoreSetup.checkInternet:invocation[0]';
    isUserSignedAlready: 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]';
    signIn: 'done.invoke.signIn:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    fetchShowConfirmationInfo: 'HANDLE_BACKUP_AND_RESTORE';
    openSettings: 'OPEN_SETTINGS';
    sendBackupAndRestoreSetupCancelEvent: 'DISMISS' | 'GO_BACK';
    sendBackupAndRestoreSetupErrorEvent: 'done.invoke.signIn:invocation[0]';
    sendBackupAndRestoreSetupSuccessEvent:
      | 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]'
      | 'done.invoke.signIn:invocation[0]';
    sendDataBackupAndRestoreSetupStartEvent: 'HANDLE_BACKUP_AND_RESTORE';
    setAccountSelectionConfirmationShown:
      | 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]'
      | 'done.invoke.signIn:invocation[0]';
    setErrorReasonAsAccountRequired: 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]';
    setIsLoading: 'HANDLE_BACKUP_AND_RESTORE' | 'PROCEED';
    setNoInternet: 'done.invoke.backupAndRestoreSetup.checkInternet:invocation[0]';
    setProfileInfo:
      | 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]'
      | 'done.invoke.signIn:invocation[0]';
    setShouldTriggerAutoBackup: 'done.invoke.signIn:invocation[0]';
    setShowConfirmation: 'STORE_RESPONSE';
    unsetIsLoading:
      | 'DISMISS'
      | 'STORE_RESPONSE'
      | 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]';
    unsetShouldTriggerAutoBackup: 'HANDLE_BACKUP_AND_RESTORE';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isConfirmationAlreadyShown: 'STORE_RESPONSE';
    isIOS: 'done.invoke.signIn:invocation[0]';
    isInternetConnected: 'done.invoke.backupAndRestoreSetup.checkInternet:invocation[0]';
    isNetworkError: 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]';
    isNotSignedInIOS: 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]';
    isNotSignedInIOSAndViaConfirmationFlow: 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]';
    isSignInSuccessful: 'done.invoke.signIn:invocation[0]';
    isSignedIn: 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]';
  };
  eventsCausingServices: {
    checkInternet: 'TRY_AGAIN';
    isUserSignedAlready: 'PROCEED' | 'STORE_RESPONSE';
    signIn:
      | 'done.invoke.backupAndRestoreSetup.checkInternet:invocation[0]'
      | 'done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]';
  };
  matchesStates:
    | 'backupAndRestore'
    | 'checkInternet'
    | 'checkSignIn'
    | 'checkSignIn.error'
    | 'checkSignIn.idle'
    | 'fetchShowConfirmationInfo'
    | 'init'
    | 'noInternet'
    | 'selectCloudAccount'
    | 'signIn'
    | 'signIn.error'
    | 'signIn.idle'
    | {checkSignIn?: 'error' | 'idle'; signIn?: 'error' | 'idle'};
  tags: never;
}
