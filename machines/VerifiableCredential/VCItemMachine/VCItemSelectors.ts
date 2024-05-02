import {StateFrom} from 'xstate';
import {VCMetadata} from '../../../shared/VCMetadata';
import {VCItemMachine} from './VCItemMachine';
import {getMosipLogo} from '../../../components/VC/common/VCUtils';
import {getIdType} from '../../../shared/openId4VCI/Utils';

type State = StateFrom<typeof VCItemMachine>;

export function selectVerificationStatus(state: State) {
  return state.context.verificationStatus;
}

export function selectIsVerificationInProgress(state: State) {
  return state.matches('verifyState.verifyingCredential');
}

export function selectIsVerificationCompleted(state: State) {
  return state.matches('verifyState.verificationCompleted');
}

export function selectShowVerificationStatusBanner(state: State) {
  return state.context.showVerificationStatusBanner;
}

export function selectVerifiableCredential(state: State) {
  return state.context.verifiableCredential;
}

export function getVerifiableCredential(
  vcMetadata: VCMetadata,
  verifiableCredential,
) {
  return VCMetadata.fromVC(vcMetadata).isFromOpenId4VCI()
    ? verifiableCredential?.credential
    : verifiableCredential;
}

export function selectCredential(state: State) {
  return getVerifiableCredential(
    state.context.vcMetadata,
    state.context.verifiableCredential,
  );
}

export function selectVerifiableCredentialData(state: State) {
  const vcMetadata = new VCMetadata(state.context.vcMetadata);
  return vcMetadata.isFromOpenId4VCI()
    ? {
        vcMetadata: vcMetadata,
        face: state.context.verifiableCredential?.credential?.credentialSubject
          .face,
        issuerLogo: state.context.verifiableCredential?.issuerLogo,
        wellKnown: state.context.verifiableCredential?.wellKnown,
        credentialTypes: state.context.verifiableCredential?.credentialTypes,
        issuer: vcMetadata.issuer,
      }
    : {
        vcMetadata: vcMetadata,
        issuer: vcMetadata.issuer,
        face: state.context.credential?.biometrics?.face,
        issuerLogo: getMosipLogo(),
      };
}

export function selectKebabPopUp(state: State) {
  return state.context.isMachineInKebabPopupState;
}

export function selectContext(state: State) {
  return state.context;
}

export function selectGeneratedOn(state: State) {
  return state.context.generatedOn;
}

export function selectWalletBindingSuccess(state: State) {
  return state.context.walletBindingResponse;
}

export function selectWalletBindingResponse(state: State) {
  return state.context.walletBindingResponse;
}

export function selectIsCommunicationDetails(state: State) {
  return state.context.communicationDetails;
}

export function selectWalletBindingError(state: State) {
  return state.context.error;
}

export function selectBindingAuthFailedError(state: State) {
  return state.context.error;
}

export function selectAcceptingBindingOtp(state: State) {
  return state.matches('existingState.walletBinding.acceptingBindingOTP');
}

export function selectWalletBindingInProgress(state: State) {
  return (
    state.matches('existingState.walletBinding.requestingBindingOTP') ||
    state.matches('existingState.walletBinding.addingWalletBindingId') ||
    state.matches('existingState.walletBinding.addKeyPair') ||
    state.matches('existingState.walletBinding.updatingPrivateKey')
  );
}

export function selectBindingWarning(state: State) {
  return state.matches('existingState.walletBinding.showBindingWarning');
}

export function selectRemoveWalletWarning(state: State) {
  return state.matches('existingState.kebabPopUp.removeWallet');
}

export function selectIsPinned(state: State) {
  return state.context.vcMetadata.isPinned;
}

export function selectOtpError(state: State) {
  return state.context.error;
}

export function selectShowActivities(state: State) {
  return state.matches('existingState.kebabPopUp.showActivities');
}

export function selectShowWalletBindingError(state: State) {
  return state.matches('existingState.walletBinding.showingWalletBindingError');
}

export function selectVc(state: State) {
  const {serviceRefs, ...data} = state.context;
  return data;
}

export function selectId(state: State) {
  return state.context.vcMetadata.id;
}
