import {send} from 'xstate';
import {respond} from 'xstate/lib/actions';
import {ActivityLog} from '../../../components/ActivityLogEvent';
import {VCMetadata, parseMetadatas} from '../../../shared/VCMetadata';
import {
  MY_VCS_STORE_KEY,
  RECEIVED_VCS_STORE_KEY,
} from '../../../shared/constants';
import {ActivityLogEvents} from '../../activityLog';
import {BackupEvents} from '../../backupAndRestore/backup';
import {StoreEvents} from '../../store';

export const VCMetaActions = (model: any) => {
  return {
    sendBackupEvent: send(BackupEvents.DATA_BACKUP(true), {
      to: context => context.serviceRefs.backup,
    }),

    getVcItemResponse: respond((context, event) => {
      if (context.tamperedVcs.includes(event.vcMetadata)) {
        return {
          type: 'TAMPERED_VC',
        };
      }

      const isMyVCs = context.myVcsMetadata?.filter(
        (vcMetadataObject: Object) => {
          return (
            new VCMetadata(vcMetadataObject).getVcKey() ===
            VCMetadata.fromVC(event.vcMetadata)?.getVcKey()
          );
        },
      ).length;

      const vcData = isMyVCs
        ? context.myVcs[VCMetadata.fromVC(event.vcMetadata)?.getVcKey()]
        : context.receivedVcs[VCMetadata.fromVC(event.vcMetadata)?.getVcKey()];

      return {
        type: 'GET_VC_RESPONSE',
        response: vcData,
      };
    }),

    loadMyVcs: send(() => StoreEvents.GET_VCS_DATA(MY_VCS_STORE_KEY), {
      to: (context: any) => context.serviceRefs.store,
    }),

    loadReceivedVcs: send(
      () => StoreEvents.GET_VCS_DATA(RECEIVED_VCS_STORE_KEY),
      {
        to: (context: any) => context.serviceRefs.store,
      },
    ),

    setMyVcs: model.assign({
      myVcs: (_context, event) => {
        return event.response.vcsData;
      },
      tamperedVcs: (context, event) => {
        return [...context.tamperedVcs, ...event.response.tamperedVcsList];
      },
      myVcsMetadata: (_context, event) => {
        return parseMetadatas((event.response.vcsMetadata || []) as object[]);
      },
    }),

    setReceivedVcs: model.assign({
      receivedVcs: (_context, event) => {
        return event.response.vcsData;
      },
      tamperedVcs: (context, event) => {
        return [...context.tamperedVcs, ...event.response.tamperedVcsList];
      },
      receivedVcsMetadata: (_context, event) => {
        return parseMetadatas((event.response.vcsMetadata || []) as object[]);
      },
    }),

    resetTamperedVcs: model.assign({
      tamperedVcs: () => [],
    }),

    setDownloadingFailedVcs: model.assign({
      downloadingFailedVcs: (context, event) => [
        ...context.downloadingFailedVcs,
        event.vcMetadata,
      ],
    }),

    setVerificationErrorMessage: model.assign({
      verificationErrorMessage: (context, event) => event.errorMessage,
    }),

    resetVerificationErrorMessage: model.assign({
      verificationErrorMessage: (_context, event) => '',
    }),

    resetDownloadFailedVcs: model.assign({
      downloadingFailedVcs: (context, event) => [],
    }),

    setDownloadedVc: (context, event) => {
      const vcMetaData = event.vcMetadata ? event.vcMetadata : event.vc;
      const vcUniqueId = VCMetadata.fromVC(vcMetaData).getVcKey();
      context.myVcs[vcUniqueId] = event.vc;
    },

    addVcToInProgressDownloads: model.assign({
      inProgressVcDownloads: (context, event) => {
        let paresedInProgressList: Set<string> = context.inProgressVcDownloads;
        const newVcRequestID = event.requestId;
        const newInProgressList = paresedInProgressList.add(newVcRequestID);
        return newInProgressList;
      },
    }),

    removeVcFromInProgressDownlods: model.assign({
      inProgressVcDownloads: (context, event) => {
        let updatedInProgressList: Set<string> = context.inProgressVcDownloads;
        if (!event.vcMetadata) {
          return updatedInProgressList;
        }
        const removeVcRequestID = event.vcMetadata.requestId;
        updatedInProgressList.delete(removeVcRequestID);

        return updatedInProgressList;
      },
      areAllVcsDownloaded: context => {
        if (context.inProgressVcDownloads.size == 0) {
          return true;
        }
        return false;
      },
    }),

    resetInProgressVcsDownloaded: model.assign({
      areAllVcsDownloaded: () => false,
      inProgressVcDownloads: new Set<string>(),
    }),

    setUpdatedVcMetadatas: send(
      _context => {
        return StoreEvents.SET(MY_VCS_STORE_KEY, _context.myVcsMetadata);
      },
      {to: context => context.serviceRefs.store},
    ),

    prependToMyVcsMetadata: model.assign({
      myVcsMetadata: (context, event) => [
        event.vcMetadata,
        ...context.myVcsMetadata,
      ],
    }),

    removeVcFromMyVcsMetadata: model.assign({
      myVcsMetadata: (context, event) =>
        context.myVcsMetadata.filter(
          (vc: VCMetadata) => !vc.equals(event.vcMetadata),
        ),
    }),

    removeDownloadingFailedVcsFromMyVcs: model.assign({
      myVcsMetadata: (context, event) =>
        context.myVcsMetadata.filter(
          value =>
            !context.downloadingFailedVcs.some(item => item?.equals(value)),
        ),
    }),

    removeDownloadFailedVcsFromStorage: send(
      context => {
        return StoreEvents.REMOVE_ITEMS(
          MY_VCS_STORE_KEY,
          context.downloadingFailedVcs.map(m => m.getVcKey()),
        );
      },
      {
        to: context => context.serviceRefs.store,
      },
    ),

    logTamperedVCsremoved: send(
      context => ActivityLogEvents.LOG_ACTIVITY(ActivityLog.logTamperedVCs()),
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),

    updateMyVcsMetadata: model.assign({
      myVcsMetadata: (context, event) => [
        ...getUpdatedVCMetadatas(context.myVcsMetadata, event.vcMetadata),
      ],
    }),

    setWalletBindingSuccess: model.assign({
      walletBindingSuccess: true,
    }),
    resetWalletBindingSuccess: model.assign({
      walletBindingSuccess: false,
    }),
  };
};

function getUpdatedVCMetadatas(
  existingVCMetadatas: VCMetadata[],
  updatedVcMetadata: VCMetadata,
) {
  const isPinStatusUpdated = updatedVcMetadata.isPinned;

  return existingVCMetadatas.map(value => {
    if (value.equals(updatedVcMetadata)) {
      return updatedVcMetadata;
    } else if (isPinStatusUpdated) {
      return new VCMetadata({...value, isPinned: false});
    } else {
      return value;
    }
  });
}
