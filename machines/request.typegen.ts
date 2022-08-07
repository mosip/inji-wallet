// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    '': { type: '' };
    'xstate.after(CLEAR_DELAY)#clearingConnection': {
      type: 'xstate.after(CLEAR_DELAY)#clearingConnection';
    };
    'xstate.init': { type: 'xstate.init' };
    'xstate.stop': { type: 'xstate.stop' };
  };
  'invokeSrcNameMap': {
    advertiseDevice: 'done.invoke.waitingForConnection:invocation[0]';
    checkBluetoothService: 'done.invoke.request.checkingBluetoothService.checking:invocation[0]';
    exchangeDeviceInfo: 'done.invoke.request.exchangingDeviceInfo:invocation[0]';
    receiveVc: 'done.invoke.request.waitingForVc:invocation[0]';
    requestBluetooth: 'done.invoke.request.checkingBluetoothService.requesting:invocation[0]';
    sendVcResponse:
      | 'done.invoke.accepted:invocation[0]'
      | 'done.invoke.request.reviewing.rejected:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    disconnect:
      | ''
      | 'DISMISS'
      | 'GOBACK'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop';
    generateConnectionParams:
      | 'DISMISS'
      | 'xstate.after(CLEAR_DELAY)#clearingConnection';
    logReceived: 'STORE_RESPONSE';
    mergeIncomingVc: 'STORE_RESPONSE';
    prependReceivedVc: 'VC_RESPONSE';
    registerLoggers: 'DISMISS' | 'xstate.after(CLEAR_DELAY)#clearingConnection';
    removeLoggers:
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.after(CLEAR_DELAY)#clearingConnection'
      | 'xstate.init';
    requestExistingVc: 'VC_RESPONSE';
    requestReceivedVcs: 'ACCEPT';
    requestReceiverInfo: 'CONNECTED';
    sendVcReceived: 'STORE_RESPONSE';
    setIncomingVc: 'VC_RECEIVED';
    setReceiverInfo: 'RECEIVE_DEVICE_INFO';
    setSenderInfo: 'EXCHANGE_DONE';
    storeVc: 'STORE_RESPONSE';
  };
  'eventsCausingServices': {
    advertiseDevice: 'DISMISS' | 'xstate.after(CLEAR_DELAY)#clearingConnection';
    checkBluetoothService: 'SCREEN_FOCUS';
    exchangeDeviceInfo: 'RECEIVE_DEVICE_INFO';
    receiveVc: 'EXCHANGE_DONE';
    requestBluetooth: 'BLUETOOTH_DISABLED';
    sendVcResponse: 'CANCEL' | 'REJECT' | 'STORE_RESPONSE';
  };
  'eventsCausingGuards': {
    hasExistingVc: 'VC_RESPONSE';
  };
  'eventsCausingDelays': {
    CLEAR_DELAY: '' | 'GOBACK';
  };
  'matchesStates':
    | 'bluetoothDenied'
    | 'checkingBluetoothService'
    | 'checkingBluetoothService.checking'
    | 'checkingBluetoothService.enabled'
    | 'checkingBluetoothService.requesting'
    | 'clearingConnection'
    | 'disconnected'
    | 'exchangingDeviceInfo'
    | 'inactive'
    | 'preparingToExchangeInfo'
    | 'reviewing'
    | 'reviewing.accepted'
    | 'reviewing.accepting'
    | 'reviewing.accepting.mergingIncomingVc'
    | 'reviewing.accepting.prependingReceivedVc'
    | 'reviewing.accepting.requestingExistingVc'
    | 'reviewing.accepting.requestingReceivedVcs'
    | 'reviewing.accepting.storingVc'
    | 'reviewing.idle'
    | 'reviewing.navigatingToHome'
    | 'reviewing.navigatingToTimeBasedRequest'
    | 'reviewing.rejected'
    | 'waitingForConnection'
    | 'waitingForVc'
    | {
        checkingBluetoothService?: 'checking' | 'enabled' | 'requesting';
        reviewing?:
          | 'accepted'
          | 'accepting'
          | 'idle'
          | 'navigatingToHome'
          | 'navigatingToTimeBasedRequest'
          | 'rejected'
          | {
              accepting?:
                | 'mergingIncomingVc'
                | 'prependingReceivedVc'
                | 'requestingExistingVc'
                | 'requestingReceivedVcs'
                | 'storingVc';
            };
      };
  'tags': never;
}
