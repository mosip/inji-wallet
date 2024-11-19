
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]": { type: "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.backupAndRestoreSetup.init.checkInternet:invocation[0]": { type: "done.invoke.backupAndRestoreSetup.init.checkInternet:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.signIn:invocation[0]": { type: "done.invoke.signIn:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.backupAndRestoreSetup.init.checkInternet:invocation[0]": { type: "error.platform.backupAndRestoreSetup.init.checkInternet:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "checkInternet": "done.invoke.backupAndRestoreSetup.init.checkInternet:invocation[0]";
"isUserSignedAlready": "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]";
"signIn": "done.invoke.signIn:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "fetchShowConfirmationInfo": "done.invoke.backupAndRestoreSetup.init.checkInternet:invocation[0]";
"openSettings": "OPEN_SETTINGS";
"sendBackupAndRestoreSetupCancelEvent": "DISMISS" | "GO_BACK";
"sendBackupAndRestoreSetupErrorEvent": "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]" | "done.invoke.backupAndRestoreSetup.init.checkInternet:invocation[0]" | "done.invoke.signIn:invocation[0]" | "error.platform.backupAndRestoreSetup.init.checkInternet:invocation[0]";
"sendBackupAndRestoreSetupSuccessEvent": "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]" | "done.invoke.signIn:invocation[0]";
"sendDataBackupAndRestoreSetupStartEvent": "HANDLE_BACKUP_AND_RESTORE";
"setAccountSelectionConfirmationShown": "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]" | "done.invoke.signIn:invocation[0]";
"setIsLoading": "HANDLE_BACKUP_AND_RESTORE" | "PROCEED" | "TRY_AGAIN";
"setProfileInfo": "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]" | "done.invoke.signIn:invocation[0]";
"setShouldTriggerAutoBackup": "done.invoke.signIn:invocation[0]";
"unsetIsLoading": "DISMISS" | "STORE_RESPONSE" | "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]" | "done.invoke.backupAndRestoreSetup.init.checkInternet:invocation[0]" | "error.platform.backupAndRestoreSetup.init.checkInternet:invocation[0]";
"unsetShouldTriggerAutoBackup": "HANDLE_BACKUP_AND_RESTORE";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isAuthorisedAndCloudAccessNotGiven": "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]";
"isConfirmationAlreadyShown": "STORE_RESPONSE";
"isIOSAndSignInFailed": "done.invoke.signIn:invocation[0]";
"isInternetConnected": "done.invoke.backupAndRestoreSetup.init.checkInternet:invocation[0]";
"isNetworkError": "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]" | "done.invoke.signIn:invocation[0]";
"isSignInSuccessful": "done.invoke.signIn:invocation[0]";
"isSignedIn": "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]";
        };
        eventsCausingServices: {
          "checkInternet": "HANDLE_BACKUP_AND_RESTORE" | "TRY_AGAIN";
"isUserSignedAlready": "PROCEED" | "STORE_RESPONSE";
"signIn": "done.invoke.backupAndRestoreSetup.checkSignIn:invocation[0]";
        };
        matchesStates: "backupAndRestore" | "checkSignIn" | "checkSignIn.error" | "checkSignIn.idle" | "checkSignIn.noInternet" | "fetchShowConfirmationInfo" | "init" | "init.checkInternet" | "init.idle" | "init.noInternet" | "selectCloudAccount" | "signIn" | "signIn.error" | "signIn.idle" | "signIn.noInternet" | { "checkSignIn"?: "error" | "idle" | "noInternet";
"init"?: "checkInternet" | "idle" | "noInternet";
"signIn"?: "error" | "idle" | "noInternet"; };
        tags: never;
      }
  