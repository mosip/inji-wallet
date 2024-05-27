import {NativeModules} from 'react-native';
import {__AppId} from '../GlobalVariables';

export class VciClient {
  static async downloadCredential(
    issuerMetaData: Object,
    jwtProof: string,
    accessToken: string,
  ) {
    const InjiVciClient = NativeModules.InjiVciClient;
    InjiVciClient.init(__AppId.getValue());
    const credentialResponse = await InjiVciClient.requestCredential(
      issuerMetaData,
      jwtProof,
      accessToken,
    );
    return JSON.parse(credentialResponse);
  }
}
