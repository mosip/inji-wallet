//Regex expression to evaluate if the key is for a VC
import { VC } from '../types/vc';

const VC_ITEM_STORE_KEY_REGEX =
  '^vc:(UIN|VID):[a-z0-9]+:[a-z0-9-]+:[true|false]+(:[0-9-]+)?$';

export class VCKey {
  idType = '';
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
    return new VCKey({
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

      return new VCKey({
        idType: idType,
        hashedId: hashedId,
        requestId: requestId,
        isPinned: isPinned,
        id: id ? id : null,
      });
    } catch (e) {
      console.error('Invalid VC Key provided');
      return new VCKey();
    }
  }

  static isValid(key): boolean {
    return VCKey.vcKeyRegExp.exec(key) != null;
  }

  // returns `vc:${vc.idType}:${vc.hashedId}:${vc.requestId}:${vc.isPinned}:${vc.id}`;
  toString() {
    const keyComponents = [
      'vc',
      this.idType,
      this.hashedId,
      this.requestId,
      this.isPinned,
      this.id,
    ];

    const validComponents = keyComponents.filter((c) => c !== null);

    return validComponents.join(':');
  }

  equals(other: VCKey): boolean {
    return this.requestId === other.requestId;
  }
}
