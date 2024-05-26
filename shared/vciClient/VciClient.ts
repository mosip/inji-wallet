import {NativeModules} from 'react-native';
import {__AppId} from '../GlobalVariables';
import {isAndroid} from '../constants';

export class VciClient {
  static async downloadCredential(
    issuerMetaData: Object,
    jwtProof: string,
    accessToken: string,
  ) {
    if (isAndroid()) {
      const InjiVciClient = NativeModules.InjiVciClient;
      InjiVciClient.init(__AppId.getValue());
      const credentialResponse = await InjiVciClient.requestCredential(
        issuerMetaData,
        jwtProof,
        accessToken,
      );
      return JSON.parse(credentialResponse);
    } else {
      const {InjiVciClient} = NativeModules;
      InjiVciClient.init(__AppId.getValue());
      const credentialResponse = await InjiVciClient.requestCredential(
        issuerMetaData,
        jwtProof,
        accessToken,
      );
      return JSON.parse(credentialResponse);
    }
  }
}
