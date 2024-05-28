import {ActorRefFrom, EventFrom} from 'xstate';
import {AppServices} from '../../shared/GlobalContext';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {
  getEndEventData,
  sendEndEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {QrLoginActions} from './QrLoginActions';
import {QrLoginmodel} from './QrLoginModel';
import {QrLoginServices} from './QrLoginServices';
import {QrLoginGuards} from './QrLoginGuards';

const model = QrLoginmodel;

export const QrLoginEvents = model.events;
export type QrLoginRef = ActorRefFrom<typeof qrLoginMachine>;

export const qrLoginMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEUBOAZA9lAlgOwDocIAbMAYgGUBhAQQDl6BJegcQH0ARAeXoFEA2gAYAuolAAHTLBwAXHJjziQAD0QBGACzqATAQCs+nZv0BmABzqL50zoA0IAJ6IA7KaEFNATnPmv6oUMhHUMAX1CHNCxcQmIyck4mSgBZJMphMSQQKRl5RWU1BF1zFwIvHQrTFxdNCxcANgdnBH16j1NbdT8vfW8q9XDIjGx8AhJ8AGsAFVQAQzxYWYBjPLxyCEUwIjwAN0wJraiRwnG8abmF5dWEfD2l2dWMjOUcuQUlLMKtXQMjEwsrL5bE1EF4XOYCEJ6iEXF4ekIOppzIMQEcYmNJjN5osVu9yGBUKhMKgCBISA8AGbEgC2BDRo1O52xV3eN12mHuj1Ezyyr1WBQ0JQhmlhotMZmM+hcIIQNX0nnUhh65h06hcOhKKPphFgAAtMAB3ADqs1QeHwUHI1F4ADEmAAlZI8yTSN75T6IEIeHT+eo1Lyaeriwwy+pggiwtXw9SKjU6LXDdF6w0ms0Wq0Mah8dDO7Ku-kehBegg+9R+7yB4P6GV+dQRlwBIRqoTqjX1BPRUaUfUGviE4kZ+hZnOiF7594Coo9TSQtyqqUx9zApyINpeCNIoVaYzlUwd45jTCzCDJRwANSWsCoU249r47DvlAACrxKIJR7zx+7QIU-fLofoMaATYWjaKGLjylCOjQi4gSmJoOgNPuSY9jsSzoDgsCyFQ2Z8NQUzsGe1C5nyE6Fr4M4BkI3j6DYtEttWK4tDGEb1H6DbmEYAZschozJgaaEYVh5Bnnw9pMDaACaJFfh8P6uLRZRIoqKl0UI5gyiK9SQtobjUZu0KaLxOqoehmHYYkKRpDJuRkfJRTqRCpj1PoTYBj01QVKGPwVIBHT6AGqq1MZBAUssYC0AArrIurkDatBZoRtDoEwnA2W6cmqJ6rklr6-qVoYjHNP4kI2Jo1ENr01EBiFYVLBF0WxfFiUsGeyWpelBb2cWpbltxVahiKuVqmGXT1IG6heLV4VRTFg7Dp1dlZUWOW9flQaFTW2glrBYK0SqZaqiFtyzOMEBMBAYB4PIsiOAkSSpJQ6Qfi6tnfstf4EABQFdKYoHqKG1EECUrnmEIcJ+FC7YRKiiajCdZ0XVdN13XeUz2pJhFiRJTB0FMTC8It72FD1eUVhtIZMQF2mRjUHT1FYPTQ0MnaEKgYAAI6RXAsjUIosDI1atoOk6L15m9mW-hBX0hD9IGaGBTEIfKvTNoGOhVF4zOw6zBDs1zPN8wsgt0EO2ZE5Lq7S99ql-QrANMe4M6RqNDa6NC5hGTD2oEBseAUJZj3PZkr0ZZOAS+AQzmuZNNGefYSshAYunUdCmvaz7+vc1hFpGwL13rJs2x7AcdJw2znPZ-IeBQHnyNsncDzvE8YukcTq42GUYYtuNgFsQGMqqnWNjwSNiFeACe7e+XeuVzzuf84LBJEiSZKUjSZe61n8813X10NxyTeKC3Ifi2HhYR05LluXHrY1qYO2OanY1sciKJ4Jgl3wFk2pjhLk4AFpGhMQAfKOE4CIGQKnizA8cQwB-3PvZYoEJVT+FVCUaC-hNDeXlDYCoipwRCCIeKEKjIsSXFxO9NulsiguWdpYIMQZoK9F6DKOmX0FYQSITHHoU1p6634qmc0NcEFdWWghNh4MCBlnqGDLQ7EAxvxgeibsho+wr1EUtEmLYIQqmjvbeCKoiqrgCCWTc4JtzeA1qQo8J5zyXk0e3BAIph7jTYvBQIwQLDgWdv4Bo5UkTqjMCFfiglzKOJoX4bS4oGyIR9FUIhCdmgMz0EEqw4pApaGgTrA8dUGoxQiZOGoX0Si1CDFYAKCEkkaChKVUeHQNYNGosdXYp1iBI2unIZoocxGFCRHoKU40VT+H2n4QG8oqig3Bj4LwUIXAhW3lhPeshCmFiROucqhlYK6AXA7Zoxg6wTwgv09JHRfAhT9vAz8-9Cz+HXJUxUCIzBIiRJpaCOkRoNlMGCME8EFlzxzrvRe11Vn2RBtI1oDM-pGAsF4GsdZXJEI8n8Go41wjhCAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./QrLoginMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'QrLogin',
      initial: 'waitingForData',
      entry: ['resetSelectedVc', 'resetFlowType'],
      states: {
        waitingForData: {
          on: {
            GET: {
              actions: [
                'setScanData',
                'resetLinkTransactionId',
                'resetSelectedVoluntaryClaims',
              ],
              target: 'checkFaceAuthConsent',
            },
          },
        },
        checkFaceAuthConsent: {
          entry: 'getFaceAuthConsent',
          on: {
            STORE_RESPONSE: {
              actions: 'updateShowFaceAuthConsent',
              target: 'linkTransaction',
            },
          },
        },
        linkTransaction: {
          invoke: {
            src: 'linkTransaction',
            onDone: [
              {
                cond: 'isSimpleShareFlow',
                actions: [
                  'setlinkTransactionResponse',
                  'expandLinkTransResp',
                  'setClaims',
                ],
                target: 'loadMyVcs',
              },
              {
                cond: 'showFaceAuthConsentScreen',
                target: 'faceVerificationConsent',
              },
              {
                actions: [
                  'setlinkTransactionResponse',
                  'expandLinkTransResp',
                  'setClaims',
                ],
                target: 'faceAuth',
              },
            ],
            onError: [
              {
                actions: 'SetErrorMessage',
                target: 'ShowError',
              },
            ],
          },
        },
        ShowError: {
          on: {
            DISMISS: {
              actions: 'forwardToParent',
              target: 'waitingForData',
            },
          },
        },
        loadMyVcs: {
          entry: 'loadMyVcs',
          on: {
            STORE_RESPONSE: {
              actions: 'setMyVcs',
              target: 'showvcList',
            },
          },
        },
        showvcList: {
          on: {
            SELECT_VC: {
              actions: 'setSelectedVc',
            },
            VERIFY: [
              {
                cond: 'showFaceAuthConsentScreen',
                target: 'faceVerificationConsent',
              },
              {
                target: 'faceAuth',
              },
            ],
            DISMISS: {
              actions: 'forwardToParent',
              target: 'waitingForData',
            },
          },
        },
        faceVerificationConsent: {
          on: {
            FACE_VERIFICATION_CONSENT: {
              actions: ['storeShowFaceAuthConsent', 'setShowFaceAuthConsent'],
              target: 'faceAuth',
            },
            DISMISS: [
              {
                cond: 'isSimpleShareFlow',
                target: 'showvcList',
              },
              {
                actions: 'forwardToParent',
                target: 'waitingForData',
              },
            ],
          },
        },
        faceAuth: {
          on: {
            FACE_VALID: {
              target: 'loadingThumbprint',
            },
            FACE_INVALID: {
              target: 'invalidIdentity',
            },
            CANCEL: [
              {
                cond: 'isSimpleShareFlow',
                target: 'showvcList',
              },
              {
                actions: 'forwardToParent',
                target: 'waitingForData',
              },
            ],
          },
        },
        invalidIdentity: {
          on: {
            DISMISS: [
              {
                cond: 'isSimpleShareFlow',
                target: 'showvcList',
              },
              {
                actions: 'forwardToParent',
                target: 'waitingForData',
              },
              ,
            ],
            RETRY_VERIFICATION: {
              target: 'faceAuth',
            },
          },
        },
        sendingAuthenticate: {
          invoke: {
            src: 'sendAuthenticate',
            onDone: [
              {
                cond: 'isConsentAlreadyCaptured',
                target: 'success',
              },
              {
                target: 'requestConsent',
                actions: 'setLinkedTransactionId',
              },
            ],
            onError: [
              {
                actions: 'SetErrorMessage',
                target: 'ShowError',
              },
            ],
          },
        },
        requestConsent: {
          on: {
            CONFIRM: {
              target: 'sendingConsent',
            },
            TOGGLE_CONSENT_CLAIM: {
              actions: 'setConsentClaims',
              target: 'requestConsent',
            },
            DISMISS: {
              actions: 'forwardToParent',
              target: 'waitingForData',
            },
          },
        },
        loadingThumbprint: {
          entry: 'loadThumbprint',
          on: {
            STORE_RESPONSE: {
              actions: 'setThumbprint',
              target: 'sendingAuthenticate',
            },
          },
        },
        sendingConsent: {
          invoke: {
            src: 'sendConsent',
            onDone: {
              target: 'success',
            },
            onError: [
              {
                actions: 'SetErrorMessage',
                target: 'ShowError',
              },
            ],
          },
        },
        success: {
          entry: [
            () =>
              sendEndEvent(
                getEndEventData(
                  TelemetryConstants.FlowType.qrLogin,
                  TelemetryConstants.EndEventStatus.success,
                ),
              ),
          ],
          on: {
            CONFIRM: {
              target: 'done',
            },
          },
        },
        done: {
          type: 'final',
          data: context => context,
        },
      },
    },
    {
      actions: QrLoginActions(model),
      services: QrLoginServices,
      guards: QrLoginGuards,
    },
  );

export function createQrLoginMachine(serviceRefs: AppServices) {
  return qrLoginMachine.withContext({
    ...qrLoginMachine.context,
    serviceRefs,
  });
}
