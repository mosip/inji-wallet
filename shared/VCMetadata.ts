import { VC, VcIdType } from '../types/vc';

const VC_KEY_PREFIX = 'VC';
const VC_ITEM_STORE_KEY_REGEX = '^VC_[a-z0-9-]+$';

export class VCMetadata {
  idType: VcIdType | string = '';
  hashedId = '';
  requestId = '';
  isPinned = false;
  id = '';
  static vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);

  constructor({
    idType = '',
    hashedId = '',
    requestId = '',
    isPinned = false,
    id = null,
  } = {}) {
    this.idType = idType;
    this.hashedId = hashedId;
    this.requestId = requestId;
    this.isPinned = isPinned;
    this.id = id;
  }

  static fromVC(vc: Partial<VC>, includeId: boolean) {
    return new VCMetadata({
      idType: vc.idType,
      hashedId: vc.hashedId,
      requestId: vc.requestId,
      isPinned: vc.isPinned,
      id: includeId ? vc.id : null,
    });
  }

  static fromVcMetadataString(vcMetadataStr: string) {
    try {
      return new VCMetadata(JSON.parse(vcMetadataStr));
    } catch (e) {
      console.error('Failed to parse VC Metadata', e);
      return new VCMetadata();
    }
  }

  static isVCKey(key): boolean {
    return VCMetadata.vcKeyRegExp.exec(key) != null;
  }

  // Used for mmkv storage purposes and as a key for components and vc maps
  // Update VC_ITEM_STORE_KEY_REGEX in case of changes in vckey
  getVcKey(): string {
    return `${VC_KEY_PREFIX}_${this.requestId}`;
  }

  equals(other: VCMetadata): boolean {
    return this.getVcKey() === other.getVcKey();
  }
}

export function parseMetadatas(metadataStrings: string[]) {
  return metadataStrings.map((s) => VCMetadata.fromVcMetadataString(s));
}
