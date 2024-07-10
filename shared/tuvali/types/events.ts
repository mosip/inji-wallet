/* This file redefines the types from Native Modules to allow auto complete to the consumer applications,
  However this means, if the native module type definition changes, such changes needs to be applied here as well
  to avoid mismatch of type information
*/

export type CommonDataEvent =
  | ConnectedEvent
  | DisconnectedEvent
  | ErrorEvent
  | SecureChannelEstablished;

export type WalletDataEvent =
  | CommonDataEvent
  | VerificationStatusReceivedEvent
  | DataSentEvent;

export type VerifierDataEvent = CommonDataEvent | DataReceivedEvent;

export type ConnectedEvent = {type: EventTypes.onConnected};

export type SecureChannelEstablished = {
  type: EventTypes.onSecureChannelEstablished;
};

export type DataReceivedEvent = {
  type: EventTypes.onDataReceived;
  data: string;
  crcFailureCount: number;
  totalChunkCount: number;
};

export type DataSentEvent = {
  type: EventTypes.onDataSent;
};

export type VerificationStatusReceivedEvent = {
  type: EventTypes.onVerificationStatusReceived;
  status: VerificationStatus;
};

export type DisconnectedEvent = {
  type: EventTypes.onDisconnected;
};

export type ErrorEvent = {
  type: EventTypes.onError;
  message: string;
  code: string;
};

export enum EventTypes {
  onConnected = 'onConnected',
  onSecureChannelEstablished = 'onSecureChannelEstablished',
  onDataSent = 'onDataSent',
  onDataReceived = 'onDataReceived',
  onVerificationStatusReceived = 'onVerificationStatusReceived',
  onError = 'onError',
  onDisconnected = 'onDisconnected',
}

export enum VerificationStatus {
  ACCEPTED = 0,
  REJECTED = 1,
}
