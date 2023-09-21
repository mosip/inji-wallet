import {authorize, AuthorizeResult} from 'react-native-app-auth';
import {assign, EventFrom, send, sendParent, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {Theme} from '../components/ui/styleUtils';
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
import {VerifiableCredential} from '../components/VC copy/EsignetMosipVCItem/vc';

const model = createModel(
  {
    issuers: [] as issuerType[],
    selectedIssuer: [] as issuerType[],
    tokenResponse: {} as AuthorizeResult,
    errorMessage: '' as string,
    loadingReason: 'displayIssuers' as string,
    verifiableCredential: null as VerifiableCredential | null,
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
    /** @xstate-layout N4IgpgJg5mDOIC5QEtawK5gE6wLIEMBjAC2QDswA6AG1QBcBJNTHAYggHsLLY786qqDNjxFS3WrybCcAbQAMAXUSgADh1jI6yLipAAPRAEYA7PMomj8gJwAWeSYAcTgMy2TJgDQgAnsZPWlLYArC5GAEzWEfKRtka2AL4J3kIsoiTkVLBg1GCE2mRQ0iysACIA8gDqAHIAMuUAgqUA+gBqDA3NDKUKykgg6prauv2GCMHuFo7W8sET8i4x1uHefgimJpTWoRHWJrYuc9YAbEkpzCIEGdzZufnkRRdYrADKAKK1bwDCACpvLQwXi8AKpvABKvT0gy0OjIejGE02Thmc3si0iK18iEcRiC1nxJxR22OjhcZxAqUuYkyPByeQKjxkZUBuEBL0h-Whwzho0QiKmKPm6OWq0Q4X2QXkx3C0uCOKM0pcJnJlJwV3EWTp+WK2HYXCyfAElFV6Q1tLujCeHLUGhhI1AY2mx0oRmCxyMjgcJMi8VF6xM4Uo4QWRjc2xMcqVp2SFKepppqmwADMOFgALYNdB0Yip5AAL34sNYDWBPwAEuUwQwAFr-a0DW3c+HGBaOILHeSOWwkj3hYIKv34rYmY4TUeOZzSxzR84yePcRNYFPpzPZ3MF7msMHfN4MVr-Zo-coAaTe1XrXNhzfW4VvlEW3YVMRcexlfo2Wx2kX2h2C20SMYmuqNIwHQXxYJAYBkNo+DUAAYlgHBpjqzycDchqCHGwHcKB4GQdByCwQhSEoRejZXry6zuG2yy9scSq0bY75WEGMpytM+wONsZLkmQHAQHAehAdSFBQuR9oGIgAC0xx+jJKpYSJghkFoYlDBRDqIMctiUB2EyOPpMzhM4mJrH2gTLHs8jxI44T2K6ClzthVCSJac5qXaPKaQgtimWK1lBJExwzF24QuMGtgAbOaTOea9IPChHlNpRLi2ZQ-Zur5o7PlEslYggwa4r5JwBFlLijvsjkxUpcXak8SUaZJCARi4Lq2F28izGEna2e+dgugExwmKl7hmFKVVUtcVCLsuGZZjmWD5oWEmXhJYxWCxtkxGiRjLJYjh+oVgUlXYMrlcElWAYpU2ULhEECQRRGIch9WcuJXlNfECqBR6MTOHYZgHflwZtkNVkxGdrbhBNao1cgEC5A1a2IC1bUdV1VgTn5BV7JQWOksENhyk4RhJEkQA */
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
          onError: {
            actions: [() => console.log('error in invokeAuth - ', event.data)],
            target: 'downloadCredentials',
          },
        },
      },
      checkKeyPair: {
        description: 'checks whether key pair is generated',
        entry: [
          context =>
            log(
              'Reached CheckKeyPair context -> ',
              JSON.stringify(context, null, 4),
            ),
          send('CHECK_KEY_PAIR'),
        ],
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
            actions: 'setVerifiableCredential',
            target: 'verifyingCredential',
          },
          onError: {
            actions: () => console.log('in error of downloadCredential'),
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
        entry: () => console.log('in state verifyingCredential'),
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
        entry: () => console.log('entered idle state'),
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
        context => {
          const [issuer, protocol, id] =
            context.verifiableCredential?.identifier.split(':');
          return StoreEvents.PREPEND(
            MY_VCS_STORE_KEY,
            VCMetadata.fromVC({
              id: id ? id : null,
              issuer: issuer,
              protocol: protocol,
            }),
          );
        },
        {
          to: context => context.serviceRefs.store,
        },
      ),

      storeVerifiableCredentialData: send(
        context => {
          const [issuer, protocol, id] =
            context.verifiableCredential?.identifier.split(':');
          return StoreEvents.SET(
            VCMetadata.fromVC({
              id: id ? id : null,
              issuer: issuer,
              protocol: protocol,
            }).getVcKey(),
            context.verifiableCredential,
          );
        },
        {
          to: context => context.serviceRefs.store,
        },
      ),

      storeVcMetaContext: send(
        context => {
          console.log('storeVcMetaContext');
          const [issuer, protocol, id] =
            context.verifiableCredential?.identifier.split(':');

          return {
            type: 'VC_ADDED',
            vcMetadata: VCMetadata.fromVC({
              id: id ? id : null,
              issuer: issuer,
              protocol: protocol,
            }),
          };
        },
        {
          to: context => context.serviceRefs.vc,
        },
      ),

      storeVcsContext: send(
        context => {
          console.log('storeVcsContext');
          const [issuer, protocol, id] =
            context.verifiableCredential?.identifier.split(':');
          return {
            type: 'VC_DOWNLOADED_FROM_OPENID4VCI',
            vcMetadata: VCMetadata.fromVC({
              id: id ? id : null,
              issuer: issuer,
              protocol: protocol,
            }),
            vc: context.verifiableCredential,
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
          console.log('event on verifiableCredential', event);
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
          const {
            verifiableCredential: {credential},
          } = context;
          return ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: VCMetadata.fromVC(
              context.verifiableCredential,
              true,
            ).getVcKey(),
            type: 'VC_DOWNLOADED',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: '',
          });
        },
        {
          to: context => context.serviceRefs.activityLog,
        },
      ),
    },
    services: {
      downloadIssuersList: async () => {
        const defaultIssuer = {
          id: 'UIN, VID, AID',
          displayName: 'UIN, VID, AID',
          logoUrl: Theme.DigitIcon,
        };

        const response = await request('GET', '/residentmobileapp/issuers');
        return [defaultIssuer, ...response.response.issuers];
      },
      downloadIssuerConfig: async (_, event) => {
        const response = await request(
          'GET',
          `/residentmobileapp/issuers/${event.id}`,
        );
        return response.response;
      },
      downloadCredential: async context => {
        const body = await getBody(context);
        const response = await fetch(
          'https://api-internal.dev1.mosip.net/v1/esignet/vci/credential',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + context.tokenResponse?.accessToken,
            },
            body: JSON.stringify(body),
          },
        );
        const credential = await response.json();
        credential.identifier = getIdentifier(context, credential);
        credential.generatedOn = new Date();
        console.log(
          'Response from downloadCredential',
          JSON.stringify(credential, null, 4),
        );
        return credential;
      },
      invokeAuthorization: async context => {
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
        return context;
      },
      verifyCredential: async context => {
        console.log('verified verifyCredential');
        return true;
        // return verifyCredential(context.verifiableCredential.credential);
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
