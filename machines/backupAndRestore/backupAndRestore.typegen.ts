// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.backupAndRestore.checkInternet:invocation[0]': {
      type: 'done.invoke.backupAndRestore.checkInternet:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.backupAndRestore.checkSignIn:invocation[0]': {
      type: 'done.invoke.backupAndRestore.checkSignIn:invocation[0]';
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
    checkInternet: 'done.invoke.backupAndRestore.checkInternet:invocation[0]';
    isUserSignedAlready: 'done.invoke.backupAndRestore.checkSignIn:invocation[0]';
    signIn: 'done.invoke.signIn:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    setIsLoading: 'HANDLE_BACKUP_AND_RESTORE';
    setNoInternet: 'done.invoke.backupAndRestore.checkInternet:invocation[0]';
    setProfileInfo:
      | 'done.invoke.backupAndRestore.checkSignIn:invocation[0]'
      | 'done.invoke.signIn:invocation[0]';
    unsetIsLoading: 'done.invoke.backupAndRestore.checkSignIn:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isInternetConnected: 'done.invoke.backupAndRestore.checkInternet:invocation[0]';
    isSignInSuccessful: 'done.invoke.signIn:invocation[0]';
    isSignedIn: 'done.invoke.backupAndRestore.checkSignIn:invocation[0]';
  };
  eventsCausingServices: {
    checkInternet: 'PROCEED' | 'TRY_AGAIN';
    isUserSignedAlready: 'HANDLE_BACKUP_AND_RESTORE';
    signIn: 'done.invoke.backupAndRestore.checkInternet:invocation[0]';
  };
  matchesStates:
    | 'backupAndRestore'
    | 'checkInternet'
    | 'checkSignIn'
    | 'init'
    | 'noInternet'
    | 'selectCloudAccount'
    | 'signIn'
    | 'signIn.error'
    | 'signIn.idle'
    | {signIn?: 'error' | 'idle'};
  tags: never;
}
