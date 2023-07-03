import { assign, ErrorPlatformEvent, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { HOST, MY_VCS_STORE_KEY, VC_ITEM_STORE_KEY } from '../shared/constants';
import { AppServices } from '../shared/GlobalContext';
import { CredentialDownloadResponse, request } from '../shared/request';
import {
  VC,
  VerifiableCredential,
  VcIdType,
  DecodedCredential,
} from '../types/vc';
import { StoreEvents } from './store';
import { ActivityLogEvents } from './activityLog';
import { verifyCredential } from '../shared/vcjs/verifyCredential';
import { log } from 'xstate/lib/actions';
import {
  generateKeys,
  WalletBindingResponse,
} from '../shared/cryptoutil/cryptoUtil';
import { KeyPair } from 'react-native-rsa-native';
import {
  getBindingCertificateConstant,
  savePrivateKey,
} from '../shared/keystore/SecureKeystore';
import getAllConfigurations, {
  DownloadProps,
} from '../shared/commonprops/commonProps';
import { VcEvents } from './vc';
import i18n from '../i18n';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    id: '',
    idType: '' as VcIdType,
    tag: '',
    vcKey: '' as string,
    myVcs: [] as string[],
    generatedOn: null as Date,
    credential: null as DecodedCredential,
    verifiableCredential: null as VerifiableCredential,
    storeVerifiableCredential: null as VerifiableCredential,
    requestId: '',
    isVerified: false,
    isPinned: false,
    lastVerifiedOn: null,
    locked: false,
    otp: '',
    otpError: '',
    idError: '',
    transactionId: '',
    bindingTransactionId: '',
    revoked: false,
    downloadCounter: 0,
    maxDownloadCount: 10,
    downloadInterval: 5000,
    walletBindingResponse: null as WalletBindingResponse,
    walletBindingError: '',
    publicKey: '',
    privateKey: '',
    storeError: null as Error,
  },
  {
    events: {
      KEY_RECEIVED: (key: string) => ({ key }),
      KEY_ERROR: (error: Error) => ({ error }),
      EDIT_TAG: () => ({}),
      SAVE_TAG: (tag: string) => ({ tag }),
      STORE_READY: () => ({}),
      DISMISS: () => ({}),
      CREDENTIAL_DOWNLOADED: (vc: VC) => ({ vc }),
      STORE_RESPONSE: (response: VC) => ({ response }),
      POLL: () => ({}),
      DOWNLOAD_READY: () => ({}),
      GET_VC_RESPONSE: (vc: VC) => ({ vc }),
      VERIFY: () => ({}),
      LOCK_VC: () => ({}),
      INPUT_OTP: (otp: string) => ({ otp }),
      REFRESH: () => ({}),
      REVOKE_VC: () => ({}),
      ADD_WALLET_BINDING_ID: () => ({}),
      CANCEL: () => ({}),
      CONFIRM: () => ({}),
      STORE_ERROR: (error: Error) => ({ error }),
      PIN_CARD: () => ({}),
      KEBAB_POPUP: () => ({}),
      SHOW_ACTIVITY: () => ({}),
      REMOVE: (vcKey: string) => ({ vcKey }),
    },
  }
);

export const VcItemEvents = model.events;

