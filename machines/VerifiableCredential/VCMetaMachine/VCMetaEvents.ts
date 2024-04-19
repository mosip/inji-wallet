import {VCMetadata} from '../../../shared/VCMetadata';
import {VC} from './vc';

export const VcMetaEvents = {
  VIEW_VC: (vc: VC) => ({vc}),
  GET_VC_ITEM: (vcMetadata: VCMetadata) => ({vcMetadata}),
  STORE_RESPONSE: (response: unknown) => ({response}),
  STORE_ERROR: (error: Error) => ({error}),
  VC_ADDED: (vcMetadata: VCMetadata) => ({vcMetadata}),
  REMOVE_VC_FROM_CONTEXT: (vcMetadata: VCMetadata) => ({vcMetadata}),
  VC_METADATA_UPDATED: (vcMetadata: VCMetadata) => ({vcMetadata}),
  VC_DOWNLOADED: (vc: VC, vcMetadata?: VCMetadata) => ({
    vc,
    vcMetadata,
  }),
  REFRESH_MY_VCS: () => ({}),
  REFRESH_MY_VCS_TWO: (vc: VC) => ({vc}),
  REFRESH_RECEIVED_VCS: () => ({}),
  WALLET_BINDING_SUCCESS: () => ({}),
  RESET_WALLET_BINDING_SUCCESS: () => ({}),
  ADD_VC_TO_IN_PROGRESS_DOWNLOADS: (requestId: string) => ({requestId}),
  REMOVE_VC_FROM_IN_PROGRESS_DOWNLOADS: (vcMetadata: VCMetadata) => ({
    vcMetadata,
  }),
  RESET_IN_PROGRESS_VCS_DOWNLOADED: () => ({}),
  REMOVE_TAMPERED_VCS: () => ({}),
  DOWNLOAD_LIMIT_EXPIRED: (vcMetadata: VCMetadata) => ({vcMetadata}),
  DELETE_VC: () => ({}),
  VERIFY_VC_FAILED: (errorMessage: string, vcMetadata?: VCMetadata) => ({
    errorMessage,
    vcMetadata,
  }),
  RESET_VERIFY_ERROR: () => ({}),
  REFRESH_VCS_METADATA: () => ({}),
  SHOW_TAMPERED_POPUP: () => ({}),
};
