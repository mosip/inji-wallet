import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../../shared/GlobalContext';
import {VCMetadata} from '../../../shared/VCMetadata';
import {
  Credential,
  DecodedCredential,
  VerifiableCredential,
  WalletBindingResponse,
} from '../VCMetaMachine/vc';
import {CommunicationDetails} from '../../../shared/Utils';
import {VCItemEvents} from './VCItemEvents';
import {vcVerificationBannerDetails} from '../../../components/BannerNotificationContainer';

export const VCItemModel = createModel(
  {
    serviceRefs: {} as AppServices,
    vcMetadata: {} as VCMetadata,
    generatedOn: new Date() as Date,
    credential: null as unknown as DecodedCredential,
    verifiableCredential: null as unknown as Credential,
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
    verificationStatus: null as vcVerificationBannerDetails | null,
    showVerificationStatusBanner: false as boolean,
  },
  {
    events: VCItemEvents,
  },
);
