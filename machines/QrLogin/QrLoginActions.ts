import { assign, send, sendParent } from "xstate";
import i18n from "../../i18n";
import { VCShareFlowType } from "../../shared/Utils";
import { parseMetadatas } from "../../shared/VCMetadata";
import { SHOW_FACE_AUTH_CONSENT_QR_LOGIN_FLOW, MY_VCS_STORE_KEY } from "../../shared/constants";
import { getBindingCertificateConstant } from "../../shared/keystore/SecureKeystore";
import { VC, linkTransactionResponse } from "../VerifiableCredential/VCMetaMachine/vc";
import { StoreEvents } from "../store";



export const QrLoginActions=(model:any)=>{
  
        return{
          setShowFaceAuthConsent: model.assign({
          showFaceAuthConsent: (_, event) => {
            return !event.isDoNotShowPopUpConsentGiven;
          },
        }),

        storeShowFaceAuthConsent: send(
          (context, event) =>
            StoreEvents.SET(SHOW_FACE_AUTH_CONSENT_QR_LOGIN_FLOW, !event.isDoNotShowPopUpConsentGiven),
          {
            to: context => context.serviceRefs.store,
          },
        ),

        forwardToParent: sendParent('DISMISS'),

        setScanData: model.assign((context, event) => {
          const linkCode = event.linkCode;
          const flowType = event.flowType;
          const selectedVc = event.selectedVc;
          return {
            ...context,
            linkCode: linkCode,
            flowType: flowType,
            selectedVc: selectedVc,
          };
        }),
        getFaceAuthConsent: send(StoreEvents.GET(SHOW_FACE_AUTH_CONSENT_QR_LOGIN_FLOW), {
          to: (context:any) => context.serviceRefs.store,
        }),

        updateShowFaceAuthConsent: model.assign({
          showFaceAuthConsent: (_, event) => {
            return event.response || event.response === null;
          },
        }),

        // TODO: loaded VCMetadatas are not used anywhere. remove?
        loadMyVcs: send(StoreEvents.GET(MY_VCS_STORE_KEY), {
          to: context => context.serviceRefs.store,
        }),

        setMyVcs: model.assign({
          myVcs: (_context, event) =>
            parseMetadatas((event.response || []) as object[]),
        }),

        loadThumbprint: send(
          context =>
            StoreEvents.GET(
              getBindingCertificateConstant(
                context.selectedVc.walletBindingResponse?.walletBindingId,
              ),
            ),
          {to: context => context.serviceRefs.store},
        ),
        setThumbprint: assign({
          thumbprint: (_context, event) => {
            return (event.response || '') as string;
          },
        }),
        resetLinkTransactionId: model.assign({
          linkTransactionId: () => '',
        }),

        resetSelectedVoluntaryClaims: model.assign({
          selectedVoluntaryClaims: () => [],
        }),

        setSelectedVc: assign({
          selectedVc: (context, event) => {
            return {...event.vc};
          },
        }),

        resetSelectedVc: assign({
          selectedVc: {} as VC,
        }),

        resetFlowType: assign({
          flowType: VCShareFlowType.SIMPLE_SHARE,
        }),

        setlinkTransactionResponse: assign({
          linkTransactionResponse: (context, event) =>
            event.data as linkTransactionResponse,
        }),

        expandLinkTransResp: assign({
          authFactors: context => context.linkTransactionResponse.authFactors,

          authorizeScopes: context =>
            context.linkTransactionResponse.authorizeScopes,

          clientName: context => context.linkTransactionResponse.clientName,

          configs: context => context.linkTransactionResponse.configs,

          essentialClaims: context =>
            context.linkTransactionResponse.essentialClaims,

          linkTransactionId: context =>
            context.linkTransactionResponse.linkTransactionId,

          logoUrl: context => context.linkTransactionResponse.logoUrl,

          voluntaryClaims: context =>
            context.linkTransactionResponse.voluntaryClaims,
        }),

        setClaims: context => {
          context.voluntaryClaims.map(claim => {
            context.isSharing[claim] = false;
          });
        },

        SetErrorMessage: assign({
          errorMessage: (context, event) => {
            const message = event.data.name;
            const ID_ERRORS_MAP = {
              invalid_link_code: 'invalidQR',
            };
            const errorMessage = ID_ERRORS_MAP[message]
              ? i18n.t(`errors.${ID_ERRORS_MAP[message]}`, {
                  ns: 'QrLogin',
                })
              : i18n.t(`errors.genericError`, {
                  ns: 'common',
                });

            return errorMessage;
          },
        }),

        setConsentClaims: assign({
          isSharing: (context, event) => {
            context.isSharing[event.claim] = !event.enable;
            if (!event.enable) {
              context.selectedVoluntaryClaims.push(event.claim);
            } else {
              context.selectedVoluntaryClaims =
                context.selectedVoluntaryClaims.filter(
                  eachClaim => eachClaim !== event.claim,
                );
            }
            return {...context.isSharing};
          },
        }),
        setLinkedTransactionId: assign({
          linkedTransactionId: (context, event) =>
            event.data.linkedTransactionId as string,
        }),
      }
    }

    
