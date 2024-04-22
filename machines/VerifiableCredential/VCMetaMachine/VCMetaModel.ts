import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../../shared/GlobalContext';
import {VCMetadata} from '../../../shared/VCMetadata';
import {VC} from './vc';
import {VcMetaEvents} from './VCMetaEvents';

export const VCMetamodel = createModel(
  {
    serviceRefs: {} as AppServices,
    myVcsMetadata: [] as VCMetadata[],
    receivedVcsMetadata: [] as VCMetadata[],
    myVcs: {} as Record<string, VC>,
    receivedVcs: {} as Record<string, VC>,
    inProgressVcDownloads: new Set<string>(), //VCDownloadInProgress
    areAllVcsDownloaded: false as boolean,
    walletBindingSuccess: false,
    tamperedVcs: [] as VCMetadata[],
    downloadingFailedVcs: [] as VCMetadata[], //VCDownloadFailed
    verificationErrorMessage: '' as string,
  },
  {
    events: VcMetaEvents,
  },
);
