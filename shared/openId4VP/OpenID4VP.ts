import {NativeModules} from 'react-native';
import {__AppId} from '../GlobalVariables';
import {VC} from '../../machines/VerifiableCredential/VCMetaMachine/vc';
import {getJWT} from '../cryptoutil/cryptoUtil';
import {getJWK} from '../openId4VCI/Utils';

export const OpenID4VP_Key_Ref = 'OpenId4VP_KeyPair';
export const OpenID4VP_Proof_Algo_Type = 'RsaSignature2018';
export const OpenID4VP_Domain = 'OpenId4Vp';

export class OpenID4VP {
  static InjiOpenId4VP = NativeModules.InjiOpenId4VP;

  static initialize() {
    OpenID4VP.InjiOpenId4VP.init(__AppId.getValue());
  }

  static async authenticateVerifier(
    encodedAuthorizationRequest: string,
    trustedVerifiersList: any,
  ) {
    const authenticationResponse =
      await OpenID4VP.InjiOpenId4VP.authenticateVerifier(
        encodedAuthorizationRequest,
        trustedVerifiersList,
      );
    return JSON.parse(authenticationResponse);
  }

  static async constructVerifiablePresentationToken(
    selectedVCs: Record<string, VC[]>,
  ) {
    let updatedSelectedVCs = {};
    Object.keys(selectedVCs).forEach(inputDescriptorId => {
      updatedSelectedVCs[inputDescriptorId] = selectedVCs[
        inputDescriptorId
      ].map(vc => JSON.stringify(vc));
    });

    const vpToken =
      await OpenID4VP.InjiOpenId4VP.constructVerifiablePresentationToken(
        updatedSelectedVCs,
      );
    return vpToken;
  }

  static async shareVerifiablePresentation(
    vpResponseMetadata: Record<string, string>,
  ) {
    return await OpenID4VP.InjiOpenId4VP.shareVerifiablePresentation(
      vpResponseMetadata,
    );
  }
}

export async function constructProofJWT(
  publicKey: string,
  privateKey: string,
  vpToken: Object,
  keyType: string,
): Promise<string> {
  const jwtHeader = {
    alg: keyType,
    jwk: await getJWK(publicKey, keyType),
  };

  const jwtPayload = createJwtPayload(vpToken);

  return await getJWT(
    jwtHeader,
    jwtPayload,
    OpenID4VP_Key_Ref,
    privateKey,
    keyType,
  );
}

function createJwtPayload(vpToken: {[key: string]: any}) {
  const {'@context': context, type, verifiableCredential, id, holder} = vpToken;
  return {
    '@context': context,
    type,
    verifiableCredential,
    id,
    holder,
  };
}
