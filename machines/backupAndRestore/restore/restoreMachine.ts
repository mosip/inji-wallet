import {EventFrom} from 'xstate';
import {AppServices} from '../../../shared/GlobalContext';
import {restoreActions} from './restoreActions';
import {restoreGaurd} from './restoreGaurds';
import {restoreModel} from './restoreModel';
import {restoreService} from './restoreService';

const model = restoreModel;

export const RestoreEvents = model.events;

export const restoreMachine = model.createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCMCGBjA1gVwA4CU4AXAewCcwBiAIQEEBhAaQFUAFAfXwFEBlAFQDy3ANoAGALqJQuErACWROSQB2UkAA9EAFgBMAGhABPRAA4AjADoAzDp0BOUVt0BWAGwB2d1ucBfHwbQsPEJYUgoLXAoAGxJUCEoIFTALOWUANxJMZMCcAmJyZMiwGLiEVIz0VEUVMXFatRl5atUkDUQrUXcLMy07dx1ndzMrMzNRE2cDYwQzHVErC1crdzcTLVce1xMdPwCMXJCw5NSFGgYWDm5+IS561saFJRbQTQRXfSN23W6tNd07KwTOx2My7EA5YL5cIUUIFaj7PCUASMO7SWSPFRqV59KamOxaCx2ZzrKxbdwmUSjExgiF5WHQqFgeFBXCUAAiAEkeABZLk8VEgB7NLHtPomCzrZyiTpDHQmClaXEIYF2CwTdyieyifEdMzuGkIulHCwwo7M3KULgADT4+AYfHYbNofFoAqFTxFyvcSrsJlV6s1Dh1lP1-nBhsOBRNjPNeAs6AAFmAsDwwqgYLQ0qg5FE5MgcwpDAkkil0plshHGdH6UzDfGkym0xmswX87miIYymXKs1am70cLWq9BjpCU5A-0tPMJkrnB01WszK5fvMOlY7AaWZGGTXY7h68nMKnyOmwJns7m24Xi8pjmWshZadvkqa4XXE4fj2RT+fWwWO12FRVE8fZmJI9wDh6Q6ICOY5TvYk7TpMnwzNKqogpqYzOD0zgmFYvhhk+VavhQe4WIkADuyglBAe4AGI5mAdFkCQAC29AxNg8SJLepYZA+RE1tWZp1pR1GxLRhoMVETEsexnEQIBJA9iBEj9k0UEvIgZjYZYZh2DongDPi2x6kqYyUhKojElo672LYgKbgcxExqJJBUTR9GMcxbEcSQXGUGAZAsWQERRFUABm5CsY+lZCSRtYsuR7niXEXkyT58n+Yp5TKcBNRqRIDSQZi0EzLp3QGUZzgmToZkoR4o7OHM8qAnY7yzNShFxcaCVkdgygAF5yLg6VUDxd78RWW4ubudYDcNo1SYxSkqQVdRFRBGmlVpMzAq4FiOB0riiMu2qneZ07WL0rVBroVhaE5kLxa5SULSNY2BcF5BhZF0WxTNL1zW9Q0fctMmrflyh9ptaLbc8bR7e1h22adp1Tg4rhKuYBI6e4J32H6sxmF1eyA71r25NGaXg1QTouuwdH4AI3KMxyAAytyw4KJUI68Oi2c4Fg6PhFKdNOJjeihYw9N0AvvEMFIjDs3Xk1GfV1jRbJVKgfAkNyYCseQRbXNwnC8KwAgAHI8Fz4FwxifOIHKvpqkuc7te4gK4Zd2GHa4mNDCdumuE9Rrq5TcZazresG0bZAm4IZtcPgzP4Opjuei74rmK4HseN7Jg+s4QvuDqtjjHMHShmTzlAyJSUQMUYBEIluRsnIZA3pN5YA3XFPA1TTcya3e4d2QkO9oV9s8-DnoPVolgnUSVjrg4RmKtLgZqt4oxewLp34X4YbKCQTfwK0glHMVc9lQAtFjKEP2Hz4RNEEk35nZW6OZS4LD0PRdCS1snnKwL8qwnCIJ-Qcu1F6agsBqGwfp1yOBBJdeBzUpRTm1HMPOG5Vb9wjoPPA0DNKI16EqJwCw3DEzqkSaywJwH1zfElOQEAZKkJ2ojQyQsdAbC9kuEmzUdKb2mH6IWsxjLkmwavGu4Y1Y7gblTD8jYTzNgvHmf80wHYwO4SsYW-CRgbAmHVYkxcFgbFsIAl2owwEEOegPJRcYxKeVpplPyXFOFOxmLYA6KwQR9C9vwouKFfQSPeLnEWAs5xMMcSwqm70losmkmALxno9TLmFuuAuCoTCuDzj6YE1hth53sr6fopN5GEMUfEuMFAabJMYmksqFdVSOFsuSWw+JLrDEWJqX47VDJlNiUQpx+5o5EF1vrQ2xtmm7T4c1awgIPDTi0EMRwPSLH9L9ArYZ9jw41NIqJZuo9DTjzmYjEYZdFg3UlgHCYy5LqGTVLYXQSx2r6TkVfUZtT9ywGwOgdAcAL46LIa8Uk9gEEeDGAM34WEnldG2LYewRIiRl0qd8w5bc4wRQvNgCgFzwXDGoQHPUlI5gDG8NjeY3R5h0ususykx8fBAA */
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./restoreMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'restore',
    initial: 'init',
    on: {
      BACKUP_RESTORE: [
        {
          actions: ['sendDataRestoreStartEvent'],
          target: 'restoreBackup',
        },
      ],
      DOWNLOAD_UNSYNCED_BACKUP_FILES: {
        actions: 'downloadUnsyncedBackupFiles',
      },
    },
    states: {
      init: {},
      restoreBackup: {
        initial: 'checkInternet',
        entry: 'setShowRestoreInProgress',
        states: {
          checkInternet: {
            invoke: {
              src: 'checkInternet',
              onDone: [
                {
                  cond: 'isInternetConnected',
                  target: 'checkStorageAvailability',
                },
                {
                  actions: [
                    'setRestoreErrorReasonAsNetworkError',
                    'sendDataRestoreErrorEvent',
                  ],
                  target: 'failure',
                },
              ],
              onError: [
                {
                  actions: [
                    'setRestoreErrorReasonAsNetworkError',
                    'sendDataRestoreErrorEvent',
                  ],
                  target: 'failure',
                },
              ],
            },
          },
          checkStorageAvailability: {
            invoke: {
              src: 'checkStorageAvailability',
              onDone: [
                {
                  cond: 'isMinimumStorageRequiredForBackupRestorationReached',
                  actions: 'setRestoreTechnicalError',
                  target: ['failure'],
                },
                {
                  target: 'downloadBackupFileFromCloud',
                },
              ],
            },
          },
          downloadBackupFileFromCloud: {
            invoke: {
              src: 'downloadLatestBackup',
              onDone: {
                actions: 'setBackupFileName',
                target: 'unzipBackupFile',
              },
              onError: {
                actions: ['setRestoreErrorReason'],
                target: 'failure',
              },
            },
          },
          unzipBackupFile: {
            invoke: {
              src: 'unzipBackupFile',
              onDone: {
                target: 'readBackupFile',
              },
              onError: {
                actions: ['setRestoreErrorReason'],
                target: 'failure',
              },
            },
          },
          readBackupFile: {
            invoke: {
              src: 'readBackupFile',
            },
            on: {
              DATA_FROM_FILE: {
                actions: ['setDataFromBackupFile'],
                target: 'loadDataToMemory',
              },
            },
          },
          loadDataToMemory: {
            entry: 'loadDataToMemory',
            on: {
              STORE_RESPONSE: {
                actions: 'refreshVCs',
                target: 'success',
              },
              STORE_ERROR: {
                actions: 'setRestoreTechnicalError',
                target: 'failure',
              },
            },
          },
          success: {
            entry: [
              'unsetShowRestoreInProgress',
              'sendDataRestoreSuccessEvent',
              'cleanupFiles',
            ],
          },
          failure: {
            entry: [
              'unsetShowRestoreInProgress',
              'sendDataRestoreFailureEvent',
              'cleanupFiles',
            ],
          },
        },
        on: {
          DISMISS: {
            target: 'init',
          },
          DISMISS_SHOW_RESTORE_IN_PROGRESS: {
            actions: 'unsetShowRestoreInProgress',
          },
        },
      },
    },
  },
  {
    actions: restoreActions(model),

    services: restoreService(model),

    guards: restoreGaurd(),
  },
);

export function createRestoreMachine(serviceRefs: AppServices) {
  return restoreMachine.withContext({
    ...restoreMachine.context,
    serviceRefs,
  });
}
