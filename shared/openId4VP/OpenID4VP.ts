import {NativeModules} from 'react-native';
import {__AppId} from '../GlobalVariables';
import {VC} from '../../machines/VerifiableCredential/VCMetaMachine/vc';
import { getJWT } from '../cryptoutil/cryptoUtil';
import { getJWK } from '../openId4VCI/Utils';

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
    const updatedSelectedVCs = Object.keys(selectedVCs).forEach(
      inputDescriptorId => {
        updatedSelectedVCs[inputDescriptorId] = selectedVCs[
          inputDescriptorId
        ].map(vc => JSON.stringify(vc));
      },
    );
    const vpToken =
      await OpenID4VP.InjiOpenId4VP.constructVerifiablePresentationToken(
        updatedSelectedVCs,
      );
    return vpToken;
  }

  static async shareVerifiablePresentation(
    vpResponseMetadata: Record<string, string>,
  ) {
     return await OpenID4VP.InjiOpenId4VP.shareVerifiablePresentation(vpResponseMetadata);
  }

  static async constructProofJWS(
    publicKey: string,
    privateKey: string,
    vpToken: Object,
    keyType: string,
  ): Promise<string> {
    const jwtHeader = {
      alg: keyType,
      jwk: await getJWK(publicKey, keyType),
    };
    const jwsPayload = {
     "@context" : vpToken["@context"],
     type: vpToken["type"],
     verifiableCredential: vpToken["verifiableCredential"],
     id : vpToken["id"],
     holder: vpToken["holder"]
    };
    
    const jwsis =  await getJWT(
      jwtHeader,
      jwsPayload,
      "OpenId4Vp",
      privateKey,
      keyType,
    );
    return jwsis;
};
}
