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
    'xstate.after(CONNECTION_TIMEOUT)#request.exchangingDeviceInfo.inProgress': {
      type: 'xstate.after(CONNECTION_TIMEOUT)#request.exchangingDeviceInfo.inProgress';
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
    exchangeDeviceInfo: 'done.invoke.request.exchangingDeviceInfo:invocation[0]';
    monitorConnection: 'done.invoke.request:invocation[0]';
    receiveVc: 'done.invoke.request.waitingForVc:invocation[0]';
    requestBluetooth: 'done.invoke.request.checkingBluetoothService.requesting:invocation[0]';
    requestNearByDevicesPermission: 'done.invoke.request.checkNearbyDevicesPermission.requesting:invocation[0]';
    sendDisconnect: 'done.invoke.request.cancelling:invocation[0]';
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
      | 'SWITCH_PROTOCOL'
      | 'xstate.stop';
    generateConnectionParams:
      | 'CONNECTION_DESTROYED'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#request.clearingConnection';
    logReceived: 'CANCEL' | 'REJECT' | 'STORE_ERROR' | 'STORE_RESPONSE';
    mergeIncomingVc: 'STORE_RESPONSE';
    openAppPermission: 'GOTO_SETTINGS';
    prependReceivedVc: 'VC_RESPONSE';
    registerLoggers:
      | 'CONNECTION_DESTROYED'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#request.clearingConnection';
    removeLoggers:
      | 'CONNECTION_DESTROYED'
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
    requestReceiverInfo: 'CONNECTED';
    sendVcReceived: 'STORE_RESPONSE';
    setBleError: 'BLE_ERROR';
    setIncomingVc: 'VC_RECEIVED';
    setReadyForBluetoothStateCheck: 'NEARBY_ENABLED';
    setReceiveLogTypeDiscarded: 'CANCEL' | 'REJECT' | 'STORE_ERROR';
    setReceiveLogTypeRegular: 'ACCEPT' | 'STORE_RESPONSE';
    setReceiveLogTypeUnverified: 'FACE_INVALID';
    setReceiveLogTypeVerified: 'FACE_VALID';
    setReceiverInfo: 'RECEIVE_DEVICE_INFO';
    setSenderInfo: 'EXCHANGE_DONE';
    setStoringError: 'STORE_ERROR';
    storeVc: 'STORE_RESPONSE';
    switchProtocol: 'SWITCH_PROTOCOL';
  };
  'eventsCausingDelays': {
    CONNECTION_TIMEOUT: 'RECEIVE_DEVICE_INFO';
    DESTROY_TIMEOUT: '' | 'DISMISS';
    SHARING_TIMEOUT: 'EXCHANGE_DONE';
  };
  'eventsCausingGuards': {
    hasExistingVc: 'VC_RESPONSE';
  };
  'eventsCausingServices': {
    advertiseDevice:
      | 'CONNECTION_DESTROYED'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#request.clearingConnection';
    checkBluetoothService: 'NEARBY_ENABLED';
    checkNearByDevicesPermission:
      | 'APP_ACTIVE'
      | 'RESET'
      | 'SCREEN_FOCUS'
      | 'SWITCH_PROTOCOL';
    disconnect: '' | 'DISMISS' | 'GO_TO_RECEIVED_VC_TAB';
    exchangeDeviceInfo: 'RECEIVE_DEVICE_INFO';
    monitorConnection: 'xstate.init';
    receiveVc: 'EXCHANGE_DONE';
    requestBluetooth: 'BLUETOOTH_STATE_DISABLED';
    requestNearByDevicesPermission: 'NEARBY_DISABLED';
    sendDisconnect: 'CANCEL';
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
    | 'exchangingDeviceInfo'
    | 'exchangingDeviceInfo.inProgress'
    | 'exchangingDeviceInfo.timeout'
    | 'handlingBleError'
    | 'inactive'
    | 'nearByDevicesPermissionDenied'
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
        exchangingDeviceInfo?: 'inProgress' | 'timeout';
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
