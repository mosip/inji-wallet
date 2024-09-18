import {VCShareFlowType} from '../../shared/Utils';

export const openId4VPGuards = () => {
  return {
    showFaceAuthConsentScreen: (context, event) => {
      return context.showFaceAuthConsent && context.isShareWithSelfie;
    },

    isShareWithSelfie: context => context.isShareWithSelfie,

    isFlowTypeSimpleShare: context =>
      context.flowType === VCShareFlowType.SIMPLE_SHARE,
  };
};
