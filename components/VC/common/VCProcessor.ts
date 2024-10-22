import {NativeModules} from 'react-native';
import {VerifiableCredential} from '../../../machines/VerifiableCredential/VCMetaMachine/vc';
import {VCFormat} from '../../../shared/VCFormat';
import {getVerifiableCredential} from '../../../machines/VerifiableCredential/VCItemMachine/VCItemSelectors';

const {RNPixelpassModule} = NativeModules;

export class VCProcessor {
  static async processForRendering(
    vcData: VerifiableCredential,
    vcFormat: String,
  ): Promise<any> {
    console.log('data i ', vcData);
    if (vcFormat === VCFormat.mso_mdoc) {
      if (vcData.processedCredential) {
        return vcData.processedCredential;
      }
      const decodedString =
        await RNPixelpassModule.decodeBase64UrlEncodedCBORData(
          vcData.credential.toString(),
        );
      console.log('decoded the data ', decodedString);
      const parsedData = JSON.parse(decodedString);
      //TODO: Exclude issuerAuth to avoid bigger data?
      return parsedData;
    }
    return getVerifiableCredential(vcData);
  }
}
