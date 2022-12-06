
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.QrLogin.linkTransaction:invocation[0]": { type: "done.invoke.QrLogin.linkTransaction:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "linkTransaction": "done.invoke.QrLogin.linkTransaction:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "loadMyVcs": "CONFIRM" | "done.invoke.QrLogin.linkTransaction:invocation[0]";
"setMyVcs": "STORE_RESPONSE";
"setScanData": "SCANNING_DONE";
"setSelectedVc": "SELECT_VC";
"setlinkTransactionResponse": "done.invoke.QrLogin.linkTransaction:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "linkTransaction": never;
        };
        matchesStates: "done" | "faceAuth" | "idle" | "invalidIdentity" | "linkTransaction" | "loadMyVcs" | "requestConsent" | "showWarning" | "showvcList";
        tags: never;
      }
  