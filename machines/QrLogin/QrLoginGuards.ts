import { VCShareFlowType } from "../../shared/Utils";

export const QrLoginGuards={
  showQrLoginConsentScreen: context => {
      return context.showQrLoginConsent;
    },

    isConsentAlreadyCaptured: (_, event) =>
      event.data?.consentAction === 'NOCAPTURE',

    isSimpleShareFlow: (context, _event) =>
      context.flowType === VCShareFlowType.SIMPLE_SHARE,
  }