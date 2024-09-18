import {send, sendParent} from 'xstate/lib/actions';
import {VC} from '../VerifiableCredential/VCMetaMachine/vc';
import {StoreEvents} from '../store';
import {SHOW_FACE_AUTH_CONSENT_SHARE_FLOW} from '../../shared/constants';

export const openId4VPActions = (model: any) => {
  return {
    setAuthenticationResponse: model.assign({
      authenticationResponse: (_, event) => event.data,
    }),

    setEncodedAuthorizationRequest: model.assign({
      encodedAuthorizationRequest: (_, event) => event.authRequest,
    }),

    getVcsMatchingAuthRequest: model.assign({
      vcsMatchingAuthRequest: (context, event) => {
        let vcs = event.vcs;
        let matchingVCs = {} as Record<string, [VC]>;
        const response = context.authenticationResponse;
        if ('presentation_definition' in response) {
          const pd = JSON.parse(response['presentation_definition']);
          vcs.forEach(vc => {
            pd['input_descriptors'].forEach(inputDescriptor => {
              let isMatched = true;

              inputDescriptor.constraints.fields?.forEach(field => {
                field.path.forEach(path => {
                  const pathSegments = path.substring(2).split('.');

                  const pathData = pathSegments.reduce(
                    (obj, key) => obj?.[key],
                    vc.verifiableCredential.credential,
                  );

                  if (
                    pathData === undefined ||
                    (field.filter && field.filter.type !== typeof pathData) ||
                    !pathData.includes(field.filter.pattern)
                  ) {
                    isMatched = false;
                  }
                });
              });

              if (isMatched) {
                matchingVCs[inputDescriptor.id]?.push(vc) ||
                  (matchingVCs[inputDescriptor.id] = [vc]);
              }
            });
          });
        } else if ('scope' in response) {
          matchingVCs = vcs.filter(vc => vc.scope == response.scope);
        }
        return matchingVCs;
      },
    }),

    setSelectedVCs: model.assign({
      selectedVCs: (_, event) => event.selectedVCs,
    }),

    setIsShareWithSelfie: model.assign({
      isShareWithSelfie: () => true,
    }),

    setShowFaceAuthConsent: model.assign({
      showFaceAuthConsent: (_, event) => {
        return !event.isDoNotAskAgainChecked;
      },
    }),

    storeShowFaceAuthConsent: send(
      (context, event) =>
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
  };
};
