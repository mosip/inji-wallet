import {StateFrom} from 'xstate';
import {scanMachine} from './scanMachine';
import {VCMetadata} from '../../../shared/VCMetadata';
import {getMosipLogo} from '../../../components/VC/common/VCUtils';

type State = StateFrom<typeof scanMachine>;

export function selectFlowType(state: State) {
  return state.context.flowType;
}

export function selectReceiverInfo(state: State) {
  return state.context.receiverInfo;
}

export function selectVcName(state: State) {
  return state.context.vcName;
}

export function selectCredential(state: State) {
  return (
    state.context.selectedVc?.verifiableCredential?.credential ||
    state.context.selectedVc?.verifiableCredential
  );
}

export function selectVerifiableCredentialData(state: State) {
  const vcMetadata = new VCMetadata(state.context.selectedVc?.vcMetadata);
  return {
    vcMetadata: vcMetadata,
    issuer: vcMetadata.issuer,
    issuerLogo:
      state.context.selectedVc?.verifiableCredential?.issuerLogo ||
      getMosipLogo(),
    face:
      state.context.selectedVc?.verifiableCredential?.credential
        ?.credentialSubject?.face ||
      state.context.selectedVc?.credential?.biometrics?.face,
    wellKnown: state.context.selectedVc?.verifiableCredential?.wellKnown,
    credentialTypes:
      state.context.selectedVc?.verifiableCredential?.credentialTypes,
  };
}

export function selectQrLoginRef(state: State) {
  return state.context.QrLoginRef;
}

export function selectIsScanning(state: State) {
  return state.matches('findingConnection');
}

export function selectIsQuickShareDone(state: State) {
  return state.matches('loadVCS.navigatingToHome');
}

export function selectShowQuickShareSuccessBanner(state: State) {
  return state.context.showQuickShareSuccessBanner;
}
export function selectIsConnecting(state: State) {
  return state.matches('connecting.inProgress');
}

export function selectIsConnectingTimeout(state: State) {
  return state.matches('connecting.timeout');
}

export function selectIsSelectingVc(state: State) {
  return state.matches('reviewing.selectingVc');
}

export function selectIsSendingVc(state: State) {
  return state.matches('reviewing.sendingVc.inProgress');
}

export function selectIsFaceIdentityVerified(state: State) {
  return (
    state.matches('reviewing.sendingVc.inProgress') &&
    state.context.showFaceCaptureSuccessBanner
  );
}

export function selectIsSendingVcTimeout(state: State) {
  return state.matches('reviewing.sendingVc.timeout');
}

export function selectIsSent(state: State) {
  return state.matches('reviewing.sendingVc.sent');
}

export function selectIsInvalid(state: State) {
  return state.matches('invalid');
}

export function selectIsLocationDenied(state: State) {
  return state.matches('checkingLocationState.denied');
}

export function selectIsLocationDisabled(state: State) {
  return state.matches('checkingLocationState.disabled');
}

export function selectIsShowQrLogin(state: State) {
  return state.matches('showQrLogin');
}

export function selectIsQrLoginDone(state: State) {
  return state.matches('showQrLogin.navigatingToHistory');
}

export function selectIsQrLoginStoring(state: State) {
  return state.matches('showQrLogin.storing');
}

export function selectIsDone(state: State) {
  return state.matches('reviewing.disconnect');
}

export function selectIsMinimumStorageRequiredForAuditEntryLimitReached(
  state: State,
) {
  return state.matches('restrictSharingVc');
}

export function selectIsFaceVerificationConsent(state: State) {
  return state.matches('reviewing.faceVerificationConsent');
}

export function selectIsQrLoginViaDeepLink(state: State) {
  return state.matches('qrLoginViaDeepLink');
}
