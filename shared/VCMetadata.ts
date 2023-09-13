//Regex expression to evaluate if the key is for a VC
import { VC, VcIdType } from '../types/vc';

const VC_ITEM_STORE_KEY_REGEX =
  '^vc:(UIN|VID):[a-z0-9]+:[a-z0-9-]+:[true|false]+(:[0-9-]+)?$';

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

  static fromVCKey(vcKey) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [prefix, idType, hashedId, requestId, isPinned, id] =
        vcKey.split(':');

      return new VCMetadata({
        idType: idType,
        hashedId: hashedId,
        requestId: requestId,
        isPinned: isPinned === 'true',
        id: id ? id : null,
      });
    } catch (e) {
      console.error('Invalid VC Key provided');
      return new VCMetadata();
    }
  }

  static isVCKey(key): boolean {
    return VCMetadata.vcKeyRegExp.exec(key) != null;
  }

  // Used for mmkv storage purposes
  getVcKey(): string {
    return 'VC_' + this.uniqueId();
  }

  // used as key to vc list map and other components
  uniqueId(): string {
    return this.requestId;
  }

  equals(other: VCMetadata): boolean {
    return this.uniqueId() === other.uniqueId();
  }
}
