import {EventFrom} from 'xstate';
import {openId4VPModel} from './openID4VPModel';
import {openId4VPServices} from './openID4VPServices';
import {openId4VPActions} from './openID4VPActions';
import {AppServices} from '../../shared/GlobalContext';
import {openId4VPGuards} from './openID4VPGuards';
import {send, sendParent} from 'xstate/lib/actions';

const model = openId4VPModel;

export const OpenId4VPEvents = model.events;

export const openID4VPMachine = model.createMachine(
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
              'setMiniViewShareSelectedVC',
              'setIsShareWithSelfie',
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
            target: 'getTrustedVerifiersList',
          },
        },
      },
      getTrustedVerifiersList: {
        invoke: {
          src: 'fetchTrustedVerifiers',
          onDone: {
            actions: 'setTrustedVerifiers',
            target: 'getKeyPairFromKeystore',
          },
          onError: {
            actions: 'setError',
          },
        },
      },
      getKeyPairFromKeystore: {
        invoke: {
          src: 'getKeyPair',
          onDone: {
            actions: ['loadKeyPair'],
            target: 'checkKeyPair',
          },
          onError: [
            {
              actions: 'setError',
            },
          ],
        },
      },
      checkKeyPair: {
        description: 'checks whether key pair is generated',
        invoke: {
          src: 'getSelectedKey',
          onDone: {
            cond: 'hasKeyPair',
            target: 'authenticateVerifier',
          },
          onError: [
            {
              actions: 'setError',
            },
          ],
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
            actions: 'setAuthenticationError',
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
              actions: 'compareAndStoreSelectedVC',
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
            actions: [
              'setSelectedVCs',
              model.assign({isShareWithSelfie: () => true}),
            ],
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
          FACE_VERIFICATION_CONSENT: [
            {
              cond: 'isSimpleOpenID4VPShare',
              actions: ['setShowFaceAuthConsent', 'storeShowFaceAuthConsent'],
              target: 'checkIfAnySelectedVCHasImage',
            },
            {
              actions: ['setShowFaceAuthConsent', 'storeShowFaceAuthConsent'],
              target: 'verifyingIdentity',
            },
          ],
          DISMISS: [
            {
              cond: 'isSimpleOpenID4VPShare',
              target: 'selectingVCs',
            },
            {
              actions: sendParent('DISMISS'),
            },
          ],
        },
      },
      checkIfAnySelectedVCHasImage: {
        entry: send('CHECK_FOR_IMAGE'),
        on: {
          CHECK_FOR_IMAGE: [
            {
              cond: 'isAnyVCHasImage',
              target: 'verifyingIdentity',
            },
            {
              actions: model.assign({
                error: () => 'none of the selected VC has image',
              }),
            },
          ],
        },
      },
      verifyingIdentity: {
        on: {
          FACE_VALID: [
            {
              cond: 'hasKeyPair',
              target: 'sendingVP',
            },
            {
              target: 'checkKeyPair',
            },
          ],
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
              actions: sendParent('DISMISS'),
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
          onDone: {
            actions: sendParent('SUCCESS'),
            target: 'success',
          },
          onError: {
            actions: ['setError', sendParent('SHOW_ERROR')],
            target: 'showError',
          },
        },
        after: {
          SHARING_TIMEOUT: {
            actions: sendParent('TIMEOUT'),
          },
        },
      },
      showError: {
        on: {
          RETRY: {
            actions: ['incrementOpenID4VPRetryCount'],
            target: 'sendingVP',
          },
          RESET_RETRY_COUNT: {
            actions: 'resetOpenID4VPRetryCount',
          },
        },
      },
      success: {},
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

export function createOpenID4VPMachine(serviceRefs: AppServices) {
  return openID4VPMachine.withContext({
    ...openID4VPMachine.context,
    serviceRefs,
  });
}
