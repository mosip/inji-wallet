import {isClientValidationRequired} from '../../shared/openID4VP/OpenID4VP';
import {VCShareFlowType} from '../../shared/Utils';

export const openID4VPGuards = () => {
  return {
    showFaceAuthConsentScreen: (context, event) => {
      return context.showFaceAuthConsent && context.isShareWithSelfie;
    },

    isShareWithSelfie: context => context.isShareWithSelfie,

    isSimpleOpenID4VPShare: context =>
      context.flowType === VCShareFlowType.OPENID4VP,

    isSelectedVCMatchingRequest: context =>
      Object.values(context.selectedVCs).length === 1,

    isFlowTypeSimpleShare: context =>
      context.flowType === VCShareFlowType.SIMPLE_SHARE,

    hasKeyPair: (context: any) => {
      return !!context.publicKey;
    },

    isAnyVCHasImage: (context: any) => {
      const hasImage = Object.values(context.selectedVCs)
        .flatMap(vc => vc)
        .some(
          vc => vc.verifiableCredential?.credential?.credentialSubject.face,
        );
      return !!hasImage;
    },

    isFaceVerificationRetryAttempt: (context: any) =>
      context.isFaceVerificationRetryAttempt,

    isClientValidationRequred: (_, event) => event.data,
  };
};
