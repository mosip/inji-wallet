import {StateFrom} from 'xstate';
import {getMosipLogo} from '../../components/VC/common/VCUtils';
import {VCMetadata} from '../../shared/VCMetadata';
import {qrLoginMachine} from './QrLoginMachine';
import {Credential} from '../VerifiableCredential/VCMetaMachine/vc';

type State = StateFrom<typeof qrLoginMachine>;

export function selectMyVcs(state: State) {
  return state.context.myVcs;
}

export function selectIsWaitingForData(state: State) {
  return state.matches('waitingForData');
}

export function selectDomainName(state: State) {
  return state.context.domainName;
}

export function selectIsLinkTransaction(state: State) {
  return state.matches('linkTransaction');
}

export function selectIsloadMyVcs(state: State) {
  return state.matches('loadMyVcs');
}

export function selectIsShowingVcList(state: State) {
  return state.matches('showvcList');
}

export function selectIsisVerifyingIdentity(state: State) {
  return state.matches('faceAuth');
}

export function selectIsInvalidIdentity(state: State) {
  return state.matches('invalidIdentity');
}

export function selectIsShowError(state: State) {
  return state.matches('ShowError');
}

export function selectIsRequestConsent(state: State) {
  return state.matches('requestConsent');
}

export function selectIsSendingAuthenticate(state: State) {
  return state.matches('sendingAuthenticate');
}

export function selectIsSendingConsent(state: State) {
  return state.matches('sendingConsent');
}

export function selectIsVerifyingSuccesful(state: State) {
  return state.matches('success');
}

export function selectCredential(state: State): Credential {
  const credential =
    state.context.selectedVc?.verifiableCredential?.credential ||
    state.context.selectedVc?.credential;
  return credential ? [credential] : credential;
}

export function selectVerifiableCredentialData(state: State) {
  const vcMetadata = new VCMetadata(state.context.selectedVc?.vcMetadata);
  return [
    {
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
    },
  ];
}

export function selectLinkTransactionResponse(state: State) {
  return state.context.linkTransactionResponse;
}

export function selectEssentialClaims(state: State) {
  return state.context.essentialClaims;
}

export function selectVoluntaryClaims(state: State) {
  return state.context.voluntaryClaims;
}

export function selectLogoUrl(state: State) {
  return state.context.logoUrl;
}

export function selectClientName(state: State) {
  return state.context.clientName;
}

export function selectErrorMessage(state: State) {
  return state.context.errorMessage;
}

export function selectIsSharing(state: State) {
  return state.context.isSharing;
}

export function selectIsQrLoginViaDeepLink(state: State) {
  return state.context.isQrLoginViaDeepLink;
}

export function selectIsFaceVerificationConsent(state: State) {
  return state.matches('faceVerificationConsent');
}
