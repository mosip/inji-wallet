import {assign} from 'xstate';
import {send, sendParent} from 'xstate/lib/actions';
import {SHOW_FACE_AUTH_CONSENT_SHARE_FLOW} from '../../shared/constants';
import {VC} from '../VerifiableCredential/VCMetaMachine/vc';
import {StoreEvents} from '../store';

import {VCShareFlowType} from '../../shared/Utils';

// TODO - get this presentation definition list which are alias for scope param
// from the verifier end point after the endpoint is created and exposed.

let predefinedPresentationDefinitions = {
  sunbird_rc_insurance_vc_ldp: {
    id: 'vp token example',
    purpose:
      'Relying party is requesting your digital ID for the purpose of Self-Authentication',
    input_descriptors: [
      {
        id: 'id card credential',
        constraints: {
          fields: [
            {
              path: ['$.type'],
              filter: {
                type: 'string',
                pattern: 'InsuranceCredential',
              },
            },
          ],
        },
      },
    ],
  },
};

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
        let presentationDefinition;
        const response = context.authenticationResponse;
        if ('presentation_definition' in response) {
          presentationDefinition = JSON.parse(
            response['presentation_definition'],
          );
        } else if ('scope' in response) {
          presentationDefinition =
            predefinedPresentationDefinitions[response.scope];
        }
        vcs.forEach(vc => {
          presentationDefinition['input_descriptors'].forEach(
            inputDescriptor => {
              let isMatched = true;
              inputDescriptor.constraints.fields?.forEach(field => {
                field.path.forEach(path => {
                  const pathSegments = path.substring(2).split('.');

                  const pathData = pathSegments.reduce(
                    (obj, key) => obj?.[key],
                    vc.verifiableCredential.credential,
                  );

                  if (
                    path === undefined ||
                    (pathSegments[pathSegments.length - 1] === 'type' &&
                      (field.filter?.type !== typeof pathData[1] ||
                        !pathData[1].includes(field.filter?.pattern))) ||
                    (pathSegments[pathSegments.length - 1] !== 'type' &&
                      (field.filter?.type !== typeof pathData ||
                        !pathData.includes(field.filter?.pattern)))
                  ) {
                    isMatched = false;
                    return;
                  }
                });

                if (!isMatched) {
                  return;
                }
              });

              if (isMatched) {
                matchingVCs[inputDescriptor.id]?.push(vc) ||
                  (matchingVCs[inputDescriptor.id] = [vc]);
              }
            },
          );
        });
        return matchingVCs;
      },
      purpose: context => {
        const response = context.authenticationResponse;
        if ('presentation_definition' in response) {
          const pd = JSON.parse(response['presentation_definition']);
          return pd.purpose ?? '';
        } else if ('scope' in response) {
          return predefinedPresentationDefinitions[response.scope].purpose;
        }
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
      trustedVerifiers: (_: any, event: any) => event.data,
    }),
  };
};
