import {EventFrom} from 'xstate';
import {openId4VPModel} from './openId4VPModel';
import {openId4VPServices} from './openId4VPServices';
import {openId4VPActions} from './openId4VPActions';
import {AppServices} from '../../shared/GlobalContext';
import {openId4VPGuards} from './openId4VPGuards';
import {send, sendParent} from 'xstate/lib/actions';

const model = openId4VPModel;

export const OpenId4VPEvents = model.events;

export const openId4VPMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./openId4VPMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'OpenId4VP',
    initial: 'waitingForData',

    states: {
      waitingForData: {
        on: {
          AUTHENTICATE: {
            actions: [
              'setEncodedAuthorizationRequest',
              'setFlowType',
              'setSelectedVc',
            ],
            target: 'checkFaceAuthConsent',
          },
        },
      },
      checkFaceAuthConsent: {
        entry: 'getFaceAuthConsent',
        on: {
          STORE_RESPONSE: {
            actions: 'updateShowFaceAuthConsent',
            target: 'authenticateVerifier',
          },
        },
      },
      authenticateVerifier: {
        invoke: {
          src: 'getAuthenticationResponse',
          onDone: {
            actions: 'setAuthenticationResponse',
            target: 'getVCsSatisfyingAuthRequest',
          },
          onError: {
            actions: [
              (_, event) => console.error('Error:', event.data),
              'setError',
            ],
          },
        },
      },
      getVCsSatisfyingAuthRequest: {
        on: {
          DOWNLOADED_VCS: [
            {
              cond: 'isSimpleOpenID4VPShare',
              actions: 'getVcsMatchingAuthRequest',
              target: 'selectingVCs',
            },
            {
              actions: 'getVcsMatchingAuthRequest',
              target: 'setSelectedVC',
            },
          ],
        },
      },
      setSelectedVC: {
        entry: send('SET_SELECTED_VC'),
        on: {
          SET_SELECTED_VC: [
            {
              actions: 'compareVCwithMatchingVCs',
              target: 'checkIfMatchingVCsHasSelectedVC',
            },
          ],
        },
      },
      checkIfMatchingVCsHasSelectedVC: {
        entry: send('CHECK_SELECTED_VC'),
        on: {
          CHECK_SELECTED_VC: [
            {
              cond: 'isSelectedVCMatchingRequest',
              target: 'getConsentForVPSharing',
            },
            {
              actions: [
                model.assign({
                  error: () => 'credential mismatch detected',
                }),
              ],
            },
          ],
        },
      },
      selectingVCs: {
        on: {
          VERIFY_AND_ACCEPT_REQUEST: {
            actions: ['setSelectedVCs', 'setIsShareWithSelfie'],
            target: 'getConsentForVPSharing',
          },
          ACCEPT_REQUEST: {
            target: 'getConsentForVPSharing',
            actions: [
              'setSelectedVCs',
              'setShareLogTypeUnverified',
              'resetFaceCaptureBannerStatus',
            ],
          },
          CANCEL: {
            actions: 'forwardToParent',
            target: 'waitingForData',
          },
        },
      },
      getConsentForVPSharing: {
        on: {
          CONFIRM: [
            {
              cond: 'showFaceAuthConsentScreen',
              target: 'faceVerificationConsent',
            },
            {
              cond: 'isShareWithSelfie',
              target: 'verifyingIdentity',
            },
            {
              target: 'sendingVP',
            },
          ],
          CANCEL: {
            target: 'showConfirmationPopup',
          },
        },
      },
      showConfirmationPopup: {
        on: {
          CONFIRM: {
            actions: sendParent('DISMISS'),
          },
          GO_BACK: {
            target: 'getConsentForVPSharing',
          },
        },
      },
      faceVerificationConsent: {
        on: {
          FACE_VERIFICATION_CONSENT: {
            actions: ['setShowFaceAuthConsent', 'storeShowFaceAuthConsent'],
            target: 'verifyingIdentity',
          },
          DISMISS: [
            // {
            //   cond: 'isFlowTypeMiniViewShareWithSelfie',
            //   target: '#scan.checkFaceAuthConsent',
            // },
            {
              target: 'selectingVCs',
            },
          ],
        },
      },
      verifyingIdentity: {
        on: {
          FACE_VALID: {
            target: 'sendingVP',
            actions: [
              'setShareLogTypeVerified',
              'updateFaceCaptureBannerStatus',
            ],
          },
          FACE_INVALID: {
            target: 'invalidIdentity',
            actions: 'logFailedVerification',
          },
          CANCEL: [
            {
              cond: 'isSimpleOpenID4VPShare',
              target: 'selectingVCs',
            },
            {
              target: 'selectingVCs',
            },
          ],
        },
      },

      invalidIdentity: {
        on: {
          DISMISS: [
            {
              cond: 'isSimpleOpenID4VPShare',
              target: 'selectingVCs',
            },
            {
              actions: sendParent('DISMISS'),
            },
          ],
          RETRY_VERIFICATION: {
            target: 'verifyingIdentity',
          },
        },
      },
      sendingVP: {
        entry: sendParent('IN_PROGRESS'),
        invoke: {
          src: 'sendVP',
          onDone: {},
        },
        after: {
          SHARING_TIMEOUT: {
            actions: sendParent('TIMEOUT'),
          },
        },
      },
    },
  },
  {
    actions: openId4VPActions(model),
    services: openId4VPServices(),
    guards: openId4VPGuards(),
    delays: {
      SHARING_TIMEOUT: 15 * 1000,
    },
  },
);

export function createOpenId4VPMachine(serviceRefs: AppServices) {
  return openId4VPMachine.withContext({
    ...openId4VPMachine.context,
    serviceRefs,
  });
}
