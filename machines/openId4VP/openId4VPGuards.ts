import {VCShareFlowType} from '../../shared/Utils';

export const openId4VPGuards = () => {
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
  };
};
