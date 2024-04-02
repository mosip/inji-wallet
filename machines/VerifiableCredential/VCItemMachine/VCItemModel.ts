import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../../shared/GlobalContext';
import {VCMetadata} from '../../../shared/VCMetadata';
import {VerifiableCredential, WalletBindingResponse} from '../VCMetaMachine/vc';
import {CommunicationDetails} from '../../../shared/Utils';
import {VCItemEvents} from './VCItemEvents';

export const VCItemModel = createModel(
  {
    serviceRefs: {} as AppServices,
    vcMetadata: {} as VCMetadata,
    generatedOn: new Date() as Date,
    verifiableCredential: null as unknown as VerifiableCredential,
    hashedId: '',
    publicKey: '',
    privateKey: '',
    OTP: '',
    error: '',
    bindingTransactionId: '',
    requestId: '',
    downloadCounter: 0,
    maxDownloadCount: null as unknown as number,
    downloadInterval: null as unknown as number,
    walletBindingResponse: null as unknown as WalletBindingResponse,
    isMachineInKebabPopupState: false,
    communicationDetails: null as unknown as CommunicationDetails,
  },
  {
    events: VCItemEvents,
  },
);
