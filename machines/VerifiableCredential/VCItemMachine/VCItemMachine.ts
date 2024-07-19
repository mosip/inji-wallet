import {AppServices} from '../../../shared/GlobalContext';
import {VCMetadata} from '../../../shared/VCMetadata';
import {assign, EventFrom, send} from 'xstate';
import {log} from 'xstate/lib/actions';
import {VCItemActions} from './VCItemActions';
import {VCItemGaurds} from './VCItemGaurds';
import {VCItemServices} from './VCItemServices';
import {VCItemModel} from './VCItemModel';
import {BannerStatusType} from '../../../components/BannerNotification';

const machineName = 'vc-item-machine';
const model = VCItemModel;
export const VCItemEvents = model.events;
export const VCItemMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./VCItemMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    description:
      'This machine is spawned for every VC downloaded, and tracks its lifecycle.',
    id: machineName,
    type: 'parallel',
    states: {
      vcUtilitiesState: {
        on: {
          REFRESH: {
            target: '.loadVc',
          },
          UPDATE_VC_METADATA: {
            actions: 'setVcMetadata',
          },
        },
        initial: 'loadVc',
        states: {
          loadVc: {
            initial: 'loadVcFromContext',
            states: {
              loadVcFromContext: {
                entry: ['requestVcContext'],
                description: 'Fetch the VC data from the Memory.',
                on: {
                  GET_VC_RESPONSE: [
                    {
                      actions: ['setContext'],
                      cond: 'hasCredentialAndWellknown',
                      target: '.fetchWellknown',
                    },
                    {
                      actions: ['setContext'],
                      cond: 'hasCredential',
                      target: `#vc-item-machine.vcUtilitiesState.idle`,
                    },
                    {
                      actions: 'addVcToInProgressDownloads',
                      target: 'loadVcFromServer',
                    },
                  ],
                  TAMPERED_VC: {
                    target: '#vc-item-machine.vcUtilitiesState.idle',
                  },
                },
                initial: 'idle',
                states: {
                  idle: {},
                  fetchWellknown: {
                    invoke: {
                      src: 'fetchIssuerWellknown',
                      onDone: {
                        actions: 'updateWellknownResponse',

                        target: `#vc-item-machine.vcUtilitiesState.idle`,
                      },
                    },
                  },
                },
              },
              loadVcFromServer: {
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
                      onError: {
                        actions: [
                          'sendDownloadingFailedToVcMeta',
                          'removeVcFromInProgressDownloads',
                        ],
                      },
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
                        actions: 'setContext',
                        target:
                          '#vc-item-machine.vcUtilitiesState.verifyingCredential',
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
                        actions: ['removeVcMetaDataFromVcMachineContext'],
                        target: '.viewingVc',
                      },
                    },
                  },
                },
              },
            },
          },
          walletBinding: {
            initial: 'showBindingWarning',
            states: {
              showBindingWarning: {
                on: {
                  CONFIRM: {
                    actions: 'sendActivationStartEvent',
                    target: 'requestingBindingOTP',
                  },
                  CANCEL: [
                    {
                      cond: context => context.isMachineInKebabPopupState,
                      target: '#vc-item-machine.vcUtilitiesState.kebabPopUp',
                    },
                    {
                      target: '#vc-item-machine.vcUtilitiesState.idle',
                    },
                  ],
                },
              },
              requestingBindingOTP: {
                invoke: {
                  src: 'requestBindingOTP',
                  onDone: [
                    {
                      target: 'acceptingBindingOTP',
                      actions: ['setCommunicationDetails'],
                    },
                  ],
                  onError: [
                    {
                      actions: [
                        'setErrorAsWalletBindingError',
                        'sendWalletBindingErrorEvent',
                        'logWalletBindingFailure',
                      ],
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
                      actions: ['unSetError'],
                      target: '#vc-item-machine.vcUtilitiesState.kebabPopUp',
                    },
                    {
                      actions: ['unSetError'],
                      target: '#vc-item-machine.vcUtilitiesState.idle',
                    },
                  ],
                },
              },
              acceptingBindingOTP: {
                entry: ['unSetOTP'],
                on: {
                  INPUT_OTP: {
                    target: 'addKeyPair',
                    actions: ['setOTP'],
                  },
                  DISMISS: [
                    {
                      cond: context => context.isMachineInKebabPopupState,
                      target: '#vc-item-machine.vcUtilitiesState.kebabPopUp',
                      actions: [
                        'sendUserCancelledActivationFailedEndEvent',
                        'unSetOTP',
                        'unSetBindingTransactionId',
                      ],
                    },
                    {
                      target: '#vc-item-machine.vcUtilitiesState.idle',
                      actions: [
                        'sendUserCancelledActivationFailedEndEvent',
                        'unSetOTP',
                        'unSetBindingTransactionId',
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
                      src: 'requestBindingOTP',
                      onDone: {
                        target:
                          '#vc-item-machine.vcUtilitiesState.walletBinding.acceptingBindingOTP',
                        actions: ['setCommunicationDetails'],
                      },
                      onError: {
                        actions: [
                          'setErrorAsWalletBindingError',
                          'sendWalletBindingErrorEvent',
                        ],
                        target:
                          '#vc-item-machine.vcUtilitiesState.walletBinding.showingWalletBindingError',
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
                      actions: [
                        'setErrorAsWalletBindingError',
                        'sendWalletBindingErrorEvent',
                        'logWalletBindingFailure',
                      ],
                      target: 'showingWalletBindingError',
                    },
                  ],
                },
              },
              addingWalletBindingId: {
                invoke: {
                  src: 'addWalletBindingId',
                  onDone: [
                    {
                      cond: 'isCustomSecureKeystore',
                      target: 'updatingContextVariables',
                      actions: ['setWalletBindingResponse'],
                    },
                    {
                      target: 'updatingPrivateKey',
                      /*The walletBindingResponse is used for conditional rendering in wallet binding.                                                                                                                                                                                                                                                                                                                                                                                                                                          response and use it in updatingPrivateKey state*/
                      actions: ['setWalletBindingResponse'],
                    },
                  ],
                  onError: [
                    {
                      actions: [
                        'setErrorAsWalletBindingError',
                        'sendWalletBindingErrorEvent',
                        'logWalletBindingFailure',
                      ],
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
                      'setErrorAsWalletBindingError',
                      'sendWalletBindingErrorEvent',
                      'logWalletBindingFailure',
                    ],
                    target: 'showingWalletBindingError',
                  },
                },
              },
              updatingContextVariables: {
                entry: [
                  'setThumbprintForWalletBindingId',
                  'storeContext',
                  'resetPrivateKey',
                  'storeVcInContext',
                  'unSetError',
                  'sendActivationSuccessEvent',
                  'logWalletBindingSuccess',
                  send('SHOW_BINDING_STATUS'),
                ],
                on: {
                  SHOW_BINDING_STATUS: [
                    {
                      cond: context => context.isMachineInKebabPopupState,
                      actions: 'sendWalletBindingSuccess',
                      target: '#vc-item-machine.vcUtilitiesState.kebabPopUp',
                    },
                    {
                      actions: 'sendWalletBindingSuccess',
                      target: '#vc-item-machine.vcUtilitiesState.idle',
                    },
                  ],
                },
              },
            },
          },
          kebabPopUp: {
            entry: assign({isMachineInKebabPopupState: () => true}),
            exit: 'resetIsMachineInKebabPopupState',
            on: {
              DISMISS: {
                target: '#vc-item-machine.vcUtilitiesState.idle',
              },
              ADD_WALLET_BINDING_ID: {
                target: '#vc-item-machine.vcUtilitiesState.walletBinding',
              },
              PIN_CARD: {
                target: '.pinCard',
                actions: 'setPinCard',
              },
              SHOW_ACTIVITY: {
                target:
                  '#vc-item-machine.vcUtilitiesState.kebabPopUp.showActivities',
              },
              REMOVE: {
                actions: 'setVcKey',
                target:
                  '#vc-item-machine.vcUtilitiesState.kebabPopUp.removeWallet',
              },
              CLOSE_VC_MODAL: {
                actions: ['closeViewVcModal'],
                target: '#vc-item-machine.vcUtilitiesState.idle',
              },
            },
            initial: 'idle',
            states: {
              idle: {},
              pinCard: {
                entry: 'updateVcMetadata',
                always: {
                  target: '#vc-item-machine.vcUtilitiesState.idle',
                },
              },
              showActivities: {
                entry: 'resetIsMachineInKebabPopupState',
                on: {
                  DISMISS: '#vc-item-machine.vcUtilitiesState.idle',
                },
              },
              removeWallet: {
                entry: 'resetIsMachineInKebabPopupState',
                on: {
                  CONFIRM: {
                    target: 'removingVc',
                  },
                  CANCEL: {
                    target: '#vc-item-machine.vcUtilitiesState.idle',
                  },
                },
              },
              removingVc: {
                entry: 'removeVcItem',
                on: {
                  STORE_RESPONSE: {
                    actions: [
                      'closeViewVcModal',
                      'refreshAllVcs',
                      'logRemovedVc',
                    ],
                    target: 'triggerAutoBackup',
                  },
                },
              },
              triggerAutoBackup: {
                invoke: {
                  src: 'isUserSignedAlready',
                  onDone: [
                    {
                      cond: 'isSignedIn',
                      actions: [
                        'sendBackupEvent',
                        'refreshAllVcs',
                      ],
                      target: '#vc-item-machine.vcUtilitiesState.idle',
                    },
                    {
                      actions: ['refreshAllVcs'],
                      target: '#vc-item-machine.vcUtilitiesState.idle',
                    },
                  ],
                },
              },
            },
          },
          verifyingCredential: {
            invoke: {
              src: 'verifyCredential',
              onDone: {
                actions: ['setIsVerified', 'storeContext'],
              },
              onError: [
                {
                  cond: 'isVerificationPendingBecauseOfNetworkIssue',
                  actions: ['resetIsVerified', 'storeContext'],
                },
                {
                  actions: ['setErrorAsVerificationError'],
                  target: '.handleVCVerificationFailure',
                },
              ],
            },
            on: {
              STORE_RESPONSE: {
                actions: [
                  'storeVcInContext',
                  'updateVcMetadata',
                  'logDownloaded',
                  'sendTelemetryEvents',
                  'removeVcFromInProgressDownloads',
                ],
                target: '.triggerAutoBackupForVcDownload',
              },
              STORE_ERROR: {
                target:
                  '#vc-item-machine.vcUtilitiesState.loadVc.loadVcFromServer.savingFailed',
              },
            },
            initial: 'idle',
            states: {
              idle: {},
              triggerAutoBackupForVcDownload: {
                invoke: {
                  src: 'isUserSignedAlready',
                  onDone: [
                    {
                      cond: 'isSignedIn',
                      actions: ['sendBackupEvent'],
                      target: `#vc-item-machine.vcUtilitiesState.idle`,
                    },
                    {
                      target: `#vc-item-machine.vcUtilitiesState.idle`,
                    },
                  ],
                },
              },
              handleVCVerificationFailure: {
                entry: [
                  'removeVcMetaDataFromStorage',
                  'removeVcFromInProgressDownloads',
                ],
                on: {
                  STORE_RESPONSE: {
                    actions: ['sendVerificationError'],
                  },
                },
              },
            },
          },
          idle: {
            on: {
              DISMISS: {
                target:
                  '#vc-item-machine.vcUtilitiesState.loadVc.loadVcFromContext',
              },
              KEBAB_POPUP: {
                target: 'kebabPopUp',
              },
              ADD_WALLET_BINDING_ID: {
                target: '#vc-item-machine.vcUtilitiesState.walletBinding',
              },
              PIN_CARD: {
                target: '#vc-item-machine.vcUtilitiesState.kebabPopUp.pinCard',
                actions: 'setPinCard',
              },
            },
          },
        },
      },
      verifyState: {
        on: {
          VERIFY: {
            target: '#vc-item-machine.verifyState.verifyingCredential',
          },
          RESET_VERIFICATION_STATUS: {
            actions: [
              'resetVerificationStatus',
              'removeVerificationStatusFromVcMeta',
            ],
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          verifyingCredential: {
            entry: send({
              type: 'SET_VERIFICATION_STATUS',
              response: {statusType: BannerStatusType.IN_PROGRESS},
            }),

            invoke: {
              src: 'verifyCredential',
              onDone: {
                actions: ['setIsVerified', 'storeContext'],
              },
              onError: [
                {
                  cond: 'isVerificationPendingBecauseOfNetworkIssue',
                  actions: ['resetIsVerified', 'storeContext'],
                },
              ],
            },
            after: {
              500: [
                {
                  actions: 'showVerificationBannerStatus',
                },
              ],
            },
            on: {
              STORE_RESPONSE: {
                actions: [
                  'setVerificationStatus',
                  'sendVerificationStatusToVcMeta',
                  'updateVcMetadata',
                ],
                target: 'verificationCompleted',
              },
              SET_VERIFICATION_STATUS: {
                actions: 'setVerificationStatus',
              },
              SHOW_VERIFICATION_STATUS_BANNER: {
                actions: [
                  'setVerificationStatus',
                  'showVerificationBannerStatus',
                ],
              },
              //TO-DO: Handle if some error is thrown when storing verified status into storage
              STORE_ERROR: {},
            },
          },
          verificationCompleted: {
            entry: 'showVerificationBannerStatus',
            on: {
              REMOVE_VERIFICATION_STATUS_BANNER: {
                actions: 'resetVerificationStatus',
              },
            },
          },
        },
      },
    },
  },
  {
    actions: VCItemActions(model),
    services: VCItemServices(model),
    guards: VCItemGaurds(),
  },
);

export const createVCItemMachine = (
  serviceRefs: AppServices,
  vcMetadata: VCMetadata,
) => {
  return VCItemMachine.withContext({
    ...VCItemMachine.context,
    serviceRefs,
    vcMetadata,
  });
};
