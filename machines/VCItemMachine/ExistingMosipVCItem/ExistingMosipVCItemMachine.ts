import {assign, ErrorPlatformEvent, EventFrom, send, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {MIMOTO_BASE_URL, MY_VCS_STORE_KEY} from '../../../shared/constants';
import {AppServices} from '../../../shared/GlobalContext';
import {CredentialDownloadResponse, request} from '../../../shared/request';
import {
  DecodedCredential,
  VC,
  VcIdType,
  VerifiableCredential,
} from '../../../types/VC/ExistingMosipVC/vc';
import {StoreEvents} from '../../store';
import {ActivityLogEvents} from '../../activityLog';
import {verifyCredential} from '../../../shared/vcjs/verifyCredential';
import {log} from 'xstate/lib/actions';
import {
  generateKeys,
  isHardwareKeystoreExists,
  WalletBindingResponse,
} from '../../../shared/cryptoutil/cryptoUtil';
import {KeyPair} from 'react-native-rsa-native';
import {
  getBindingCertificateConstant,
  savePrivateKey,
} from '../../../shared/keystore/SecureKeystore';
import getAllConfigurations, {DownloadProps} from '../../../shared/api';
import {VcEvents} from '../vc';
import i18n from '../../../i18n';
import SecureKeystore from '@mosip/secure-keystore';
import {VCMetadata} from '../../../shared/VCMetadata';
import {
  getEndEventData,
  getStartEventData,
  sendEndEvent,
  sendInteractEvent,
  getInteractEventData,
  sendStartEvent,
} from '../../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryConstants';

import {API_URLS} from '../../../shared/api';
import {BackupEvents} from '../../backupAndRestore/backup';
import Cloud, {
  isSignedInResult,
} from '../../../shared/CloudBackupAndRestoreUtils';
import {getIdType} from '../../../shared/openId4VCI/Utils';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    id: '',
    idType: '' as VcIdType,
    vcMetadata: {} as VCMetadata,
    myVcs: [] as string[],
    generatedOn: new Date() as Date,
    credential: null as DecodedCredential,
    verifiableCredential: null as VerifiableCredential,
    requestId: '',
    lastVerifiedOn: null,
    locked: false,
    otp: '',
    otpError: '',
    idError: '',
    transactionId: '',
    bindingTransactionId: '',
    revoked: false,
    downloadCounter: 0,
    maxDownloadCount: null as number,
    downloadInterval: null as number,
    walletBindingResponse: null as WalletBindingResponse,
    tempWalletBindingIdResponse: null as WalletBindingResponse,
    walletBindingError: '',
    publicKey: '',
    privateKey: '',
    isMachineInKebabPopupState: false,
    bindingAuthFailedMessage: '' as string,
    verificationErrorMessage: '',
    phoneNumber: '' as string,
    email: '' as string,
  },
  {
    events: {
      KEY_RECEIVED: (key: string) => ({key}),
      KEY_ERROR: (error: Error) => ({error}),
      STORE_READY: () => ({}),
      DISMISS: () => ({}),
      CREDENTIAL_DOWNLOADED: (vc: VC) => ({vc}),
      STORE_RESPONSE: (response: VC) => ({response}),
      POLL: () => ({}),
      DOWNLOAD_READY: () => ({}),
      FAILED: () => ({}),
      GET_VC_RESPONSE: (vc: VC) => ({vc}),
      LOCK_VC: () => ({}),
      INPUT_OTP: (otp: string) => ({otp}),
      RESEND_OTP: () => ({}),
      REFRESH: () => ({}),
      REVOKE_VC: () => ({}),
      ADD_WALLET_BINDING_ID: () => ({}),
      CANCEL: () => ({}),
      CONFIRM: () => ({}),
      STORE_ERROR: (error: Error) => ({error}),
      PIN_CARD: () => ({}),
      KEBAB_POPUP: () => ({}),
      SHOW_ACTIVITY: () => ({}),
      REMOVE: (vcMetadata: VCMetadata) => ({vcMetadata}),
      UPDATE_VC_METADATA: (vcMetadata: VCMetadata) => ({vcMetadata}),
      TAMPERED_VC: (key: string) => ({key}),
      SHOW_BINDING_STATUS: () => ({}),
    },
  },
);

export const ExistingMosipVCItemEvents = model.events;

