import {VCMetadata} from './VCMetadata';
import {NETWORK_REQUEST_FAILED} from './constants';
import {groupBy} from './javascript';
import {Issuers} from './openId4VCI/Utils';

export const getVCsOrderedByPinStatus = (vcMetadatas: VCMetadata[]) => {
  const [pinned, unpinned] = groupBy(
    vcMetadatas,
    (vcMetadata: VCMetadata) => vcMetadata.isPinned,
  );
  return pinned.concat(unpinned);
};

export enum VCShareFlowType {
  SIMPLE_SHARE = 'simple share',
  MINI_VIEW_SHARE = 'mini view share',
  MINI_VIEW_SHARE_WITH_SELFIE = 'mini view share with selfie',
  MINI_VIEW_QR_LOGIN = 'mini view qr login',
  OPENID4VP = 'OpenID4VP',
  MINI_VIEW_SHARE_OPENID4VP = 'OpenID4VP share from mini view',
  MINI_VIEW_SHARE_WITH_SELFIE_OPENID4VP = 'OpenID4VP share with selfie from mini view',
}

export enum VCItemContainerFlowType {
  QR_LOGIN = 'qr login',
  VC_SHARE = 'vc share',
  VP_SHARE = 'vp share',
}

export interface CommunicationDetails {
  phoneNumber: string;
  emailId: string;
}

export const isMosipVC = (issuer: string) => {
  return issuer === Issuers.Mosip || issuer === Issuers.MosipOtp;
};

export const isMockVC = (issuer: string) => {
  return issuer.toLowerCase().startsWith('mock');
};

export const parseJSON = (input: any) => {
  let result = null;
  try {
    result = JSON.parse(input);
  } catch (e) {
    console.warn('Error occurred while parsing JSON ', e);
    result = JSON.parse(JSON.stringify(input));
  }
  return result;
};

export const isNetworkError = (error: string) => {
  return error.includes(NETWORK_REQUEST_FAILED);
};
