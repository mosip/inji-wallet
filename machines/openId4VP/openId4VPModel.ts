import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../shared/GlobalContext';
import {VC} from '../VerifiableCredential/VCMetaMachine/vc';
const openId4VPEvents = {
  AUTHENTICATE: (encodedAuthRequest: string) => ({encodedAuthRequest}),
  DOWNLOADED_VCS: (vcs: VC[]) => ({vcs}),
  SELECT_VC: (vcKey: string, inputDescriptorId: any) => ({
    vcKey,
    inputDescriptorId,
  }),
  ACCEPT_REQUEST: (selectedVCs: Record<string, VC[]>) => ({
    selectedVCs,
  }),
  VERIFY_AND_ACCEPT_REQUEST: (selectedVCs: Record<string, VC[]>) => ({
    selectedVCs,
  }),
  CONFIRM: () => ({}),
  CANCEL: () => ({}),
  FACE_VERIFICATION_CONSENT: (isDoNotAskAgainChecked: boolean) => ({
    isDoNotAskAgainChecked,
  }),
  FACE_VALID: () => ({}),
  FACE_INVALID: () => ({}),
  DISMISS: () => ({}),
  RETRY_VERIFICATION: () => ({}),
  STORE_RESPONSE: (response: any) => ({response}),
  GO_BACK: () => ({}),
};

export const openId4VPModel = createModel(
  {
    serviceRefs: {} as AppServices,
    encodedAuthorizationRequest: '' as string,
    authenticationResponse: {},
    vcsMatchingAuthRequest: {} as Record<string, VC[]>,
    checkedAll: false as boolean,
    selectedVCs: {} as Record<string, VC[]>,
    isShareWithSelfie: false as boolean,
    showFaceAuthConsent: true as boolean,
    purpose: '' as string,
    error: '' as string,
  },
  {events: openId4VPEvents},
);