export const vcItemMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDcDGBaAlgFzAWwGIAlAUQDFSBlACQG0AGAXUVAAcB7WHTdgOxZAAPRABYATABoQAT0QBGABwBWAHT0FAZjEB2bSKUBOA9rliAvmalosuPCtQALMKgDWmXlABqqAgHESACoA+p4AwkFUAAoA8gBylCQMzEggHFzYPPwpwggKBiIqcvqaAGwGSvT0SnJSsgjicio69Np5GvTFSiIWVhg4+PZOru5ePv7BYREklDHxiXLJbJzcfAI5eQVFSqXlldW1iO2qmlpKhtpnGkbdliDW-XaOzm4elNjsAE5gBJQB0aRTGZxBJJARpFZZUA5OSmA4IMRyDQFDRKDQmMRiDRyAwKG69GwDJ7DV7vL4-P4AqLA+aLVLLDKrbLyJRiBRNAxybT0MRnQwKBSSGTyXFNERGPIwhFo-k9O59WyDZ4jShgD7IVUAEQAhtgtYriVA3jqAK6wAgxAAyFtBKXBDMhQkQPO0TTORQMJRZ2hKyjhihEbLkHRaXVRcmqCll9wVRJehtV6o+2t1+rjRuwpoIGuiAHVYhbogBBDVTYsATRtS3SmTWokMhWD9HyJRKRUxfuMYjUJQRBnaii6VSj8sJQzTCc1Or1EHYAHdeAAbdhaiAjUJfCBgXgZLUL83RK2VunVxlQxAKIMqETiCVo6pnBR+hQlDSFBTaMQlEQdL8dPFyglHjHZUJyTKcVBneclxXNcNy3Hc91CUgNRIWIAgASULC0gmzPMC2LEgNSPO0ayZBAg3yQoURMGjLg9DsxAKD88gxERsQDVph0AlRMAgBdvkI9DggCQtfGI+lSLPeERBdNiShMIMtDFb8lDhT9ORUNERDKZ9rw-JQuIeHi+O+TwSCIdCyArJgwQk09HXhT8ShUd8ujyFkMUMEo1LEFoVBZbl6BhBQQzRQyFV4-iCALUIAGkQlCcSTwdHIdA0V8kW01k5BKegexaNTvUad9r206of3MW5owGSLvlITxolikgEqSiFa1yQU6lZEKXL0JRPS5AMXwMqqRzsWqCGLEscywi1AiCAAhdDYg1ZbfCCdCiJs207JS+ROv28KBkgbgPACLUoCzdDKAAWWuyhWvtdrMVknKFPoJT8iqNT0voQp9By79TB7AwjrsE6MjOi6fkLMyghEsTtqrNqyMY175JhD7GK+1ShWk6pChbREBQMDpPzBlRYFJEZzsu35-maqk5keySHP645yhbDolMUbQ1IBwnWw0EmyZKCnE0wAAzaRYMgeDMF3AgZ14MAeN4ZB2BcVXqrsCXpdlzdtwVhcEHcDXUB1TIkhZ+zUqc3q3PKDEeXovHfNbFQvwqSoUSbF9xdVKWZY8dc5aNxXVQ+T4VFYBcdUlz5dbGlQ9eDqBQ8NhDTfV9gLfta2kePFGpM85zXIDJ3PNdupsR9T3n3KFFlDYnKKdjEZPEDyXMDzzJ00zG29vI5QDBc5QuSMfqPUUJ8KjfMogp5apurb4CPE7j4pZ7y2+H7s1aAWWzkvagdR-5JQJ856fHzdxRR69gMZP5FptAps3d14ghlsiABVYJogCJEQe7UtAujyjyHQRR5JiD7HCEQVxVBP2MHlPq-tRrcXfguT+q1br3WAWRUB3YIEmG0h+WBeNhZflFMYVsYoSGVXxEZL4ABHY0cBIZQGiNgVgSs+CqzNprbWycWFsKpiMLhrBs7mx3rwAutISK23kDCV8MDfLpX6pUD6cCuTOT7NoShbEL75ApiI9h4juEEEjtHWO8dE4p2EWAVhZiPASKkbnGRcij7FwcjCRE7I1Eolyj7OBQsVDGFJp6fQMCigUy1KgVAYBWAcIkehXgrBjTYC-rEX+-9AH4KkmUVQ4C3S4lKTiOBzQVDMQFEDC+SJYnxMSck7hqT0mZJwXdSgD1C4KKHqYJs9cQrtHKHoRicINAY38iTTQ1waIaAaQkpJIwiBgA1lrVpGSsk5KCAAoBPTdonzeoUIov1tBfRgbjGuiJjjpS0O0TQLIRqMIVHExZHCVlrLABs9p11OndPkQcsiRhGimH0GKAUXIsZwjIVebYPIfSIkfq-dBTDHGiI4RaXOLheEqzVp8+x3FTFiI8Ji1wbje58E8TtY+ZEfRFJ7CUx+eQb51CuM+KpXJzj3MUGLFFCoiUYqxZYj4UcPgxzjtgBOHwk6ErRc4qApKXDko8UwfJDlClEMZWUllog2L3w+n2KUDyhx8oGEuA03hyQM0BLMEE+yaVSV8SogwASNHBLxt+PyRgPTvhyuoF1Ji5XEqgB8wROL+E5y1gS1FTjg2hq1sq-Oqr7XeNSqTJo6g0TekxBeE54yfaC17PJF86hA2xveassNVixU2MlXYnWKgBXLMrQmgRFLZHJoBQ6hyhDimQNITAjQcCYSqACmKPKTt0qBrWR3Hw9NKTTFtYkFNT1aVnJcuUAUFQrifj0PmtEntGKtmbPJb8vLnlmvYFAKAzbPlXVwV0tV0IX5Xh9N6xEaJWQHQQO0A9PZtLsRbHoPKZb0UjAWu4VcLiLHKwjfihtTaPAQd4FBzh3DE1W07V41dUlf1hMgQ8oMRjv3A1UEGM9T8ijiCeQBGNYGkOQfMTw6t4rbHSujfyoNHDkOodcW2lVjAn2HA+vhkwhGqhnO-RURogVi1C36vAimsAHBzhICKz4BBQiFliKEEg1oV2sxyJ6ZypgKjPm9HkPKOqEAeWod6eBjFFJyAWU08DjHoM8O-n-HZeSDOKIQBcWSrQZk5UoeGP0S8qnRPDF+i4wsXNLIYyhpj96-lCYCxfK8wWrihefOFvGF8ux6G9byZ0sSIAQFimAaQkQtSYA+OGvFgiOMDBXJV6rtX6sYcpVh6lqalHyWOfA9oZzvwXIiyKLkJM2ItBkvo8r7Wat1Yayx2tUqZVGTa1VpbXX+NJsE35vpRyYTDZaOc8ofoya9TFIDdK4TkUXrsG1kYOZdz8WwDxkY6EICNYEVGhtz2PCvYXO9z7HhvvdY7Qdrt-Wf0aT7SQ6B5DWWFc0noeS6V9H9Xqaap7FWXtvbAB99zUBvvCtFaxut7GAf46B4T4nyXwcQEh1S5GOGe1+QR1AshQ6KFYk2IxVEAomwohow240rAICWw8JETeyAdRgG279yNQjuIS6lxw2XmB5e4G2yz3rbPDOIFaGRlETKZKYhfOMupmlyiDkChcEDuOVDq+l1ALXOvFfVfJ9YiV62Wt2Fd5ruXCu9d7cw9D7DRuAvKCom5JFlveesv0CZj6ehwxIlMA92jCplNzjB4aXUGYzRLRWmtHCcRl0w-Z9CXy99n7DIvuIEQ4yewyZJhMowPIQojVuLwdgm54ApB1lH-z6AJlwnQP0tQmjTBIgFFnhhOfRxKnXqgUfQ9bPexyuUD0YpDDjNj8V5sQUX4nFXqvwvnwwAb5PgiAomi-YIlZMUfmzlj-FFaF+zEF+DQqjVJOLqLfmRCdn6GUM5LlN+M+O0PJE7o9qmCBAAWBCmO3CSCaEPobv5jlCRvkKPOAr5OoKUoYGLsnKgfGEgcmNOHOIuMuKhhnPLLuMAQUnXEiFmnUqiLoDgVQlsMLPkK0L4uesvuNCZEwQ5NjA-pKKiEYPoroIVDyNdkNPkCOq3M7hDDTBdKIc+t+p+AMmKMYFiO+B6KDM7lTJ8OoVAJoYcLHuEkFMLJ+FiC6t5G7PoH9O5DoB6J+M+BiAHJvPrCHHBOHAuJYfCNyEVtiBiKwb5J+GpIDLbl0F+kYBMkvg2mQRvFvO2nvMEYiINufDRB+BZloDEcLC5KYHXopNsLiG-OrB-BAMEWxFeO+pUDApUB+nAkiH9MUHlNiPoiFMkcnJgrxCoOwNwsEXkA0cCk0aTLYUnrqjoGEtsFnl7MVlUfLlghACoAAEZxJawobBEupwJDSwpnJ8FVD8jZ4IZcZMbBGshUK5QsgTJBQXgi4hIDJTYIjchGB3EJbNKsDfKjHrpfhCzwJ5b6EVKaBhKhYuq6R0IkHcSvKuYeDxpfJpIZLBGBZZb8g5Yvh5aXJKKVBxE95iY3aRjO6IYKpYp1EfiFA8iIichcgnbfrwLlAZq5q+SYxBQUzmpxjeD-F-ThIyQfQwh6B5DjI4gFDeqFLcgfgwiCEXHlq3qCLBHyTDqmBRYN475jbTqayzp1EcgEl6IBjVC8z5pFCHr6BohJF5QdCclXo3qIkto359Y17njrriBiYupOxVC4k-otFmn9S6C4ifioigbyoF4SJ1EkaMR-RTZojTynHGImEqazhqairBFej+QtGFJ7675wi2Yf6-gCjySwmbaNKJZQBhkjFOnR4shsgnCmDKCVAmDlJ4ymZ-S3LNDBiwHGHwFbYdbLZ7FIiaRC6fh0Kfj7EtnZQQmejKDhjigmo9m05QDA6g4k7fZpl8weoQLzEL55TaTzLO5B4jAe6h7VZpn6ANh6ruHwIyTelNyvgnBVAejqBfgknwF56zgF6ZFVlYEFpQKKQchvStDW44hqDTaGl5AWAWBAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./vcItem.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      on: {
        REFRESH: {
          target: '.checkingStore',
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
                target: 'checkingVerificationStatus',
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
                target: 'checkingVerificationStatus',
              },
              {
                target: 'checkingServerData',
              },
            ],
          },
        },
        checkingServerData: {
          description:
            "Download VC data from the server. Uses polling method to check when it's available.",
          initial: 'verifyingDownloadLimitExpiry',
          states: {
            verifyingDownloadLimitExpiry: {
              invoke: {
                src: 'checkDownloadExpiryLimit',
                onDone: {
                  target: 'checkingStatus',
                  actions: ['setMaxDownloadCount', 'setDownloadInterval'],
                },
                onError: {
                  actions: log((_, event) => (event.data as Error).message),
                  target: 'checkingStatus',
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
                  actions: send('POLL_STATUS', { to: 'checkStatus' }),
                },
                DOWNLOAD_READY: {
                  target: 'downloadingCredential',
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
                      send('POLL_DOWNLOAD', { to: 'downloadCredential' }),
                      'incrementDownloadCounter',
                    ],
                  },
                ],
                CREDENTIAL_DOWNLOADED: {
                  actions: ['setStoreVerifiableCredential', 'storeContext'],
                },
                STORE_RESPONSE: {
                  actions: [
                    'setVerifiableCredential',
                    'updateVc',
                    'logDownloaded',
                  ],
                  target: '#vc-item.checkingVerificationStatus',
                },
                STORE_ERROR: {
                  target: '#vc-item.checkingServerData.savingFailed',
                },
              },
            },
            savingFailed: {
              entry: ['setStoreError', 'removeVcMetaDataFromStorage'],
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
            EDIT_TAG: {
              target: 'editingTag',
            },
            VERIFY: {
              target: 'verifyingCredential',
            },
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
          entry: 'storeContext',
          on: {
            STORE_RESPONSE: {
              actions: 'sendVcUpdated',
              target: 'idle',
            },
          },
        },
        kebabPopUp: {
          on: {
            DISMISS: {
              target: 'idle',
            },
            ADD_WALLET_BINDING_ID: {
              target: '#vc-item.kebabPopUp.showBindingWarning',
            },
            PIN_CARD: {
              target: '#vc-item.pinCard',
              actions: 'setPinCard',
            },
            SHOW_ACTIVITY: {
              target: '#vc-item.kebabPopUp.showActivities',
            },
            REMOVE: {
              actions: 'setVcKey',
              target: '#vc-item.kebabPopUp.removeWallet',
            },
          },
          initial: 'idle',
          states: {
            idle: {},
            showBindingWarning: {
              on: {
                CONFIRM: {
                  target: '#vc-item.kebabPopUp.requestingBindingOtp',
                },
                CANCEL: {
                  target: '#vc-item.kebabPopUp',
                },
              },
            },
            requestingBindingOtp: {
              invoke: {
                src: 'requestBindingOtp',
                onDone: [
                  {
                    target: '#vc-item.kebabPopUp.acceptingBindingOtp',
                  },
                ],
                onError: [
                  {
                    actions: 'setWalletBindingError',
                    target: '#vc-item.kebabPopUp.showingWalletBindingError',
                  },
                ],
              },
            },
            showingWalletBindingError: {
              on: {
                CANCEL: {
                  target: '#vc-item.kebabPopUp',
                  actions: 'setWalletBindingErrorEmpty',
                },
              },
            },
            acceptingBindingOtp: {
              entry: ['clearOtp'],
              on: {
                INPUT_OTP: {
                  target: '#vc-item.kebabPopUp.addKeyPair',
                  actions: ['setOtp'],
                },
                DISMISS: {
                  target: '#vc-item.kebabPopUp',
                  actions: ['clearOtp', 'clearTransactionId'],
                },
              },
            },
            addKeyPair: {
              invoke: {
                src: 'generateKeyPair',
                onDone: {
                  target: '#vc-item.kebabPopUp.addingWalletBindingId',
                  actions: ['setPublicKey', 'setPrivateKey'],
                },
                onError: [
                  {
                    actions: 'setWalletBindingError',
                    target: '#vc-item.kebabPopUp.showingWalletBindingError',
                  },
                ],
              },
            },
            addingWalletBindingId: {
              invoke: {
                src: 'addWalletBindnigId',
                onDone: [
                  {
                    target: '#vc-item.kebabPopUp.updatingPrivateKey',
                    actions: ['setWalletBindingId'],
                  },
                ],
                onError: [
                  {
                    actions: 'setWalletBindingError',
                    target: '#vc-item.kebabPopUp.showingWalletBindingError',
                  },
                ],
              },
            },
            updatingPrivateKey: {
              invoke: {
                src: 'updatePrivateKey',
                onDone: {
                  actions: [
                    'storeContext',
                    'updatePrivateKey',
                    'updateVc',
                    'setWalletBindingErrorEmpty',
                    'logWalletBindingSuccess',
                  ],
                  target: '#vc-item.kebabPopUp',
                },
                onError: {
                  actions: 'setWalletBindingError',
                  target: '#vc-item.kebabPopUp.showingWalletBindingError',
                },
              },
            },
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
                  actions: ['removedVc', log('removing Vc')],
                  target: '#vc-item',
                },
              },
            },
          },
        },
        editingTag: {
          on: {
            DISMISS: {
              target: 'idle',
            },
            SAVE_TAG: {
              actions: 'setTag',
              target: 'storingTag',
            },
          },
        },
        storingTag: {
          entry: 'storeTag',
          on: {
            STORE_RESPONSE: {
              actions: 'updateVc',
              target: 'idle',
            },
          },
        },
        verifyingCredential: {
          invoke: {
            src: 'verifyCredential',
            onDone: [
              {
                actions: ['markVcValid', 'storeContext', 'updateVc'],
                target: 'idle',
              },
            ],
            onError: [
              {
                actions: log((_, event) => (event.data as Error).message),
                target: 'idle',
              },
            ],
          },
        },
        checkingVerificationStatus: {
          description:
            'Check if VC verification is still valid. VCs stored on the device must be re-checked once every [N] time has passed.',
          always: [
            {
              cond: 'isVcValid',
              target: 'idle',
            },
            {
              target: 'verifyingCredential',
            },
          ],
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
              target: 'requestingBindingOtp',
            },
            CANCEL: {
              target: 'idle',
            },
          },
        },
        requestingBindingOtp: {
          invoke: {
            src: 'requestBindingOtp',
            onDone: [
              {
                target: 'acceptingBindingOtp',
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
            CANCEL: {
              target: 'idle',
              actions: 'setWalletBindingErrorEmpty',
            },
          },
        },
        acceptingBindingOtp: {
          entry: ['clearOtp'],
          on: {
            INPUT_OTP: {
              target: 'addKeyPair',
              actions: ['setOtp'],
            },
            DISMISS: {
              target: 'idle',
              actions: ['clearOtp', 'clearTransactionId'],
            },
          },
        },
        addKeyPair: {
          invoke: {
            src: 'generateKeyPair',
            onDone: {
              target: 'addingWalletBindingId',
              actions: ['setPublicKey', 'setPrivateKey'],
            },
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
                target: 'updatingPrivateKey',
                actions: [
                  'setWalletBindingId',
                  'setThumbprintForWalletBindingId',
                ],
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
              actions: [
                'storeContext',
                'updatePrivateKey',
                'updateVc',
                'setWalletBindingErrorEmpty',
                'logWalletBindingSuccess',
              ],
              target: 'idle',
            },
            onError: {
              actions: ['setWalletBindingError', 'logWalletBindingFailure'],
              target: 'showingWalletBindingError',
            },
          },
        },
      },
    },
    {
      actions: {
        setVerifiableCredential: assign((context) => {
          return {
            ...context,
            verifiableCredential: {
              ...context.storeVerifiableCredential,
            },
            storeVerifiableCredential: null,
          };
        }),

        setStoreVerifiableCredential: model.assign((context, event) => {
          return {
            ...context,
            ...event.vc,
            storeVerifiableCredential: {
              ...event.vc.verifiableCredential,
            },
            verifiableCredential: null,
          };
        }),

        setStoreError: assign({
          storeError: (_context, event) => event.error,
        }),

        removeVcMetaDataFromStorage: send(
          (context) => {
            const { serviceRefs, ...data } = context;
            return StoreEvents.REMOVE_VC_METADATA(
              MY_VCS_STORE_KEY,
              VC_ITEM_STORE_KEY(context)
            );
          },
          {
            to: (context) => context.serviceRefs.store,
          }
        ),

        removeVcMetaDataFromVcMachine: send(
          (context, _event) => {
            const { serviceRefs, ...data } = context;
            return {
              type: 'REMOVE_VC_FROM_CONTEXT',
              vcKey: VC_ITEM_STORE_KEY(context),
            };
          },
          {
            to: (context) => context.serviceRefs.vc,
          }
        ),

        setWalletBindingError: assign({
          walletBindingError: (context, event) =>
            i18n.t(`errors.genericError`, {
              ns: 'common',
            }),
        }),

        setWalletBindingErrorEmpty: assign({
          walletBindingError: () => '',
        }),

        setPublicKey: assign({
          publicKey: (context, event) => (event.data as KeyPair).public,
        }),

        setPrivateKey: assign({
          privateKey: (context, event) => (event.data as KeyPair).private,
        }),

        updatePrivateKey: assign({
          privateKey: () => '',
        }),

        setWalletBindingId: assign({
          walletBindingResponse: (context, event) =>
            event.data as WalletBindingResponse,
        }),

        setPinCard: assign((context) => {
          return {
            ...context,
            isPinned: !context.isPinned,
          };
        }),

        sendVcUpdated: send(
          (_context, event) =>
            VcEvents.VC_UPDATED(VC_ITEM_STORE_KEY(event.response) as string),
          {
            to: (context) => context.serviceRefs.vc,
          }
        ),

        updateVc: send(
          (context) => {
            const { serviceRefs, ...vc } = context;
            return { type: 'VC_DOWNLOADED', vc };
          },
          {
            to: (context) => context.serviceRefs.vc,
          }
        ),
        setThumbprintForWalletBindingId: send(
          (context) => {
            const { walletBindingResponse } = context;
            const walletBindingIdKey = getBindingCertificateConstant(
              walletBindingResponse.walletBindingId
            );
            return StoreEvents.SET(
              walletBindingIdKey,
              walletBindingResponse.thumbprint
            );
          },
          {
            to: (context) => context.serviceRefs.store,
          }
        ),

        removedVc: send(
          () => ({
            type: 'REFRESH_MY_VCS',
          }),
          {
            to: (context) => context.serviceRefs.vc,
          }
        ),

        requestVcContext: send(
          (context) => ({
            type: 'GET_VC_ITEM',
            vcKey: VC_ITEM_STORE_KEY(context),
          }),
          {
            to: (context) => context.serviceRefs.vc,
          }
        ),

        requestStoredContext: send(
          (context) => StoreEvents.GET(VC_ITEM_STORE_KEY(context)),
          {
            to: (context) => context.serviceRefs.store,
          }
        ),

        storeContext: send(
          (context) => {
            const { serviceRefs, ...data } = context;
            data.credentialRegistry = HOST;
            return StoreEvents.SET(VC_ITEM_STORE_KEY(context), data);
          },
          {
            to: (context) => context.serviceRefs.store,
          }
        ),

        setTag: model.assign({
          tag: (_, event) => event.tag,
        }),

        incrementDownloadCounter: model.assign({
          downloadCounter: ({ downloadCounter }) => downloadCounter + 1,
        }),

        setMaxDownloadCount: model.assign({
          maxDownloadCount: (_context, event) =>
            Number((event.data as DownloadProps).maxDownloadLimit),
        }),

        setDownloadInterval: model.assign({
          downloadInterval: (_context, event) =>
            Number((event.data as DownloadProps).downloadInterval),
        }),

        storeTag: send(
          (context) => {
            const { serviceRefs, ...data } = context;
            return StoreEvents.SET(VC_ITEM_STORE_KEY(context), data);
          },
          { to: (context) => context.serviceRefs.store }
        ),

        setCredential: model.assign((context, event) => {
          switch (event.type) {
            case 'STORE_RESPONSE':
              return { ...context, ...event.response };
            case 'GET_VC_RESPONSE':
            case 'CREDENTIAL_DOWNLOADED':
              return { ...context, ...event.vc };
          }
        }),

        logDownloaded: send(
          (context) => {
            const { serviceRefs, ...data } = context;
            return ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(data),
              type: 'VC_DOWNLOADED',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: data.tag || data.id,
            });
          },
          {
            to: (context) => context.serviceRefs.activityLog,
          }
        ),

        logWalletBindingSuccess: send(
          (context, event) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context),
              type: 'WALLET_BINDING_SUCCESSFULL',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: context.tag || context.id,
            }),
          {
            to: (context) => context.serviceRefs.activityLog,
          }
        ),

        logWalletBindingFailure: send(
          (context, event) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context),
              type: 'WALLET_BINDING_FAILURE',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: context.tag || context.id,
            }),
          {
            to: (context) => context.serviceRefs.activityLog,
          }
        ),

        logRevoked: send(
          (context) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context),
              type: 'VC_REVOKED',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: context.tag || context.id,
            }),
          {
            to: (context) => context.serviceRefs.activityLog,
          }
        ),

        revokeVID: send(
          (context) => {
            return StoreEvents.REMOVE(
              MY_VCS_STORE_KEY,
              VC_ITEM_STORE_KEY(context)
            );
          },
          {
            to: (context) => context.serviceRefs.store,
          }
        ),

        markVcValid: assign((context) => {
          return {
            ...context,
            isVerified: true,
            lastVerifiedOn: Date.now(),
          };
        }),

        setTransactionId: assign({
          transactionId: () => String(new Date().valueOf()).substring(3, 13),
        }),

        clearTransactionId: assign({ transactionId: '' }),

        setOtp: model.assign({
          otp: (_, event) => event.otp,
        }),

        setVcKey: model.assign({
          vcKey: (_, event) => event.vcKey,
        }),

        setOtpError: assign({
          otpError: (_context, event) =>
            (event as ErrorPlatformEvent).data.message,
        }),

        clearOtp: assign({ otp: '' }),

        setLock: assign({
          locked: (context) => !context.locked,
        }),

        setRevoke: assign({
          revoked: () => true,
        }),

        storeLock: send(
          (context) => {
            const { serviceRefs, ...data } = context;
            return StoreEvents.SET(VC_ITEM_STORE_KEY(context), data);
          },
          { to: (context) => context.serviceRefs.store }
        ),

        loadMyVcs: send(StoreEvents.GET(MY_VCS_STORE_KEY), {
          to: (context) => context.serviceRefs.store,
        }),

        removeVcItem: send(
          (_context, event) => {
            return StoreEvents.REMOVE(MY_VCS_STORE_KEY, _context.vcKey);
          },
          { to: (context) => context.serviceRefs.store }
        ),
      },

      services: {
        checkDownloadExpiryLimit: async (context) => {
          var resp = await getAllConfigurations();
          const maxLimit: number = resp.vcDownloadMaxRetry;
          const vcDownloadPoolInterval: number = resp.vcDownloadPoolInterval;
          console.log(maxLimit);
          if (maxLimit <= context.downloadCounter) {
            throw new Error(
              'Download limit expired for request id: ' + context.requestId
            );
          }

          const downloadProps: DownloadProps = {
            maxDownloadLimit: maxLimit,
            downloadInterval: vcDownloadPoolInterval,
          };

          return downloadProps;
        },

        addWalletBindnigId: async (context) => {
          const response = await request(
            'POST',
            '/residentmobileapp/wallet-binding',
            {
              requestTime: String(new Date().toISOString()),
              request: {
                authFactorType: 'WLA',
                format: 'jwt',
                individualId: context.id,
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
            }
          );
          const certificate = response.response.certificate;
          await savePrivateKey(
            getBindingCertificateConstant(context.id),
            certificate
          );

          const walletResponse: WalletBindingResponse = {
            walletBindingId: response.response.encryptedWalletBindingId,
            keyId: response.response.keyId,
            thumbprint: response.response.thumbprint,
            expireDateTime: response.response.expireDateTime,
          };
          return walletResponse;
        },

        updatePrivateKey: async (context) => {
          const hasSetPrivateKey: boolean = await savePrivateKey(
            context.walletBindingResponse.walletBindingId,
            context.privateKey
          );
          if (!hasSetPrivateKey) {
            throw new Error('Could not store private key in keystore.');
          }
          return '';
        },

        generateKeyPair: async (context) => {
          let keyPair: KeyPair = await generateKeys();
          return keyPair;
        },

        requestBindingOtp: async (context) => {
          const response = await request(
            'POST',
            '/residentmobileapp/binding-otp',
            {
              requestTime: String(new Date().toISOString()),
              request: {
                individualId: context.id,
                otpChannels: ['EMAIL', 'PHONE'],
              },
            }
          );
          if (response.response == null) {
            throw new Error('Could not process request');
          }
        },

        checkStatus: (context) => (callback, onReceive) => {
          const pollInterval = setInterval(
            () => callback(model.events.POLL()),
            context.downloadInterval
          );

          onReceive(async (event) => {
            if (event.type === 'POLL_STATUS') {
              const response = await request(
                'GET',
                `/residentmobileapp/credentialshare/request/status/${context.requestId}`
              );
              switch (response.response?.statusCode) {
                case 'NEW':
                  break;
                case 'ISSUED':
                case 'printing':
                  callback(model.events.DOWNLOAD_READY());
                  break;
              }
            }
          });

          return () => clearInterval(pollInterval);
        },

        downloadCredential: (context) => (callback, onReceive) => {
          const pollInterval = setInterval(
            () => callback(model.events.POLL()),
            context.downloadInterval
          );

          onReceive(async (event) => {
            if (event.type === 'POLL_DOWNLOAD') {
              const response: CredentialDownloadResponse = await request(
                'POST',
                '/residentmobileapp/credentialshare/download',
                {
                  individualId: context.id,
                  requestId: context.requestId,
                }
              );

              callback(
                model.events.CREDENTIAL_DOWNLOADED({
                  credential: response.credential,
                  verifiableCredential: response.verifiableCredential,
                  generatedOn: new Date(),
                  id: context.id,
                  idType: context.idType,
                  tag: '',
                  requestId: context.requestId,
                  isVerified: false,
                  isPinned: context.isPinned,
                  lastVerifiedOn: null,
                  locked: context.locked,
                  walletBindingResponse: null,
                  credentialRegistry: '',
                })
              );
            }
          });

          return () => clearInterval(pollInterval);
        },

        verifyCredential: async (context) => {
          return verifyCredential(context.verifiableCredential);
        },

        requestOtp: async (context) => {
          try {
            return request('POST', '/residentmobileapp/req/otp', {
              individualId: context.id,
              individualIdType: context.idType,
              otpChannel: ['EMAIL', 'PHONE'],
              transactionID: context.transactionId,
            });
          } catch (error) {
            console.error(error);
          }
        },

        requestLock: async (context) => {
          let response = null;
          if (context.locked) {
            response = await request(
              'POST',
              '/residentmobileapp/req/auth/unlock',
              {
                individualId: context.id,
                individualIdType: context.idType,
                otp: context.otp,
                transactionID: context.transactionId,
                authType: ['bio'],
                unlockForSeconds: '120',
              }
            );
          } else {
            response = await request(
              'POST',
              '/residentmobileapp/req/auth/lock',
              {
                individualId: context.id,
                individualIdType: context.idType,
                otp: context.otp,
                transactionID: context.transactionId,
                authType: ['bio'],
              }
            );
          }
          return response.response;
        },

        requestRevoke: async (context) => {
          try {
            return request('PATCH', `/residentmobileapp/vid/${context.id}`, {
              transactionID: context.transactionId,
              vidStatus: 'REVOKED',
              individualId: context.id,
              individualIdType: 'VID',
              otp: context.otp,
            });
          } catch (error) {
            console.error(error);
          }
        },
      },

      guards: {
        hasCredential: (_, event) => {
          const vc =
            event.type === 'GET_VC_RESPONSE' ? event.vc : event.response;

          return vc?.credential != null && vc?.verifiableCredential != null;
        },

        isDownloadAllowed: (_context, event) => {
          return _context.downloadCounter <= _context.maxDownloadCount;
        },

        isVcValid: (context) => {
          return context.isVerified;
        },
      },
    }
  );