export const ExistingMosipVCItemMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDcDGBaAlgFzAWwGIAlAUQDFSBlACQG0AGAXUVAAcB7WHTdgOxZAAPRABYATABoQAT0QBGABwBWAHT0FAZjEB2bSKUBOA9rliAvmalosuPCtQALMKgDWmXlABqqAgHESACoA+p4AwkFUAAoA8gBylCQMzEggHFzYPPwpwggKBiIqcvqaAGwGSvT0SnJSsgjicio69Np5GvTFSiIWVhg4+PZOru5ePv7BYREklDHxiXLJbJzcfAI5eQVFSqXlldW1iO2qmlpKhtpnGkbdliDW-XaOzm4elNjsAE5gBJQB0aRTGZxBJJARpFZZUA5OSmA4IMRyDQFDRKDQmMRiDRyAwKG69GwDJ7DV7vL4-P4AqLA+aLVLLDKrbLyJRiBRNAxybT0MRnQwKBSSGTyXFNERGPIwhFo-k9O59WyDZ4jShgD7IVUAEQAhtgtYriVA3jqAK6wAgxAAyFtBKXBDMhQkQPO0TTORQMJRZ2hKyjhihEbLkHRaXVRcmqCll9wVRJehtV6o+2t1+rjRuwpoIGuiAHVYhbogBBDVTYsATRtS3SmTWokMhWD9HyJRKRUxfuMYjUJQRBnaii6VSj8sJQzTCc1Or1EHYAHdeAAbdhaiAjUJfCBgXgZLUL83RK2VunVxlQxAKIMqETiCVo6pnBR+hQlDSFBTaMQlEQdL8dPFyglHjHZUJyTKcVBneclxXNcNy3Hc91CUgNRIWIAgASULC0gmzPMC2LEgNSPO0ayZBAg3yQoURMGjLg9DsxAKD88gxERsQDVph0AlRMAgBdvkI9DggCQtfGI+lSLPeERBdNiShMIMtDFb8lDhT9ORUNERDKZ9rw-JQuIeHi+O+TwSCIdCyArJgwQk09HXhT8ShUd8ujyFkMUMEo1LEFoVBZbl6BhBQQzRQyFV4-iCALUIAGkQlCcSTwdHIdA0V8kW01k5BKegexaNTvUad9r206of3MW5owGSLvlITxolikgEqSiFa1yQU6lZEKXL0JRPS5AMXwMqqRzsWqCGLEscywi1AiCAAhdDYg1ZbfCCdCiJs207JS+ROv28KBkgbgPACLUoCzdDKAAWWuyhWvtdrMVknKFPoJT8iqNT0voQp9By79TB7AwjrsE6MjOi6fkLMyghEsTtqrNqyMY175JhD7GK+1ShWk6pChbREBQMDpPzBlRYFJEZzsu35-maqk5keySHP645yhbDolMUbQ1IBwnWw0EmyZKCnE0wAAzaRYMgeDMF3AgZ14MAeN4ZB2BcVXqrsCXpdlzdtwVhcEHcDXUB1TIkhZ+zUqc3q3PKDEeXovHfNbFQvwqSoUSbF9xdVKWZY8dc5aNxXVQ+T4VFYBcdUlz5dbGlQ9eDqBQ8NhDTfV9gLfta2kePFGpM85zXIDJ3PNdupsR9T3n3KFFlDYnKKdjEZPEDyXMDzzJ00zG29vI5QDBc5QuSMfqPUUJ8KjfMogp5apurb4CPE7j4pZ7y2+H7s1aAWWzkvagdR-5JQJ856fHzdxRR69gMZP5FptAps3d14ghlsiABVYJogCJEQe7UtAujyjyHQRR5JiD7HCEQVxVBP2MHlPq-tRrcXfguT+q1br3WAWRUB3YIEmG0h+WBeNhZflFMYVsYoSGVXxEZL4ABHY0cBIZQGiNgVgSs+CqzNprbWycWFsKpiMLhrBs7mx3rwAutISK23kDCV8MDfLpX6pUD6cCuTOT7NoShbEL75ApiI9h4juEEEjtHWO8dE4p2EWAVhZiPASKkbnGRcij7FwcjCRE7I1Eolyj7OBQsVDGFJp6fQMCigUy1KgVAYBWAcIkehXgrBjTYC-rEX+-9AH4KkmUVQ4C3S4lKTiOBzQVDMQFEDC+SJYnxMSck7hqT0mZJwXdSgD1C4KKHqYJs9cQrtHKHoRicINAY38iTTQ1waIaAaQkpJIwiBgA1lrVpGSsk5KCAAoBPTdonzeoUIov1tBfRgbjGuiJjjpS0O0TQLIRqMIVHExZHCVlrLABs9p11OndPkQcsiRhGimH0GKAUXIsZwjIVebYPIfSIkfq-dBTDHGiI4RaXOLheEqzVp8+x3FTFiI8Ji1wbje58E8TtY+ZEfRFJ7CUx+eQb51CuM+KpXJzj3MUGLFFCoiUYqxZYj4UcPgxzjtgBOHwk6ErRc4qApKXDko8UwfJDlClEMZWUllog2L3w+n2KUDyhx8oGEuA03hyQM0BLMEE+yaVSV8SogwASNHBLxt+PyRgPTvhyuoF1Ji5XEqgB8wROL+E5y1gS1FTjg2hq1sq-Oqr7XeNSqTJo6g0TekxBeE54yfaC17PJF86hA2xveassNVixU2MlXYnWKgBXLMrQmgRFLZHJoBQ6hyhDimQNITAjQcCYSqACmKPKTt0qBrWR3Hw9NKTTFtYkFNT1aVnJcuUAUFQrifj0PmtEntGKtmbPJb8vLnlmvYFAKAzbPlXVwV0tV0IX5Xh9N6xEaJWQHQQO0A9PZtLsRbHoPKZb0UjAWu4VcLiLHKwjfihtTaPAQd4FBzh3DE1W07V41dUlf1hMgQ8oMRjv3A1UEGM9T8ijiCeQBGNYGkOQfMTw6t4rbHSujfyoNHDkOodcW2lVjAn2HA+vhkwhGqhnO-RURogVi1C36vAimsAHBzhICKz4BBQiFliKEEg1oV2sxyJ6ZypgKjPm9HkPKOqEAeWod6eBjFFJyAWU08DjHoM8O-n-HZeSDOKIQBcWSrQZk5UoeGP0S8qnRPDF+i4wsXNLIYyhpj96-lCYCxfK8wWrihefOFvGF8ux6G9byZ0sSIAQFimAaQkQtSYA+OGvFgiOMDBXJV6rtX6sYcpVh6lqalHyWOfA9oZzvwXIiyKLkJM2ItBkvo8r7Wat1Yayx2tUqZVGTa1VpbXX+NJsE35vpRyYTDZaOc8ofoya9TFIDdK4TkUXrsG1kYOZdz8WwDxkY6EICNYEVGhtz2PCvYXO9z7HhvvdY7Qdrt-Wf0aT7SQ6B5DWWFc0noeS6V9H9Xqaap7FWXtvbAB99zUBvvCtFaxut7GAf46B4T4nyXwcQEh1S5GOGe1+QR1AshQ6KFYk2IxVEAomwohow240rAICWw8JETeyAdRgG279yNQjuIS6lxw2XmB5e4G2yz3rbPDOIFaGRlETKZKYhfOMupmlyiDkChcEDuOVDq+l1ALXOvFfVfJ9YiV62Wt2Fd5ruXCu9d7cw9D7DRuAvKCom5JFlveesv0CZj6ehwxIlMA92jCplNzjB4aXUGYzRLRWmtHCcRl0w-Z9CXy99n7DIvuIEQ4yewyZJhMowPIQojVuLwdgm54ApB1lH-z6AJlwnQP0tQmjTBIgFFnhhOfRxKnXqgUfQ9bPexyuUD0YpDDjNj8V5sQUX4nFXqvwvnwwAb5PgiAomi-YIlZMUfmzlj-FFaF+zEF+DQqjVJOLqLfmRCdn6GUM5LlN+M+O0PJE7o9qmCBAAWBCmO3CSCaEPobv5jlCRvkKPOAr5OoKUoYGLsnKgfGEgcmNOHOIuMuKhhnPLLuMAQUnXEiFmnUqiLoDgVQlsMLPkK0L4uesvuNCZEwQ5NjA-pKKiEYPoroIVDyNdkNPkCOq3M7hDDTBdKIc+t+p+AMmKMYFiO+B6KDM7lTJ8OoVAJoYcLHuEkFMLJ+FiC6t5G7PoH9O5DoB6J+M+BiAHJvPrCHHBOHAuJYfCNyEVtiBiKwb5J+GpIDLbl0F+kYBMkvg2mQRvFvO2nvMEYiINufDRB+BZloDEcLC5KYHXopNsLiG-OrB-BAMEWxFeO+pUDApUB+nAkiH9MUHlNiPoiFMkcnJgrxCoOwNwsEXkA0cCk0aTLYUnrqjoGEtsFnl7MVlUfLlghACoAAEZxJawobBEupwJDSwpnJ8FVD8jZ4IZcZMbBGshUK5QsgTJBQXgi4hIDJTYIjchGB3EJbNKsDfKjHrpfhCzwJ5b6EVKaBhKhYuq6R0IkHcSvKuYeDxpfJpIZLBGBZZb8g5Yvh5aXJKKVBxE95iY3aRjO6IYKpYp1EfiFA8iIichcgnbfrwLlAZq5q+SYxBQUzmpxjeD-F-ThIyQfQwh6B5DjI4gFDeqFLcgfgwiCEXHlq3qCLBHyTDqmBRYN475jbTqayzp1EcgEl6IBjVC8z5pFCHr6BohJF5QdCclXo3qIkto359Y17njrriBiYupOxVC4k-otFmn9S6C4ifioigbyoF4SJ1EkaMR-RTZojTynHGImEqazhqairBFej+QtGFJ7675wi2Yf6-gCjySwmbaNKJZQBhkjFOnR4shsgnCmDKCVAmDlJ4ymZ-S3LNDBiwHGHwFbYdbLZ7FIiaRC6fh0Kfj7EtnZQQmejKDhjigmo9m05QDA6g4k7fZpl8weoQLzEL55TaTzLO5B4jAe6h7VZpn6ANh6ruHwIyTelNyvgnBVAejqBfgknwF56zgF6ZFVlYEFpQKKQchvStDW44hqDTaGl5AWAWBAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./ExistingMosipVCItemMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      on: {
        REFRESH: {
          target: '.checkingStore',
        },
        UPDATE_VC_METADATA: {
          actions: 'setVcMetadata',
        },
      },
      description: 'VC',
      id: 'vc-item',
      initial: 'checkingVc',
      states: {
        checkingVc: {
          entry: 'requestVcContext',
          description:
            'Check if the VC data is in VC list already (in memory).',
          on: {
            GET_VC_RESPONSE: [
              {
                actions: 'setCredential',
                cond: 'hasCredential',
                target: '#vc-item.idle',
              },
              {
                target: 'checkingStore',
              },
            ],
          },
        },
        checkingStore: {
          entry: 'requestStoredContext',
          description: 'Check if VC data is in secured local storage.',
          on: {
            STORE_RESPONSE: [
              {
                actions: ['setCredential', 'updateVc'],
                cond: 'hasCredential',
                target: '#vc-item.idle',
              },
              {
                actions: 'addVcToInProgressDownloads',
                target: 'checkingServerData',
              },
            ],
            TAMPERED_VC: {
              actions: 'sendTamperedVc',
            },
          },
        },
        checkingServerData: {
          description:
            "Download VC data from the server. Uses polling method to check when it's available.",
          initial: 'loadDownloadLimitConfig',
          states: {
            loadDownloadLimitConfig: {
              invoke: {
                src: 'loadDownloadLimitConfig',
                onDone: {
                  actions: ['setMaxDownloadCount', 'setDownloadInterval'],
                  target: 'verifyingDownloadLimitExpiry',
                },
              },
            },
            verifyingDownloadLimitExpiry: {
              entry: ['incrementDownloadCounter'],
              invoke: {
                src: 'checkDownloadExpiryLimit',
                onDone: {
                  target: 'checkingStatus',
                },
                onError: {
                  actions: [
                    log((_, event) => (event.data as Error).message),
                    'sendDownloadLimitExpire',
                  ],
                },
              },
            },
            checkingStatus: {
              invoke: {
                src: 'checkStatus',
                id: 'checkStatus',
              },
              on: {
                POLL: {
                  cond: 'isDownloadAllowed',
                  actions: send('POLL_STATUS', {to: 'checkStatus'}),
                },
                DOWNLOAD_READY: {
                  target: 'downloadingCredential',
                },
                FAILED: {
                  actions: 'sendDownloadLimitExpire',
                },
              },
            },
            downloadingCredential: {
              invoke: {
                src: 'downloadCredential',
                id: 'downloadCredential',
              },
              on: {
                POLL: [
                  {
                    cond: 'isDownloadAllowed',
                    actions: [
                      send('POLL_DOWNLOAD', {to: 'downloadCredential'}),
                      'incrementDownloadCounter',
                    ],
                  },
                  {
                    target: 'verifyingDownloadLimitExpiry',
                  },
                ],
                CREDENTIAL_DOWNLOADED: {
                  actions: 'setCredential',
                  target: '#vc-item.verifyingCredential',
                },
              },
            },
            savingFailed: {
              entry: ['removeVcMetaDataFromStorage'],
              initial: 'idle',
              states: {
                idle: {},
                viewingVc: {},
              },
              on: {
                DISMISS: {
                  actions: ['removeVcMetaDataFromVcMachine'],
                  target: '.viewingVc',
                },
              },
            },
          },
        },
        idle: {
          entry: ['clearTransactionId', 'clearOtp'],
          on: {
            LOCK_VC: {
              target: 'requestingOtp',
            },
            REVOKE_VC: {
              target: 'acceptingRevokeInput',
            },
            ADD_WALLET_BINDING_ID: {
              target: 'showBindingWarning',
            },
            PIN_CARD: {
              target: 'pinCard',
              actions: 'setPinCard',
            },
            KEBAB_POPUP: {
              target: 'kebabPopUp',
            },
            DISMISS: {
              target: 'checkingVc',
            },
          },
        },
        pinCard: {
          entry: 'sendVcUpdated',
          always: {
            target: 'idle',
          },
        },
        kebabPopUp: {
          entry: assign({isMachineInKebabPopupState: () => true}),
          on: {
            DISMISS: {
              actions: assign({
                isMachineInKebabPopupState: () => false,
              }),
              target: 'idle',
            },
            ADD_WALLET_BINDING_ID: {
              target: '#vc-item.showBindingWarning',
            },
            PIN_CARD: {
              target: '#vc-item.pinCard',
              actions: [
                'setPinCard',
                assign({
                  isMachineInKebabPopupState: () => false,
                }),
              ],
            },
            SHOW_ACTIVITY: {
              target: '#vc-item.kebabPopUp.showActivities',
            },
            REMOVE: {
              actions: [
                'setVcKey',
                assign({
                  isMachineInKebabPopupState: () => false,
                }),
              ],
              target: '#vc-item.kebabPopUp.removeWallet',
            },
          },
          initial: 'idle',
          states: {
            idle: {},
            showActivities: {
              on: {
                DISMISS: '#vc-item.kebabPopUp',
              },
            },
            removeWallet: {
              on: {
                CONFIRM: {
                  target: 'removingVc',
                },
                CANCEL: {
                  target: 'idle',
                },
              },
            },
            removingVc: {
              entry: 'removeVcItem',
              on: {
                STORE_RESPONSE: {
                  target: '.triggerAutoBackup',
                },
              },
              states: {
                triggerAutoBackup: {
                  invoke: {
                    src: 'isUserSignedAlready',
                    onDone: [
                      {
                        cond: 'isSignedIn',
                        actions: [
                          'sendBackupEvent',
                          'refreshMyVcs',
                          'logVCremoved',
                        ],
                        target: '#vc-item',
                      },
                      {
                        actions: ['refreshMyVcs', 'logVCremoved'],
                        target: '#vc-item',
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        verifyingCredential: {
          invoke: {
            src: 'verifyCredential',
            onDone: [
              {
                actions: ['storeContext'],
              },
            ],
            onError: [
              {
                //To-Do Handle Error Scenarios
                actions: ['updateVerificationErrorMessage'],
                target: 'handleVCVerificationFailure',
              },
            ],
          },
          initial: 'idle',
          on: {
            STORE_RESPONSE: {
              actions: [
                'updateVc',
                'logDownloaded',
                'sendTelemetryEvents',
                'removeVcFromInProgressDownloads',
              ],
              target: '.triggerAutoBackupForVcDownload',
            },
            STORE_ERROR: {
              target: '#vc-item.checkingServerData.savingFailed',
            },
          },
          states: {
            idle: {},
            triggerAutoBackupForVcDownload: {
              invoke: {
                src: 'isUserSignedAlready',
                onDone: [
                  {
                    cond: 'isSignedIn',
                    actions: ['sendBackupEvent'],
                    target: '#vc-item.idle',
                  },
                  {
                    target: '#vc-item.idle',
                  },
                ],
              },
            },
          },
        },

        handleVCVerificationFailure: {
          entry: ['removeVcMetaDataFromStorage'],
          on: {
            STORE_RESPONSE: {
              actions: ['sendVerificationError'],
            },
          },
        },
        invalid: {
          states: {
            otp: {},
            backend: {},
          },
          on: {
            INPUT_OTP: {
              actions: 'setOtp',
              target: 'requestingLock',
            },
            DISMISS: {
              target: 'idle',
            },
          },
        },
        requestingOtp: {
          invoke: {
            src: 'requestOtp',
            onDone: [
              {
                actions: [log('accepting OTP')],
                target: 'acceptingOtpInput',
              },
            ],
            onError: [
              {
                actions: [log('error OTP')],
                target: '#vc-item.invalid.backend',
              },
            ],
          },
        },
        acceptingOtpInput: {
          entry: ['clearOtp', 'setTransactionId'],
          on: {
            INPUT_OTP: [
              {
                actions: [
                  log('setting OTP lock'),
                  'setTransactionId',
                  'setOtp',
                ],
                target: 'requestingLock',
              },
            ],
            DISMISS: {
              actions: ['clearOtp', 'clearTransactionId'],
              target: 'idle',
            },
            RESEND_OTP: {
              target: '.resendOTP',
            },
          },
          initial: 'idle',
          states: {
            idle: {},
            resendOTP: {
              invoke: {
                src: 'requestOtp',
                onDone: [
                  {
                    target: 'idle',
                  },
                ],
              },
            },
          },
        },
        acceptingRevokeInput: {
          entry: [log('acceptingRevokeInput'), 'clearOtp', 'setTransactionId'],
          on: {
            INPUT_OTP: [
              {
                actions: [
                  log('setting OTP revoke'),
                  'setTransactionId',
                  'setOtp',
                ],
                target: 'requestingRevoke',
              },
            ],
            DISMISS: {
              actions: ['clearOtp', 'clearTransactionId'],
              target: 'idle',
            },
          },
        },
        requestingLock: {
          invoke: {
            src: 'requestLock',
            onDone: [
              {
                actions: 'setLock',
                target: 'lockingVc',
              },
            ],
            onError: [
              {
                actions: 'setOtpError',
                target: 'acceptingOtpInput',
              },
            ],
          },
        },
        lockingVc: {
          entry: ['storeLock'],
          on: {
            STORE_RESPONSE: {
              target: 'idle',
            },
          },
        },
        requestingRevoke: {
          invoke: {
            src: 'requestRevoke',
            onDone: [
              {
                actions: [log('doneRevoking'), 'setRevoke'],
                target: 'revokingVc',
              },
            ],
            onError: [
              {
                actions: [
                  log((_, event) => (event.data as Error).message),
                  'setOtpError',
                ],
                target: 'acceptingOtpInput',
              },
            ],
          },
        },
        revokingVc: {
          entry: ['revokeVID'],
          on: {
            STORE_RESPONSE: {
              target: 'loggingRevoke',
            },
          },
        },
        loggingRevoke: {
          entry: [log('loggingRevoke'), 'logRevoked'],
          on: {
            DISMISS: {
              target: 'idle',
            },
          },
        },
        showBindingWarning: {
          on: {
            CONFIRM: {
              actions: 'sendActivationStartEvent',
              target: 'requestingBindingOtp',
            },
            CANCEL: [
              {
                cond: context => context.isMachineInKebabPopupState,
                target: '#vc-item.kebabPopUp',
              },
              {
                target: 'idle',
              },
            ],
          },
        },
        requestingBindingOtp: {
          invoke: {
            src: 'requestBindingOtp',
            onDone: [
              {
                target: 'acceptingBindingOtp',
                actions: ['setPhoneNumber', 'setEmail'],
              },
            ],
            onError: [
              {
                actions: ['setWalletBindingError', 'logWalletBindingFailure'],
                target: 'showingWalletBindingError',
              },
            ],
          },
        },
        showingWalletBindingError: {
          on: {
            CANCEL: [
              {
                cond: context => context.isMachineInKebabPopupState,
                actions: ['setWalletBindingErrorEmpty'],
                target: '#vc-item.kebabPopUp',
              },
              {
                actions: ['setWalletBindingErrorEmpty'],
                target: 'idle',
              },
            ],
          },
        },
        acceptingBindingOtp: {
          entry: ['clearOtp'],
          on: {
            INPUT_OTP: {
              target: 'addKeyPair',
              actions: ['setOtp'],
            },
            DISMISS: [
              {
                cond: context => context.isMachineInKebabPopupState,
                target: '#vc-item.kebabPopUp',
                actions: [
                  'sendActivationFailedEndEvent',
                  'clearOtp',
                  'clearTransactionId',
                ],
              },
              {
                target: 'idle',
                actions: [
                  'sendActivationFailedEndEvent',
                  'clearOtp',
                  'clearTransactionId',
                ],
              },
            ],
            RESEND_OTP: {
              target: '.resendOTP',
            },
          },
          initial: 'idle',
          states: {
            idle: {},
            resendOTP: {
              invoke: {
                src: 'requestBindingOtp',
                onDone: {
                  target: 'idle',
                  actions: ['setPhoneNumber', 'setEmail'],
                },
                onError: {
                  actions: 'setWalletBindingError',
                  target: '#vc-item.showingWalletBindingError',
                },
              },
            },
          },
        },
        addKeyPair: {
          invoke: {
            src: 'generateKeyPair',
            onDone: [
              {
                cond: 'isCustomSecureKeystore',
                target: 'addingWalletBindingId',
                actions: ['setPublicKey'],
              },
              {
                target: 'addingWalletBindingId',
                actions: ['setPublicKey', 'setPrivateKey'],
              },
            ],
            onError: [
              {
                actions: ['setWalletBindingError', 'logWalletBindingFailure'],
                target: 'showingWalletBindingError',
              },
            ],
          },
        },
        addingWalletBindingId: {
          invoke: {
            src: 'addWalletBindnigId',
            onDone: [
              {
                cond: 'isCustomSecureKeystore',
                target: 'updatingContextVariables',
              },
              {
                target: 'updatingPrivateKey',
                /*The walletBindingResponse is used for conditional rendering in wallet binding.
                However, it wrongly considers activation as successful even when there's an error
                in updatingPrivateKey state. So created a temporary context variable to store the binding
                response and use it in updatingPrivateKey state*/
                actions: 'setTempWalletBindingResponse',
              },
            ],
            onError: [
              {
                actions: ['setWalletBindingError', 'logWalletBindingFailure'],
                target: 'showingWalletBindingError',
              },
            ],
          },
        },
        updatingPrivateKey: {
          invoke: {
            src: 'updatePrivateKey',
            onDone: {
              target: 'updatingContextVariables',
            },
            onError: {
              actions: [
                'setWalletBindingError',
                'logWalletBindingFailure',
                'sendActivationFailedEndEvent',
              ],
              target: 'showingWalletBindingError',
            },
          },
        },

        updatingContextVariables: {
          entry: [
            'setWalletBindingId',
            'setThumbprintForWalletBindingId',
            'storeContext',
            'updatePrivateKey',
            'updateVc',
            'setWalletBindingErrorEmpty',
            'sendActivationSuccessEvent',
            'logWalletBindingSuccess',
            send('SHOW_BINDING_STATUS'),
          ],
          on: {
            SHOW_BINDING_STATUS: [
              {
                cond: context => context.isMachineInKebabPopupState,
                actions: 'sendWalletBindingSuccess',
                target: '#vc-item.kebabPopUp',
              },
              {
                actions: 'sendWalletBindingSuccess',
                target: 'idle',
              },
            ],
          },
        },
      },
    },
    {
      actions: {
        removeVcMetaDataFromStorage: send(
          context => {
            return StoreEvents.REMOVE_VC_METADATA(
              MY_VCS_STORE_KEY,
              context.vcMetadata.getVcKey(),
            );
          },
          {
            to: context => context.serviceRefs.store,
          },
        ),

        removeVcMetaDataFromVcMachine: send(
          context => {
            return {
              type: 'REMOVE_VC_FROM_CONTEXT',
              vcMetadata: context.vcMetadata,
            };
          },
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        sendDownloadLimitExpire: send(
          (_context, event) => {
            return {
              type: 'DOWNLOAD_LIMIT_EXPIRED',
              vcMetadata: _context.vcMetadata,
            };
          },
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        sendVerificationError: send(
          (context, event) => {
            return {
              type: 'VERIFY_VC_FAILED',
              errorMessage: context.verificationErrorMessage,
              vcMetadata: context.vcMetadata,
            };
          },
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        updateVerificationErrorMessage: assign({
          verificationErrorMessage: (context, event) =>
            (event.data as Error).message,
        }),

        setWalletBindingError: assign({
          walletBindingError: () => {
            const errorMessage = i18n.t(`errors.genericError`, {
              ns: 'common',
            });
            return errorMessage;
          },
          bindingAuthFailedMessage: (_context, event) => {
            const error = JSON.parse(JSON.stringify(event.data)).name;
            if (error) {
              return error;
            }
            return '';
          },
        }),

        setWalletBindingErrorEmpty: assign({
          walletBindingError: () => '',
          bindingAuthFailedMessage: () => '',
        }),

        sendWalletBindingSuccess: send(
          context => {
            return {
              type: 'WALLET_BINDING_SUCCESS',
            };
          },
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        sendBackupEvent: send(BackupEvents.DATA_BACKUP(true), {
          to: context => context.serviceRefs.backup,
        }),

        sendActivationStartEvent: context => {
          sendStartEvent(
            getStartEventData(
              context.isMachineInKebabPopupState
                ? TelemetryConstants.FlowType.vcActivationFromKebab
                : TelemetryConstants.FlowType.vcActivation,
            ),
          );
          sendInteractEvent(
            getInteractEventData(
              context.isMachineInKebabPopupState
                ? TelemetryConstants.FlowType.vcActivationFromKebab
                : TelemetryConstants.FlowType.vcActivation,
              TelemetryConstants.InteractEventSubtype.click,
              'Activate Button',
            ),
          );
        },

        sendActivationFailedEndEvent: (context, event, meta) => {
          const [errorId, errorMessage] =
            event.data?.message === 'Could not store private key in keystore'
              ? [
                  TelemetryConstants.ErrorId.updatePrivateKey,
                  TelemetryConstants.ErrorMessage.privateKeyUpdationFailed,
                ]
              : [
                  TelemetryConstants.ErrorId.userCancel,
                  TelemetryConstants.ErrorMessage.activationCancelled,
                ];
          sendEndEvent(
            getEndEventData(
              context.isMachineInKebabPopupState
                ? TelemetryConstants.FlowType.vcActivationFromKebab
                : TelemetryConstants.FlowType.vcActivation,
              TelemetryConstants.EndEventStatus.failure,
              {
                errorId: errorId,
                errorMessage: errorMessage,
              },
            ),
          );
        },

        sendActivationSuccessEvent: context =>
          sendEndEvent(
            getEndEventData(
              context.isMachineInKebabPopupState
                ? TelemetryConstants.FlowType.vcActivationFromKebab
                : TelemetryConstants.FlowType.vcActivation,
              TelemetryConstants.EndEventStatus.success,
            ),
          ),

        setPublicKey: assign({
          publicKey: (context, event) => {
            if (!isHardwareKeystoreExists) {
              return (event.data as KeyPair).public;
            }
            return event.data as string;
          },
        }),

        setPrivateKey: assign({
          privateKey: (context, event) => (event.data as KeyPair).private,
        }),

        updatePrivateKey: assign({
          privateKey: () => '',
        }),

        setWalletBindingId: assign({
          walletBindingResponse: (context, event) => {
            return isHardwareKeystoreExists
              ? (event.data as WalletBindingResponse)
              : context.tempWalletBindingIdResponse;
          },
        }),

        setTempWalletBindingResponse: assign({
          tempWalletBindingIdResponse: (context, event) =>
            event.data as WalletBindingResponse,
        }),

        setPinCard: assign({
          vcMetadata: context =>
            new VCMetadata({
              ...context.vcMetadata,
              isPinned: !context.vcMetadata.isPinned,
            }),
        }),

        setVcMetadata: assign({
          vcMetadata: (_, event) => event.vcMetadata,
        }),

        sendVcUpdated: send(
          context => VcEvents.VC_METADATA_UPDATED(context.vcMetadata),
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        sendTamperedVc: send(
          context => VcEvents.TAMPERED_VC(context.vcMetadata),
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        updateVc: send(
          context => {
            const {serviceRefs, ...vc} = context;
            return {type: 'VC_DOWNLOADED', vc};
          },
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        removeVcFromInProgressDownloads: send(
          context => {
            return {
              type: 'REMOVE_VC_FROM_IN_PROGRESS_DOWNLOADS',
              vcMetadata: context.vcMetadata,
            };
          },
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        addVcToInProgressDownloads: send(
          context => {
            return {
              type: 'ADD_VC_TO_IN_PROGRESS_DOWNLOADS',
              requestId: context.vcMetadata.requestId,
            };
          },
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        setThumbprintForWalletBindingId: send(
          context => {
            const {walletBindingResponse} = context;
            const walletBindingIdKey = getBindingCertificateConstant(
              walletBindingResponse.walletBindingId,
            );
            return StoreEvents.SET(
              walletBindingIdKey,
              walletBindingResponse.thumbprint,
            );
          },
          {
            to: context => context.serviceRefs.store,
          },
        ),

        refreshMyVcs: send(
          () => ({
            type: 'REFRESH_MY_VCS',
          }),
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        requestVcContext: send(
          context => ({
            type: 'GET_VC_ITEM',
            vcMetadata: context.vcMetadata,
          }),
          {
            to: context => context.serviceRefs.vc,
          },
        ),

        requestStoredContext: send(
          context => StoreEvents.GET(context.vcMetadata.getVcKey()),
          {
            to: context => context.serviceRefs.store,
          },
        ),

        storeContext: send(
          context => {
            const {
              serviceRefs,
              isMachineInKebabPopupState,
              tempWalletBindingIdResponse,
              ...data
            } = context;
            data.credentialRegistry = MIMOTO_BASE_URL;
            return StoreEvents.SET(context.vcMetadata.getVcKey(), data);
          },
          {
            to: context => context.serviceRefs.store,
          },
        ),

        incrementDownloadCounter: model.assign({
          downloadCounter: ({downloadCounter}) => downloadCounter + 1,
        }),

        setMaxDownloadCount: model.assign({
          maxDownloadCount: (_context, event) =>
            Number((event.data as DownloadProps).maxDownloadLimit),
        }),

        setDownloadInterval: model.assign({
          downloadInterval: (_context, event) =>
            Number((event.data as DownloadProps).downloadInterval),
        }),

        setCredential: model.assign((context, event) => {
          switch (event.type) {
            case 'STORE_RESPONSE':
              return {
                ...context,
                ...event.response,
                vcMetadata: context.vcMetadata,
              };
            case 'GET_VC_RESPONSE':
            case 'CREDENTIAL_DOWNLOADED':
              return {
                ...context,
                ...event.vc,
              };
          }
        }),

        logDownloaded: send(
          context => {
            const {serviceRefs, ...data} = context;
            return ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: context.vcMetadata.getVcKey(),
              type: 'VC_DOWNLOADED',
              id: context.vcMetadata.id,
              idType: getIdType(context.vcMetadata.issuer),
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: data.id,
            });
          },
          {
            to: context => context.serviceRefs.activityLog,
          },
        ),
        sendTelemetryEvents: () => {
          sendEndEvent({
            type: TelemetryConstants.FlowType.vcDownload,
            status: TelemetryConstants.EndEventStatus.success,
          });
        },

        logWalletBindingSuccess: send(
          context =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: context.vcMetadata.getVcKey(),
              type: 'WALLET_BINDING_SUCCESSFULL',
              idType: getIdType(context.vcMetadata.issuer),
              id: context.vcMetadata.id,
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: context.vcMetadata.id,
            }),
          {
            to: context => context.serviceRefs.activityLog,
          },
        ),

        logWalletBindingFailure: send(
          context =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: context.vcMetadata.getVcKey(),
              type: 'WALLET_BINDING_FAILURE',
              timestamp: Date.now(),
              deviceName: '',
              id: context.vcMetadata.id,
              idType: getIdType(context.vcMetadata.issuer),
              vcLabel: context.vcMetadata.id,
            }),
          {
            to: context => context.serviceRefs.activityLog,
          },
        ),

        logRevoked: send(
          context =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: context.vcMetadata.getVcKey(),
              type: 'VC_REVOKED',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: context.vcMetadata.id,
              id: context.vcMetadata.id,
              idType: getIdType(context.vcMetadata.issuer),
            }),
          {
            to: context => context.serviceRefs.activityLog,
          },
        ),

        revokeVID: send(
          context => {
            return StoreEvents.REMOVE(
              MY_VCS_STORE_KEY,
              context.vcMetadata.getVcKey(),
            );
          },
          {
            to: context => context.serviceRefs.store,
          },
        ),

        setTransactionId: assign({
          transactionId: () => String(new Date().valueOf()).substring(3, 13),
        }),

        clearTransactionId: assign({transactionId: ''}),

        setOtp: model.assign({
          otp: (_, event) => event.otp,
        }),

        setVcKey: model.assign({
          vcMetadata: (_, event) => event.vcMetadata,
        }),

        setOtpError: assign({
          otpError: (_context, event) =>
            (event as ErrorPlatformEvent).data.message,
        }),

        setPhoneNumber: assign({
          phoneNumber: (_context, event) => event.data.response.maskedMobile,
        }),

        setEmail: model.assign({
          email: (_context, event) => event.data.response.maskedEmail,
        }),

        clearOtp: assign({otp: ''}),

        setLock: assign({
          locked: context => !context.locked,
        }),

        setRevoke: assign({
          revoked: () => true,
        }),

        storeLock: send(
          context => {
            const {serviceRefs, ...data} = context;
            return StoreEvents.SET(context.vcMetadata.getVcKey(), data);
          },
          {to: context => context.serviceRefs.store},
        ),

        removeVcItem: send(
          _context => {
            return StoreEvents.REMOVE(
              MY_VCS_STORE_KEY,
              _context.vcMetadata.getVcKey(),
            );
          },
          {to: context => context.serviceRefs.store},
        ),

        logVCremoved: send(
          (context, _) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: context.vcMetadata.getVcKey(),
              type: 'VC_REMOVED',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: context.vcMetadata.id,
              id: context.vcMetadata.id,
              idType: getIdType(context.vcMetadata.issuer),
            }),
          {
            to: context => context.serviceRefs.activityLog,
          },
        ),
      },

      services: {
        isUserSignedAlready: () => async () => {
          return await Cloud.isSignedInAlready();
        },

        loadDownloadLimitConfig: async context => {
          var resp = await getAllConfigurations();
          const maxLimit: number = resp.vcDownloadMaxRetry;
          const vcDownloadPoolInterval: number = resp.vcDownloadPoolInterval;

          const downloadProps: DownloadProps = {
            maxDownloadLimit: maxLimit,
            downloadInterval: vcDownloadPoolInterval,
          };
          return downloadProps;
        },

        checkDownloadExpiryLimit: async context => {
          if (context.downloadCounter > context.maxDownloadCount) {
            throw new Error(
              'Download limit expired for request id: ' +
                context.vcMetadata.requestId,
            );
          }
        },

        addWalletBindnigId: async context => {
          const response = await request(
            API_URLS.walletBinding.method,
            API_URLS.walletBinding.buildURL(),
            {
              requestTime: String(new Date().toISOString()),
              request: {
                authFactorType: 'WLA',
                format: 'jwt',
                individualId: context.vcMetadata.id,
                transactionId: context.transactionId,
                publicKey: context.publicKey,
                challengeList: [
                  {
                    authFactorType: 'OTP',
                    challenge: context.otp,
                    format: 'alpha-numeric',
                  },
                ],
              },
            },
          );
          const certificate = response.response.certificate;
          await savePrivateKey(
            getBindingCertificateConstant(context.vcMetadata.id),
            certificate,
          );

          const walletResponse: WalletBindingResponse = {
            walletBindingId: response.response.encryptedWalletBindingId,
            keyId: response.response.keyId,
            thumbprint: response.response.thumbprint,
            expireDateTime: response.response.expireDateTime,
          };
          return walletResponse;
        },

        updatePrivateKey: async context => {
          const hasSetPrivateKey: boolean = await savePrivateKey(
            context.tempWalletBindingIdResponse.walletBindingId,
            context.privateKey,
          );
          if (!hasSetPrivateKey) {
            throw new Error('Could not store private key in keystore.');
          }
          return '';
        },

        generateKeyPair: async context => {
          if (!isHardwareKeystoreExists) {
            return await generateKeys();
          }
          const isBiometricsEnabled = SecureKeystore.hasBiometricsEnabled();
          return SecureKeystore.generateKeyPair(
            context.vcMetadata.id,
            isBiometricsEnabled,
            0,
          );
        },

        requestBindingOtp: async context => {
          const response = await request(
            API_URLS.bindingOtp.method,
            API_URLS.bindingOtp.buildURL(),
            {
              requestTime: String(new Date().toISOString()),
              request: {
                individualId: context.vcMetadata.id,
                otpChannels: ['EMAIL', 'PHONE'],
              },
            },
          );
          if (response.response == null) {
            throw new Error('Could not process request');
          }
          return response;
        },

        checkStatus: context => (callback, onReceive) => {
          const pollInterval = setInterval(
            () => callback(model.events.POLL()),
            context.downloadInterval,
          );

          onReceive(async event => {
            if (event.type === 'POLL_STATUS') {
              try {
                const response = await request(
                  API_URLS.credentialStatus.method,
                  API_URLS.credentialStatus.buildURL(
                    context.vcMetadata.requestId,
                  ),
                );
                switch (response.response?.statusCode) {
                  case 'NEW':
                    break;
                  case 'ISSUED':
                  case 'printing':
                    callback(model.events.DOWNLOAD_READY());
                    break;
                  case 'FAILED':
                  default:
                    callback(model.events.FAILED());
                    clearInterval(pollInterval);
                    break;
                }
              } catch (error) {
                callback(model.events.FAILED());
                clearInterval(pollInterval);
              }
            }
          });

          return () => clearInterval(pollInterval);
        },

        downloadCredential: context => (callback, onReceive) => {
          const pollInterval = setInterval(
            () => callback(model.events.POLL()),
            context.downloadInterval,
          );

          onReceive(async event => {
            if (event.type === 'POLL_DOWNLOAD') {
              const response: CredentialDownloadResponse = await request(
                API_URLS.credentialDownload.method,
                API_URLS.credentialDownload.buildURL(),
                {
                  individualId: context.vcMetadata.id,
                  requestId: context.vcMetadata.requestId,
                },
              );

              callback(
                model.events.CREDENTIAL_DOWNLOADED({
                  credential: response.credential,
                  verifiableCredential: response.verifiableCredential,
                  generatedOn: new Date(),
                  id: context.vcMetadata.id,
                  idType: context.vcMetadata.idType,
                  requestId: context.vcMetadata.requestId,
                  lastVerifiedOn: null,
                  locked: context.locked,
                  walletBindingResponse: null,
                  credentialRegistry: '',
                }),
              );
            }
          });

          return () => clearInterval(pollInterval);
        },

        verifyCredential: async context => {
          if (context.verifiableCredential) {
            const verificationResult = await verifyCredential(
              context.verifiableCredential,
            );
            if (!verificationResult.isVerified) {
              throw new Error(verificationResult.errorMessage);
            }
          }
        },

        requestOtp: async context => {
          try {
            return request(
              API_URLS.requestOtp.method,
              API_URLS.requestOtp.buildURL(),
              {
                individualId: context.vcMetadata.id,
                individualIdType: context.vcMetadata.idType,
                otpChannel: ['EMAIL', 'PHONE'],
                transactionID: context.transactionId,
              },
            );
          } catch (error) {
            console.error(error);
          }
        },

        requestLock: async context => {
          let response = null;
          if (context.locked) {
            response = await request(
              API_URLS.authUnLock.method,
              API_URLS.authUnLock.buildURL(),
              {
                individualId: context.vcMetadata.id,
                individualIdType: context.vcMetadata.idType,
                otp: context.otp,
                transactionID: context.transactionId,
                authType: ['bio'],
                unlockForSeconds: '120',
              },
            );
          } else {
            response = await request(
              API_URLS.authLock.method,
              API_URLS.authLock.buildURL(),
              {
                individualId: context.vcMetadata.id,
                individualIdType: context.vcMetadata.idType,
                otp: context.otp,
                transactionID: context.transactionId,
                authType: ['bio'],
              },
            );
          }
          return response.response;
        },

        requestRevoke: async context => {
          try {
            return request(
              API_URLS.requestRevoke.method,
              API_URLS.requestRevoke.buildURL(context.vcMetadata.id),
              {
                transactionID: context.transactionId,
                vidStatus: 'REVOKED',
                individualId: context.vcMetadata.id,
                individualIdType: 'VID',
                otp: context.otp,
              },
            );
          } catch (error) {
            console.error(error);
          }
        },
      },

      guards: {
        isSignedIn: (_context, event) =>
          (event.data as isSignedInResult).isSignedIn,
        hasCredential: (_, event) => {
          const vc =
            event.type === 'GET_VC_RESPONSE' ? event.vc : event.response;

          return vc?.credential != null && vc?.verifiableCredential != null;
        },

        isDownloadAllowed: _context => {
          return _context.downloadCounter <= _context.maxDownloadCount;
        },

        isCustomSecureKeystore: () => isHardwareKeystoreExists,
      },
    },
  );

export const createExistingMosipVCItemMachine = (
  serviceRefs: AppServices,
  vcMetadata: VCMetadata,
) => {
  return ExistingMosipVCItemMachine.withContext({
    ...ExistingMosipVCItemMachine.context,
    serviceRefs,
    vcMetadata,
  });
};

type State = StateFrom<typeof ExistingMosipVCItemMachine>;

export function selectVc(state: State) {
  const {serviceRefs, ...data} = state.context;
  return data;
}

export function selectId(state: State) {
  return state.context.vcMetadata.id;
}

export function selectIdType(state: State) {
  return state.context.vcMetadata.idType;
}

export function selectCredential(state: State) {
  return state.context.credential;
}

export function selectIsOtpError(state: State) {
  return state.context.otpError;
}

export function selectIsLockingVc(state: State) {
  return state.matches('lockingVc');
}

export function selectIsRevokingVc(state: State) {
  return state.matches('revokingVc');
}

export function selectIsLoggingRevoke(state: State) {
  return state.matches('loggingRevoke');
}

export function selectIsAcceptingOtpInput(state: State) {
  return state.matches('acceptingOtpInput');
}

export function selectIsAcceptingRevokeInput(state: State) {
  return state.matches('acceptingRevokeInput');
}

export function selectRequestBindingOtp(state: State) {
  return state.matches('requestingBindingOtp');
}

export function selectIsSavingFailedInIdle(state: State) {
  return state.matches('checkingServerData.savingFailed.idle');
}
