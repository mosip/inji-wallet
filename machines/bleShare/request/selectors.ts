import {StateFrom} from 'xstate';
import {requestMachine} from './requestMachine';
import {VCMetadata} from '../../../shared/VCMetadata';
import {SvgImage} from '../../../components/ui/svg';
import {Theme} from '../../../components/ui/styleUtils';

type State = StateFrom<typeof requestMachine>;

export function selectSenderInfo(state: State) {
  return state.context.senderInfo;
}

export function selectIncomingVc(state: State) {
  return state.context.incomingVc;
}

export function selectCredential(state: State) {
  return new VCMetadata(state.context.incomingVc.vcMetadata).isFromOpenId4VCI()
    ? state.context.incomingVc.verifiableCredential?.credential
    : state.context.incomingVc.verifiableCredential;
}

export function selectVerifiableCredentialData(state: State) {
  return new VCMetadata(state.context.vcMetadata).isFromOpenId4VCI()
    ? {
        face: state.context.incomingVc.verifiableCredential.credential
          .credentialSubject.face,
        issuerLogo: state.context.incomingVc.verifiableCredential.issuerLogo,
      }
    : {
        face: state.context.incomingVc.credential.biometrics.face,
        issuerLogo: SvgImage.MosipLogo(Theme.Styles.logo),
      };
}

export function selectIsIncomingVp(state: State) {
  return state.context.incomingVc?.verifiablePresentation != null;
}

export function selectIsReviewingInIdle(state: State) {
  return state.matches('reviewing.idle');
}

export function selectIsWaitingForConnection(state: State) {
  return state.matches('waitingForConnection');
}

export function selectIsCheckingBluetoothService(state: State) {
  return state.matches('checkingBluetoothService');
}

export function selectIsWaitingForVc(state: State) {
  return state.matches('waitingForVc.inProgress');
}

export function selectIsWaitingForVcTimeout(state: State) {
  return state.matches('waitingForVc.timeout');
}

export function selectOpenId4VpUri(state: State) {
  return state.context.openId4VpUri;
}

export function selectIsAccepting(state: State) {
  return state.matches('reviewing.accepting');
}

export function selectIsDisplayingIncomingVC(state: State) {
  return state.matches('reviewing.displayingIncomingVC');
}

export function selectIsSavingFailedInIdle(state: State) {
  return state.matches('reviewing.savingFailed.idle');
}

export function selectIsDone(state: State) {
  return state.matches('reviewing.navigatingToHistory');
}

export function selectIsNavigatingToReceivedCards(state: State) {
  return state.matches('reviewing.navigatingToReceivedCards');
}

export function selectIsNavigatingToHome(state: State) {
  return state.matches('reviewing.navigatingToHome');
}