export const createVcItemMachine = (
  serviceRefs: AppServices,
  vcKey: string
) => {
  const [, idType, id, requestId] = vcKey.split(':');
  return vcItemMachine.withContext({
    ...vcItemMachine.context,
    serviceRefs,
    id,
    idType: idType as VcIdType,
    requestId,
  });
};

type State = StateFrom<typeof vcItemMachine>;

export function selectVc(state: State) {
  const { serviceRefs, ...data } = state.context;
  return data;
}

export function selectGeneratedOn(state: State) {
  return new Date(state.context.generatedOn).toLocaleDateString();
}

export function selectId(state: State) {
  return state.context.id;
}

export function selectIdType(state: State) {
  return state.context.idType;
}

export function selectTag(state: State) {
  return state.context.tag;
}

export function selectCredential(state: State) {
  return state.context.credential;
}

export function selectVerifiableCredential(state: State) {
  return state.context.verifiableCredential;
}

export function selectContext(state: State) {
  return state.context;
}

export function selectIsEditingTag(state: State) {
  return state.matches('editingTag');
}

export function selectIsOtpError(state: State) {
  return state.context.otpError;
}

export function selectOtpError(state: State) {
  return state.context.otpError;
}
export function selectIsPinned(state: State) {
  return state.context.isPinned;
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

export function selectEmptyWalletBindingId(state: State) {
  var val = state.context.walletBindingResponse
    ? state.context.walletBindingResponse.walletBindingId
    : undefined;
  return val == undefined || val == null || val.length <= 0 ? true : false;
}

export function selectWalletBindingError(state: State) {
  return state.context.walletBindingError;
}

export function selectRequestBindingOtp(state: State) {
  return state.matches('requestingBindingOtp');
}

export function selectAcceptingBindingOtp(state: State) {
  return state.matches('acceptingBindingOtp');
}

export function selectShowWalletBindingError(state: State) {
  return state.matches('showingWalletBindingError');
}

export function selectWalletBindingInProgress(state: State) {
  return state.matches('requestingBindingOtp') ||
    state.matches('addingWalletBindingId') ||
    state.matches('addKeyPair') ||
    state.matches('updatingPrivateKey')
    ? true
    : false;
}

export function selectBindingWarning(state: State) {
  return state.matches('showBindingWarning');
}
export function selectKebabPopUp(state: State) {
  return state.matches('kebabPopUp');
}

export function selectKebabPopUpRequestBindingOtp(state: State) {
  return state.matches('kebabPopUp.requestingBindingOtp');
}

export function selectKebabPopUpAcceptingBindingOtp(state: State) {
  return state.matches('kebabPopUp.acceptingBindingOtp');
}

export function selectKebabPopUpShowWalletBindingError(state: State) {
  return state.matches('kebabPopUp.showingWalletBindingError');
}

export function selectKebabPopUpWalletBindingInProgress(state: State) {
  return state.matches('kebabPopUp.requestingBindingOtp') ||
    state.matches('kebabPopUp.addingWalletBindingId') ||
    state.matches('kebabPopUp.addKeyPair') ||
    state.matches('kebabPopUp.updatingPrivateKey')
    ? true
    : false;
}

export function selectKebabPopUpBindingWarning(state: State) {
  return state.matches('kebabPopUp.showBindingWarning');
}

export function selectRemoveWalletWarning(state: State) {
  return state.matches('kebabPopUp.removeWallet');
}

export function selectShowActivities(state: State) {
  return state.matches('kebabPopUp.showActivities');
}

export function selectStoreError(state: State) {
  return state.context.storeError;
}

export function selectIsSavingFailedInIdle(state: State) {
  return state.matches('checkingServerData.savingFailed.idle');
}
