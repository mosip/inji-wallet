import { VCShareFlowType } from "../shared/Utils";

export const QrLOginGuards={
    showFaceAuthConsentScreen: context => {
      return context.showFaceAuthConsent;
    },

    isConsentAlreadyCaptured: (_, event) =>
      event.data?.consentAction === 'NOCAPTURE',

    isSimpleShareFlow: (context, _event) =>
      context.flowType === VCShareFlowType.SIMPLE_SHARE,
  },