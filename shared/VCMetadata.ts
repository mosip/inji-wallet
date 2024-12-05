import {
  Credential,
  VC,
  VcIdType,
  VerifiableCredential,
} from '../machines/VerifiableCredential/VCMetaMachine/vc';
import {Protocols} from './openId4VCI/Utils';
import {getMosipIdentifier} from './commonUtil';
import {VCFormat} from './VCFormat';
import {isMosipVC} from './Utils';

const VC_KEY_PREFIX = 'VC';
const VC_ITEM_STORE_KEY_REGEX = '^VC_[a-zA-Z0-9_-]+$';

export class VCMetadata {
  static vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);
  idType: VcIdType | string = '';
  requestId = '';
  isPinned = false;
  id: string = '';
  issuer?: string = '';
  protocol?: string = '';
  timestamp?: string = '';
  isVerified: boolean = false;
  mosipIndividualId: string = '';
  format: string = '';
  isExpired: boolean = false;

  downloadKeyType: string = '';
  constructor({
    idType = '',
    requestId = '',
    isPinned = false,
    id = '',
    issuer = '',
    protocol = '',
    timestamp = '',
    isVerified = false,
    mosipIndividualId = '',
    format = '',
    downloadKeyType = '',
    isExpired = false,
  } = {}) {
    this.idType = idType;
    this.requestId = requestId;
    this.isPinned = isPinned;
    this.id = id;
    this.protocol = protocol;
    this.issuer = issuer;
    this.timestamp = timestamp;
    this.isVerified = isVerified;
    this.mosipIndividualId = mosipIndividualId;
    this.format = format;
    this.downloadKeyType = downloadKeyType;
    this.isExpired = isExpired;
  }

  //TODO: Remove any typing and use appropriate typing
  static fromVC(vc: Partial<VC> | VCMetadata | any) {
    return new VCMetadata({
      idType: vc.idType,
      format: vc.format || VCFormat.ldp_vc,
      requestId: vc.requestId,
      isPinned: vc.isPinned || false,
      id: vc.id,
      protocol: vc.protocol,
      issuer: vc.issuer,
      timestamp: vc.vcMetadata ? vc.vcMetadata.timestamp : vc.timestamp,
      isVerified: vc.isVerified,
      isExpired: vc.isExpired,
      mosipIndividualId: vc.mosipIndividualId
        ? vc.mosipIndividualId
        : vc.vcMetadata
        ? vc.vcMetadata.mosipIndividualId
        : getMosipIndividualId(vc.verifiableCredential, vc.issuer),
      downloadKeyType: vc.downloadKeyType,
    });
  }

  static fromVcMetadataString(vcMetadataStr: string | object) {
    try {
      if (typeof vcMetadataStr === 'object')
        return new VCMetadata(vcMetadataStr);
      return new VCMetadata(JSON.parse(vcMetadataStr));
    } catch (e) {
      console.error('Failed to parse VC Metadata', e);
      return new VCMetadata();
    }
  }

  static isVCKey(key: string): boolean {
    return VCMetadata.vcKeyRegExp.exec(key) != null;
  }

  isFromOpenId4VCI() {
    return this.protocol === Protocols.OpenId4VCI;
  }

  // Used for mmkv storage purposes and as a key for components and vc maps
  // Update VC_ITEM_STORE_KEY_REGEX in case of changes in vckey
  getVcKey(): string {
    return this.timestamp !== ''
      ? `${VC_KEY_PREFIX}_${this.timestamp}_${this.requestId}`
      : `${VC_KEY_PREFIX}_${this.requestId}`;
  }

  equals(other: VCMetadata): boolean {
    return this.getVcKey() === other.getVcKey();
  }
}

export function parseMetadatas(metadataStrings: object[]) {
  return metadataStrings.map(o => new VCMetadata(o));
}

export const getVCMetadata = (context: object, keyType: string) => {
  const [issuer, protocol, credentialId] =
    context.credentialWrapper?.identifier.split(':');

  return VCMetadata.fromVC({
    requestId: credentialId ?? null,
    issuer: issuer,
    protocol: protocol,
    id: `${credentialId} + '_' + ${issuer}`,
    timestamp: context.timestamp ?? '',
    isVerified: context.vcMetadata.isVerified ?? false,
    isExpired: context.vcMetadata.isExpired ?? false,
    mosipIndividualId: getMosipIndividualId(
      context['verifiableCredential'] as VerifiableCredential,
      issuer,
    ),
    format: context['credentialWrapper'].format,
    downloadKeyType: keyType,
  });
};

const getMosipIndividualId = (
  verifiableCredential: VerifiableCredential | Credential,
  issuer: string,
) => {
  try {
    const credential = verifiableCredential?.credential
      ? verifiableCredential.credential
      : verifiableCredential;
    const credentialSubject = credential?.credentialSubject;
    if (isMosipVC(issuer)) {
      return credentialSubject ? getMosipIdentifier(credentialSubject) : '';
    }
    return '';
  } catch (error) {
    console.error('Error getting the display ID:', error);
    return null;
  }
};
