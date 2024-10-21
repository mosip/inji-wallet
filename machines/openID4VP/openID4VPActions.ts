import {assign} from 'xstate';
import {send, sendParent} from 'xstate/lib/actions';
import {SHOW_FACE_AUTH_CONSENT_SHARE_FLOW} from '../../shared/constants';
import {VC} from '../VerifiableCredential/VCMetaMachine/vc';
import {StoreEvents} from '../store';
import {JSONPath} from 'jsonpath-plus';

import {VCShareFlowType} from '../../shared/Utils';

// TODO - get this presentation definition list which are alias for scope param
// from the verifier end point after the endpoint is created and exposed.

export const openID4VPActions = (model: any) => {
  return {
    setAuthenticationResponse: model.assign({
      authenticationResponse: (_, event) => event.data,
    }),

    setEncodedAuthorizationRequest: model.assign({
      encodedAuthorizationRequest: (_, event) => event.encodedAuthRequest,
    }),

    setFlowType: model.assign({
      flowType: (_, event) => event.flowType,
    }),

    getVcsMatchingAuthRequest: model.assign({
      vcsMatchingAuthRequest: (context, event) => {
        let vcs = event.vcs;
        let matchingVCs = {} as Record<string, [VC]>;
        let presentationDefinition =
          context.authenticationResponse['presentation_definition'];
        let anyInputDescriptoHasFormatOrConstraints = false;

        vcs.forEach(vc => {
          presentationDefinition['input_descriptors'].forEach(
            inputDescriptor => {
              const format =
                inputDescriptor.format ?? presentationDefinition.format;
              anyInputDescriptoHasFormatOrConstraints =
                anyInputDescriptoHasFormatOrConstraints ||
                format !== undefined ||
                inputDescriptor.constraints.fields !== undefined;
              if (
                isVCMatchingRequestConstraints(
                  inputDescriptor.constraints,
                  vc.verifiableCredential.credential,
                ) ||
                areVCFormatAndProofTypeMatchingRequest(
                  format,
                  vc.format,
                  vc.verifiableCredential.credential.proof.type,
                )
              ) {
                matchingVCs[inputDescriptor.id]?.push(vc) ||
                  (matchingVCs[inputDescriptor.id] = [vc]);
              }
            },
          );
        });
        if (!anyInputDescriptoHasFormatOrConstraints) {
          matchingVCs[presentationDefinition['input_descriptors'][0].id] = vcs;
        }
        return matchingVCs;
      },
      purpose: context => {
        const response = context.authenticationResponse;
        const pd = response['presentation_definition'];
        return pd.purpose ?? '';
      },
    }),

    setSelectedVCs: model.assign({
      selectedVCs: (_, event) => event.selectedVCs,
    }),

    compareAndStoreSelectedVC: model.assign({
      selectedVCs: context => {
        const matchingVcs = {};
        Object.entries(context.vcsMatchingAuthRequest).map(
          ([inputDescriptorId, vcs]) =>
            (vcs as VC[]).map(vcData => {
              if (
                vcData.vcMetadata.requestId ===
                context.miniViewSelectedVC.vcMetadata.requestId
              ) {
                matchingVcs[inputDescriptorId] = [vcData];
              }
            }),
        );
        return matchingVcs;
      },
    }),

    setMiniViewShareSelectedVC: model.assign({
      miniViewSelectedVC: (_, event) => event.selectedVC,
    }),

    setIsShareWithSelfie: model.assign({
      isShareWithSelfie: (_, event) =>
        event.flowType ===
        VCShareFlowType.MINI_VIEW_SHARE_WITH_SELFIE_OPENID4VP,
    }),

    setShowFaceAuthConsent: model.assign({
      showFaceAuthConsent: (_, event) => {
        return !event.isDoNotAskAgainChecked;
      },
    }),

    storeShowFaceAuthConsent: send(
      (_, event) =>
        StoreEvents.SET(
          SHOW_FACE_AUTH_CONSENT_SHARE_FLOW,
          !event.isDoNotAskAgainChecked,
        ),
      {
        to: context => context.serviceRefs.store,
      },
    ),

    getFaceAuthConsent: send(
      StoreEvents.GET(SHOW_FACE_AUTH_CONSENT_SHARE_FLOW),
      {
        to: (context: any) => context.serviceRefs.store,
      },
    ),

    updateShowFaceAuthConsent: model.assign({
      showFaceAuthConsent: (_, event) => {
        return event.response || event.response === null;
      },
    }),

    forwardToParent: sendParent('DISMISS'),

    setError: model.assign({
      error: (_, event) => {
        console.error('Error:', event.data.message);
        return event.data.message;
      },
    }),

    resetError: model.assign({
      error: () => '',
    }),

    resetIsShareWithSelfie: model.assign({isShareWithSelfie: () => false}),

    loadKeyPair: assign({
      publicKey: (_, event: any) => event.data?.publicKey as string,
      privateKey: (context: any, event: any) =>
        event.data?.privateKey
          ? event.data.privateKey
          : (context.privateKey as string),
    }),

    incrementOpenID4VPRetryCount: model.assign({
      openID4VPRetryCount: context => context.openID4VPRetryCount + 1,
    }),

    resetOpenID4VPRetryCount: model.assign({
      openID4VPRetryCount: () => 0,
    }),

    setAuthenticationError: model.assign({
      error: (_, event) => {
        console.error('Error:', event.data.message);
        return 'vc validation - ' + event.data.message;
      },
    }),

    setTrustedVerifiersApiCallError: model.assign({
      error: (_, event) => {
        console.error('Error:', event.data.message);
        return 'api error - ' + event.data.message;
      },
    }),

    setTrustedVerifiers: model.assign({
      trustedVerifiers: (_: any, event: any) => event.data.response.verifiers,
    }),

    updateFaceCaptureBannerStatus: model.assign({
      showFaceCaptureSuccessBanner: () => true,
    }),

    resetFaceCaptureBannerStatus: model.assign({
      showFaceCaptureSuccessBanner: false,
    }),
  };
};

function areVCFormatAndProofTypeMatchingRequest(
  format: Record<string, any>,
  vcFormatType: string,
  vcProofType: string,
): boolean {
  if (!format) {
    return false;
  }
  return Object.entries(format).some(
    ([type, value]) =>
      type === vcFormatType && value.proof_type.includes(vcProofType),
  );
}

function isVCMatchingRequestConstraints(constraints, credential) {
  if (!constraints.fields) {
    return false;
  }
  for (const field of constraints.fields) {
    for (const path of field.path) {
      const valueMatchingPath = JSONPath({
        path: path,
        json: credential,
      })[0];

      if (
        valueMatchingPath !== undefined &&
        field.filter?.type === typeof valueMatchingPath &&
        String(valueMatchingPath).includes(field.filter?.pattern)
      ) {
        return true;
      }
    }
  }
  return false;
}
