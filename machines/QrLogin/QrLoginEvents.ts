import { VC } from "./VerifiableCredential/VCMetaMachine/vc";

export const QrLoginEvents= {
    SELECT_VC: (vc: VC) => ({vc}),
    SCANNING_DONE: (params: string) => ({params}),
    STORE_RESPONSE: (response: unknown) => ({response}),
    STORE_ERROR: (error: Error) => ({error}),
    TOGGLE_CONSENT_CLAIM: (enable: boolean, claim: string) => ({
      enable,
      claim,
    }),
    DISMISS: () => ({}),
    CONFIRM: () => ({}),
    GET: (
      linkCode: string,
      flowType: string,
      selectedVc: VC,
      faceAuthConsentGiven: boolean,
    ) => ({
      linkCode,
      flowType,
      selectedVc,
      faceAuthConsentGiven,
    }),
    VERIFY: () => ({}),
    CANCEL: () => ({}),
    FACE_VALID: () => ({}),
    FACE_INVALID: () => ({}),
    RETRY_VERIFICATION: () => ({}),
    FACE_VERIFICATION_CONSENT: (isConsentGiven: boolean) => ({
      isConsentGiven,
    }),
  }