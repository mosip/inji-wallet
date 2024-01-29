// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
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
    setProfileInfo:
      | 'done.invoke.backupAndRestore.checkSignIn:invocation[0]'
      | 'done.invoke.signIn:invocation[0]';
    unsetIsLoading: 'done.invoke.backupAndRestore.checkSignIn:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isSignInSuccessful: 'done.invoke.signIn:invocation[0]';
    isSignedIn: 'done.invoke.backupAndRestore.checkSignIn:invocation[0]';
  };
  eventsCausingServices: {
    isUserSignedAlready: 'HANDLE_BACKUP_AND_RESTORE';
    signIn: 'PROCEED';
  };
  matchesStates:
    | 'backupAndRestore'
    | 'checkSignIn'
    | 'init'
    | 'selectCloudAccount'
    | 'signIn'
    | 'signIn.error'
    | 'signIn.idle'
    | {signIn?: 'error' | 'idle'};
  tags: never;
}
