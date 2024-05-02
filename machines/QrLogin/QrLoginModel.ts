import { createModel } from "xstate/lib/model";
import { AppServices } from "../../shared/GlobalContext";
import { VCShareFlowType } from "../../shared/Utils";
import { VCMetadata } from "../../shared/VCMetadata";
import { QrLoginEvents } from "./QrLoginEvents";
import { VC, linkTransactionResponse } from "../VerifiableCredential/VCMetaMachine/vc";

export const QrLoginmodel = createModel(
    {
      serviceRefs: {} as AppServices,
      selectedVc: {} as VC,
      linkCode: '',
      flowType: VCShareFlowType.SIMPLE_SHARE,
      myVcs: [] as VCMetadata[],
      thumbprint: '',
      linkTransactionResponse: {} as linkTransactionResponse,
      authFactors: [],
      authorizeScopes: null,
      clientName: {},
      configs: {},
      essentialClaims: [],
      linkTransactionId: '',
      logoUrl: '',
      voluntaryClaims: [],
      selectedVoluntaryClaims: [],
      errorMessage: '',
      domainName: '',
      consentClaims: ['name', 'picture'],
      isSharing: {},
      linkedTransactionId: '',
      showQrLoginConsent: true as boolean,
    },
    {
      events:QrLoginEvents,
    },
  );