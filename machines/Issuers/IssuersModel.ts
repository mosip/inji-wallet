import {createModel} from 'xstate/lib/model';
import {AuthorizeResult} from 'react-native-app-auth';
import {
  CredentialTypes,
  CredentialWrapper,
  VerifiableCredential,
} from '../VerifiableCredential/VCMetaMachine/vc';
import {AppServices} from '../../shared/GlobalContext';
import {VCMetadata} from '../../shared/VCMetadata';
import {IssuersEvents} from './IssuersEvents';
import {issuerType} from './IssuersMachine';

export const IssuersModel = createModel(
  {
    issuers: [] as issuerType[],
    selectedIssuerId: '' as string,
    selectedIssuer: {} as issuerType,
    tokenResponse: {} as AuthorizeResult,
    errorMessage: '' as string,
    loadingReason: 'displayIssuers' as string,
    verifiableCredential: null as VerifiableCredential | null,
    selectedCredentialType: {} as CredentialTypes,
    supportedCredentialTypes: [] as CredentialTypes[],
    credentialWrapper: {} as CredentialWrapper,
    serviceRefs: {} as AppServices,
    verificationErrorMessage: '',
    publicKey: '',
    privateKey: '',
    vcMetadata: {} as VCMetadata,
    keyType:'RS256' as string,
    wellknownKeyTypes: []  as string[]
  },
  {
    events: IssuersEvents,
  },
);
