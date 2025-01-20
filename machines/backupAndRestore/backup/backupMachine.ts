import {EventFrom} from 'xstate';
import {AppServices} from '../../../shared/GlobalContext';
import {backupActions} from './backupActions';
import {backupGaurds} from './backupGaurds';
import {backupModel} from './backupModel';
import {backupService} from './backupService';

const model = backupModel;

export const BackupEvents = model.events;

export const backupMachine = model.createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCMCGBjA1gVwA4GIARAQQBViB9AIWIGEBpAVQAUBtABgF1FRcB7WAEsALoL4A7HiAAeiACwAmADQgAnogCcARgDMAOgDsOuQDYFWjSZ0mLCgL52VaLHnwAZYgGVS1Ok2YUhACi5ACSbp4c3Egg-EKiElKyCIoq6ggKCiZyehoGcgAc7DoArKUlGgU6Dk4YOLh6AGZgwugAFm6osMJUdXiELaiCADaweu1gWJ7CfABOYPjeAPIASkEUa57MSwBynkFRUnEiYpIxybpZeloFNmUaciVPummIFjoGemaFJXKPJSYDAYaiBnPUmi12p1ur0XLgBsIhqNxm1JphpnMFss1hsgltdvtWFporwBCdEudEFYSnoSgpbjp2MUPgVtK8Mlo-rSzOw-iUDPyFLyQWC8BDWh0uj0+vDBiMxhMpjN5otSKt1kEVitVocYscEmdQMlqbT6VYmToWWy1IghQ9DNY6SYTE9LKYRTLxVCpbD6gikQrUVhaMM+NgIPgIBIwHpBOIAG58TAx0UNZoS6HSuH++UotEhsMQBBxxPoVAGqK60nxU5JN46K43O46B5PEovG0ZdgmArcunsTlVDQKAEeuFeyUwmU55GKzAF8P4MCzWZzPS4YblxpzAC2elTE8zvv6ctnQfnofDxYTfDLFa4VdiZINdYQlxM11uWnu-3bOnZ5gFJ8jwNgolougYJhjuCYJxlAjAEIQoSeAAsshkRcEcz61pSKRyIyhhmAUWT8gYFhPOyGjWHojzDgojyFDcDzQWKsHiPBDRzoQ5aoMQ8ZIqgyAjCIqgAGJzMeBDYusmzbHsByYXq2EUkaiBPB+FqsmYJjsL8VTst+gKGK2dJUZYxjAo4oKemxHF5lg3GInxAlCcMInibMkmququL4vJRIkk+NYqTIakAnommWFkumFP+nbfuwXyPAUdIpaUxTClZB62Qh9mYI5vH8SMgnCcIYkSTK3k4rJBIHAogX6jhqkIOpEXFFp0V6XF6RaGRNKclYWRAiYGiZbU445Zx54YrMqAwM5xWuSJkbRrGN7JvuNl1HBuVzjNc1gAtm5LWV16luWpyVop1bkoaoVvlkH4PLocjsAUcgGPRw4GcYiUaA8OhaLo-2soDLENJNeX7fNRXHaVqgreIMYlkmKZbVgO1TWi0OHbDJVuadKN3pdD7ElhwV3Rcj25HIL1vR9X3KJ2ChUYYVTmPheQaO2WhQVl6OYJjUPKgdR348tUZI2tiYbdl23sbt00izDLnw2dt4XRIlb1eTt2vlo1PPb972fXI33xYUCgOoCBSspzdHg5tGMK1jSpzKLeMnQjy6rrM66bsI26zHucvO3Ze3K7jqsE6o6vE1rD7XUFeu4Qbzo03TJuM+yOi3BFALOq9txWFoxSO5DEfuyri3w0uK5rhuW67k7MHy+HStV1HNcx3HmviJWZNKRT+uG7TxsM2bTM9fyNIDuwYEMkNYHl23uXpu0BWiauO6EFQVUyXicmEknjUhck5jfnotvOjcvOvWU3VvBYOSWJyLPfmbQEaCvYdr5CbSb23rvfeFBNTahWI+U+lNbRAxpNfGwBQ766UtOyOknwRqWltlRdgeQgY-0Fi7CcgC+A7z3tJUBWodSDxui+XCF84HF1vtkZBj83yYIipUAwo0RoAz5uNVuv8GgAHdZgiDAAVUgfBRIjAWKJcI6wdjEBQgpBqyloEZEBBoK+QIPrpWsB8Ayz9cg2EUNoX4nDv78wmqvBoAAvQQuBJLSOGAsSWyN1po2sYIvQ9jHEymcWAXu95OCQLUa+RkJRey0yyAoIwuhAYfQMrpXsYE3qVH5GZYi+Cha+KcTIuuvt-ZN2Di3ViNifEOLyS4oJJMQknzCbhCJUS06xMBpaTkBh2SAkSlUdgApeQClptobJhDcn+PyT7BuAcg4hwFjkyp4zqlEz7gPVRw9GnJJoi0uJ7TEnxXoolds2QeyWCeAYN6Iy7J4FDKgCAVTXGrRRrLOZhDrl8FufcmpCc6lrJTs1YwsS2aQV5C2AE3YTCUXoklYu3Y35WEsvwsp3i3kfMWQsSZftG6B2bqHAhVyNzvLuWir5-dE6-Nof8zReh9GwL6dYY57IDCskMIoFKWRrD0ieJc3KKKiVwgCQUqZxTZleLxTyglqL+UyJJas3WFL7rWC4dSkuCUjCFwhfFPpH5vztg5h8AUCLrKiqFry+5ICar+XqesylSqaWqvpaYdktsrYDnNGBL6Lo5DcoaKatF5rD61QCnKpqCqqV2pKHS9VSSrgNksMUdsRQBwOCsuIPgEA4BSFTMGs+iAAC0Gr0i5qhUyEtpbS3DkdnGEQ2b1G-jakDbs71sgVAMnkXsvVHSxWMB8ewVjwTr0nFmP0p54BDz+fdGJXwXTGATQKJtragbUrHjgqwzpuy9sRWmf+R5pwjuFpiGt4TS5TrKI8G4c7HXMz6VoGirJIJmwqNkIwjsB07uzHuucC4ICHtwtzdt2hc60XMrTACOCcjdm5rpG4ttaYlG9T+5qQob3DksEBbs5zjBUS6foUC2g+rMj+AUb1sYIAuIQwq8Kug1WweIqYgydxqV9KqBhl0zpiNcR4mLL2HlJLkfPmbXILMeznO6Zh1hvMjDGU+v9XkvUcGGtxULSus1q5wxjnxzQTx87pN6v2FsnT4q-ByL8JlM7LTsrg32pFYqt0SmIaQjTb4Uqz0+kOZBw4DM9UBh+eiGCbCtlLhuo1AibN6BEWIiRUiZGOfonSXIEbXrmjeuYTzT97Sc0yJUBimDiNjKlWRsd8rz5VBvUCIUukBQG1ZIY9LLZMvvV+DlqzENym+vy2ARzxgLD527KULhxQuEFreLyXsZRnS0bjVl4jsBsDoHQHAUdNCQ3JCLvoQEjJuxMm0AOSiQIIq3CMCBcomRpsyPEMITws35uwEW8nIr8g3praMEyHSODS5aCdY8QwZFc5FGsC9BTLy7KNCRNgeYjnVtfGe5tt7O2LZcieLE3kI4Rp9VOy487olQfg8K8th7VQocbde9tj7nYI1wOyFURB2gbjdi9cmoAA */
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./backupMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'backup',
    type: 'parallel',
    states: {
      fetchLastBackupDetails: {
        on: {
          LAST_BACKUP_DETAILS: {
            actions: ['unsetLastBackupDetails', 'setIsLoadingBackupDetails'],
            target: '.checkCloud',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          checkCloud: {
            entry: 'sendFetchLastBackupDetailsStartEvent',
            invoke: {
              src: 'getLastBackupDetailsFromCloud',
              onDone: {
                actions: [
                  'unsetIsLoadingBackupDetails',
                  'setLastBackupDetails',
                  'sendFetchLastBackupDetailsSuccessEvent',
                ],
                target: '#backup.fetchLastBackupDetails.idle',
              },
              onError: [
                {
                  cond: 'isNetworkError',
                  actions: 'sendFetchLastBackupDetailsErrorEvent',
                  target: 'noInternet',
                },
                {
                  actions: [
                    'unsetIsLoadingBackupDetails',
                    'sendFetchLastBackupDetailsFailureEvent',
                  ],
                  target: '#backup.fetchLastBackupDetails.idle',
                },
              ],
            },
          },
          noInternet: {
            on: {
              TRY_AGAIN: {
                actions: [
                  'unsetLastBackupDetails',
                  'setIsLoadingBackupDetails',
                ],
                target: '#backup.fetchLastBackupDetails.checkCloud',
              },
              DISMISS: {
                actions: [
                  'unsetIsLoadingBackupDetails',
                  'sendFetchLastBackupDetailsCancelEvent',
                ],
                target: '#backup.fetchLastBackupDetails.idle',
              },
            },
          },
        },
      },
      backingUp: {
        initial: 'idle',
        on: {
          DATA_BACKUP: {
            actions: [
              'setIsAutoBackup',
              'setShowBackupInProgress',
              'sendDataBackupStartEvent',
            ],
            target: '.checkInternet',
          },
          DISMISS: {
            target: '.idle',
          },
          DISMISS_SHOW_BACKUP_IN_PROGRESS: {
            actions: 'unsetShowBackupInProgress',
          },
        },
        states: {
          idle: {},
          checkInternet: {
            invoke: {
              src: 'checkInternet',
              onDone: [
                {
                  cond: 'isInternetConnected',
                  target: 'checkDataAvailabilityForBackup',
                },
                {
                  cond: 'checkIfAutoBackup',
                  actions: 'setBackupErrorReasonAsNoInternet',
                  target: 'silentFailure',
                },
                {
                  actions: 'setBackupErrorReasonAsNoInternet',
                  target: 'failure',
                },
              ],
              onError: [
                {
                  cond: 'checkIfAutoBackup',
                  actions: 'setBackupErrorReasonAsNoInternet',
                  target: 'silentFailure',
                },
                {
                  actions: 'setBackupErrorReasonAsNoInternet',
                  target: 'failure',
                },
              ],
            },
          },
          checkDataAvailabilityForBackup: {
            entry: ['loadVcs'],
            on: {
              STORE_RESPONSE: [
                {
                  cond: 'isVCFound',
                  target: 'checkStorageAvailability',
                },
                {
                  cond: 'checkIfAutoBackup',
                  actions: 'setBackUpNotPossible',
                  target: 'silentFailure',
                },
                {
                  actions: 'setBackUpNotPossible',
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
                  cond: 'isMinimumStorageRequiredForBackupAvailable',
                  target: 'fetchDataFromDB',
                },
                {
                  cond: 'checkIfAutoBackup',
                  actions: 'setErrorReasonAsStorageLimitReached',
                  target: 'silentFailure',
                },
                {
                  actions: 'setErrorReasonAsStorageLimitReached',
                  target: 'failure',
                },
              ],
              onError: [
                {
                  cond: 'checkIfAutoBackup',
                  actions: ['setBackUpNotPossible'],
                  target: 'silentFailure',
                },
                {
                  actions: ['setBackUpNotPossible'],
                  target: 'failure',
                },
              ],
            },
          },
          fetchDataFromDB: {
            entry: ['fetchAllDataFromDB'],
            on: {
              STORE_RESPONSE: {
                actions: 'setDataFromStorage',
                target: 'writeDataToFile',
              },
              STORE_ERROR: [
                {
                  cond: 'checkIfAutoBackup',
                  actions: ['setBackupErrorReason'],
                  target: 'silentFailure',
                },
                {
                  actions: ['setBackupErrorReason'],
                  target: 'failure',
                },
              ],
            },
          },
          writeDataToFile: {
            invoke: {
              src: 'writeDataToFile',
            },
            on: {
              FILE_NAME: {
                actions: 'setFileName',
                target: 'zipBackupFile',
              },
            },
          },
          zipBackupFile: {
            invoke: {
              src: 'zipBackupFile',
              onDone: {
                target: 'uploadBackupFile',
              },
              onError: [
                {
                  cond: 'checkIfAutoBackup',
                  target: 'silentFailure',
                },
                {
                  target: 'failure',
                },
              ],
            },
          },
          uploadBackupFile: {
            invoke: {
              src: 'uploadBackupFile',
              onDone: [
                {
                  cond: 'checkIfAutoBackup',
                  actions: 'extractLastBackupDetails',
                  target: 'silentSuccess',
                },
                {
                  actions: 'extractLastBackupDetails',
                  target: 'success',
                },
              ],
              onError: [
                {
                  cond: 'checkIfAutoBackup',
                  actions: ['setBackupErrorReason'],
                  target: 'silentFailure',
                },
                {
                  actions: ['setBackupErrorReason'],
                  target: 'failure',
                },
              ],
            },
          },
          success: {
            entry: [
              'unsetShowBackupInProgress',
              'sendDataBackupSuccessEvent',
              'cleanupFiles',
            ],
          },
          silentSuccess: {
            entry: ['sendDataBackupSuccessEvent', 'cleanupFiles'],
          },
          failure: {
            entry: [
              'unsetShowBackupInProgress',
              'sendDataBackupFailureEvent',
              'cleanupFiles',
            ],
          },
          silentFailure: {
            entry: ['sendDataBackupFailureEvent', 'cleanupFiles'],
          },
        },
      },
    },
  },
  {
    actions: backupActions(model),

    services: backupService(model),

    guards: backupGaurds(),
  },
);

export function createBackupMachine(serviceRefs: AppServices) {
  return backupMachine.withContext({
    ...backupMachine.context,
    serviceRefs,
  });
}
