import RNSafetyNetClient from '@bitwala/react-native-safetynet';
import { getDeviceId } from 'react-native-device-info';
import { ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const ATTESTATION_API_KEY = 'YOUR API KEY';
const ATTESTATION_ENDPOINT = '';
const NONCE_ENDPOINT = '';

const model = createModel(
  {
    nonce: '',
    jws: '',
    error: '',
  },
  {
    events: {
      NONCE_RECEIVED: (nonce: string) => ({ nonce }),
      ATTESTATION_RECEIVED: (jws: string) => ({ jws }),
      ERROR: (error: string) => ({ error }),
      VERIFIED: () => ({}),
    },
  }
);

type Context = ContextFrom<typeof model>;

export const safetynetMachine = model.createMachine(
  {
    id: 'safetynet',
    context: model.initialContext,
    initial: 'requestingAttestation', // 'requestingNonce',
    states: {
      requestingNonce: {
        invoke: {
          src: 'requestNonce',
        },
      },
      requestingAttestation: {
        invoke: {
          src: 'requestAttestation',
          onDone: '',
        },
      },
      verifyingAttestation: {
        invoke: {
          src: 'verifyAttestation',
        },
      },
      verified: {
        type: 'final',
        data: {
          jws: (context: Context) => context.jws,
        },
      },
      failed: {
        type: 'final',
        data: {
          error: (context: Context) => context.error,
        },
      },
    },
  },
  {
    actions: {},

    services: {
      requestNonce: () => async (callback) => {
        const nonceResult = await RNSafetyNetClient.requestNonce({
          endPointUrl: NONCE_ENDPOINT,
          additionalData: getDeviceId(),
        });

        if (!nonceResult.nonce || nonceResult.error) {
          callback(
            model.events.ERROR(nonceResult.error || 'Nonce request failed.')
          );
        } else {
          callback(model.events.NONCE_RECEIVED(nonceResult.nonce));
        }
      },

      requestAttestation: (context) => async (callback) => {
        const attestationResult =
          await RNSafetyNetClient.sendAttestationRequest(
            context.nonce,
            ATTESTATION_API_KEY
          );

        if (!attestationResult.jws || attestationResult.error) {
          callback(
            model.events.ERROR(
              attestationResult.error || 'Attestation request failed.'
            )
          );
        } else {
          callback(model.events.ATTESTATION_RECEIVED(attestationResult.jws));
        }
      },

      verifyAttestation: (context) => async (callback) => {
        const verification = (await RNSafetyNetClient.verifyAttestationResult({
          endPointUrl: ATTESTATION_ENDPOINT,
          attestationJws: context.jws,
        })) as VerificationResult;

        if (!verification.success) {
          callback(model.events.ERROR('Verfication failed.'));
        } else {
          callback(model.events.VERIFIED());
        }
      },
    },
  }
);

interface VerificationResult {
  success: boolean;
}
