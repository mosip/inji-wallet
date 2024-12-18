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
import {NativeModules} from 'react-native';
import {isAndroid} from '../constants';
import {VCFormat} from '../VCFormat';

// FIXME: Ed25519Signature2018 not fully supported yet.
// Ed25519Signature2018 proof type check is not tested with its real credential
const ProofType = {
  ED25519_2018: 'Ed25519Signature2018',
  RSA: 'RsaSignature2018',
  ED25519_2020: 'Ed25519Signature2020',
};

const ProofPurpose = {
  Assertion: 'assertionMethod',
  PublicKey: 'publicKey',
};

const vcVerifier = NativeModules.VCVerifierModule;

export async function verifyCredential(
  verifiableCredential: Credential,
  credentialFormat: string
): Promise<VerificationResult> {
  try {
    if (isAndroid()) {
      return await verifyCredentialForAndroid(verifiableCredential, credentialFormat);
    }
    return await verifyCredentialForIos(verifiableCredential, credentialFormat);
  } catch (error) {
    console.error('Error occurred during credential verification:', error);

    return {
      isVerified: false,
      verificationMessage: error.message,
      verificationErrorCode: VerificationErrorType.GENERIC_TECHNICAL_ERROR,
    };
  }
}

async function verifyCredentialForAndroid(
  verifiableCredential: Credential,
  credentialFormat: string
): Promise<VerificationResult> {
  const credentialString = typeof verifiableCredential === 'string'
    ? verifiableCredential
    : JSON.stringify(verifiableCredential);
  
  const vcVerifierResult = await vcVerifier.verifyCredentials(credentialString, credentialFormat);
  return handleVcVerifierResponse(vcVerifierResult, verifiableCredential);
}

async function verifyCredentialForIos(
  verifiableCredential: Credential,
  credentialFormat: string
): Promise<VerificationResult> {
  if (credentialFormat === VCFormat.mso_mdoc) {
    return createSuccessfulVerificationResult();
  }
  /*
  Since Digital Bazaar library is not able to verify ProofType: "Ed25519Signature2020",
  defaulting it to return true until VcVerifier is implemented for iOS.
  */
  if (verifiableCredential.proof.type === ProofType.ED25519_2020) {
    return createSuccessfulVerificationResult();
  }

  const purpose = getPurposeFromProof(verifiableCredential.proof.proofPurpose);
  const suite = selectVerificationSuite(verifiableCredential.proof);
  const vcjsOptions = {
    purpose,
    suite,
    credential: verifiableCredential,
    documentLoader: jsonld.documentLoaders.xhr(),
  };

  const result = await vcjs.verifyCredential(vcjsOptions);
  return handleResponse(result, verifiableCredential);
}

function getPurposeFromProof(proofPurpose) {
  switch (proofPurpose) {
    case ProofPurpose.PublicKey:
      return new vcjs.PublicKeyProofPurpose();
    case ProofPurpose.Assertion:
      return new vcjs.AssertionProofPurpose();
    default:
      throw new Error('Unsupported proof purpose');
  }
}

function selectVerificationSuite(proof: any) {
  const suiteOptions = {
    verificationMethod: proof.verificationMethod,
    date: proof.created,
  };

  switch (proof.type) {
    case ProofType.RSA:
      return new RsaSignature2018(suiteOptions);
    case ProofType.ED25519_2018:
      return new Ed25519Signature2018(suiteOptions);
    default:
      throw new Error('Unsupported proof type');
  }
}

function handleResponse(
  result: any,
  verifiableCredential: VerifiableCredential | Credential,
) {
  let errorMessage = VerificationErrorMessage.NO_ERROR;
  let errorCode = VerificationErrorType.NO_ERROR;
  let isVerifiedFlag = true;

  if (!result?.verified) {
    let errorCodeName = result['results'][0].error.name;
    errorMessage = VerificationErrorType.GENERIC_TECHNICAL_ERROR;
    isVerifiedFlag = false;
    errorCode = VerificationErrorType.GENERIC_TECHNICAL_ERROR;

    if (errorCodeName == 'jsonld.InvalidUrl') {
      errorMessage = VerificationErrorMessage.NETWORK_ERROR;
      errorCode = VerificationErrorType.NETWORK_ERROR;
    } else if (errorCodeName == VerificationErrorMessage.RANGE_ERROR) {
      errorMessage = VerificationErrorMessage.RANGE_ERROR;
      sendVerificationErrorEvent(
        TelemetryConstants.ErrorMessage.vcVerificationFailed,
        verifiableCredential,
      );
      isVerifiedFlag = true;
      errorCode = VerificationErrorType.RANGE_ERROR;
    }
  }

  const verificationResult: VerificationResult = {
    isVerified: isVerifiedFlag,
    verificationMessage: errorMessage,
    verificationErrorCode: errorCode,
  };
  return verificationResult;
}

function handleVcVerifierResponse(
  verificationResult: any,
  verifiableCredential: VerifiableCredential | Credential,
): VerificationResult {
  try {
    if (!verificationResult.verificationStatus) {
      verificationResult.verificationErrorCode = verificationResult.verificationErrorCode === ''
          ? VerificationErrorType.GENERIC_TECHNICAL_ERROR
          : verificationResult.verificationErrorCode;
      sendVerificationErrorEvent(
        verificationResult.verificationMessage,
        verifiableCredential,
      );
    }
    return {
      isVerified: verificationResult.verificationStatus,
      verificationMessage: verificationResult.verificationMessage,
      verificationErrorCode: verificationResult.verificationErrorCode,
    };
  } catch (error) {
    console.error(
      'Error occurred while verifying the VC using VcVerifier Library:',
      error,
    );
    sendVerificationErrorEvent(error, verifiableCredential);
    return {
      isVerified: false,
      verificationMessage: verificationResult.verificationMessage,
      verificationErrorCode: verificationResult.verificationErrorCode,
    };
  }
}

function createSuccessfulVerificationResult(): VerificationResult {
  return {
    isVerified: true,
    verificationMessage: VerificationErrorMessage.NO_ERROR,
    verificationErrorCode: VerificationErrorType.NO_ERROR,
  };
}

function sendVerificationErrorEvent(
  errorMessage: string,
  verifiableCredential: any,
) {
  const stacktrace = __DEV__ ? verifiableCredential : {};
  //Add only UIN / VID in the credential into telemetry error message and not document_number or other identifiers to avoid sensitivity issues
  let detailedError = errorMessage;
  if (verifiableCredential.credentialSubject)
    detailedError += `-${getMosipIdentifier(
      verifiableCredential.credentialSubject,
    )}`;

  sendErrorEvent(
    getErrorEventData(
      TelemetryConstants.FlowType.vcVerification,
      TelemetryConstants.ErrorId.vcVerificationFailed,
      detailedError,
      stacktrace,
    ),
  );
}

export const VerificationErrorType = {
  NO_ERROR: '',
  GENERIC_TECHNICAL_ERROR: 'ERR_GENERIC',
  NETWORK_ERROR: 'ERR_NETWORK',
  EXPIRATION_ERROR: 'ERR_VC_EXPIRED',
  RANGE_ERROR: 'ERR_RANGE',
};

export const VerificationErrorMessage = {
  NO_ERROR: '',
  RANGE_ERROR: 'RangeError',
  NETWORK_ERROR: 'NetworkError',
};

export interface VerificationResult {
  isVerified: boolean;
  verificationMessage: string;
  verificationErrorCode: string;
}
