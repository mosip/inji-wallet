export const openId4VPGuards = () => {
  return {
    showFaceAuthConsentScreen: (context, event) => {
      return context.showFaceAuthConsent && context.isShareWithSelfie;
    },

    isShareWithSelfie: context => context.isShareWithSelfie,
  };
};
