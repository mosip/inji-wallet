import {authorize, AuthorizeResult} from 'react-native-app-auth';
import {assign, EventFrom, send, sendParent, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {MY_VCS_STORE_KEY} from '../shared/constants';
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

// OIDCErrors is a collection of external errors from the OpenID library or the issuer
enum OIDCErrors {
  OIDC_FLOW_CANCELLED_ANDROID = 'User cancelled flow',
  OIDC_FLOW_CANCELLED_IOS = 'org.openid.appauth.general error -3',

  INVALID_TOKEN_SPECIFIED = 'Invalid token specified',
}

const model = createModel(
  {
    issuers: [] as issuerType[],
    tempSelectedIssuer: '' as string,
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
    /** @xstate-layout N4IgpgJg5mDOIC5QEtawK5gE6wLIEMBjAC2QDswA6CVABwBt8BPASTUxwGIIB7Cy8gDceAayqoM2PEVL8asBszaScCIT0L4ALsj4BtAAwBdQ0cShaPWMh19zIAB6IATAHYAHAFZK7gGwBmd2cARgBOdwNgvwAaECZEV18DSmdfdw8ogBZQ-wN-TwBfAtiJDmkScip5RVZ2KU5sLB4sSkUtADNmgFsBOpwCCrk6RlqVWDUyYU1bMlNTe0trGfsnBDcvHwCgsIio31j4tf9fFINI4MTPfMzXT2cikr7y2SpG5s4AFQAlAE0AfQAggBxAEsABy8yQIEWNl0ZBWiEywX8rkomXyvlCOQ8Bn2cUQnnSKSRbixnkyvl8zn8DxApSkAxelDeWE+v0BIPBemCZihMOWUNWmQM6MoVIMflCd2CAX8B0QoVcwRSnkxrnRkUyd1CtPp-RklWZWCarK+AFEAMpmj5-M1fL4AeS+kIsVlhdkFiKSyRue1cEvSvlc8oQnlcqMS6OOziCaT8uqejMNLOcbP+wNBEOMCzdAtAq3JJxlioizk8oWCyMyIeCnjOaPcwQloQM-tcbl8CbGSf4Kc45qtNrtjud2b5ubhCNDFMoxZxZYrVZrrnylHCOOyEVCAWCXbKPaosDA9DAhB0ZCgyg4nAAIg6AOpggAyDoBN7+LBvLuhE49+cQ-jBJkmSUP4NxgU2-iBEGnghiuPpNr4haeGEZJ7gyBr8EeJ5nuQl59JwVpPmaADCHxmu+LAWhaACqdrfvyk6eggYFIqcwGZGW2pas4IY3MkzitukNzUli-g6sUdKJphVQ8AA7mQ9A8PgEBXtgJF8O0yBQNwfDiJMojiNJgyyQpSkqWpWAaWQWlQBMUzaHCcxjq6SxMf+LHAcqgkcVxzihDxIYoqikoomckFUhJjzdjJ1DyYpymqX01m2Q0xrNK0jAdN0vQxSZcVmYllkpdp9kaI5+jGAxv7wsxwqiuKkrSrKfG5GiEqtiu6rkjchSSXqzyGrQ2CdFgXQAugWjEM0yAAF4VWQun8OoYi5fusXDVgo3jZN01YHNC1ldMTlVS5P5uX+jgEjOc6luWlZgTW1yUIkjbpChvgXGW6H6vlm3bRNU0zfNMxpSamXaNta0YX9I3dIDe0HTMR0Lc5vKue6tUeYWs5qndi6PfiCCNrO6SpEkfh1k2mQ-YN-D-fDu3AwtYMZW0UMDQerRw2NCPM8j6jHZVJg8jmF1Y1d05FnjBgLg91ZEzKVIvWW-HerWbi01zJCniIADSYBMAACvgyCsiRAASpF638etmv8RugqO6PnZjU7BKkzgvaqzicb7qrCu4NZXP4oESpS+QBWkdxa7FOuEPrhsm2bnCW9btv238jssM6ovjuL7ue97VJ+1qviB09WqUHW4ZKhcSpR7H+UwBQWDaGABvG6brK8MtBmrZzsUt9g7ed8nWAozMaNi27zFhEqPhCRSqTZLioRPRclCtlSlwijsnb9cZTLD23Wgd0n3dLfpwgD0fhon6PF9m5PJ0iy7jGXas8-KhEHjL+XLZMQ1h2FvOsvVKSKjrDSQ+eUmS8EKipEiWBIBgDIDofA9BYBXwEP3IysDDTwISog5BEBUHoMwS-YW1UC7MXWN4PwgQQjhEiDERW2pZyCVlhKP+Xgm5wPiuZCASCUFoOQBgrBLIIbZTGtDX6-CEFCJIWQsRFDBao1Ou-GqU46GbEYTsFheJDiVlrGuVIKJjiBClJSPhBCBGJWEaQ0R4jU4AjBCRM0T5qGzw8johh2xmF7BDF4L2SR2yU0imBPq0V1r5UENgZA7QmB4QccojB2CVp4JiUyOJ+1EnJKUU4+glDZgaJnnmSWrFvIimAn5AKdwnpJDXGBMsSskLAVcDY-gOSElJIvCkwprMWjsxyoPWJ8S8l9IKeQ4p0987eIqV5diNTPDcXqWwzI7hq7lyRMcaOgkolSXwctCAJ5U4OlwEbYi5EvxnQ-hLIUfhkj+GcL7SktwzhQWDkGdqgQKRBCCHkdwnTxAnLAC4txHivHlKFOXL2dxjhbnaZ9WCisgKbMrHcAwoRqT7PcEC2kZAeCkPgFCUZLwynuUlgAWkMYgKl3gsSMqZcy6B0SYZwOGEoJ4FLP4uE4pssKCL-L7zlETJUXsogRD+S0pINMYFZOTOlLAPL7mImeSBICIp3BYm1eWYMRMwybPLHcIIFZnn3HleyxVJpnAqvdiuUCZY-DpA9h7QIy5qRb3EqkN6r05VsrkYabCp5zz4RUHa5iuQKzVwuFiIMlZIiE0OO4Nq6oAobK1OWMxwKCpEKSioEqUAI0eQRRGW4n1OLNLxfqw4JIXrATOBsps7YPY5oZrzJm+0QaUruVOTiwc-CgXbJ9FNFJhQHwDXTKg8dE5dzNsWyWipQ4oWjK9KkEcaxjq9divFKJGxQJzQ-M+Y9u4Lq-mGDVZxPrhhyJ9EUT1cRihWWcKU-pdgdMtYGuQdjiEiPISSjG0K+VlhetuJIHtSTAU3UEFI2qYyEnJBBKKhyFVdPGb0qA-TyFnoAlwsUYFEhlhCBuYOlY0QrICimoClIZQ5tgFoGaF4cMsTSGW1UQFqT8vSDWH11dX3UkxJ9NwFrJ1c2QKC5jNxEgvRRJBUsxYvmoi2HkXIHZy4ftE7FXuYBmNUxOP5WWjZK2KhrYgWsooDBQNyAw-yH6ihAA */
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
            actions: ['setIssuers', 'unsetLoadingReason'],
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
          TRY_AGAIN: [
            {
              cond: 'shouldFetchIssuerAgain',
              actions: ['setLoadingIssuer', 'resetError'],
              target: 'displayIssuers',
            },
            {
              actions: 'resetError',
              target: 'checkKeyPair',
            },
          ],
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
            // set the issuer obj from the issuerStore
            actions: 'updateTmpSelectedIssuer',
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
            target: 'error',
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
              cond: 'isOIDCflowCancelled',
              actions: 'resetError',
              target: 'selectingIssuer',
            },
            {
              actions: [
                'setError',
                (_, event) => console.log('error in invokeAuth - ', event.data),
              ],
              target: 'error',
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
            target: 'error',
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
      unsetLoadingReason: model.assign({
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
      setLoadingIssuer: model.assign({
        loadingReason: 'displayIssuers',
      }),
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
      updateTmpSelectedIssuer: model.assign({
        tempSelectedIssuer: (_, event) => event.id,
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
      downloadIssuerConfig: async (context, _) => {
        return await CACHED_API.fetchIssuerConfig(context.tempSelectedIssuer);
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
      isOIDCflowCancelled: (_, event) => {
        // iOS & Android have different error strings for user cancelled flow
        const err = [
          OIDCErrors.OIDC_FLOW_CANCELLED_ANDROID,
          OIDCErrors.OIDC_FLOW_CANCELLED_IOS,
        ];
        return (
          !!event.data &&
          typeof event.data.toString === 'function' &&
          err.some(e => event.data.toString().includes(e))
        );
      },
      shouldFetchIssuerAgain: context => context.selectedIssuer !== null,
      invalidTokenSpecified: (_, event) =>
        event.data.error !== OIDCErrors.INVALID_TOKEN_SPECIFIED,
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
