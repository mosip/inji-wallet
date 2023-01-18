
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]": { type: "done.invoke.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.AddVcModal.requestingCredential:invocation[0]": { type: "done.invoke.AddVcModal.requestingCredential:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]": { type: "error.platform.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]"; data: unknown };
"error.platform.AddVcModal.requestingCredential:invocation[0]": { type: "error.platform.AddVcModal.requestingCredential:invocation[0]"; data: unknown };
"xstate.after(100)#AddVcModal.acceptingIdInput.focusing": { type: "xstate.after(100)#AddVcModal.acceptingIdInput.focusing" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "requestCredential": "done.invoke.AddVcModal.requestingCredential:invocation[0]";
"requestOtp": "done.invoke.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "clearId": "SELECT_ID_TYPE";
"clearIdError": "INPUT_ID" | "VALIDATE_INPUT";
"clearOtp": "DISMISS" | "done.invoke.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]" | "error.platform.AddVcModal.requestingCredential:invocation[0]" | "xstate.init";
"focusInput": "INPUT_ID" | "SELECT_ID_TYPE" | "VALIDATE_INPUT" | "error.platform.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]" | "error.platform.AddVcModal.requestingCredential:invocation[0]" | "xstate.after(100)#AddVcModal.acceptingIdInput.focusing";
"forwardToParent": "DISMISS";
"resetIdInputRef": "DISMISS";
"setId": "INPUT_ID";
"setIdBackendError": "error.platform.AddVcModal.acceptingIdInput.requestingOtp:invocation[0]" | "error.platform.AddVcModal.requestingCredential:invocation[0]";
"setIdErrorEmpty": "VALIDATE_INPUT";
"setIdErrorWrongFormat": "VALIDATE_INPUT";
"setIdInputRef": "READY";
"setIdType": "SELECT_ID_TYPE";
"setOtp": "INPUT_OTP";
"setOtpError": "error.platform.AddVcModal.requestingCredential:invocation[0]";
"setRequestId": "done.invoke.AddVcModal.requestingCredential:invocation[0]";
"setTransactionId": "DISMISS" | "error.platform.AddVcModal.requestingCredential:invocation[0]" | "xstate.init";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isEmptyId": "VALIDATE_INPUT";
"isIdInvalid": "error.platform.AddVcModal.requestingCredential:invocation[0]";
"isWrongIdFormat": "VALIDATE_INPUT";
        };
        eventsCausingServices: {
          "requestCredential": "INPUT_OTP";
"requestOtp": "VALIDATE_INPUT";
        };
        matchesStates: "acceptingIdInput" | "acceptingIdInput.focusing" | "acceptingIdInput.idle" | "acceptingIdInput.invalid" | "acceptingIdInput.invalid.backend" | "acceptingIdInput.invalid.empty" | "acceptingIdInput.invalid.format" | "acceptingIdInput.rendering" | "acceptingIdInput.requestingOtp" | "acceptingOtpInput" | "done" | "requestingCredential" | { "acceptingIdInput"?: "focusing" | "idle" | "invalid" | "rendering" | "requestingOtp" | { "invalid"?: "backend" | "empty" | "format"; }; };
        tags: never;
      }
  