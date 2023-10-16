
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.AddVcModal": { type: "done.invoke.AddVcModal"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.GetVcModal": { type: "done.invoke.GetVcModal"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.MyVcsTab.addVc.checkNetwork:invocation[0]": { type: "done.invoke.MyVcsTab.addVc.checkNetwork:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.MyVcsTab.addVc.checkStorage:invocation[0]": { type: "done.invoke.MyVcsTab.addVc.checkStorage:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "checkNetworkStatus": "done.invoke.MyVcsTab.addVc.checkNetwork:invocation[0]";
"checkStorageAvailability": "done.invoke.MyVcsTab.addVc.checkStorage:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "resetStoringVcItemStatus": "RESET_STORE_VC_ITEM_STATUS";
"sendVcAdded": "STORE_RESPONSE";
"setStoringVcItemStatus": "SET_STORE_VC_ITEM_STATUS" | "STORE_RESPONSE";
"storeVcItem": "done.invoke.AddVcModal";
"viewVcFromParent": "VIEW_VC";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isMinimumStorageLimitReached": "done.invoke.MyVcsTab.addVc.checkStorage:invocation[0]";
"isNetworkOn": "done.invoke.MyVcsTab.addVc.checkNetwork:invocation[0]";
        };
        eventsCausingServices: {
          "AddVcModal": "done.invoke.GetVcModal" | "done.invoke.MyVcsTab.addVc.checkStorage:invocation[0]";
"GetVcModal": "GET_VC";
"checkNetworkStatus": "ADD_VC" | "TRY_AGAIN";
"checkStorageAvailability": "done.invoke.MyVcsTab.addVc.checkNetwork:invocation[0]";
        };
        matchesStates: "addVc" | "addVc.checkNetwork" | "addVc.checkStorage" | "addVc.networkOff" | "addVc.storageLimitReached" | "addingVc" | "addingVc.savingFailed" | "addingVc.savingFailed.idle" | "addingVc.storing" | "addingVc.waitingForvcKey" | "gettingVc" | "gettingVc.waitingForvcKey" | "idle" | "viewingVc" | { "addVc"?: "checkNetwork" | "checkStorage" | "networkOff" | "storageLimitReached";
"addingVc"?: "savingFailed" | "storing" | "waitingForvcKey" | { "savingFailed"?: "idle"; };
"gettingVc"?: "waitingForvcKey"; };
        tags: never;
      }
  