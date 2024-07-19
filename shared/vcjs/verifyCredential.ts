import jsonld from '@digitalcredentials/jsonld';
import vcjs from '@digitalcredentials/vc';
import {RsaSignature2018} from '../../lib/jsonld-signatures/suites/rsa2018/RsaSignature2018';
import {Ed25519Signature2018} from '../../lib/jsonld-signatures/suites/ed255192018/Ed25519Signature2018';
import {AssertionProofPurpose} from '../../lib/jsonld-signatures/purposes/AssertionProofPurpose';
import {PublicKeyProofPurpose} from '../../lib/jsonld-signatures/purposes/PublicKeyProofPurpose';
import {
  Credential,
  VerifiableCredential,
} from '../../machines/VerifiableCredential/VCMetaMachine/vc';
import {getErrorEventData, sendErrorEvent} from '../telemetry/TelemetryUtils';
import {TelemetryConstants} from '../telemetry/TelemetryConstants';
import {getMosipIdentifier} from '../commonUtil';

// FIXME: Ed25519Signature2018 not fully supported yet.
// Ed25519Signature2018 proof type check is not tested with its real credential
const ProofType = {
  ED25519: 'Ed25519Signature2018',
  RSA: 'RsaSignature2018',
};

const ProofPurpose = {
  Assertion: 'assertionMethod',
  PublicKey: 'publicKey',
};

export async function verifyCredential(
  verifiableCredential: Credential,
): Promise<VerificationResult> {
  try {
    let purpose: PublicKeyProofPurpose | AssertionProofPurpose;
    const proof = verifiableCredential.proof;
    switch (proof.proofPurpose) {
      case ProofPurpose.PublicKey:
        purpose = new PublicKeyProofPurpose();
        break;
      case ProofPurpose.Assertion:
        purpose = new AssertionProofPurpose();
        break;
    }

    let suite: Ed25519Signature2018 | RsaSignature2018;
    const suiteOptions = {
      verificationMethod: proof.verificationMethod,
      date: proof.created,
    };
    switch (proof.type) {
      case ProofType.ED25519: {
        suite = new Ed25519Signature2018(suiteOptions);
        break;
      }
      case ProofType.RSA: {
        suite = new RsaSignature2018(suiteOptions);
        break;
      }
    }

    const vcjsOptions = {
      purpose,
      suite,
      credential: verifiableCredential,
      documentLoader: jsonld.documentLoaders.xhr(),
    };

    //ToDo - Have to remove once range error is fixed during verification
    const result = await vcjs.verifyCredential(vcjsOptions);
    return handleResponse(result, verifiableCredential);

    //ToDo Handle Expiration error message
  } catch (error) {
    console.error('Error occured while verifying the VC:', error);
    const stacktrace = __DEV__ ? verifiableCredential : {};
    sendErrorEvent(
      getErrorEventData(
        TelemetryConstants.FlowType.vcVerification,
        TelemetryConstants.ErrorId.vcVerificationFailed,
        error +
          '-' +
          getMosipIdentifier(verifiableCredential.credentialSubject),
        stacktrace,
      ),
    );
    return {
      isVerified: false,
      errorMessage: VerificationErrorType.TECHNICAL_ERROR,
    };
  }
}

function handleResponse(
  result: any,
  verifiableCredential: VerifiableCredential | Credential,
) {
  var errorMessage = VerificationErrorType.NO_ERROR;
  var isVerifiedFlag = true;

  if (!result?.verified) {
    let errorCodeName = result['results'][0].error.name;
    errorMessage = VerificationErrorType.TECHNICAL_ERROR;
    isVerifiedFlag = false;

    if (errorCodeName == 'jsonld.InvalidUrl') {
      errorMessage = VerificationErrorType.NETWORK_ERROR;
    } else if (errorCodeName == VerificationErrorType.RANGE_ERROR) {
      errorMessage = VerificationErrorType.RANGE_ERROR;
      const vcIdentifier = getMosipIdentifier(
        verifiableCredential.credentialSubject,
      );
      const stacktrace = __DEV__ ? verifiableCredential : {};
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.vcVerification,
          TelemetryConstants.ErrorId.vcVerificationFailed,
          TelemetryConstants.ErrorMessage.vcVerificationFailed + vcIdentifier,
          stacktrace,
        ),
      );
      isVerifiedFlag = true;
    }
  }

  const verificationResult: VerificationResult = {
    isVerified: isVerifiedFlag,
    errorMessage: errorMessage,
  };
  return verificationResult;
}

export const VerificationErrorType = {
  NO_ERROR: '',
  TECHNICAL_ERROR: 'technicalError',
  RANGE_ERROR: 'RangeError',
  NETWORK_ERROR: 'networkError',
  EXPIRATION_ERROR: 'expirationError',
};

export interface VerificationResult {
  errorMessage: string;
  isVerified: boolean;
}
