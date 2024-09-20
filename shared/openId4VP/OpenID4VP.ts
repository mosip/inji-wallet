import {NativeModules} from 'react-native';
import {__AppId} from '../GlobalVariables';
import {VC} from '../../machines/VerifiableCredential/VCMetaMachine/vc';

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
}
