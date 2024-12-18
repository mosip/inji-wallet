import {EventFrom} from 'xstate';
import {AppServices} from '../../../shared/GlobalContext';
import {backupAndRestoreSetupActions} from './backupAndRestoreSetupActions';
import {backupAndRestoreSetupGaurds} from './backupAndRestoreSetupGaurds';
import {backupAndRestoreSetupModel} from './backupAndRestoreSetupModel';
import {backupAndRestoreSetupService} from './backupAndRestoreSetupService';

const model = backupAndRestoreSetupModel;

export const BackupAndRestoreSetupEvents = model.events;

export const backupAndRestoreSetupMachine = model.createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCMCGBjA1gVwA4EEA7CAJTgBcB7AJzAGUxy8A6AS0NfIGIAJfAOQAiAGQCiAfQBC+AMIBpAKoAFcQMHiSougBUA8poDaABgC6iULkqxOrSoXMgAnogC0ADgDszAKxG-RjwBOIzcQgGYAJjCAGhAAD0QAFjdE5gBGCN9MjzSANly0xI9EgF8S2LQsPCJSChp6RhZ2TmZ0AAswLABJQnIwakJGLgg7MDZCADdKTDHKnAJiMlgqWgYmXHGW9s7MHr6BxgR2KfRUcltCYxMrh0trc7sHZwREiIifWISEMLTvZjdcjlAokwh5Ad4IoEyhUMPMaksVg11ptyK0Ot1ev1BtwRoNxlMZsw5tVFnVVo0Ns1UdsMftsUdJpRTg9LqYDGkzEgQHcbI8uc9Xu9vJ9ED8-gCgSCwR4IVDyiBiQtast6msmhxqejdpiDtx+tQaMxcAAbM4AMxoAFsibCScrEWrKRq0Ts9ljDscmWcLlcblyeSyHF8xf9AWlgaDwZDYs9QalvNCFbalQjVRSUcxCJQ3bquNoSABNVQAcXwXX4fosVl59i5XzebmYHjcwW8aSMgQ8YTCRlyMSciG8Q-S3lyERy3mbiSHpXlivhZKR6paWZz2K4gi6dAAslu6JXudXA3XEA2my2jG2O12e32Y4h8mEm2EQYFChLOx5E-PSSrycizUYdo6DaSgAHcZDsM1WGoS1vTsHoLS4HR9AkTQ6CUXR+DoUQDwDC4g1FRJUnbX5vESIwwjcNJiiKe8EHbNtmESQJWLCQJR0hcMvznZMFz-JcNkA8hgNAiCoJguCWUQyhkL0TQNC0TDsNwjlbiPAiT2+Yj0iMMiKKomjiI8ei0jMp9WNYiFPBo7xQW-PjfwddNYDAY1OnIGRjUobAIHwdB0B83ouGLXQpFkOQ8I0vlQHrXxmDfCiPCCDw3kowI3FMzJG0sjLkrcMJvDfBNeKqFNF0dZhXPc9BPO83z-MC7BgqUEhdBkURREEKL7k02LT3ixKAhStL2MygcGLCQEfGbdswTfQJu1yByyv45zkRpTA6FYKBCB6YZRnxaZZkc+00w2rVtt2noGROeDWWuUx1N6mL4kHUd0mSRIaPyQIIlyIxEnolw3iffw9O8aiCnyIoVrhJzzpYTarr2wgDrxT1CR-M7-yRy6dtR26vRZX01P9aLa36hAh1yT6Uh+3I-oBoGJpBnJmHB34obyXJYdK+GccEl0sBR-bcTGTGTtWhHcY2ZGCZuz1mR9NkIk5KsXsp1mKL+Xw-HHSzckhui3oYsz3khXJQgCPIIiKNw4btVNZeFraFcIZh9RoEKwukeQeprJ5EByIwPlNn5Gy7EECmbf7ARlR3yoEyr5euj2veoLhdCUUR+HEHDtG0cti33J7yc1oOEBDsPgzSSOXymmi3Dj5KSphaXBZT-G08zbMdXXfMi3wUtywD49QGeFsIhFBAz2bVt207btezCRO1sRuXu9R3u1yGTcdz3Me+tNueLyvJfb37Z4OPjfw0mXtwCu+teZaF6w0-RiXGSx07nbf92ibKzsL6MuGtA5aUSPkDmHhKKQgnF2KIwNpxPj1kYA2rEjYpB4u3AWf9Krv1Rp-I6P8O54JcgApW91Sbq0PBXCBUCAiwM7L8BBV9ED32mpOaiARGbhiWi-Tu5CP7i2IVLXBFUhGE0oSTVWND8KvS+Itd4hRexFRBIUXmJltZ2R8P4dBgRMF8xwU7CRyICFi0OpLG0pDTEsHMYQQBVC2RhDkRTQiCAlGfVURGDRJtnguF8GkXR+sggYONtgpMNjk6SJ6J7agBpM6hXCv7UBtDwFUzroEXRs1AbER+D9eiY5gl6Qfk-MyAiyFmPdnEhJXBNAyCwgAMS6MWBQClZANIUPwbQR9XqT17DXdhLZsncOIuon6FTbEbHsTvfuQxB4ljLBWVJ8itb1giJHM+i8bwr3ogCLJnNSkvjSJM6JVSe6rjmdwfeu46Cl1cXQqmp8F7XmXneCai0gmoLjgzAqpz1osGxn-H2yTIorLcRAkE55ghW2KG2ZsQ5TIQiCb8McIJQiZA2SVeUWYIBwAcECqZz10mm0WiM9sYz8lgmBqlFBfh2wAj8I-Ls-yN4omJePU2ddQ7z0vNst5bCEAuCMglQ2ekOzJGShEwlZzlyolYBAdyHLj5fCMPRDZDt+YmNlU6LYWpd7kGVQoxAaqJqCh8Kyl2VJZl0kYEatZJrCmA0tULYSolwKQUINBWC90ZL2vcS4ZI9Fmy0zbpE8ROqqpuQ8l5HyfkApBUNeXElXxA3jWvlbF1Xcdiiy1qs9x3LoV8teZfJBl5inth7L2DFq8tVJwBZvHN1SFVKuTZy1V9FJzLTrevF2qdt4Z39VpU1zxq5hplQ212uabXuiTWA9tjqJpTyzTEvNEKMnfXJbk8Z1LWZ9lpuDAxrwfgRBCCu8528W1gCHVTEdD5UrnrsdUwdbaVWLv6aGx90zqmXNtXOtJC6EB3o8c-Htr9KoTvqDe02abTIZBQWUMoQA */
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./backupAndRestoreSetupMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'backupAndRestoreSetup',
    initial: 'init',
    states: {
      init: {
        on: {
          HANDLE_BACKUP_AND_RESTORE: {
            actions: [
              'setIsLoading',
              'unsetShouldTriggerAutoBackup',
              'sendDataBackupAndRestoreSetupStartEvent',
            ],
            target: '.checkInternet',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          checkInternet: {
            invoke: {
              src: 'checkInternet',
              onDone: [
                {
                  cond: 'isInternetConnected',
                  target: '#backupAndRestoreSetup.fetchShowConfirmationInfo',
                },
                {
                  actions: [
                    'unsetIsLoading',
                    'sendBackupAndRestoreSetupErrorEvent',
                  ],
                  target: 'noInternet',
                },
              ],
              onError: {
                actions: [
                  'unsetIsLoading',
                  'sendBackupAndRestoreSetupErrorEvent',
                ],
                target: 'noInternet',
              },
            },
          },
          noInternet: {
            on: {
              TRY_AGAIN: {
                actions: 'setIsLoading',
                target: 'checkInternet',
              },
              DISMISS: {
                actions: [
                  'unsetIsLoading',
                  'sendBackupAndRestoreSetupCancelEvent',
                ],
                target: '#backupAndRestoreSetup.init',
              },
            },
          },
        },
      },
      fetchShowConfirmationInfo: {
        /*TODO: Check if this call to store can be replaced by settings machine itself
         *This would avoid extra read calls to storage
         */
        entry: 'fetchShowConfirmationInfo',
        on: {
          STORE_RESPONSE: [
            {
              cond: 'isConfirmationAlreadyShown',
              target: 'checkSignIn',
            },
            {
              actions: ['unsetIsLoading'],
              target: 'selectCloudAccount',
            },
          ],
        },
      },
      selectCloudAccount: {
        on: {
          GO_BACK: {
            actions: 'sendBackupAndRestoreSetupCancelEvent',
            target: 'init',
          },
          PROCEED: [
            {
              actions: 'setIsLoading',
              target: 'checkSignIn',
            },
          ],
        },
      },
      checkSignIn: {
        invoke: {
          src: 'isUserSignedAlready',
          onDone: [
            {
              cond: 'isSignedIn',
              actions: ['setProfileInfo', 'unsetIsLoading'],
              target: 'backupAndRestore',
            },
            {
              cond: 'isNetworkError',
              actions: 'sendBackupAndRestoreSetupErrorEvent',
              target: '.noInternet',
            },
            {
              cond: 'isAuthorisedAndCloudAccessNotGiven',
              actions: ['unsetIsLoading'],
              target: '.error',
            },
            {
              actions: ['unsetIsLoading'],
              target: 'signIn',
            },
          ],
        },
        initial: 'idle',
        states: {
          idle: {},
          error: {
            entry: 'unsetIsLoading',
            on: {
              GO_BACK: {
                actions: 'sendBackupAndRestoreSetupCancelEvent',
                target: '#backupAndRestoreSetup.init',
              },
              OPEN_SETTINGS: {
                actions: 'openSettings',
                target: '#backupAndRestoreSetup.init',
              },
            },
          },
          noInternet: {
            on: {
              TRY_AGAIN: {
                target: '#backupAndRestoreSetup.checkSignIn',
              },
              DISMISS: {
                actions: [
                  'unsetIsLoading',
                  'sendBackupAndRestoreSetupCancelEvent',
                ],
                target: '#backupAndRestoreSetup.init',
              },
            },
          },
        },
      },
      signIn: {
        id: 'signIn',
        invoke: {
          src: 'signIn',
          onDone: [
            {
              cond: 'isSignInSuccessful',
              actions: ['setProfileInfo', 'setShouldTriggerAutoBackup'],
              target: 'backupAndRestore',
            },
            {
              cond: 'isNetworkError',
              actions: 'sendBackupAndRestoreSetupErrorEvent',
              target: '.noInternet',
            },
            {
              cond: 'isIOSAndSignInFailed',
              target: '#backupAndRestoreSetup.init',
            },
            {
              actions: 'sendBackupAndRestoreSetupErrorEvent',
              target: '.error',
            },
          ],
        },
        initial: 'idle',
        states: {
          idle: {},
          error: {
            on: {
              GO_BACK: {
                actions: 'sendBackupAndRestoreSetupCancelEvent',
                target: '#backupAndRestoreSetup.init',
              },
              RECONFIGURE_ACCOUNT: '#backupAndRestoreSetup.signIn',
            },
          },
          noInternet: {
            on: {
              TRY_AGAIN: {
                target: '#backupAndRestoreSetup.signIn',
              },
              DISMISS: {
                actions: ['sendBackupAndRestoreSetupCancelEvent'],
                target: '#backupAndRestoreSetup.init',
              },
            },
          },
        },
      },
      backupAndRestore: {
        entry: [
          'setAccountSelectionConfirmationShown',
          'sendBackupAndRestoreSetupSuccessEvent',
        ],
        on: {
          GO_BACK: 'init',
        },
      },
    },
  },
  {
    actions: backupAndRestoreSetupActions(model),

    services: backupAndRestoreSetupService(),

    guards: backupAndRestoreSetupGaurds(),
  },
);
