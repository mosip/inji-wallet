import {EventFrom} from 'xstate';
import {openId4VPModel} from './openId4VPModel';
import {openId4VPServices} from './openId4VPServices';
import {openId4VPActions} from './openId4VPActions';
import {AppServices} from '../../shared/GlobalContext';
import {openId4VPGuards} from './openId4VPGuards';
import {sendParent} from 'xstate/lib/actions';

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
              () => console.log('authenticate action::'),
              'setEncodedAuthorizationRequest',
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
          onError: {},
        },
      },
      getVCsSatisfyingAuthRequest: {
        on: {
          DOWNLOADED_VCS: {
            actions: 'getVcsMatchingAuthRequest',
            target: 'selectingVCs',
          },
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
          CANCEL: {},
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
            // {
            //   target: '#scan.reviewing.selectingVc',
            // },
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
              cond: 'isFlowTypeSimpleShare',
              target: 'selectingVCs',
            },
            {
              // target: 'cancelling',
            },
          ],
        },
      },

      invalidIdentity: {
        on: {
          DISMISS: [
            {
              cond: 'isFlowTypeSimpleShare',
              target: 'selectingVCs',
            },
            {
              // target: 'cancelling',
            },
          ],
          RETRY_VERIFICATION: {
            target: 'verifyingIdentity',
          },
        },
      },
      sendingVP: {
        entry: [sendParent('IN_PROGRESS')],
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
      SHARING_TIMEOUT: 5 * 1000,
    },
  },
);

export function createOpenId4VPMachine(serviceRefs: AppServices) {
  return openId4VPMachine.withContext({
    ...openId4VPMachine.context,
    serviceRefs,
  });
}
