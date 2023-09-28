import {authorize, AuthorizeResult} from 'react-native-app-auth';
import {assign, EventFrom, send, sendParent, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {MY_VCS_STORE_KEY} from '../shared/constants';
import {request} from '../shared/request';
import {StoreEvents} from './store';
import {AppServices} from '../shared/GlobalContext';
import {
  generateKeys,
  isCustomSecureKeystore,
} from '../shared/cryptoutil/cryptoUtil';
import SecureKeystore from 'react-native-secure-keystore';
import {KeyPair} from 'react-native-rsa-native';
import {ActivityLogEvents} from './activityLog';
import {log} from 'xstate/lib/actions';
import {verifyCredential} from '../shared/vcjs/verifyCredential';
import {getBody, getIdentifier} from '../shared/openId4VCI/Utils';
import {VCMetadata} from '../shared/VCMetadata';
import {
  CredentialWrapper,
  VerifiableCredential,
} from '../types/VC/EsignetMosipVC/vc';
import {CACHED_API} from '../shared/api';

const TIMEOUT_SEC = 10;

const model = createModel(
  {
    issuers: [] as issuerType[],
    selectedIssuer: {} as issuerType,
    tokenResponse: {} as AuthorizeResult,
    errorMessage: '' as string,
    loadingReason: 'displayIssuers' as string,
    verifiableCredential: null as VerifiableCredential | null,
    credentialWrapper: {} as CredentialWrapper,
    serviceRefs: {} as AppServices,

    publicKey: ``,
    privateKey: ``,
  },
  {
    events: {
      DISMISS: () => ({}),
      SELECTED_ISSUER: (id: string) => ({id}),
      DOWNLOAD_ID: () => ({}),
      COMPLETED: () => ({}),
      TRY_AGAIN: () => ({}),
      RESET_ERROR: () => ({}),
      CHECK_KEY_PAIR: () => ({}),
      CANCEL: () => ({}),
    },
  },
);

export const IssuerScreenTabEvents = model.events;
export const Issuer_Tab_Ref_Id = 'issuersMachine';

export const Issuers_Key_Ref = 'OpenId4VCI';
export const IssuersMachine = model.createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEtawK5gE6wLIEMBjAC2QDswA6CVABwBt8BPASTUxwGIIB7Cy8gDceAayqoM2PEVL8asBszaScCIT0L4ALsj4BtAAwBdQ0cShaPWMh19zIAB6IAjAA4ALAE5KAZgCsBs4A7D4ATABs7j4GngA0IEyI4X6hlO7hQUFemc5+Pp4+AL6F8RIc0iTkVPKKrOxSnNhYPFiUiloAZi0AtgL1OASVcnSMdSqwamTCmrZkpqb2ltaz9k4Ibl6+AcFhkdFxCS5B4ZQp4c4GBqF+fkGhQX7hxaX9FbJUTS2cACoASgCaAH0AIIAcWBLAAcgskCAljZdGRVi4CkE0s4oqFLqFPM5nJ5QvFEghXM5KG4Qu4Hp4YkFckFniAylJBu9KJ8sJxfgBRADK3O+gO5v1+AHlfjCLFYEXZYWtrhjKOEaUFXJ4aa5Qu5CYcEJ4TuEfD4qRc-ASDAFXIzmQMZFV2VhmlhQj8ASDwVDJXDpSs5YgfOFLpQDNF3K5Ih5woGgkTEK5XD5KAmPAZ3AYstF49bXqz7RyXTz+YLhWKJcZFj7EciEAGgyHU+Gw+lo7GEKrXGl1UFAncjddPNnxrn+ByfK6gWCIdDy7D4b7QGtawZg6HG5GW7rnBE-Kdcp4zXTqe5B+Vhx9HS0x4WBUKReKvXOq36a4Hl-WwxHm+nW3ju+Sco8IQ0pEDIlEyOZ2vwsBgPQYCEDoZBQMoHCcAAIqKADqkIADKisCqGAiwqEPpWsoLogoShMESZGg8uShGqOKtrciY+EENKUTijyPE8YE2m89rQbB8HkEh-ScPy2HcgAwt83IESwvK8gAqsKJHLE+5EIAq7hKiqaoalqOrEh4unuFuPgeH4+LnJkJ4spB1Q8AA7mQ9A8PgEDIdg0l8B0yBQNwfDiFMojiBBQxOa57med5WC+WQ-lQJM0zaIi8wzlKGlkY4-rpmiW7sYayoGOcPg-lcHYBKqKSXPuzgZPZtqRdQLluR5Xn9AlSWNBerTtF0WC9PxZ6tdFHVxd1AUpRoaX6MY6kykiz7RJk5L3PqAbAc45W6q4IaUJkBSUVtkSBE1An8LQ2CDd0wLoFoxAtMgABec1kEF-DqGIfRDo5bQ3T092Pc9b2zDNMzpQtmXetly1aUuK4Np+Ubfpu7h5OSx36uEVlmn4F2jddWC3cDT1YK9729U6bSMJ0PS-ae-3E6TD3k5T4PqJD80mDDj45YugZkmxpWeO4GM0jcP61kmfhUuEET6hZhP-SQcEiAA0mATAAAr4MgnLSQAEjJGuAhr3JAjrEJlmYs6kfDuU1lRlBGYGyQBOmmo-luZK+5ZxXWftVp8RFbJq4Qmva3rBucMbpvm5bgLWywErOHbWVLdWYRkm7pU3JcqrGXG+Q0fuVFRuxYYDqHf0tTAFBYNoYBa7r+ucrwX2hT9I3-Q32DN63MdYBD70ZRnsNZ8+FzRK7YtagU1n6qVrY0rp8bhnLxzKikKv12AjeD9H7efSFwg92H9r903Wgt8fBuj7M8zpxWcPVjPy44tqXj+DZK+6jVJMCtcYEnFgqGuLw65sl4ONTy0ksCQAPjofA9BYCnwEN3cKUD7QwPanAhBEAkHIBQRMLmY9oYT35o7NYGxvD+B7LsKIMRWxZHXqVBibEzSeAeKBSBTMWq4JihAeBiCyDINQdTFotNtC3UZg5ARbUhEiMIWI4hqDH5Q15pQh278PB0O2CECITCDjEjxK4HcGNcb3GVLiFIoQ97QMUR1ZRRCSFx2BJCaS3JsKLXnE7WhWwGFGP2K2BMBUMb5W7DifODj7SCGwMgDoTBRIuNUSg9B30sH8LZPEimSSUkENcfQDRPNfGaSdjpPSXt1QGE1NqVsfZyTmTYriHGtTjSxP4LkxJyTEKpPEZI-qdNZG9xat0-JfTClpOKWQp+FDX5Ty0pUkqqoal1OLggJeh06RRjTKVCMvDwLYK+hAWCcdRS4B1lJOSxE+Y6OfFEM0lB9JhFTDEcW0tUieE3sqMI2osQhz4fItkyBTlgHcZ47xZSBb+m7CcFI6QLgRHDJkVsVilRf2+eqSyxoa5gTIDwQh8BYSjPeAsvxawAC04RWzUs6dUEYShXjkvKTQrwZJzFRm+SA5UO0fyPF8ArK4PgMTBFxI1Wu2S8x9RZTC7SGJlx5EsvudiW4-DhlXmidIYDK4ivec4elDonShFldQ-0YREw2JnnsTUERQkHTxJceM3z8QXGPJK4F0qnQ+FNdnC1elcQhhtZRGlm4NiHVcEeEVGJKIEw9c1NkQk4IITEioX1z4K47kuOLdMe4MxopCIdYI+1AjBBxBAo5Uq5BONil1PyAV01LLuLnTUPKrjJHtTuG4+obg3EiNcQ5pL7QsyBmzUG71G1O2VcuEIRUqK5CjEaVepVTiGiNMkQ04t1SGojlHNuBtJ1rHqZuXN2yTpajyMcayhrr5H33VgQ9SQwinEjamfIOI3UbJLc8lFBJuxUkeBWod1bYHCKmeI4lmcKUuCbK7TUx14wWjhaEvEzyzSBGuOW3Ghrxm9KgP0tRj7tLvPWniNMuQRUat1NG12YR1R2ItDiLIhrYBaGeohIj9wXYMWRcvbcrZQil32gxO4ctIz6nsfGy64gwVEfyHLckuNjhhmxNw6WiZKLpmNGmHhjzDWdzAERjGuQkwPGVJG8ytT3AVQ7Guna3zalnDlsUYoQA */
    predictableActionArguments: true,
    preserveActionOrder: true,
    id: Issuer_Tab_Ref_Id,
    context: model.initialContext,
    initial: 'displayIssuers',
    tsTypes: {} as import('./issuersMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    states: {
      displayIssuers: {
        description: 'displays the issuers downloaded from the server',
        invoke: {
          src: 'downloadIssuersList',
          onDone: {
            actions: ['setIssuers'],
            target: 'selectingIssuer',
          },
          onError: {
            actions: ['setError'],
            target: 'error',
          },
        },
      },
      error: {
        description: 'reaches here when any error happens',
        on: {
          TRY_AGAIN: {
            actions: 'resetError',
            target: 'displayIssuers',
          },
          RESET_ERROR: {
            actions: 'resetError',
            target: 'idle',
          },
        },
      },
      error2: {
        description: 'reaches here when issuer config is not available',
        on: {
          TRY_AGAIN: {
            actions: 'resetError',
            target: 'downloadCredentials',
          },
          RESET_ERROR: {
            actions: 'resetError',
            target: 'idle',
          },
        },
      },
      error3: {
        description: 'reaches here when auth callback fails',
        on: {
          TRY_AGAIN: {
            actions: 'resetError',
            target: 'downloadCredentials',
          },
          RESET_ERROR: {
            actions: 'resetError',
            target: 'idle',
          },
        },
      },
      selectingIssuer: {
        description: 'waits for the user to select any issuer',
        on: {
          DOWNLOAD_ID: {
            actions: sendParent('DOWNLOAD_ID'),
          },
          SELECTED_ISSUER: {
            target: 'downloadIssuerConfig',
          },
        },
      },
      downloadIssuerConfig: {
        description: 'downloads the configuration of the selected issuer',
        invoke: {
          src: 'downloadIssuerConfig',
          onDone: {
            actions: 'setSelectedIssuers',
            target: 'performAuthorization',
          },
          onError: {
            actions: 'setError',
            target: 'error2',
          },
        },
      },
      performAuthorization: {
        description:
          'invokes the issuers authorization endpoint and gets the access token',
        invoke: {
          src: 'invokeAuthorization',
          onDone: {
            actions: ['setTokenResponse', 'getKeyPairFromStore', 'loadKeyPair'],
            target: 'checkKeyPair',
          },
          onError: [
            {
              cond: (_, event) => event.data.error !== 'User cancelled flow',
              actions: [
                (_, event) => console.log('error in invokeAuth - ', event.data),
                'setError',
              ],
              target: 'error3',
            },
            {
              cond: (_, event) =>
                event.data.error !== 'Invalid token specified',
              target: 'downloadCredentials',
            },
          ],
        },
      },
      checkKeyPair: {
        description: 'checks whether key pair is generated',
        entry: [send('CHECK_KEY_PAIR')],
        on: {
          CHECK_KEY_PAIR: [
            {
              cond: 'hasKeyPair',
              target: 'downloadCredentials',
            },
            {
              target: 'generateKeyPair',
            },
          ],
        },
      },
      generateKeyPair: {
        description:
          'if keypair is not generated, new one is created and stored',
        invoke: {
          src: 'generateKeyPair',
          onDone: [
            {
              actions: ['setPublicKey', 'setPrivateKey', 'storeKeyPair'],
              target: 'downloadCredentials',
            },
            {
              actions: ['setPublicKey', 'storeKeyPair'],
              cond: 'isCustomSecureKeystore',
              target: 'downloadCredentials',
            },
          ],
        },
      },
      downloadCredentials: {
        description: 'credential is downloaded from the selected issuer',
        invoke: {
          src: 'downloadCredential',
          onDone: {
            actions: ['setVerifiableCredential', 'setCredentialWrapper'],
            target: 'verifyingCredential',
          },
          onError: {
            actions: 'setError',
            target: 'error3',
          },
        },
        on: {
          CANCEL: {
            target: 'selectingIssuer',
          },
        },
      },
      verifyingCredential: {
        description:
          'once the credential is downloaded, it is verified before saving',
        invoke: {
          src: 'verifyCredential',
          onDone: [
            {
              target: 'storing',
            },
          ],
          onError: [
            {
              actions: log((_, event) => (event.data as Error).message),
              //TODO: Move to state according to the required flow when verification of VC fails
              target: 'idle',
            },
          ],
        },
      },
      storing: {
        description: 'all the verified credential is stored.',
        entry: [
          'storeVerifiableCredentialMeta',
          'storeVerifiableCredentialData',
          'storeVcsContext',
          'storeVcMetaContext',
          'logDownloaded',
        ],
      },
      idle: {
        on: {
          COMPLETED: {
            target: 'done',
          },
          CANCEL: {
            target: 'selectingIssuer',
          },
        },
      },
      done: {
        entry: () => console.log('Reached done'),
        type: 'final',
      },
    },
  },
  {
    actions: {
      setIssuers: model.assign({
        issuers: (_, event) => event.data,
        loadingReason: null,
      }),

      setError: model.assign({
        errorMessage: (_, event) => {
          console.log('Error while fetching issuers ', event.data.message);
          if (event.data.message === 'User cancelled flow') {
            // not an error if user has pressed back button or closes the tab
            return '';
          }
          return event.data.message === 'Network request failed'
            ? 'noInternetConnection'
            : 'generic';
        },
        loadingReason: null,
      }),

      resetError: model.assign({
        errorMessage: '',
      }),

      loadKeyPair: assign({
        publicKey: (_, event) => event.publicKey,
        privateKey: (context, event) =>
          event.privateKey ? event.privateKey : context.privateKey,
      }),
      getKeyPairFromStore: send(StoreEvents.GET(Issuers_Key_Ref), {
        to: context => context.serviceRefs.store,
      }),
      storeKeyPair: send(
        (_, event) => {
          return StoreEvents.SET(Issuers_Key_Ref, {
            publicKey: (event.data as KeyPair).public + ``,
            privateKey: (event.data as KeyPair).private + ``,
          });
        },
        {
          to: context => context.serviceRefs.store,
        },
      ),

      storeVerifiableCredentialMeta: send(
        context =>
          StoreEvents.PREPEND(MY_VCS_STORE_KEY, getVCMetadata(context)),
        {
          to: context => context.serviceRefs.store,
        },
      ),

      storeVerifiableCredentialData: send(
        context =>
          StoreEvents.SET(
            getVCMetadata(context).getVcKey(),
            context.credentialWrapper,
          ),
        {
          to: context => context.serviceRefs.store,
        },
      ),

      storeVcMetaContext: send(
        context => {
          return {
            type: 'VC_ADDED',
            vcMetadata: getVCMetadata(context),
          };
        },
        {
          to: context => context.serviceRefs.vc,
        },
      ),

      storeVcsContext: send(
        context => {
          return {
            type: 'VC_DOWNLOADED_FROM_OPENID4VCI',
            vcMetadata: getVCMetadata(context),
            vc: context.credentialWrapper,
          };
        },
        {
          to: context => context.serviceRefs.vc,
        },
      ),

      setSelectedIssuers: model.assign({
        selectedIssuer: (_, event) => event.data,
      }),
      setTokenResponse: model.assign({
        tokenResponse: (_, event) => event.data,
        loadingReason: 'settingUp',
      }),
      setVerifiableCredential: model.assign({
        verifiableCredential: (_, event) => {
          return event.data.verifiableCredential;
        },
      }),
      setCredentialWrapper: model.assign({
        credentialWrapper: (_, event) => {
          return event.data;
        },
      }),
      setPublicKey: assign({
        publicKey: (context, event) => {
          if (!isCustomSecureKeystore()) {
            return (event.data as KeyPair).public;
          }
          return event.data as string;
        },
        loadingReason: 'downloadingCredentials',
      }),

      setPrivateKey: assign({
        privateKey: (context, event) => (event.data as KeyPair).private,
      }),

      logDownloaded: send(
        context => {
          return ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: getVCMetadata(context).getVcKey(),
            type: 'VC_DOWNLOADED',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: getVCMetadata(context).id,
          });
        },
        {
          to: context => context.serviceRefs.activityLog,
        },
      ),
    },
    services: {
      downloadIssuersList: async () => {
        return await CACHED_API.fetchIssuers();
      },

      downloadIssuerConfig: async (_, event) => {
        return await CACHED_API.fetchIssuerConfig(event.id);
      },

      downloadCredential: async context => {
        const body = await getBody(context);
        const response = await fetch(
          context.selectedIssuer.serviceConfiguration.credentialEndpoint,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + context.tokenResponse?.accessToken,
            },
            body: JSON.stringify(body),
          },
        );
        let credential = await response.json();
        credential = updateCredentialInformation(context, credential);
        return credential;
      },
      invokeAuthorization: async context => {
        console.log('ISSUER: ', context.selectedIssuer);
        const response = await authorize(context.selectedIssuer);
        return response;
      },
      generateKeyPair: async context => {
        if (!isCustomSecureKeystore()) {
          return await generateKeys();
        }
        const isBiometricsEnabled = SecureKeystore.hasBiometricsEnabled();
        return SecureKeystore.generateKeyPair(
          Issuers_Key_Ref,
          isBiometricsEnabled,
          0,
        );
      },
      verifyCredential: async context => {
        return verifyCredential(context.verifiableCredential?.credential);
      },
    },
    guards: {
      hasKeyPair: context => {
        return context.publicKey != null;
      },
      isCustomSecureKeystore: () => isCustomSecureKeystore(),
    },
  },
);

