// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    '': { type: '' };
    'done.invoke.request.reviewing.verifyingVp:invocation[0]': {
      type: 'done.invoke.request.reviewing.verifyingVp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.after(DESTROY_TIMEOUT)#request.clearingConnection': {
      type: 'xstate.after(DESTROY_TIMEOUT)#request.clearingConnection';
    };
    'xstate.after(SHARING_TIMEOUT)#request.waitingForVc.inProgress': {
      type: 'xstate.after(SHARING_TIMEOUT)#request.waitingForVc.inProgress';
    };
    'xstate.init': { type: 'xstate.init' };
    'xstate.stop': { type: 'xstate.stop' };
  };
  'invokeSrcNameMap': {
    advertiseDevice: 'done.invoke.request.waitingForConnection:invocation[0]';
    checkBluetoothService: 'done.invoke.request.checkingBluetoothService.checking:invocation[0]';
    checkNearByDevicesPermission: 'done.invoke.request.checkNearbyDevicesPermission.checking:invocation[0]';
    disconnect:
      | 'done.invoke.request.clearingConnection:invocation[0]'
      | 'done.invoke.request.reviewing.navigatingToHome:invocation[0]';
    monitorConnection: 'done.invoke.request:invocation[0]';
    receiveVc: 'done.invoke.request.waitingForVc:invocation[0]';
    requestBluetooth: 'done.invoke.request.checkingBluetoothService.requesting:invocation[0]';
    requestNearByDevicesPermission: 'done.invoke.request.checkNearbyDevicesPermission.requesting:invocation[0]';
    sendVcResponse:
      | 'done.invoke.request.reviewing.accepted:invocation[0]'
      | 'done.invoke.request.reviewing.rejected:invocation[0]'
      | 'done.invoke.request.reviewing.savingFailed:invocation[0]';
    verifyVp: 'done.invoke.request.reviewing.verifyingVp:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    clearShouldVerifyPresence:
      | 'ACCEPT'
      | 'BLE_ERROR'
      | 'CANCEL'
      | 'FACE_INVALID'
      | 'FACE_VALID'
      | 'REJECT'
      | 'RESET'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop';
    logReceived: 'CANCEL' | 'REJECT' | 'STORE_ERROR' | 'STORE_RESPONSE';
    mergeIncomingVc: 'STORE_RESPONSE';
    openAppPermission: 'GOTO_SETTINGS';
    prependReceivedVc: 'VC_RESPONSE';
    registerLoggers:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#request.clearingConnection';
    removeLoggers:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'xstate.after(DESTROY_TIMEOUT)#request.clearingConnection'
      | 'xstate.init';
    requestExistingVc: 'VC_RESPONSE';
    requestReceivedVcs:
      | 'ACCEPT'
      | 'DISMISS'
      | 'FACE_VALID'
      | 'VC_RECEIVED'
      | 'done.invoke.request.reviewing.verifyingVp:invocation[0]';
    sendVcReceived: 'STORE_RESPONSE';
    setBleError: 'BLE_ERROR';
    setIncomingVc: 'VC_RECEIVED';
    setOpenID4VpUri: 'ADV_STARTED';
    setReadyForBluetoothStateCheck: 'NEARBY_ENABLED';
    setReceiveLogTypeDiscarded: 'CANCEL' | 'REJECT' | 'STORE_ERROR';
    setReceiveLogTypeRegular: 'ACCEPT' | 'STORE_RESPONSE';
    setReceiveLogTypeUnverified: 'FACE_INVALID';
    setReceiveLogTypeVerified: 'FACE_VALID';
    setReceiverInfo: 'CONNECTED';
    setSenderInfo: 'CONNECTED';
    setStoringError: 'STORE_ERROR';
    storeVc: 'STORE_RESPONSE';
  };
  'eventsCausingDelays': {
    DESTROY_TIMEOUT: '' | 'DISMISS';
    SHARING_TIMEOUT: 'CONNECTED';
  };
  'eventsCausingGuards': {
    hasExistingVc: 'VC_RESPONSE';
  };
  'eventsCausingServices': {
    advertiseDevice:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#request.clearingConnection';
    checkBluetoothService: 'NEARBY_ENABLED';
    checkNearByDevicesPermission: 'APP_ACTIVE' | 'RESET' | 'SCREEN_FOCUS';
    disconnect: '' | 'DISMISS' | 'GO_TO_RECEIVED_VC_TAB';
    monitorConnection: 'xstate.init';
    receiveVc: 'CONNECTED';
    requestBluetooth: 'BLUETOOTH_STATE_DISABLED';
    requestNearByDevicesPermission: 'NEARBY_DISABLED';
    sendVcResponse: 'CANCEL' | 'REJECT' | 'STORE_ERROR' | 'STORE_RESPONSE';
    verifyVp: never;
  };
  'matchesStates':
    | 'bluetoothDenied'
    | 'cancelling'
    | 'checkNearbyDevicesPermission'
    | 'checkNearbyDevicesPermission.checking'
    | 'checkNearbyDevicesPermission.requesting'
    | 'checkingBluetoothService'
    | 'checkingBluetoothService.checking'
    | 'checkingBluetoothService.enabled'
    | 'checkingBluetoothService.requesting'
    | 'clearingConnection'
    | 'disconnected'
    | 'handlingBleError'
    | 'inactive'
    | 'nearByDevicesPermissionDenied'
    | 'reviewing'
    | 'reviewing.accepted'
    | 'reviewing.accepting'
    | 'reviewing.accepting.mergingIncomingVc'
    | 'reviewing.accepting.prependingReceivedVc'
    | 'reviewing.accepting.requestingExistingVc'
    | 'reviewing.accepting.requestingReceivedVcs'
    | 'reviewing.accepting.storingVc'
    | 'reviewing.idle'
    | 'reviewing.invalidIdentity'
    | 'reviewing.navigatingToHome'
    | 'reviewing.rejected'
    | 'reviewing.savingFailed'
    | 'reviewing.savingFailed.idle'
    | 'reviewing.savingFailed.viewingVc'
    | 'reviewing.verifyingIdentity'
    | 'reviewing.verifyingVp'
    | 'waitingForConnection'
    | 'waitingForVc'
    | 'waitingForVc.inProgress'
    | 'waitingForVc.timeout'
    | {
        checkNearbyDevicesPermission?: 'checking' | 'requesting';
        checkingBluetoothService?: 'checking' | 'enabled' | 'requesting';
        reviewing?:
          | 'accepted'
          | 'accepting'
          | 'idle'
          | 'invalidIdentity'
          | 'navigatingToHome'
          | 'rejected'
          | 'savingFailed'
          | 'verifyingIdentity'
          | 'verifyingVp'
          | {
              accepting?:
                | 'mergingIncomingVc'
                | 'prependingReceivedVc'
                | 'requestingExistingVc'
                | 'requestingReceivedVcs'
                | 'storingVc';
              savingFailed?: 'idle' | 'viewingVc';
            };
        waitingForVc?: 'inProgress' | 'timeout';
      };
  'tags': never;
}
