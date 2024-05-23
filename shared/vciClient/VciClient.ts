import {NativeModules} from 'react-native';
import {__AppId} from '../GlobalVariables';
import {isAndroid} from '../constants';
import {request} from '../request';
import {getCredentialRequestBody} from '../openId4VCI/Utils';

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
      const body = await getCredentialRequestBody(
        jwtProof,
        issuerMetaData['credentialType'],
      );
      return await request(
        'POST',
        issuerMetaData['credentialEndpoint'],
        body,
        '',
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
        issuerMetaData['downloadTimeoutInMilliSeconds'],
      );
    }
  }
}