type State = StateFrom<typeof IssuersMachine>;

export function selectIssuers(state: State) {
  return state.context.issuers;
}

export function selectErrorMessage(state: State) {
  return state.context.errorMessage;
}

export function selectLoadingReason(state: State) {
  return state.context.loadingReason;
}

export function selectIsDownloadCredentials(state: State) {
  return state.matches('downloadCredentials');
}

export function selectIsDone(state: State) {
  return state.matches('done');
}

export function selectIsIdle(state: State) {
  return state.matches('idle');
}

export function selectStoring(state: State) {
  return state.matches('storing');
}

interface issuerType {
  id: string;
  displayName: string;
  logoUrl: string;
}

const updateCredentialInformation = (context, credential) => {
  let credentialWrapper: CredentialWrapper = {};
  credentialWrapper.verifiableCredential = credential;
  credentialWrapper.verifiableCredential.issuerLogo =
    context.selectedIssuer.logoUrl;
  credentialWrapper.identifier = getIdentifier(context, credential);
  credentialWrapper.generatedOn = new Date();
  credentialWrapper.issuerLogo = context.selectedIssuer.logoUrl;
  return credentialWrapper;
};

const getVCMetadata = context => {
  const [issuer, protocol, requestId] =
    context.credentialWrapper?.identifier.split(':');
  return VCMetadata.fromVC({
    requestId: requestId ? requestId : null,
    issuer: issuer,
    protocol: protocol,
    id: context.verifiableCredential?.credential.credentialSubject.UIN
      ? context.verifiableCredential?.credential.credentialSubject.UIN
      : context.verifiableCredential?.credential.credentialSubject.VID,
  });
};
